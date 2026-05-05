// import { Injectable, Logger } from '@nestjs/common';
// import { MailProvider } from './providers/mail.provider';
// import { TemplateRendererProvider } from './providers/template-renderer';
// // import { TemplateRendererProvider } from './providers/template-renderer.provider';
// // import {
// //   EmailVerificationTemplate,
// //   PasswordResetTemplate,
// //   PasswordChangedTemplate,
// //   WelcomeTemplate,
// // } from './interfaces/template.interface';

// @Injectable()
// export class MailService {
//   private readonly logger = new Logger(MailService.name);

//   constructor(
//     private readonly mailProvider: MailProvider,
//     private readonly templateRenderer: TemplateRendererProvider,
//   ) {}

//   async sendEmailVerificationOtp(
//     email: string,
//     variables: EmailVerificationTemplate,
//   ): Promise<void> {
//     await this.dispatch({
//       email,
//       subject: 'Verify Your Email Address',
//       template: 'email-verification',
//       variables: {
//         ...variables,
//         year: new Date().getFullYear(),
//       },
//       description: 'email verification OTP',
//     });
//   }

//   async sendPasswordResetOtp(
//     email: string,
//     variables: PasswordResetTemplate,
//   ): Promise<void> {
//     await this.dispatch({
//       email,
//       subject: 'Reset Your Password',
//       template: 'password-reset',
//       variables: {
//         ...variables,
//         year: new Date().getFullYear(),
//       },
//       description: 'password reset OTP',
//     });
//   }

//   async sendPasswordChangedAlert(
//     email: string,
//     variables: PasswordChangedTemplate,
//   ): Promise<void> {
//     await this.dispatch({
//       email,
//       subject: 'Your Password Has Been Changed',
//       template: 'password-changed',
//       variables: {
//         ...variables,
//         year: new Date().getFullYear(),
//       },
//       description: 'password changed alert',
//     });
//   }

//   async sendWelcomeEmail(
//     email: string,
//     variables: WelcomeTemplate,
//   ): Promise<void> {
//     await this.dispatch({
//       email,
//       subject: `Welcome${variables.companyName ? ` to ${variables.companyName}` : ''}!`,
//       template: 'welcome',
//       variables: {
//         ...variables,
//         year: new Date().getFullYear(),
//       },
//       description: 'welcome email',
//     });
//   }

//   private async dispatch(options: {
//     email: string;
//     subject: string;
//     template: string;
//     variables: Record<string, any>;
//     description: string;
//   }): Promise<void> {
//     try {
//       const html = await this.templateRenderer.render(
//         options.template,
//         options.variables,
//       );

//       await this.mailProvider.sendMail({
//         to: options.email,
//         subject: options.subject,
//         html,
//       });

//       this.logger.log(`${options.description} sent to ${options.email}`);
//     } catch (error: any) {
//       this.logger.error(
//         `Failed sending ${options.description} to ${options.email}: ${error.message}`,
//         error.stack,
//       );
//     }
//   }
// }
