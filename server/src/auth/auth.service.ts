import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from 'src/user/dto/register-user.dto';
import { UserService } from 'src/user/user.service';
import { EmailLoginDto } from './dto/login.dto';
import { In, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OtpProvider } from './providers/otp.provider.ts';
import { HashProvider } from './providers/Hash.provider';
import { ConfigService } from '@nestjs/config';
import { AuthResponseDto, AuthUserDto, TokensDto } from './dto/auth.dto';
import { plainToInstance } from 'class-transformer';

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
    const otpBundle = this.otpProvider.generate();
    user.scheduleOtp(otpBundle.code, otpBundle.expiresAt);
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
    //load user with securiry columns
    const user = await this.userService.findByEmailForAuth(dto.email);
    const passwordHash = user?.passwordHash ?? AuthService.DUMMY_PASSWORD_HASH;

    // Constant-time password validation to prevent user enumeration
    const isPasswordValid = await this.hashProvider.comparePassword(
      dto.password,
      passwordHash,
    );

    if (!user || !isPasswordValid) {
      if (user) {
        user.incrementFailedLoginAttempts();
        await this.userRepository.save(user);
      }
      throw new UnauthorizedException('Invalid credentials');
    }
    // Account lock check
    if (user.isAccountLocked()) {
      const lockedTime = user.lockedUntil?.toLocaleTimeString();
      throw new UnauthorizedException(
        `Account is locked due to multiple failed login attempts. Please try again later at ${lockedTime}.`,
      );
    }

    // Email verification check
    if (!user.isEmailVerified) {
      throw new ForbiddenException(
        'Email not verified. Please check your inbox for the verification code.',
      );
    }

    // Password check
    const isPasswordCorrect = await this.hashProvider.comparePassword(
      dto.password,
      user.passwordHash,
    );
    if (!isPasswordCorrect) {
      user.incrementFailedLoginAttempts();
      await this.userRepository.save(user);
      const attemptsLeft = 5 - user.failedLoginAttempts;
      const hint =
        attemptsLeft > 0
          ? ` ${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} remaining.`
          : ' Account is now locked for 15 minutes.';
      throw new UnauthorizedException(`Invalid credentials.${hint}`);
    }
    // TODO: Issue tokens

    //Record successful login
    user.recordSuccessfulLogin();
    await this.userRepository.save(user);
    return this.buildAuthResponse(user, {
      accessToken: 'dummy-access-token',
      refreshToken: 'dummy-refresh-token',
      expiresIn: 900,
    });
  }

  //verify email using otp
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
  private buildAuthResponse(user: User, tokens: TokensDto): AuthResponseDto {
    return {
      user: plainToInstance(AuthUserDto, user, {
        excludeExtraneousValues: true,
      }),
      tokens,
    };
  }
}
