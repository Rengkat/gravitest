import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashProvider } from './providers/Hash.provider';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { OtpProvider } from './providers/otp.provider';
import {
  AuthResponseDto,
  EmailLoginDto,
  RegisterUserDto,
  TokensDto,
  VerifyEmailOtpDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly isDev: boolean;
  private static readonly DUMMY_PASSWORD_HASH =
    '$2b$12$C6UzMDM.H6dfI/f/IKxGhuJ8eWQ4P1Q0N9l8o0L8pQx5V6m7n8y9K';
  constructor(
    private readonly userService: UserService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly otpProvider: OtpProvider,
    private readonly hashProvider: HashProvider,
    private readonly configService: ConfigService,
  ) {
    this.isDev = this.configService.get('NODE_ENV') === 'development';
  }
  // ======== BASIC AUTH METHODS ========
  //Register
  // : Promise<RegisterResponseDto
  async register(dto: RegisterUserDto) {
    const user = await this.userService.registerUser(dto);
    const { code, expiresAt } = this.otpProvider.generate();
    const hashedOtp = await this.hashProvider.hashPassword(code);
    user.scheduleOtp(hashedOtp, expiresAt);
    await this.userRepository.save(user);
    // await this.sendEmailVerificationOtp(user.email, otpBundle.code);
    return {
      message:
        'Account created! Please verify your email with the code we just sent you.',
    };
  }

  //Login
  //: Promise<AuthResponseDto>
  async login(dto: EmailLoginDto) {
    const user = await this.userService.findSensitiveUserByEmail(dto.email);
    const passwordHash = user?.passwordHash ?? AuthService.DUMMY_PASSWORD_HASH;

    const isPasswordValid = await this.hashProvider.comparePassword(
      dto.password,
      passwordHash,
    );

    // Constant-time: evaluate both conditions
    if (!user || !isPasswordValid) {
      if (user) {
        user.incrementFailedLoginAttempts();
        await this.userRepository.save(user);
      }
      throw new UnauthorizedException('Invalid credentials');
    }

    // Lock check
    if (user.isAccountLocked()) {
      throw new ForbiddenException(
        `Account locked. Try again after ${user.lockedUntil?.toLocaleTimeString()}.`,
      );
    }

    if (!user.isEmailVerified) {
      throw new ForbiddenException(
        'Email not verified. Please check your inbox.',
      );
    }
    // TODO: Implement 2FA check here if enabled
    //TODO: issue tokens
    user.recordSuccessfulLogin();
    await this.userRepository.save(user);

    return this.buildAuthResponse(user, {
      accessToken: 'dummy-access-token',
      refreshToken: 'dummy-refresh-token',
      expiresIn: 900,
    });
  }

  //verify email using otp
  async verifyEmail(dto: VerifyEmailOtpDto): Promise<{ message: string }> {
    const user = await this.userService.findSensitiveUserByEmail(dto.email);

    if (
      !user ||
      user.isEmailVerified ||
      !user.otpCodeHash ||
      !user.otpExpiresAt
    ) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    if (this.otpProvider.isExpired(user.otpExpiresAt)) {
      user.clearOtp();
      await this.userRepository.save(user);
      throw new BadRequestException('Invalid or expired verification code');
    }

    if (this.otpProvider.isMaxAttemptsReached(user.otpAttempts)) {
      user.clearOtp();
      await this.userRepository.save(user);
      throw new BadRequestException('Invalid or expired verification code');
    }

    const isValidOtp = await this.hashProvider.comparePassword(
      dto.code,
      user.otpCodeHash,
    );

    if (!isValidOtp) {
      user.incrementOtpAttempts();
      await this.userRepository.save(user);
      throw new BadRequestException('Invalid or expired verification code');
    }

    user.markEmailVerified();
    await this.userRepository.save(user);

    this.logger.log(`Email verified for user ${user.id}`);

    return { message: 'Email verified successfully' };
  }
  //rend email verification otp
  //reset password using otp
  //forgot password using otp
  //phone number verification using otp
  //restore password using otp
  //2FA using otp
  //refresh access token using refresh token
  //handle social logins (Google, Facebook, etc.)
  //   ====== HELPER METHODS ======
  //generate JWT access and refresh tokens
  //generate and verify OTPs
  //otp expiration and retry logic
  //send emails for verification and password reset
  // ============= HELPER METHODS ===========================
  /**
   * Load a user and all OTP columns via a query builder.
   * Throws NotFoundException if user is not found.
   */

  private buildAuthResponse(user: User, tokens: TokensDto): AuthResponseDto {
    return {
      user: plainToInstance(RegisterUserDto, user, {
        excludeExtraneousValues: true,
      }),
      tokens,
    };
  }
}
