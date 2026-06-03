import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { UserNotificationPreferences } from './entities/user-notification-preferences.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
  imports: [
    TypeOrmModule.forFeature([Notification, UserNotificationPreferences]),
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
