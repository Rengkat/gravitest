import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { OtpProvider } from './providers/otp.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { UserSession } from './entities/user-session';

@Module({
  controllers: [AuthController],
  providers: [AuthService, OtpProvider],
  imports: [UserModule, TypeOrmModule.forFeature([Otp, UserSession])],
  exports: [AuthService, OtpProvider],
})
export class AuthModule {}
