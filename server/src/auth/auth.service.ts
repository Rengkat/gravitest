import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Otp } from './entities/otp.entity';
import { OtpProvider } from './providers/otp.provider';
import { HashProvider } from './providers/Hash.provider';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
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

    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
  ) {
    this.isDev = this.configService.get('NODE_ENV') === 'development';
  }

  // =====================================================
  // REGISTER
  // =====================================================

  async register(dto: RegisterUserDto): Promise<RegisterResponseDto> {
    const user = await this.userService.registerUser(dto);

    const plainOtp = await this.issueOtp(
      user.id,
      OtpPurpose.EMAIL_VERIFICATION,
    );

    return {
      message:
        'Account created successfully. A verification code has been sent to your email.',
      ...(this.isDev && { devOtp: plainOtp }),
    };
  }

  // =====================================================
  // LOGIN
  // =====================================================

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

  // =====================================================
  // RESEND EMAIL VERIFICATION OTP
  // =====================================================

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

    await this.issueOtp(user.id, OtpPurpose.EMAIL_VERIFICATION);

    return {
      message: 'Verification code sent successfully.',
    };
  }

  // =====================================================
  // VERIFY EMAIL
  // =====================================================

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

    this.logger.log(`Email verified successfully for user ${user.id}`);

    return {
      message: 'Email verified successfully',
    };
  }

  // =====================================================
  // FORGOT PASSWORD
  // =====================================================

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.userService.findSensitiveUserByEmail(dto.email);

    const response = {
      message:
        'If the email exists in our system, a verification code has been sent.',
    };

    if (!user || !user.isActive || user.isAccountLocked()) {
      return response;
    }

    const latestOtp = await this.getLatestActiveOtp(
      user.id,
      OtpPurpose.PASSWORD_RESET,
    );

    if (latestOtp && !this.otpProvider.canResend(latestOtp.createdAt)) {
      return response;
    }

    await this.issueOtp(user.id, OtpPurpose.PASSWORD_RESET);

    return response;
  }

  // =====================================================
  // RESET PASSWORD
  // =====================================================

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const user = await this.userService.findSensitiveUserByEmail(dto.email);

    if (!user || !user.isActive) {
      throw new BadRequestException('Invalid email or OTP');
    }

    await this.validateOtpOrThrow(user.id, OtpPurpose.PASSWORD_RESET, dto.code);

    const passwordHash = await this.hashProvider.hashPassword(dto.newPassword);

    user.changePassword(passwordHash);
    await this.userService.save(user);

    this.logger.log(`Password reset successful for user ${user.id}`);

    return {
      message: 'Password reset successful',
    };
  }

  // =====================================================
  // LOGOUT
  // =====================================================

  async logout(userId: string): Promise<{ message: string }> {
    // TODO revoke refresh token/session store here
    return { message: 'Logged out successfully' };
  }

  // =====================================================
  // INTERNAL OTP HELPERS
  // =====================================================

  private async issueOtp(userId: string, purpose: OtpPurpose): Promise<string> {
    await this.revokeActiveOtps(userId, purpose);

    const otpBundle = this.otpProvider.generate();

    const otp = this.otpRepository.create({
      userId,
      purpose,
      codeHash: otpBundle.codeHash,
      expiresAt: otpBundle.expiresAt,
      createdAt: new Date(),
    });

    await this.otpRepository.save(otp);

    // TODO send actual email/sms here

    if (this.isDev) {
      this.logger.warn(
        `[DEV OTP] ${purpose} for ${userId}: ${otpBundle.plainCode}`,
      );
    }

    return otpBundle.plainCode;
  }

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
      order: {
        createdAt: 'DESC',
      },
    });
  }

  private buildAuthResponse(user: User, tokens: TokensDto): AuthResponseDto {
    return {
      user: plainToInstance(UserResponseDto, user, {
        excludeExtraneousValues: true,
      }),
      tokens,
    };
  }
}
