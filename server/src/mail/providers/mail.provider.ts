import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import type { ConfigType } from '@nestjs/config';
import { MailOptions } from '../interfaces/mail-options.interface';
import mailConfig from '../config/mailConfig';

type MailConfiguration = ConfigType<typeof mailConfig>;

@Injectable()
export class MailProvider implements OnModuleInit {
  private readonly logger = new Logger(MailProvider.name);
  private transporter!: nodemailer.Transporter;
  readonly fromAddress: string;

  constructor(
    @Inject(mailConfig.KEY)
    private readonly mailConfiguration: MailConfiguration,
  ) {
    this.fromAddress = `"${this.mailConfiguration.fromName}" <${this.mailConfiguration.fromAddress}>`;
  }

  async onModuleInit(): Promise<void> {
    const smtpHost = this.mailConfiguration.host;
    if (!smtpHost) throw new Error('MAIL_HOST is not configured');

    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: this.mailConfiguration.port,
      secure: this.mailConfiguration.secure,
      auth: {
        user: this.mailConfiguration.user,
        pass: this.mailConfiguration.password,
      },
    });

    await this.verifyConnection();
  }

  async send(options: MailOptions): Promise<void> {
    const message: Mail.Options = {
      from: options.from ?? this.fromAddress,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
      cc: options.cc,
      bcc: options.bcc,
      attachments: options.attachments,
    };

    try {
      const info = await this.transporter.sendMail(message);
      this.logger.log(`Mail sent to ${options.to} | id=${info.messageId}`);
    } catch (error: any) {
      this.logger.error(
        `Mail delivery failed to ${options.to} | subject=${options.subject}`,
        error?.stack,
      );
      throw error;
    }
  }

  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      this.logger.log('SMTP transport verified ✓');
    } catch (error: any) {
      this.logger.warn(`SMTP verification failed: ${error?.message}`);
    }
  }
}
