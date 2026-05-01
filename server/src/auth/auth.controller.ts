import {
  Controller,
  Post,
  Body,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { RegisterUserDto } from 'src/user/dto/register-user.dto';
import { EmailLoginDto } from './common/dto/login.dto';
// import { Public, CurrentUser } from '../../common/decorators';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ══════════════════════════════════════════
  // REGISTER
  // ══════════════════════════════════════════

  // @Public()
  @Post('register')
  @ApiOperation({
    summary: 'Register a new account',
    description:
      'Creates an account and sends a 6-digit OTP to the provided email address. ' +
      'The account cannot be used until the email is verified via POST /auth/verify-email.',
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        message:
          'Account created. Check your email for a 6-digit verification code.',
      },
    },
  })
  @ApiConflictResponse({ description: 'Email already registered' })
  @ApiBadRequestResponse({
    description: 'Validation error — password too weak, invalid phone, etc.',
  })
  register(@Body() dto: RegisterUserDto) {
    return this.authService.register(dto);
  }

  //══════════════════════════════════════════
  // LOGIN
  // ══════════════════════════════════════════
}
