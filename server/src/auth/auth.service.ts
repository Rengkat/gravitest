import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';

import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { Otp } from './entities/otp.entity';
import { OtpProvider } from './providers/otp.provider';
import { HashProvider } from './providers/Hash.provider';
import { MailService } from 'src/mail/mail.service';

import {
  AuthResponseDto,
  ForgotPasswordDto,
  LoginDto,
  RegisterResponseDto,
  RegisterUserDto,
  ResendVerificationDto,
  ResetPasswordDto,
  TokensDto,
  UserResponseDto,
  VerifyEmailOtpDto,
} from './dto/auth.dto';

import { OtpPurpose } from 'src/common/enums/enums';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly isDev: boolean;

  private static readonly DUMMY_PASSWORD_HASH =
    '$2b$12$C6UzMDM.H6dfI/f/IKxGhuJ8eWQ4P1Q0N9l8o0L8pQx5V6m7n8y9K';

  constructor(
    private readonly userService: UserService,
    private readonly otpProvider: OtpProvider,
    private readonly hashProvider: HashProvider,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,

    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
  ) {
    this.isDev = this.configService.get('NODE_ENV') === 'development';
  }

  // ===================================================
  // REGISTER
  // ===================================================

  async register(dto: RegisterUserDto): Promise<RegisterResponseDto> {
    const user = await this.userService.registerUser(dto);

    const plainOtp = await this.issueOtpAndDispatch(
      user,
      OtpPurpose.EMAIL_VERIFICATION,
    );

    return {
      message:
        'Account created successfully. A verification code has been sent to your email.',
      ...(this.isDev && { devOtp: plainOtp }),
    };
  }

  // ===================================================
  // LOGIN
  // ===================================================

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userService.findSensitiveUserByEmail(dto.email);

    const passwordHash = user?.passwordHash ?? AuthService.DUMMY_PASSWORD_HASH;

    const isPasswordValid = await this.hashProvider.comparePassword(
      dto.password,
      passwordHash,
    );

    if (!user || !isPasswordValid) {
      if (user) {
        user.incrementFailedLoginAttempts();
        await this.userService.save(user);
      }
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.isAccountLocked()) {
      await this.safeSendAccountLockedEmail(user);

      throw new ForbiddenException(
        `Account locked until ${user.lockedUntil?.toLocaleTimeString()}`,
      );
    }

    if (!user.isEmailVerified) {
      throw new ForbiddenException(
        'Email not verified. Please verify your email first.',
      );
    }

    user.recordSuccessfulLogin();
    await this.userService.save(user);

    return this.buildAuthResponse(user, {
      accessToken: 'dummy-access-token',
      refreshToken: 'dummy-refresh-token',
      expiresIn: 900,
    });
  }

  // ===================================================
  // VERIFY EMAIL
  // ===================================================

  async verifyEmail(dto: VerifyEmailOtpDto): Promise<{ message: string }> {
    const user = await this.userService.findSensitiveUserByEmail(dto.email);
    if (!user || user.isEmailVerified) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    await this.validateOtpOrThrow(
      user.id,
      OtpPurpose.EMAIL_VERIFICATION,
      dto.code,
    );

    user.markEmailVerified();
    await this.userService.save(user);
    // // Send welcome email or any post-verification actions here
    await this.mailService.sendWelcomeEmail(user.email, {
      firstName: user.firstName,
      loginLink: 'https://yourapp.com/login',
      companyName: 'Gravitest',
      features: ['Feature 1', 'Feature 2', 'Feature 3'],
    });
    return { message: 'Email verified successfully' };
  }

  // ===================================================
  // RESEND EMAIL VERIFICATION OTP
  // ===================================================

  async sendEmailVerificationOtp(
    dto: ResendVerificationDto,
  ): Promise<{ message: string }> {
    const user = await this.userService.findSensitiveUserByEmail(dto.email);

    if (!user || !user.isActive) {
      return {
        message:
          'If the email exists in our system, a verification code has been sent.',
      };
    }

    if (user.isEmailVerified) {
      return { message: 'Email is already verified.' };
    }

    await this.enforceOtpResendCooldown(user.id, OtpPurpose.EMAIL_VERIFICATION);

    await this.issueOtpAndDispatch(user, OtpPurpose.EMAIL_VERIFICATION);

    return { message: 'Verification code sent successfully.' };
  }

  // ===================================================
  // FORGOT PASSWORD
  // ===================================================

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.userService.findSensitiveUserByEmail(dto.email);

    const response = {
      message:
        'If the email exists in our system, a verification code has been sent.',
    };

    if (!user || !user.isActive || user.isAccountLocked()) {
      return response;
    }

    await this.enforceOtpResendCooldown(user.id, OtpPurpose.PASSWORD_RESET);

    await this.issueOtpAndDispatch(user, OtpPurpose.PASSWORD_RESET);

    return response;
  }

  // ===================================================
  // RESET PASSWORD
  // ===================================================

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const user = await this.userService.findSensitiveUserByEmail(dto.email);

    if (!user || !user.isActive) {
      throw new BadRequestException('Invalid email or OTP');
    }

    await this.validateOtpOrThrow(user.id, OtpPurpose.PASSWORD_RESET, dto.code);

    const passwordHash = await this.hashProvider.hashPassword(dto.newPassword);

    user.changePassword(passwordHash);
    await this.userService.save(user);

    await this.safeSendPasswordChangedEmail(user);

    return { message: 'Password reset successful' };
  }
  // =================================================
  // GET USER PROFILE AFTER AUTH
  // =================================================

  async getProfile(userId: string): Promise<UserResponseDto> {
    const user = await this.userService.findById(userId);
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  // ===================================================
  // LOGOUT
  // ===================================================

  async logout(userId: string): Promise<{ message: string }> {
    return { message: 'Logged out successfully' };
  }

  // ===================================================
  // OTP CORE
  // ===================================================

  private async issueOtpAndDispatch(
    user: User,
    purpose: OtpPurpose,
  ): Promise<string> {
    await this.revokeActiveOtps(user.id, purpose);

    const otpBundle = this.otpProvider.generate();

    const otp = this.otpRepository.create({
      userId: user.id,
      purpose,
      codeHash: otpBundle.codeHash,
      expiresAt: otpBundle.expiresAt,
      createdAt: new Date(),
      sentAt: new Date(),
      channel: 'email',
      target: user.email,
    });

    await this.otpRepository.save(otp);

    // SAFE EMAIL DISPATCH (no silent failure)
    try {
      await this.dispatchOtpMail(
        user,
        purpose,
        otpBundle.plainCode,
        otp.expiresAt,
      );
    } catch (err) {
      this.logger.error('OTP email failed', err);
    }

    if (this.isDev) {
      this.logger.warn(
        `[DEV OTP] ${purpose} for ${user.email}: ${otpBundle.plainCode}`,
      );
    }

    return otpBundle.plainCode;
  }

  private async dispatchOtpMail(
    user: User,
    purpose: OtpPurpose,
    plainCode: string,
    expiresAt: Date,
  ): Promise<void> {
    const expiryTime = expiresAt.toISOString();
    const expiryMinutes = Math.round(
      (expiresAt.getTime() - Date.now()) / 1000 / 60,
    );

    const formattedOtp = this.otpProvider.formatForDisplay(plainCode);

    switch (purpose) {
      case OtpPurpose.EMAIL_VERIFICATION:
        await this.mailService.sendEmailVerificationOtp(user.email, {
          firstName: user.firstName,
          otpCode: formattedOtp,
          expiryTime,
          expiryMinutes,
        });
        break;

      case OtpPurpose.PASSWORD_RESET:
        await this.mailService.sendPasswordResetOtp(user.email, {
          firstName: user.firstName,
          otpCode: formattedOtp,
          expiryTime,
          expiryMinutes,
        });
        break;

      case OtpPurpose.TWO_FACTOR_AUTH:
        await this.mailService.sendTwoFactorCode(user.email, {
          firstName: user.firstName,
          otpCode: formattedOtp,
          expiryTime,
          expiryMinutes,
        });
        break;
    }
  }

  // ===================================================
  // SAFE EMAILS
  // ===================================================

  private async safeSendPasswordChangedEmail(user: User): Promise<void> {
    try {
      await this.mailService.sendPasswordChangedAlert(user.email, {
        firstName: user.firstName,
        changedAt: new Date().toISOString(),
        expiryMinutes: 10, // Example value, replace with actual expiry minutes
      });
    } catch {}
  }

  private async safeSendAccountLockedEmail(user: User): Promise<void> {
    try {
      await this.mailService.sendAccountLockedEmail(user.email, {
        firstName: user.firstName,
        lockedAt: new Date().toISOString(),
        reason: 'Multiple failed login attempts',
        supportLink: `${this.configService.get('FRONTEND_URL')}/support`,
      });
    } catch {}
  }

  // ===================================================
  // OTP VALIDATION
  // ===================================================

  private async validateOtpOrThrow(
    userId: string,
    purpose: OtpPurpose,
    plainCode: string,
  ): Promise<void> {
    const otp = await this.getLatestActiveOtp(userId, purpose);
    if (!otp || !otp.canBeValidated()) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    const isValid = this.otpProvider.matches(plainCode, otp.codeHash);

    if (!isValid) {
      otp.incrementAttempts();
      await this.otpRepository.save(otp);
      throw new BadRequestException('Invalid or expired verification code');
    }

    otp.markUsed();
    await this.otpRepository.save(otp);
  }

  private async enforceOtpResendCooldown(
    userId: string,
    purpose: OtpPurpose,
  ): Promise<void> {
    const latestOtp = await this.getLatestActiveOtp(userId, purpose);

    if (latestOtp && !this.otpProvider.canResend(latestOtp.createdAt)) {
      throw new BadRequestException(
        'Please wait a minute before requesting another code.',
      );
    }
  }

  private async revokeActiveOtps(
    userId: string,
    purpose: OtpPurpose,
  ): Promise<void> {
    const activeOtps = await this.otpRepository.find({
      where: {
        userId,
        purpose,
        usedAt: IsNull(),
        revokedAt: IsNull(),
      },
    });

    for (const otp of activeOtps) {
      otp.revoke();
    }

    if (activeOtps.length) {
      await this.otpRepository.save(activeOtps);
    }
  }

  private async getLatestActiveOtp(
    userId: string,
    purpose: OtpPurpose,
  ): Promise<Otp | null> {
    return this.otpRepository.findOne({
      where: {
        userId,
        purpose,
        usedAt: IsNull(),
        revokedAt: IsNull(),
      },
      order: { createdAt: 'DESC' },
    });
  }

  // ===================================================
  // RESPONSE
  // ===================================================

  private buildAuthResponse(user: User, tokens: TokensDto): AuthResponseDto {
    return {
      user: plainToInstance(UserResponseDto, user, {
        excludeExtraneousValues: true,
      }),
      tokens,
    };
  }
}
