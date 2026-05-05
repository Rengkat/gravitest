import { MailTemplate } from '../enums/mail-template.enum';
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
} from './template.interface';

export interface MailTemplateMap {
  [MailTemplate.EMAIL_VERIFICATION]: EmailVerificationTemplate;
  [MailTemplate.PASSWORD_RESET]: PasswordResetTemplate;
  [MailTemplate.PASSWORD_CHANGED]: PasswordChangedTemplate;
  [MailTemplate.LOGIN_NEW_DEVICE]: LoginNewDeviceTemplate;
  [MailTemplate.EMAIL_CHANGED]: EmailChangedTemplate;
  [MailTemplate.TWO_FACTOR]: TwoFactorTemplate;

  [MailTemplate.WELCOME]: WelcomeTemplate;
  [MailTemplate.ACCOUNT_DEACTIVATED]: AccountDeactivatedTemplate;
  [MailTemplate.ACCOUNT_RESTORED]: AccountRestoredTemplate;
  [MailTemplate.ACCOUNT_DELETED]: AccountDeletedTemplate;
  [MailTemplate.ACCOUNT_LOCKED]: AccountLockedTemplate;

  [MailTemplate.LOGOUT_ALL]: LogoutAllTemplate;
  [MailTemplate.SESSION_REVOKED]: SessionRevokedTemplate;

  [MailTemplate.SUBSCRIPTION_ACTIVATED]: SubscriptionActivatedTemplate;
  [MailTemplate.PAYMENT_RECEIPT]: PaymentReceiptTemplate;
  [MailTemplate.TUTOR_REMINDER]: TutorReminderTemplate;
}
