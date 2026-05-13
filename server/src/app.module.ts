import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PaginationModule } from './common/pagination/pagination.module';
import { MailModule } from './mail/mail.module';

import appConfig from './config/appConfig';
import databaseConfig from './config/databaseConfig';
import mailConfig from './mail/config/mailConfig';
import jwtConfig from './auth/config/jwtConfig';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { HashModule } from './common/hash/hash.module';
import { SchoolsModule } from './schools/schools.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      load: [appConfig, databaseConfig, mailConfig, jwtConfig],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        APP_NAME: Joi.string().default('Gravitest'),
        APP_URL: Joi.string().uri().default('http://localhost:3000'),
        APP_LOGO_URL: Joi.string()
          .uri()
          .default('https://gravitest.ng/logo.png'),
        APP_PORT: Joi.number().default(5000),

        // DATABASE
        DATABASE_TYPE: Joi.string().default('postgres'),
        DATABASE_HOST: Joi.string().default('localhost'),
        DATABASE_PORT: Joi.number().default(5432),
        DATABASE_USERNAME: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),

        // JWT
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_TOKEN_AUDIENCE: Joi.string().required(),
        JWT_TOKEN_ISSUER: Joi.string().required(),
        JWT_ACCESS_TOKEN_TTL: Joi.number().default(900),
        JWT_REFRESH_TOKEN_TTL: Joi.number().default(2592000),

        // MAIL
        MAIL_HOST: Joi.string().required(),
        MAIL_PORT: Joi.number().default(2525),
        MAIL_SECURE: Joi.boolean().default(false),
        MAIL_USER: Joi.string().required(),
        MAIL_PASSWORD: Joi.string().required(),
        MAIL_FROM_NAME: Joi.string().default('Gravitest'),
        MAIL_FROM_ADDRESS: Joi.string().email().required(),
        MAIL_SUPPORT_ADDRESS: Joi.string()
          .email()
          .default('support@gravitest.ng'),
      }),
      validationOptions: {
        abortEarly: true,
      },
    }),

    TypeOrmModule.forRootAsync({
      inject: [databaseConfig.KEY],
      useFactory: (dbConfig: TypeOrmModuleOptions): TypeOrmModuleOptions =>
        dbConfig,
    }),

    PaginationModule,
    MailModule,

    UserModule,
    AuthModule,
    HashModule,
    SchoolsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
