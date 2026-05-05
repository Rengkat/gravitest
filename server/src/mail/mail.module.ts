import { Module, Global } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigModule } from '@nestjs/config';
import mailConfig from 'src/mail/config/mailConfig';
import { MailProvider } from './providers/mail.provider';
import { TemplateRendererProvider } from './providers/template-renderer';

@Module({
  imports: [ConfigModule.forFeature(mailConfig)],
  providers: [MailService, MailProvider, TemplateRendererProvider],
  exports: [MailService],
})
export class MailModule {}
