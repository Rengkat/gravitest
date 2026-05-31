import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiTooManyRequestsResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { Public } from './decorators/public.decorator';
import { CurrentUser, UserId } from './decorators/current-user.decorator';

import {
  ForgotPasswordDto,
  LoginDto,
  RegisterUserDto,
  ResendVerificationDto,
  ResetPasswordDto,
  VerifyEmailOtpDto,
} from './dto/auth.dto';
import { AuthService, RefreshTokenContext } from './auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ─────────────────────────────────────────────
  // PUBLIC ROUTES
  // ─────────────────────────────────────────────

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Create a new user account with email, password, and profile information. Sends a verification OTP to the provided email.',
  })
  @ApiBody({ type: RegisterUserDto })
  @ApiCreatedResponse({
    description: 'User registered successfully. Verification email sent.',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Registration successful. Please verify your email.',
        },
        userId: {
          type: 'string',
          format: 'uuid',
          example: '550e8400-e29b-41d4-a716-446655440000',
        },
        email: { type: 'string', example: 'user@example.com' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or validation failed',
  })
  @ApiConflictResponse({
    description: 'Email already registered',
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many registration attempts from this IP',
  })
  register(@Body() dto: RegisterUserDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User login',
    description:
      'Authenticate user with email and password. Returns access token, refresh token, and user profile. Includes device and location information for session management.',
  })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          description: 'JWT access token',
          example: 'eyJhbGciOiJIUzI1NiIs...',
        },
        refreshToken: {
          type: 'string',
          description: 'JWT refresh token',
          example: 'eyJhbGciOiJIUzI1NiIs...',
        },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            role: { type: 'string' },
            isVerified: { type: 'boolean' },
          },
        },
        expiresIn: { type: 'number', example: 3600 },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid credentials or input data',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid email or password',
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many login attempts. Account temporarily locked.',
  })
  @ApiResponse({
    status: 403,
    description: 'Email not verified',
  })
  login(@Body() dto: LoginDto, @Req() req: Request) {
    return this.authService.login(dto, req);
  }

  @Public()
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify email with OTP',
    description:
      'Verify user email address using the OTP sent during registration. Required before first login.',
  })
  @ApiBody({ type: VerifyEmailOtpDto })
  @ApiOkResponse({
    description: 'Email verified successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Email verified successfully.' },
        verified: { type: 'boolean', example: true },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid or expired OTP',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many verification attempts',
  })
  verifyEmail(@Body() dto: VerifyEmailOtpDto) {
    return this.authService.verifyEmail(dto);
  }

  @Public()
  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Resend verification OTP',
    description:
      'Request a new verification OTP if the previous one expired or was not received. Rate limited to prevent abuse.',
  })
  @ApiBody({ type: ResendVerificationDto })
  @ApiOkResponse({
    description: 'Verification OTP sent successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Verification OTP sent to your email.',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid email format',
  })
  @ApiNotFoundResponse({
    description: 'No account found with this email',
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many OTP requests. Please wait before requesting again.',
  })
  resendVerification(@Body() dto: ResendVerificationDto) {
    return this.authService.sendEmailVerificationOtp(dto);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Request password reset',
    description:
      "Send a password reset link to the user's email. The link contains a time-limited token for password reset.",
  })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiOkResponse({
    description: 'Password reset email sent if account exists',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'If an account with that email exists, a password reset link has been sent.',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid email format',
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many password reset requests',
  })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reset password with token',
    description:
      'Reset user password using the token received via email. Token expires after a set period for security.',
  })
  @ApiBody({ type: ResetPasswordDto })
  @ApiOkResponse({
    description: 'Password reset successful',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Password reset successful. You can now login with your new password.',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid or expired reset token',
  })
  @ApiResponse({
    status: 400,
    description: 'New password cannot be the same as old password',
  })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  // ─────────────────────────────────────────────
  // REFRESH  (uses the refresh guard, not access guard)
  // ─────────────────────────────────────────────

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access token',
    description:
      'Exchange a valid refresh token for a new access token and refresh token pair. The old refresh token is invalidated after use (token rotation).',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: {
          type: 'string',
          description: 'Valid refresh token',
          example: 'eyJhbGciOiJIUzI1NiIs...',
        },
      },
      required: ['refreshToken'],
    },
  })
  @ApiOkResponse({
    description: 'Tokens refreshed successfully',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          description: 'New JWT access token',
          example: 'eyJhbGciOiJIUzI1NiIs...',
        },
        refreshToken: {
          type: 'string',
          description: 'New JWT refresh token',
          example: 'eyJhbGciOiJIUzI1NiIs...',
        },
        expiresIn: { type: 'number', example: 3600 },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid, expired, or revoked refresh token',
  })
  @ApiBadRequestResponse({
    description: 'Missing refresh token in request body',
  })
  refresh(@CurrentUser() ctx: RefreshTokenContext, @Req() req: Request) {
    return this.authService.refreshTokens(ctx, req);
  }

  // ─────────────────────────────────────────────
  // AUTHENTICATED ROUTES
  // ─────────────────────────────────────────────

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user profile',
    description:
      'Retrieve the profile of the currently authenticated user. Includes user details, roles, and account status.',
  })
  @ApiOkResponse({
    description: 'User profile retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          example: '550e8400-e29b-41d4-a716-446655440000',
        },
        email: { type: 'string', example: 'user@example.com' },
        firstName: { type: 'string', example: 'John' },
        lastName: { type: 'string', example: 'Doe' },
        role: { type: 'string', example: 'STUDENT' },
        isVerified: { type: 'boolean', example: true },
        avatar: { type: 'string', nullable: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'User is not authenticated or token is invalid/expired',
  })
  getProfile(@UserId() userId: string) {
    return this.authService.getProfile(userId);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Logout (current session)',
    description:
      "Revoke the current session by invalidating the access token's JTI. The refresh token will also be invalidated.",
  })
  @ApiOkResponse({
    description: 'Logged out successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Logged out successfully.' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'User is not authenticated or token is invalid',
  })
  logout(@CurrentUser() user: { id: string; jti: string }) {
    return this.authService.logout(user.id, user.jti);
  }

  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Logout from all devices',
    description:
      'Revoke all active sessions for the current user. This invalidates all access and refresh tokens across all devices.',
  })
  @ApiOkResponse({
    description: 'Logged out from all devices successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Logged out from all devices successfully.',
        },
        sessionsRevoked: { type: 'number', example: 3 },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'User is not authenticated or token is invalid',
  })
  logoutAll(@UserId() userId: string) {
    return this.authService.logoutAll(userId);
  }
}
