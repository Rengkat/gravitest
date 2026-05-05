import { Injectable, Logger } from '@nestjs/common';
import { MailProvider } from './providers/mail.provider';
import { MailTemplate } from './enums/mail-template.enum';
import { MailTemplateMap } from './interfaces/mail-template-map.interface';

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
import { TemplateRendererProvider } from './providers/template-renderer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailProvider: MailProvider,
    private readonly templateRenderer: TemplateRendererProvider,
  ) {}

  /* =========================================================
     PRIVATE UNIVERSAL DISPATCH ENGINE
  ========================================================= */

  private async dispatchEmail<T extends MailTemplate>(
    email: string,
    template: T,
    subject: string,
    variables: MailTemplateMap[T],
    metadata?: {
      type?: string;
      attachments?: any[];
    },
  ): Promise<void> {
    try {
      this.logger.log(`Sending ${template} email to ${email}`);

      const { html, text } = await this.templateRenderer.render(template, {
        subject,
        ...variables,
      });

      await this.mailProvider.send({
        to: email,
        subject,
        html,
        text,
        attachments: metadata?.attachments,
        tags: [
          { name: 'template', value: template },
          { name: 'type', value: metadata?.type ?? 'general' },
        ],
      });

      this.logger.log(`${template} email successfully sent to ${email}`);
    } catch (error: any) {
      this.logger.error(
        `Failed sending ${template} email to ${email}: ${error?.message}`,
        error?.stack,
      );

      /**
       * IMPORTANT:
       * Mail should usually not crash auth/account flows.
       * If later you want strict transactional behavior,
       * change this policy here only.
       */
    }
  }

  /* =========================================================
     AUTH EMAILS
  ========================================================= */

  async sendEmailVerificationOtp(
    email: string,
    variables: EmailVerificationTemplate,
  ): Promise<void> {
    return this.dispatchEmail(
      email,
      MailTemplate.EMAIL_VERIFICATION,
      `Verify Your Email - OTP: ${variables.otpCode}`,
      variables,
      { type: 'verification' },
    );
  }

  async sendPasswordResetOtp(
    email: string,
    variables: PasswordResetTemplate,
  ): Promise<void> {
    return this.dispatchEmail(
      email,
      MailTemplate.PASSWORD_RESET,
      'Reset Your Password',
      variables,
      { type: 'password-reset' },
    );
  }

  async sendPasswordChangedAlert(
    email: string,
    variables: PasswordChangedTemplate,
  ): Promise<void> {
    return this.dispatchEmail(
      email,
      MailTemplate.PASSWORD_CHANGED,
      'Your Password Has Been Changed',
      variables,
      { type: 'security' },
    );
  }

  async sendLoginNewDeviceAlert(
    email: string,
    variables: LoginNewDeviceTemplate,
  ): Promise<void> {
    return this.dispatchEmail(
      email,
      MailTemplate.LOGIN_NEW_DEVICE,
      'New Device Login Detected',
      variables,
      { type: 'security' },
    );
  }

  async sendEmailChangedAlert(
    email: string,
    variables: EmailChangedTemplate,
  ): Promise<void> {
    return this.dispatchEmail(
      email,
      MailTemplate.EMAIL_CHANGED,
      'Your Email Address Has Been Changed',
      variables,
      { type: 'security' },
    );
  }

  async sendTwoFactorCode(
    email: string,
    variables: TwoFactorTemplate,
  ): Promise<void> {
    return this.dispatchEmail(
      email,
      MailTemplate.TWO_FACTOR,
      `Two-Factor Authentication Code: ${variables.code}`,
      variables,
      { type: 'verification' },
    );
  }

  /* =========================================================
     ACCOUNT EMAILS
  ========================================================= */

  async sendWelcomeEmail(
    email: string,
    variables: WelcomeTemplate,
  ): Promise<void> {
    return this.dispatchEmail(
      email,
      MailTemplate.WELCOME,
      `Welcome${variables.companyName ? ` to ${variables.companyName}` : ''}!`,
      variables,
      { type: 'welcome' },
    );
  }

  async sendAccountDeactivatedEmail(
    email: string,
    variables: AccountDeactivatedTemplate,
  ): Promise<void> {
    return this.dispatchEmail(
      email,
      MailTemplate.ACCOUNT_DEACTIVATED,
      'Your Account Has Been Deactivated',
      variables,
      { type: 'account' },
    );
  }

  async sendAccountRestoredEmail(
    email: string,
    variables: AccountRestoredTemplate,
  ): Promise<void> {
    return this.dispatchEmail(
      email,
      MailTemplate.ACCOUNT_RESTORED,
      'Your Account Has Been Restored',
      variables,
      { type: 'account' },
    );
  }

  async sendAccountDeletedEmail(
    email: string,
    variables: AccountDeletedTemplate,
  ): Promise<void> {
    return this.dispatchEmail(
      email,
      MailTemplate.ACCOUNT_DELETED,
      'Your Account Has Been Deleted',
      variables,
      { type: 'account' },
    );
  }

  async sendAccountLockedEmail(
    email: string,
    variables: AccountLockedTemplate,
  ): Promise<void> {
    return this.dispatchEmail(
      email,
      MailTemplate.ACCOUNT_LOCKED,
      'Your Account Has Been Locked',
      variables,
      { type: 'security' },
    );
  }

  /* =========================================================
     SESSION EMAILS
  ========================================================= */

  async sendLogoutAllDevicesEmail(
    email: string,
    variables: LogoutAllTemplate,
  ): Promise<void> {
    return this.dispatchEmail(
      email,
      MailTemplate.LOGOUT_ALL,
      'You Have Been Logged Out From All Devices',
      variables,
      { type: 'security' },
    );
  }

  async sendSessionRevokedEmail(
    email: string,
    variables: SessionRevokedTemplate,
  ): Promise<void> {
    return this.dispatchEmail(
      email,
      MailTemplate.SESSION_REVOKED,
      'Your Session Has Been Revoked',
      variables,
      { type: 'security' },
    );
  }

  /* =========================================================
     PRODUCT EMAILS
  ========================================================= */

  async sendSubscriptionActivatedEmail(
    email: string,
    variables: SubscriptionActivatedTemplate,
  ): Promise<void> {
    return this.dispatchEmail(
      email,
      MailTemplate.SUBSCRIPTION_ACTIVATED,
      'Your Subscription Is Now Active!',
      variables,
      { type: 'billing' },
    );
  }
  async sendPaymentReceiptEmail(
    email: string,
    variables: PaymentReceiptTemplate,
    attachments?: any[],
  ): Promise<void> {
    return this.dispatchEmail(
      email,
      MailTemplate.PAYMENT_RECEIPT,
      `Payment Receipt - ${variables.invoiceNumber}`,
      variables,
      {
        type: 'billing',
        attachments,
      },
    );
  }

  async sendTutorReminderEmail(
    email: string,
    variables: TutorReminderTemplate,
  ): Promise<void> {
    return this.dispatchEmail(
      email,
      MailTemplate.TUTOR_REMINDER,
      `Reminder: Session with ${variables.tutorName}`,
      variables,
      { type: 'reminder' },
    );
  }
}
