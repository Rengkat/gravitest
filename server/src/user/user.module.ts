import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BulkCreateUsersProvider } from './providers/create-bulk-users.provider';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { HashModule } from 'src/common/hash/hash.module';
import { CreateUserProvider } from './providers/create-user.provider';
import { UserSettings } from './entities/user-settings.entity';
import { UserNotificationPreferences } from './entities/user-notification-preferences.entity';
import { Subscription } from './entities/subscription.entity';
import { Notification } from './entities/notification.entity';
import { LibraryAccess } from '../library/entities/library-content-access.entity';

@Module({
  controllers: [UserController],
  providers: [UserService, BulkCreateUsersProvider, CreateUserProvider],
  exports: [UserService, TypeOrmModule],
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserSettings,
      UserNotificationPreferences,
      Notification,
      Subscription,
      LibraryAccess,
    ]),
    PaginationModule,
    HashModule,
  ],
})
export class UserModule {}
