import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT ?? '587', 10),
  secure: process.env.MAIL_SECURE === 'true',
  user: process.env.MAIL_USER,
  password: process.env.MAIL_PASSWORD,
  fromName: process.env.MAIL_FROM_NAME,
  fromAddress: process.env.MAIL_FROM_ADDRESS,
  useEthereal: process.env.NODE_ENV === 'development' && !process.env.MAIL_USER,
}));
