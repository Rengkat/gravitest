import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { OtpProvider } from './providers/otp.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { UserSession } from './entities/user-session.entity';
import { MailModule } from 'src/mail/mail.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import jwtConfig from './config/jwtConfig';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { SessionService } from './session.service';
import { TokenProvider } from './providers/token.provider';
import { APP_GUARD } from '@nestjs/core';
import { HashModule } from 'src/common/hash/hash.module';
@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    OtpProvider,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    JwtAuthGuard,
    RolesGuard,
    SessionService,
    TokenProvider,
    // { provide: APP_GUARD, useClass: JwtAuthGuard },
    // { provide: APP_GUARD, useClass: RolesGuard },
  ],
  imports: [
    UserModule,
    HashModule,
    TypeOrmModule.forFeature([Otp, UserSession]),
    MailModule,
    PassportModule.register({ defaultStrategy: 'jwt-access' }),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jwtConfig)],
      inject: [jwtConfig.KEY],
      useFactory: (config: ConfigType<typeof jwtConfig>): JwtModuleOptions => ({
        signOptions: {
          issuer: config.issuer,
          audience: config.audience,
        },
      }),
    }),
  ],
  exports: [
    AuthService,
    OtpProvider,
    JwtAuthGuard,
    RolesGuard,
    SessionService,
    TokenProvider,
  ],
})
export class AuthModule {}
