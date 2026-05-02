import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserRole } from 'src/common/enums/enums';

export class AuthUserDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  firstName: string;

  @ApiPropertyOptional()
  @Expose()
  middleName?: string | null;

  @ApiProperty()
  @Expose()
  lastName: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiPropertyOptional()
  @Expose()
  phoneNumber?: string | null;

  @ApiProperty({ enum: UserRole })
  @Expose()
  role: UserRole;

  @ApiProperty()
  @Expose()
  isEmailVerified: boolean;

  @ApiPropertyOptional()
  @Expose()
  isPhoneVerified?: boolean;

  @ApiProperty()
  @Expose()
  isActive: boolean;

  @ApiPropertyOptional()
  @Expose()
  avatarUrl?: string | null;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  get fullName(): string {
    return [this.firstName, this.middleName, this.lastName]
      .filter(Boolean)
      .join(' ');
  }
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
  @ApiProperty({ type: AuthUserDto })
  @Type(() => AuthUserDto)
  user: AuthUserDto;

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
