import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BaseUserDto } from 'src/user/dto';

// ── Register ───────────────────────────────────────────────────────────────────

export class RegisterUserDto extends BaseUserDto {
  @ApiProperty({ example: 'MySecurePass123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain uppercase, lowercase, and a number',
  })
  password!: string;
}

export class TokensDto {
  @ApiProperty({ description: 'JWT Access Token (15 min expiry)' })
  accessToken: string;

  @ApiProperty({ description: 'Refresh Token (7 or 30 day expiry)' })
  refreshToken: string;

  @ApiProperty({ description: 'Access token TTL in seconds' })
  expiresIn: number;
}

export class AuthResponseDto {
  @ApiProperty({ type: RegisterUserDto })
  @Type(() => RegisterUserDto)
  user: RegisterUserDto;

  @ApiProperty({ type: TokensDto })
  tokens: TokensDto;
}

export class MessageResponseDto {
  @ApiProperty()
  message: string;
}

export class RegisterResponseDto extends MessageResponseDto {
  @ApiPropertyOptional({ description: 'Returned only in development mode' })
  devOtp?: string;
}

// ── Login  ──────────────────────────────────────────────────────────────

/**
 * Standard email + password login
 */
export class LoginDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email or phone number',
  })
  @IsString()
  @IsNotEmpty()
  identifier!: string; // Can be email or phone

  @ApiProperty({
    example: 'MySecurePass123!',
    description: 'User password',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiPropertyOptional({
    default: false,
    description: 'Set true for "Remember Me" — extends session to 30 days',
  })
  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean = false;
}

/**
 * Login with email only (for clarity)
 */
export class EmailLoginDto {
  @ApiProperty({
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: 'MySecurePass123!',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean = false;
}

/**
 * Login with phone number only
 */
export class PhoneLoginDto {
  @ApiProperty({
    example: '+2348012345678',
    pattern: '^\\+234\\d{10}$',
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber!: string;

  @ApiProperty({
    example: 'MySecurePass123!',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsString()
  rememberMe?: boolean = false;
}

// ── Refresh Token ──────────────────────────────────────────────────────────────

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

// ── OTP Verify ─────────────────────────────────────────────────────────────────

export class VerifyEmailOtpDto {
  @ApiProperty({ example: 'alex@example.com' })
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @ApiProperty({ example: '847291' })
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  code: string;
}

export class ResendVerificationDto {
  @ApiProperty({ example: 'alex@example.com' })
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;
}

// ── Forgot / Reset Password ────────────────────────────────────────────────────

export class ForgotPasswordDto {
  @ApiProperty({ example: 'alex@example.com' })
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ example: 'NewP@ssw0rd!' })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
    { message: 'Password must meet complexity requirements' },
  )
  newPassword: string;
}

// ── 2FA ────────────────────────────────────────────────────────────────────────

export class Verify2FADto {
  @ApiProperty({ description: 'TOTP code from authenticator app' })
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  code: string;
}

// ── Phone OTP ──────────────────────────────────────────────────────────────────

export class VerifyPhoneOtpDto {
  @ApiProperty({ example: '2348012345678' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: '847291' })
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  code: string;
}
