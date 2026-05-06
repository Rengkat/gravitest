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
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

import { AuthService } from './auth.service';
import {
  LoginDto,
  RegisterUserDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ResendVerificationDto,
  VerifyEmailOtpDto,
} from './dto/auth.dto';
// import { Public } from '../../common/decorators/public.decorator';
// import { CurrentUser } from '../../common/decorators/current-user.decorator';
// import { JwtRefreshGuard } from '../../common/guards/jwt-refresh.guard';
// import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

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
        devOtp: '123456', // Only in development mode
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

  // ══════════════════════════════════════════
  // LOGIN
  // ══════════════════════════════════════════

  // @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login with email and password',
    description: 'Returns user info and tokens on successful login.',
  })
  @ApiOkResponse({
    description: 'Login successful',
    schema: {
      example: {
        user: {
          id: 'uuid',
          email: 'user@example.com',
          firstName: 'John',
          lastName: 'Doe',
          isEmailVerified: true,
        },
        tokens: {
          accessToken: 'eyJhbGciOiJIUzI1NiIs...',
          refreshToken: 'eyJhbGciOiJIUzI1NiIs...',
          expiresIn: 900,
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiForbiddenResponse({
    description: 'Account locked or email not verified',
  })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // ══════════════════════════════════════════
  // LOGOUT
  // ══════════════════════════════════════════

  // @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Logout current user',
    description: 'Invalidates the current refresh token and logs out the user.',
  })
  @ApiOkResponse({
    schema: {
      example: {
        message: 'Logged out successfully',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired token' })
  logout() {
    // @CurrentUser('id') userId: string
    return this.authService.logout('userId');
  }

  // ══════════════════════════════════════════
  // EMAIL VERIFICATION
  // ══════════════════════════════════════════

  // @Public()
  @Post('send-verification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Resend email verification OTP',
    description:
      'Sends a new 6-digit verification code to the provided email. ' +
      'Use this if the previous code expired or was not received.',
  })
  @ApiOkResponse({
    schema: {
      example: {
        message:
          'If the email exists in our system, a verification code has been sent.',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Please wait a minute before requesting another code',
  })
  sendVerificationOtp(@Body() dto: ResendVerificationDto) {
    return this.authService.sendEmailVerificationOtp(dto);
  }

  // @Public()
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify email with OTP',
    description:
      'Verifies the email address using the 6-digit code sent during registration. ' +
      'After verification, the account can be used for login.',
  })
  @ApiOkResponse({
    schema: {
      example: {
        message: 'Email verified successfully',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid or expired verification code',
  })
  verifyEmail(@Body() dto: VerifyEmailOtpDto) {
    return this.authService.verifyEmail(dto);
  }

  // ══════════════════════════════════════════
  // PASSWORD MANAGEMENT
  // ══════════════════════════════════════════

  // @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Request password reset',
    description:
      'Sends a password reset OTP to the provided email if the account exists and is active.',
  })
  @ApiOkResponse({
    schema: {
      example: {
        message:
          'If the email exists in our system, a verification code has been sent.',
      },
    },
  })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  // @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reset password with OTP',
    description:
      'Resets the password using the OTP sent to the email. The new password must meet strength requirements.',
  })
  @ApiOkResponse({
    schema: {
      example: {
        message: 'Password reset successful',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid email, OTP, or password requirements not met',
  })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  // ══════════════════════════════════════════
  // TOKEN MANAGEMENT
  // ══════════════════════════════════════════

  // @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Refresh access token',
    description:
      'Uses a valid refresh token to generate a new access token. The old refresh token is rotated for security.',
  })
  @ApiOkResponse({
    description: 'New tokens generated successfully',
    schema: {
      example: {
        user: {
          id: 'uuid',
          email: 'user@example.com',
          firstName: 'John',
          lastName: 'Doe',
        },
        tokens: {
          accessToken: 'eyJhbGciOiJIUzI1NiIs...',
          refreshToken: 'eyJhbGciOiJIUzI1NiIs...',
          expiresIn: 900,
        },
      },
    },
  })
  // @ApiUnauthorizedResponse({ description: 'Invalid or expired refresh token' })
  // refresh(@Req() req: Request & { user: any }) {
  //   return this.authService.refreshTokens(req.user);
  // }

  // ══════════════════════════════════════════
  // PROFILE (PROTECTED)
  // ══════════════════════════════════════════

  // @UseGuards(JwtAuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user profile',
    description:
      'Returns the profile information of the currently authenticated user.',
  })
  @ApiOkResponse({
    description: 'Current user profile',
    schema: {
      example: {
        id: 'uuid',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        isEmailVerified: true,
        createdAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired token' })
  getProfile() {
    // @CurrentUser() user: any
    return this.authService.getProfile('user.id');
  }
}
