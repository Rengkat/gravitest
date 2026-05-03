import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { OtpProvider } from './providers/otp.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService, OtpProvider],
  imports: [UserModule, TypeOrmModule.forFeature([Otp])],
  exports: [AuthService, OtpProvider],
})
export class AuthModule {}
