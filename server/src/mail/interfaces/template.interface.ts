import { UserTemplateContext } from './template-context.interface';

/* =========================
   AUTH TEMPLATES
========================= */

export interface EmailVerificationTemplate extends UserTemplateContext {
  otpCode: string;
  expiryMinutes: number;
  verificationUrl?: string; // optional — for direct-verify button
}

export interface PasswordResetTemplate extends UserTemplateContext {
  otpCode: string;
  expiryMinutes: number;
  resetUrl?: string;
}

export interface TwoFactorTemplate extends UserTemplateContext {
  otpCode: string;
  expiryMinutes: number;
  loginUrl?: string;
}

// Single declaration — no duplicate
export interface PasswordChangedTemplate extends UserTemplateContext {
  changedAt: string;
  deviceName?: string;
  browser?: string;
  ipAddress?: string;
  time?: string;
  securityUrl?: string;
}

export interface LoginNewDeviceTemplate extends UserTemplateContext {
  deviceName?: string;
  browser?: string;
  ipAddress?: string;
  time?: string;         // matches template: {{time}}
  location?: string;     // matches template: {{location}}
  securityUrl?: string;
}

export interface EmailChangedTemplate extends UserTemplateContext {
  oldEmail: string;
  newEmail: string;
  changedAt?: string;
  revertUrl?: string;
}

/* =========================
   ACCOUNT TEMPLATES
========================= */

export interface WelcomeTemplate extends UserTemplateContext {
  dashboardUrl: string;  // matches template: {{dashboardUrl}}
}

export interface AccountDeactivatedTemplate extends UserTemplateContext {
  supportUrl?: string;   // matches template: {{supportUrl}}
  reason?: string;
}

export interface AccountRestoredTemplate extends UserTemplateContext {
  loginUrl: string;      // matches template: {{loginUrl}}
}

export interface AccountDeletedTemplate extends UserTemplateContext {
  // no dynamic vars needed beyond firstName — template has no {{}} bindings
}

export interface AccountLockedTemplate extends UserTemplateContext {
  resetUrl?: string;     // matches template: {{resetUrl}}
  reason?: string;
  lockedAt?: string;
  supportLink?: string;
}

/* =========================
   SESSION TEMPLATES
========================= */

export interface LogoutAllTemplate extends UserTemplateContext {
  loginUrl?: string;     // matches template: {{loginUrl}}
}

export interface SessionRevokedTemplate extends UserTemplateContext {
  deviceName?: string;   // matches template: {{deviceName}}
  sessionsUrl?: string;  // matches template: {{sessionsUrl}}
}

/* =========================
   PRODUCT TEMPLATES
========================= */

export interface SubscriptionActivatedTemplate extends UserTemplateContext {
  planName: string;        // matches template: {{planName}}
  billingCycle: string;    // matches template: {{billingCycle}}
  amount: string;          // matches template: {{amount}}
  nextBillingDate: string; // matches template: {{nextBillingDate}}
  dashboardUrl?: string;   // matches template: {{dashboardUrl}}
}

export interface PaymentReceiptTemplate extends UserTemplateContext {
  description: string;     // matches template: {{description}}
  amount: string;          // matches template: {{amount}}
  date: string;            // matches template: {{date}}
  reference: string;       // matches template: {{reference}}
  paymentMethod: string;   // matches template: {{paymentMethod}}
  invoiceUrl?: string;     // matches template: {{invoiceUrl}}
  invoiceNumber?: string;  // used in mail subject
}

export interface TutorReminderTemplate extends UserTemplateContext {
  tutorName: string;       // matches template: {{tutorName}}
  subject: string;         // matches template: {{subject}}
  date: string;            // matches template: {{date}}
  time: string;            // matches template: {{time}}
  duration: string;        // matches template: {{duration}}
  meetingLink?: string;    // matches template: {{meetingLink}}
}
