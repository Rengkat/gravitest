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

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { Public } from './decorators/public.decorator';
import { CurrentUser, UserId } from './decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';

import {
  ForgotPasswordDto,
  LoginDto,
  RegisterUserDto,
  ResendVerificationDto,
  ResetPasswordDto,
  VerifyEmailOtpDto,
} from './dto/auth.dto';
import { AuthService, RefreshTokenContext } from './auth.service';

// @UseGuards(JwtAuthGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ─────────────────────────────────────────────
  // PUBLIC ROUTES
  // ─────────────────────────────────────────────

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() dto: RegisterUserDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto, @Req() req: Request) {
    return this.authService.login(dto, req);
  }

  @Public()
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  verifyEmail(@Body() dto: VerifyEmailOtpDto) {
    return this.authService.verifyEmail(dto);
  }

  @Public()
  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  resendVerification(@Body() dto: ResendVerificationDto) {
    return this.authService.sendEmailVerificationOtp(dto);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  // ─────────────────────────────────────────────
  // REFRESH  (uses the refresh guard, not access guard)
  // ─────────────────────────────────────────────

  /**
   * POST /auth/refresh
   * Body: { refreshToken: string }
   *
   * JwtRefreshGuard validates the refresh JWT and passes
   * { userId, jti, rawToken } into req.user via JwtRefreshStrategy.
   */
  @Public()
  @UseGuards(JwtRefreshGuard) // apply refresh guard instead
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@CurrentUser() ctx: RefreshTokenContext, @Req() req: Request) {
    return this.authService.refreshTokens(ctx, req);
  }

  // ─────────────────────────────────────────────
  // AUTHENTICATED ROUTES
  // ─────────────────────────────────────────────

  @Get('me')
  getProfile(@UserId() userId: string) {
    return this.authService.getProfile(userId);
  }

  /**
   * POST /auth/logout
   * Revokes only the current session (identified by the JTI in the
   * access token that JwtAccessStrategy injects into req.user).
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@CurrentUser() user: { id: string; jti: string }) {
    return this.authService.logout(user.id, user.jti);
  }

  /**
   * POST /auth/logout-all
   * Revokes every active session for the user.
   */
  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  logoutAll(@UserId() userId: string) {
    return this.authService.logoutAll(userId);
  }
}
