import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BulkCreateUsersProvider } from './providers/create-bulk-users.provider';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { HashModule } from 'src/common/hash/hash.module';
import { UserSettings } from './entities/user-settings.entity';
import { UserNotificationPreferences } from './entities/user-notification-preferences.entity';
import { Subscription } from './entities/subscription.entity';
import { LibraryAccess } from '../library/entities/library-content-access.entity';
import { UserRegistrationProvider } from './providers/create-user.provider';
import { UserSettingsProvider } from './providers/user-settings.provider';
import { UserNotificationPreferencesProvider } from './providers/user-notification-preferences.provider';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    BulkCreateUsersProvider,
    UserRegistrationProvider,
    UserSettingsProvider,
    UserNotificationPreferencesProvider,
  ],
  exports: [UserService, TypeOrmModule, UserRegistrationProvider],
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserSettings,
      UserNotificationPreferences,
      Subscription,
      LibraryAccess,
    ]),
    PaginationModule,
    HashModule,
  ],
})
export class UserModule {}
