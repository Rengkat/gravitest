// register-user.dto.ts
import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseUserDto } from './base-user.dto';

/**
 * RegisterUserDto — for public self-registration via POST /auth/register
 * Extends BaseUserDto but makes password REQUIRED (unlike CreateUserDto where it's optional)
 */
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
