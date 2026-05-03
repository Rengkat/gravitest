// register-user.dto.ts
import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseUserDto } from './base-user.dto';

/**
 * RegisterUserDto — for public self-registration via POST /auth/register
 * Extends BaseUserDto but makes password REQUIRED (unlike CreateUserDto where it's optional)
 */
