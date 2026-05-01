import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

const OTP_LENGTH = 6;
const OTP_TTL_MINUTES = 10;
const MAX_OTP_ATTEMPTS = 5;

export interface OtpBundle {
  code: string;
  expiresAt: Date;
}

@Injectable()
export class OtpProvider {
  /**
   * Generates a secure numeric OTP bundle.
   */
  generate(): OtpBundle {
    const code = crypto
      .randomInt(0, 10 ** OTP_LENGTH)
      .toString()
      .padStart(OTP_LENGTH, '0');

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + OTP_TTL_MINUTES);

    return { code, expiresAt };
  }

  /**
   * Checks if the OTP has expired.
   */
  isExpired(expiresAt: Date | null): boolean {
    if (!expiresAt) return true;
    return new Date() > expiresAt;
  }

  /**
   * Checks if the user has failed too many times.
   */
  isMaxAttemptsReached(attempts: number): boolean {
    return attempts >= MAX_OTP_ATTEMPTS;
  }

  /**
   * Formats the OTP for email visibility (e.g., "123 456")
   */
  formatForDisplay(code: string): string {
    return code.replace(/(\d{3})(\d{3})/, '$1 $2');
  }
}
