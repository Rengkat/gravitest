import { UserTemplateContext } from './template-context.interface';

/* =========================
   AUTH TEMPLATES
========================= */

export interface EmailVerificationTemplate extends UserTemplateContext {
  otpCode: string;
  verificationLink?: string;
  expiryTime: string;
}

export interface PasswordResetTemplate extends UserTemplateContext {
  resetToken?: string;
  resetLink: string;
  expiryTime: string;
}

export interface PasswordChangedTemplate extends UserTemplateContext {
  changedAt: string;
  changedFrom?: string;
}

export interface LoginNewDeviceTemplate extends UserTemplateContext {
  deviceName: string;
  browser: string;
  operatingSystem: string;
  location: string;
  loginTime: string;
  ipAddress: string;
}

export interface EmailChangedTemplate extends UserTemplateContext {
  oldEmail: string;
  newEmail: string;
  changedAt: string;
}

export interface TwoFactorTemplate extends UserTemplateContext {
  code: string;
  expiryTime: string;
}

/* =========================
   ACCOUNT TEMPLATES
========================= */

export interface WelcomeTemplate extends UserTemplateContext {
  loginLink: string;
  companyName?: string;
  features?: string[];
}

export interface AccountDeactivatedTemplate extends UserTemplateContext {
  deactivatedAt: string;
  reason?: string;
  reactivationLink?: string;
}

export interface AccountRestoredTemplate extends UserTemplateContext {
  restoredAt: string;
  loginLink: string;
}

export interface AccountDeletedTemplate extends UserTemplateContext {
  deletedAt: string;
  gracePeriodEnds?: string;
}

export interface AccountLockedTemplate extends UserTemplateContext {
  lockedAt: string;
  reason: string;
  unlockTime?: string;
  supportLink: string;
}

/* =========================
   SESSION TEMPLATES
========================= */

export interface LogoutAllTemplate extends UserTemplateContext {
  logoutTime: string;
  deviceCount: number;
  requestedFrom?: string;
}

export interface SessionRevokedTemplate extends UserTemplateContext {
  revokedAt: string;
  deviceName: string;
  reason?: string;
}

/* =========================
   PRODUCT TEMPLATES
========================= */

export interface SubscriptionActivatedTemplate extends UserTemplateContext {
  planName: string;
  startDate: string;
  endDate?: string;
  amount: string;
  features: string[];
  dashboardLink: string;
}

export interface PaymentReceiptTemplate extends UserTemplateContext {
  invoiceNumber: string;
  amount: string;
  currency: string;
  paymentDate: string;
  paymentMethod: string;
  items: Array<{
    description: string;
    amount: string;
  }>;
}

export interface TutorReminderTemplate extends UserTemplateContext {
  tutorName: string;
  sessionDate: string;
  sessionTime: string;
  sessionDuration: string;
  subject: string;
  meetingLink: string;
  notes?: string;
}
