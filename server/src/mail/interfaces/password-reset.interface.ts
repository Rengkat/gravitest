import { BaseTemplateContext } from './template-context.interface';

export interface PasswordResetOtpContext extends BaseTemplateContext {
  otpCode: string;
  formattedOtp: string;
  expiresIn: string;
}
