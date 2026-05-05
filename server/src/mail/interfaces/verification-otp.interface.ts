import { BaseTemplateContext } from './template-context.interface';

export interface VerificationOtpContext extends BaseTemplateContext {
  otpCode: string;
  formattedOtp: string;
  expiresIn: string;
}
