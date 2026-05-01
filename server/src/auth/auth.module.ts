import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { OtpProvider } from './providers/otp.provider.ts';

@Module({
  controllers: [AuthController],
  providers: [AuthService, OtpProvider],
  imports: [UserModule],
  exports: [AuthService, OtpProvider],
})
export class AuthModule {}
