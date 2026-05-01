import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class OtpProvider {
  generateOtp(length: number = 6): { code: string; expiresAt: Date } {
    // Generate a secure 6-digit numeric string
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiry (e.g., 10 minutes)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    return { code, expiresAt };
  }

  async verifyOtp(user: User, inputCode: string): Promise<boolean> {
    if (!user.otpCode || !user.otpExpiresAt) return false;

    const isExpired = new Date() > user.otpExpiresAt;
    const isMatch = user.otpCode === inputCode;

    return isMatch && !isExpired;
  }
}
