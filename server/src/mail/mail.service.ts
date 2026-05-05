// src/mail/mail.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { MailProvider } from './providers/mail.provider';
import { TemplateRendererProvider } from './providers/template-renderer.provider';
import {
  EmailVerificationTemplate,
  PasswordResetTemplate,
  PasswordChangedTemplate,
  LoginNewDeviceTemplate,
  EmailChangedTemplate,
  TwoFactorTemplate,
  WelcomeTemplate,
  AccountDeactivatedTemplate,
  AccountRestoredTemplate,
  AccountDeletedTemplate,
  AccountLockedTemplate,
  LogoutAllTemplate,
  SessionRevokedTemplate,
  SubscriptionActivatedTemplate,
  PaymentReceiptTemplate,
  TutorReminderTemplate,
} from './interfaces/template.interface';

/**
 * Layer 3: Mail Service (Orchestration Layer)
 *
 * Organized by domain matching your template structure:
 * - Auth emails
 * - Account emails
 * - Session emails
 * - Product emails
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailProvider: MailProvider,
    private readonly templateRenderer: TemplateRendererProvider,
  ) {}

  // ============================================
  // AUTH EMAILS
  // ============================================

  /**
   * Send email verification OTP
   * Template: auth/email-verification
   */
  async sendEmailVerificationOtp(
    email: string,
    variables: EmailVerificationTemplate,
  ): Promise<string> {
    this.logger.log(`Sending verification OTP to ${email}`);

    const html = await this.templateRenderer.render('auth/email-verification', {
      subject: 'Verify Your Email',
      ...variables,
    });

    const result = await this.mailProvider.sendMail({
      to: email,
      subject: `Verify Your Email - OTP: ${variables.otpCode}`,
      html,
      tags: [
        { name: 'type', value: 'verification' },
        { name: 'template', value: 'email-verification' },
      ],
    });

    this.logger.log(`Verification OTP sent to ${email} - ID: ${result.id}`);
    return result.id;
  }

  /**
   * Send password reset link
   * Template: auth/password-reset
   */
  async sendPasswordResetOtp(
    email: string,
    variables: PasswordResetTemplate,
  ): Promise<string> {
    this.logger.log(`Sending password reset to ${email}`);

    const html = await this.templateRenderer.render('auth/password-reset', {
      subject: 'Reset Your Password',
      ...variables,
    });

    const result = await this.mailProvider.sendMail({
      to: email,
      subject: 'Reset Your Password',
      html,
      tags: [
        { name: 'type', value: 'password-reset' },
        { name: 'template', value: 'password-reset' },
      ],
    });

    this.logger.log(`Password reset sent to ${email} - ID: ${result.id}`);
    return result.id;
  }

  /**
   * Send password changed confirmation
   * Template: auth/password-changed
   */
  async sendPasswordChangedAlert(
    email: string,
    variables: PasswordChangedTemplate,
  ): Promise<string> {
    this.logger.log(`Sending password change alert to ${email}`);

    const html = await this.templateRenderer.render('auth/password-changed', {
      subject: 'Password Changed Successfully',
      ...variables,
    });

    const result = await this.mailProvider.sendMail({
      to: email,
      subject: 'Your Password Has Been Changed',
      html,
      tags: [
        { name: 'type', value: 'security' },
        { name: 'template', value: 'password-changed' },
      ],
    });

    this.logger.log(
      `Password change alert sent to ${email} - ID: ${result.id}`,
    );
    return result.id;
  }

  /**
   * Send login from new device alert
   * Template: auth/login-new-device
   */
  async sendLoginNewDeviceAlert(
    email: string,
    variables: LoginNewDeviceTemplate,
  ): Promise<string> {
    this.logger.log(`Sending new device login alert to ${email}`);

    const html = await this.templateRenderer.render('auth/login-new-device', {
      subject: 'New Device Login Detected',
      ...variables,
    });

    const result = await this.mailProvider.sendMail({
      to: email,
      subject: 'New Device Login Detected',
      html,
      tags: [
        { name: 'type', value: 'security' },
        { name: 'template', value: 'login-new-device' },
      ],
    });

    this.logger.log(
      `New device login alert sent to ${email} - ID: ${result.id}`,
    );
    return result.id;
  }

  /**
   * Send email changed confirmation
   * Template: auth/email-changed
   */
  async sendEmailChangedAlert(
    email: string,
    variables: EmailChangedTemplate,
  ): Promise<string> {
    this.logger.log(`Sending email change alert to ${email}`);

    const html = await this.templateRenderer.render('auth/email-changed', {
      subject: 'Email Address Changed',
      ...variables,
    });

    const result = await this.mailProvider.sendMail({
      to: email,
      subject: 'Your Email Address Has Been Changed',
      html,
      tags: [
        { name: 'type', value: 'security' },
        { name: 'template', value: 'email-changed' },
      ],
    });

    this.logger.log(`Email change alert sent to ${email} - ID: ${result.id}`);
    return result.id;
  }

  /**
   * Send two-factor authentication code
   * Template: auth/two-factor
   */
  async sendTwoFactorCode(
    email: string,
    variables: TwoFactorTemplate,
  ): Promise<string> {
    this.logger.log(`Sending 2FA code to ${email}`);

    const html = await this.templateRenderer.render('auth/two-factor', {
      subject: 'Your Two-Factor Authentication Code',
      ...variables,
    });

    const result = await this.mailProvider.sendMail({
      to: email,
      subject: `Two-Factor Code: ${variables.code}`,
      html,
      tags: [
        { name: 'type', value: 'verification' },
        { name: 'template', value: 'two-factor' },
      ],
    });

    this.logger.log(`2FA code sent to ${email} - ID: ${result.id}`);
    return result.id;
  }

  // ============================================
  // ACCOUNT EMAILS
  // ============================================

  /**
   * Send welcome email
   * Template: account/welcome
   */
  async sendWelcomeEmail(
    email: string,
    variables: WelcomeTemplate,
  ): Promise<string> {
    this.logger.log(`Sending welcome email to ${email}`);

    const html = await this.templateRenderer.render('account/welcome', {
      subject: 'Welcome to ' + (variables.companyName || 'Our Platform'),
      ...variables,
    });

    const result = await this.mailProvider.sendMail({
      to: email,
      subject: `Welcome${variables.companyName ? ' to ' + variables.companyName : ''}!`,
      html,
      tags: [
        { name: 'type', value: 'welcome' },
        { name: 'template', value: 'welcome' },
      ],
    });

    this.logger.log(`Welcome email sent to ${email} - ID: ${result.id}`);
    return result.id;
  }

  /**
   * Send account deactivated notice
   * Template: account/deactivated
   */
  async sendAccountDeactivatedEmail(
    email: string,
    variables: AccountDeactivatedTemplate,
  ): Promise<string> {
    this.logger.log(`Sending account deactivation notice to ${email}`);

    const html = await this.templateRenderer.render('account/deactivated', {
      subject: 'Your Account Has Been Deactivated',
      ...variables,
    });

    const result = await this.mailProvider.sendMail({
      to: email,
      subject: 'Your Account Has Been Deactivated',
      html,
      tags: [
        { name: 'type', value: 'account' },
        { name: 'template', value: 'deactivated' },
      ],
    });

    this.logger.log(
      `Account deactivation notice sent to ${email} - ID: ${result.id}`,
    );
    return result.id;
  }

  /**
   * Send account restored notice
   * Template: account/restored
   */
  async sendAccountRestoredEmail(
    email: string,
    variables: AccountRestoredTemplate,
  ): Promise<string> {
    this.logger.log(`Sending account restoration notice to ${email}`);

    const html = await this.templateRenderer.render('account/restored', {
      subject: 'Your Account Has Been Restored',
      ...variables,
    });

    const result = await this.mailProvider.sendMail({
      to: email,
      subject: 'Your Account Has Been Restored',
      html,
      tags: [
        { name: 'type', value: 'account' },
        { name: 'template', value: 'restored' },
      ],
    });

    this.logger.log(
      `Account restoration notice sent to ${email} - ID: ${result.id}`,
    );
    return result.id;
  }

  /**
   * Send account deleted confirmation
   * Template: account/deleted
   */
  async sendAccountDeletedEmail(
    email: string,
    variables: AccountDeletedTemplate,
  ): Promise<string> {
    this.logger.log(`Sending account deletion confirmation to ${email}`);

    const html = await this.templateRenderer.render('account/deleted', {
      subject: 'Your Account Has Been Deleted',
      ...variables,
    });

    const result = await this.mailProvider.sendMail({
      to: email,
      subject: 'Your Account Has Been Deleted',
      html,
      tags: [
        { name: 'type', value: 'account' },
        { name: 'template', value: 'deleted' },
      ],
    });

    this.logger.log(
      `Account deletion confirmation sent to ${email} - ID: ${result.id}`,
    );
    return result.id;
  }

  /**
   * Send account locked alert
   * Template: account/account-locked
   */
  async sendAccountLockedEmail(
    email: string,
    variables: AccountLockedTemplate,
  ): Promise<string> {
    this.logger.log(`Sending account locked alert to ${email}`);

    const html = await this.templateRenderer.render('account/account-locked', {
      subject: 'Your Account Has Been Locked',
      ...variables,
    });

    const result = await this.mailProvider.sendMail({
      to: email,
      subject: 'Your Account Has Been Locked',
      html,
      tags: [
        { name: 'type', value: 'security' },
        { name: 'template', value: 'account-locked' },
      ],
    });

    this.logger.log(`Account locked alert sent to ${email} - ID: ${result.id}`);
    return result.id;
  }

  // ============================================
  // SESSION EMAILS
  // ============================================

  /**
   * Send logged out from all devices notice
   * Template: session/logout-all
   */
  async sendLogoutAllDevicesEmail(
    email: string,
    variables: LogoutAllTemplate,
  ): Promise<string> {
    this.logger.log(`Sending logout all devices notice to ${email}`);

    const html = await this.templateRenderer.render('session/logout-all', {
      subject: 'Logged Out From All Devices',
      ...variables,
    });

    const result = await this.mailProvider.sendMail({
      to: email,
      subject: 'You Have Been Logged Out From All Devices',
      html,
      tags: [
        { name: 'type', value: 'security' },
        { name: 'template', value: 'logout-all' },
      ],
    });

    this.logger.log(
      `Logout all devices notice sent to ${email} - ID: ${result.id}`,
    );
    return result.id;
  }

  /**
   * Send session revoked notice
   * Template: session/session-revoked
   */
  async sendSessionRevokedEmail(
    email: string,
    variables: SessionRevokedTemplate,
  ): Promise<string> {
    this.logger.log(`Sending session revoked notice to ${email}`);

    const html = await this.templateRenderer.render('session/session-revoked', {
      subject: 'Session Revoked',
      ...variables,
    });

    const result = await this.mailProvider.sendMail({
      to: email,
      subject: 'Your Session Has Been Revoked',
      html,
      tags: [
        { name: 'type', value: 'security' },
        { name: 'template', value: 'session-revoked' },
      ],
    });

    this.logger.log(
      `Session revoked notice sent to ${email} - ID: ${result.id}`,
    );
    return result.id;
  }

  // ============================================
  // PRODUCT EMAILS
  // ============================================

  /**
   * Send subscription activated notification
   * Template: product/subscription-activated
   */
  async sendSubscriptionActivatedEmail(
    email: string,
    variables: SubscriptionActivatedTemplate,
  ): Promise<string> {
    this.logger.log(`Sending subscription activation notice to ${email}`);

    const html = await this.templateRenderer.render(
      'product/subscription-activated',
      {
        subject: 'Your Subscription is Active!',
        ...variables,
      },
    );

    const result = await this.mailProvider.sendMail({
      to: email,
      subject: 'Your Subscription is Now Active!',
      html,
      tags: [
        { name: 'type', value: 'billing' },
        { name: 'template', value: 'subscription-activated' },
      ],
    });

    this.logger.log(
      `Subscription activation notice sent to ${email} - ID: ${result.id}`,
    );
    return result.id;
  }

  /**
   * Send payment receipt
   * Template: product/payment-receipt
   */
  async sendPaymentReceiptEmail(
    email: string,
    variables: PaymentReceiptTemplate,
  ): Promise<string> {
    this.logger.log(`Sending payment receipt to ${email}`);

    const html = await this.templateRenderer.render('product/payment-receipt', {
      subject: 'Payment Receipt',
      ...variables,
    });

    const result = await this.mailProvider.sendMail({
      to: email,
      subject: `Payment Receipt - ${variables.invoiceNumber}`,
      html,
      attachments: variables.attachments, // PDF receipts
      tags: [
        { name: 'type', value: 'billing' },
        { name: 'template', value: 'payment-receipt' },
      ],
    });

    this.logger.log(`Payment receipt sent to ${email} - ID: ${result.id}`);
    return result.id;
  }

  /**
   * Send tutor reminder
   * Template: product/tutor-reminder
   */
  async sendTutorReminderEmail(
    email: string,
    variables: TutorReminderTemplate,
  ): Promise<string> {
    this.logger.log(`Sending tutor reminder to ${email}`);

    const html = await this.templateRenderer.render('product/tutor-reminder', {
      subject: 'Upcoming Session Reminder',
      ...variables,
    });

    const result = await this.mailProvider.sendMail({
      to: email,
      subject: `Reminder: Session with ${variables.tutorName} on ${variables.sessionDate}`,
      html,
      tags: [
        { name: 'type', value: 'reminder' },
        { name: 'template', value: 'tutor-reminder' },
      ],
    });

    this.logger.log(`Tutor reminder sent to ${email} - ID: ${result.id}`);
    return result.id;
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  /**
   * Send any email by template name (for dynamic use cases)
   */
  async sendEmail(
    email: string,
    templateName: string,
    subject: string,
    variables: Record<string, any>,
  ): Promise<string> {
    this.logger.log(
      `Sending email using template "${templateName}" to ${email}`,
    );

    const html = await this.templateRenderer.render(templateName, {
      subject,
      ...variables,
    });

    const result = await this.mailProvider.sendMail({
      to: email,
      subject,
      html,
      tags: [{ name: 'template', value: templateName }],
    });

    return result.id;
  }

  /**
   * Send bulk emails (for newsletters, announcements, etc.)
   */
  async sendBulkEmails(
    templateName: string,
    recipients: Array<{
      email: string;
      subject?: string;
      variables: Record<string, any>;
    }>,
  ): Promise<{ succeeded: number; failed: number }> {
    this.logger.log(
      `Sending bulk emails using template "${templateName}" to ${recipients.length} recipients`,
    );

    const results = await Promise.allSettled(
      recipients.map(async (recipient) => {
        try {
          const html = await this.templateRenderer.render(
            templateName,
            recipient.variables,
          );

          await this.mailProvider.sendMail({
            to: recipient.email,
            subject: recipient.subject || 'Notification',
            html,
            tags: [
              { name: 'type', value: 'bulk' },
              { name: 'template', value: templateName },
            ],
          });

          return { success: true, email: recipient.email };
        } catch (error) {
          this.logger.error(
            `Bulk email failed for ${recipient.email}: ${error.message}`,
          );
          return {
            success: false,
            email: recipient.email,
            error: error.message,
          };
        }
      }),
    );

    const succeeded = results.filter(
      (r) => r.status === 'fulfilled' && r.value.success,
    ).length;
    const failed = results.length - succeeded;

    this.logger.log(
      `Bulk email complete - Succeeded: ${succeeded}, Failed: ${failed}`,
    );

    return { succeeded, failed };
  }

  /**
   * Send email with retry logic
   */
  async sendEmailWithRetry(
    email: string,
    templateName: string,
    subject: string,
    variables: Record<string, any>,
    maxRetries: number = 3,
  ): Promise<string> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const html = await this.templateRenderer.render(templateName, {
          subject,
          ...variables,
        });

        const result = await this.mailProvider.sendMail({
          to: email,
          subject,
          html,
          tags: [
            { name: 'template', value: templateName },
            { name: 'attempt', value: String(attempt) },
          ],
        });

        if (attempt > 1) {
          this.logger.log(`Email sent successfully on attempt ${attempt}`);
        }

        return result.id;
      } catch (error) {
        lastError = error;
        this.logger.warn(
          `Attempt ${attempt}/${maxRetries} failed for ${email}: ${error.message}`,
        );

        if (attempt < maxRetries) {
          // Exponential backoff: 1s, 2s, 4s
          const delay = Math.pow(2, attempt - 1) * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    this.logger.error(
      `All ${maxRetries} attempts failed for ${email}: ${lastError.message}`,
    );
    throw lastError;
  }
}
