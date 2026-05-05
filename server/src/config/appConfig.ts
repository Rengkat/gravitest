import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  name: process.env.APP_NAME || 'Gravitest',
  frontendUrl: process.env.APP_URL || 'http://localhost:3000',
  logoUrl: process.env.APP_LOGO_URL || 'https://gravitas.ng/logo.png',
}));
