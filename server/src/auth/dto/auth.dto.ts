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

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

const OTP_REGEX = /^\d{6}$/;

const PHONE_REGEX = /^\+234\d{10}$/;

// ───────────────── REGISTER ─────────────────

export class RegisterUserDto extends BaseUserDto {
  @ApiProperty({ example: 'MySecurePass123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  @Matches(PASSWORD_REGEX, {
    message:
      'Password must contain uppercase, lowercase, number, and special character',
  })
  password!: string;
}

// ───────────────── RESPONSE DTOs ─────────────────

export class UserResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  firstName: string;

  @ApiProperty()
  @Expose()
  @IsOptional()
  middleName?: string;

  @ApiProperty()
  @Expose()
  lastName: string;

  @ApiProperty()
  @Expose()
  role: string;

  @ApiProperty()
  @Expose()
  isEmailVerified: boolean;

  @ApiProperty()
  @Expose()
  isActive: boolean;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}

export class TokensDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  expiresIn: number;
}

export class AuthResponseDto {
  @ApiProperty({ type: UserResponseDto })
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  @ApiProperty({ type: TokensDto })
  tokens: TokensDto;
}

export class MessageResponseDto {
  @ApiProperty()
  message: string;
}

export class RegisterResponseDto extends MessageResponseDto {
  @ApiPropertyOptional()
  devOtp?: string;
}

// ───────────────── LOGIN ─────────────────

export class LoginDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email!: string;

  @ApiProperty({ example: 'MySecurePass123!' })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiProperty({ example: '123345' })
  @IsString()
  @IsOptional()
  deviceId?: string;

  @ApiProperty({ example: 'Iphone 12' })
  @IsString()
  @IsOptional()
  deviceName?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean = false;
}

// Optional if you truly want phone login
export class PhoneLoginDto {
  @ApiProperty({ example: '+2348012345678' })
  @Matches(PHONE_REGEX, {
    message: 'Phone number must be in +2348012345678 format',
  })
  phoneNumber!: string;

  @ApiProperty({ example: 'MySecurePass123!' })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean = false;
}

// ───────────────── REFRESH TOKEN ─────────────────

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}

// ───────────────── EMAIL OTP ─────────────────

export class VerifyEmailOtpDto {
  @ApiProperty({ example: 'alex@example.com' })
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email!: string;

  @ApiProperty({ example: '847291' })
  @Transform(({ value }) => value?.replace(/\s/g, ''))
  @Matches(OTP_REGEX, { message: 'OTP must be a valid 6-digit code' })
  code!: string;
}

export class ResendVerificationDto {
  @ApiProperty({ example: 'alex@example.com' })
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email!: string;
}

// ───────────────── PASSWORD RESET ─────────────────

export class ForgotPasswordDto {
  @ApiProperty({ example: 'alex@example.com' })
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email!: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'alex@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '847291' })
  @Matches(/^\d{6}$/, {
    message: 'OTP must be a 6-digit number',
  })
  code!: string;

  @ApiProperty({ example: 'NewP@ssw0rd!' })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  @Matches(PASSWORD_REGEX, {
    message:
      'Password must contain uppercase, lowercase, number, and special character',
  })
  newPassword!: string;
}

// ───────────────── 2FA ─────────────────

export class Verify2FADto {
  @ApiProperty({ example: '847291' })
  @Matches(OTP_REGEX, {
    message: '2FA code must be a valid 6-digit number',
  })
  code!: string;
}

// ───────────────── PHONE OTP ─────────────────

export class VerifyPhoneOtpDto {
  @ApiProperty({ example: '+2348012345678' })
  @Matches(PHONE_REGEX, {
    message: 'Phone number must be in +2348012345678 format',
  })
  phoneNumber!: string;

  @ApiProperty({ example: '847291' })
  @Matches(OTP_REGEX, {
    message: 'OTP must be a valid 6-digit code',
  })
  code!: string;
}
