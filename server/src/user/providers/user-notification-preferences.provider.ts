import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserNotificationPreferences } from '../entities/user-notification-preferences.entity';
import { UpdateNotificationPreferencesDto } from '../dto/update-notification-preferences.dto';

@Injectable()
export class UserNotificationPreferencesProvider {
  private readonly logger = new Logger(
    UserNotificationPreferencesProvider.name,
  );

  constructor(
    @InjectRepository(UserNotificationPreferences)
    private readonly notifPrefsRepository: Repository<UserNotificationPreferences>,
  ) {}

  async getPreferences(userId: string): Promise<UserNotificationPreferences> {
    const prefs = await this.notifPrefsRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!prefs)
      throw new NotFoundException('Notification preferences not found');

    return prefs;
  }

  async updatePreferences(
    userId: string,
    dto: UpdateNotificationPreferencesDto,
  ): Promise<UserNotificationPreferences> {
    const prefs = await this.getPreferences(userId);

    // Channel toggles
    if (dto.inAppEnabled !== undefined) prefs.inAppEnabled = dto.inAppEnabled;
    if (dto.emailEnabled !== undefined) prefs.emailEnabled = dto.emailEnabled;
    if (dto.smsEnabled !== undefined) prefs.smsEnabled = dto.smsEnabled;
    if (dto.pushEnabled !== undefined) prefs.pushEnabled = dto.pushEnabled;
    if (dto.whatsappEnabled !== undefined)
      prefs.whatsappEnabled = dto.whatsappEnabled;

    // Notification types
    if (dto.examReminders !== undefined)
      prefs.examReminders = dto.examReminders;
    if (dto.streakAlerts !== undefined) prefs.streakAlerts = dto.streakAlerts;
    if (dto.newMessages !== undefined) prefs.newMessages = dto.newMessages;
    if (dto.tutorBookingUpdates !== undefined)
      prefs.tutorBookingUpdates = dto.tutorBookingUpdates;
    if (dto.paymentNotifications !== undefined)
      prefs.paymentNotifications = dto.paymentNotifications;
    if (dto.subscriptionAlerts !== undefined)
      prefs.subscriptionAlerts = dto.subscriptionAlerts;
    if (dto.resultPublished !== undefined)
      prefs.resultPublished = dto.resultPublished;
    if (dto.newContentAlerts !== undefined)
      prefs.newContentAlerts = dto.newContentAlerts;
    if (dto.achievementAlerts !== undefined)
      prefs.achievementAlerts = dto.achievementAlerts;
    if (dto.leaderboardUpdates !== undefined)
      prefs.leaderboardUpdates = dto.leaderboardUpdates;
    if (dto.weeklyReports !== undefined)
      prefs.weeklyReports = dto.weeklyReports;
    // systemAlerts intentionally not updatable — always on

    // Quiet hours
    if (dto.quietHoursEnabled !== undefined)
      prefs.quietHoursEnabled = dto.quietHoursEnabled;
    if (dto.quietHoursStart !== undefined)
      prefs.quietHoursStart = dto.quietHoursStart;
    if (dto.quietHoursEnd !== undefined)
      prefs.quietHoursEnd = dto.quietHoursEnd;

    // WhatsApp
    if (dto.whatsappNumber !== undefined)
      prefs.whatsappNumber = dto.whatsappNumber;
    if (dto.weeklyWhatsappReport !== undefined)
      prefs.weeklyWhatsappReport = dto.weeklyWhatsappReport;

    // Email digest
    if (dto.emailDigestFrequency !== undefined)
      prefs.emailDigestFrequency = dto.emailDigestFrequency;

    const saved = await this.notifPrefsRepository.save(prefs);

    this.logger.log(`Notification preferences updated for user ${userId}`);

    return saved;
  }
}
