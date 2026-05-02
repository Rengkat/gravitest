// login.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
