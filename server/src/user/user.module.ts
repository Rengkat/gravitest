import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BulkCreateUsersProvider } from './providers/create-bulk-users.provider';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { HashModule } from 'src/common/hash/hash.module';
import { UserSettings } from './entities/user-settings.entity';
import { Subscription } from './entities/subscription.entity';
import { LibraryAccess } from '../library/entities/library-content-access.entity';
import { UserRegistrationProvider } from './providers/create-user.provider';
import { UserSettingsProvider } from './providers/user-settings.provider';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    BulkCreateUsersProvider,
    UserRegistrationProvider,
    UserSettingsProvider,
  ],
  exports: [UserService, TypeOrmModule, UserRegistrationProvider],
  imports: [
    TypeOrmModule.forFeature([User, UserSettings, Subscription, LibraryAccess]),
    PaginationModule,
    HashModule,
  ],
})
export class UserModule {}
