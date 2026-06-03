import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { User } from 'src/user/entities/user.entity';

import {
  AdminNotificationFiltersDto,
  BroadcastNotificationDto,
  MarkReadDto,
  NotificationFiltersDto,
  SendNotificationDto,
} from './dto/notification.dto';

import {
  BroadcastResult,
  DispatchResult,
  NotificationInboxSummary,
} from './types/notification.types';

import { resolveTemplate } from './providers/notification-templates';
import { NotificationEventsEmitter } from './providers/notification-events.emitter';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { PaginatedResult } from 'src/common/pagination/pagination.interface';
import {
  NotificationChannel,
  NotificationStatus,
  NotificationType,
} from 'src/common/enums/enums';
import { UserNotificationPreferences } from './entities/user-notification-preferences.entity';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,

    @InjectRepository(UserNotificationPreferences)
    private readonly prefsRepo: Repository<UserNotificationPreferences>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly dataSource: DataSource,
    private readonly paginationProvider: PaginationProvider,
    private readonly eventsEmitter: NotificationEventsEmitter,
  ) {}

  // ═══════════════════════════════════════════════════════════════════════════
  // CORE DISPATCH — called by other modules
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Primary method called by all other modules.
   * Accepts a type + context, resolves the template, checks user prefs,
   * persists the notification, emits SSE event, and dispatches externally.
   *
   * Usage from other modules:
   *   await this.notificationsService.notify({
   *     userId: student.userId,
   *     type: NotificationType.STREAK_ALERT,
   *     channel: NotificationChannel.IN_APP,
   *     context: { type: 'at_risk', currentStreak: 7 },
   *   });
   */
  async notify(params: {
    userId: string;
    type: NotificationType;
    channel?: NotificationChannel;
    context?: Record<string, any>;
    actionUrl?: string;
    metadata?: Record<string, unknown>;
    scheduledFor?: Date;
  }): Promise<DispatchResult> {
    const channel = params.channel ?? NotificationChannel.IN_APP;
    const template = resolveTemplate(params.type, params.context ?? {});

    const dto: SendNotificationDto = {
      userId: params.userId,
      type: params.type,
      channel,
      title: template.title,
      body: template.body,
      actionUrl: params.actionUrl ?? template.actionUrl ?? null,
      metadata: params.metadata ?? null,
      scheduledFor: params.scheduledFor?.toISOString() ?? null,
    };

    return this.send(dto);
  }

  /**
   * Lower-level send — accepts explicit title/body.
   * Use notify() when possible; use send() when you need full control.
   */
  async send(dto: SendNotificationDto): Promise<DispatchResult> {
    // 1. Check user preferences
    const prefs = await this.prefsRepo.findOne({
      where: { user: { id: dto.userId } },
    });

    if (prefs) {
      const skip = this.shouldSkip(dto.type, dto.channel, prefs);
      if (skip) {
        return {
          notificationId: '',
          channel: dto.channel,
          delivered: false,
          reason: skip,
        };
      }
    }

    // 2. Persist
    const notification = this.notificationRepo.create({
      userId: dto.userId,
      type: dto.type,
      channel: dto.channel,
      status: NotificationStatus.UNREAD,
      title: dto.title,
      body: dto.body,
      actionUrl: dto.actionUrl ?? null,
      metadata: dto.metadata ?? null,
      scheduledFor: dto.scheduledFor ? new Date(dto.scheduledFor) : null,
      readAt: null,
    });

    const saved = await this.notificationRepo.save(notification);

    // 3. Emit SSE event — pushes instantly to any connected client
    this.eventsEmitter.emit({
      userId: dto.userId,
      notificationId: saved.id,
      type: dto.type,
      channel: dto.channel,
      title: dto.title,
      body: dto.body,
      actionUrl: dto.actionUrl ?? null,
      metadata: dto.metadata ?? null,
      createdAt: saved.createdAt.toISOString(),
    });

    // 4. Dispatch to external channels (email/SMS/push) — fire-and-forget
    this.dispatchExternal(saved, dto, prefs).catch((err) =>
      this.logger.error(
        `External dispatch failed for ${saved.id}: ${err.message}`,
      ),
    );

    return {
      notificationId: saved.id,
      channel: dto.channel,
      delivered: true,
    };
  }

  /**
   * Send to multiple users at once.
   */
  async broadcast(dto: BroadcastNotificationDto): Promise<BroadcastResult> {
    const result: BroadcastResult = {
      sent: 0,
      skipped: 0,
      failed: 0,
      errors: [],
    };

    let userIds: string[] = dto.userIds ?? [];

    if (!userIds.length) {
      if (dto.targetRole) {
        const users = await this.userRepo.find({
          where: { role: dto.targetRole as any },
          select: ['id'],
        });
        userIds = users.map((u) => u.id);
      } else if (dto.targetSchoolId) {
        const rows = await this.dataSource.query(
          `SELECT u.id FROM users u
           INNER JOIN student_profiles sp ON sp.user_id = u.id
           WHERE sp.school_id = $1 AND u."isActive" = true`,
          [dto.targetSchoolId],
        );
        userIds = rows.map((r: any) => r.id);
      }
    }

    if (!userIds.length) {
      throw new BadRequestException('No target users resolved for broadcast.');
    }

    const CHUNK = 100;
    for (let i = 0; i < userIds.length; i += CHUNK) {
      const chunk = userIds.slice(i, i + CHUNK);
      await Promise.all(
        chunk.map(async (userId) => {
          try {
            const res = await this.notify({
              userId,
              type: dto.type,
              channel: dto.channel,
              context: {},
              actionUrl: dto.actionUrl ?? undefined,
              metadata: dto.metadata ?? undefined,
            });
            if (res.delivered) {
              result.sent++;
            } else {
              result.skipped++;
            }
          } catch (err: any) {
            result.failed++;
            result.errors.push({ userId, reason: err.message });
          }
        }),
      );
    }

    return result;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // USER INBOX
  // ═══════════════════════════════════════════════════════════════════════════

  async getInbox(
    userId: string,
    filters: NotificationFiltersDto,
  ): Promise<PaginatedResult<Notification>> {
    const {
      page,
      limit,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      ...fieldFilters
    } = filters;

    const qb = this.notificationRepo
      .createQueryBuilder('n')
      .where('n.userId = :userId', { userId });

    if (fieldFilters.status)
      qb.andWhere('n.status = :status', { status: fieldFilters.status });
    if (fieldFilters.type)
      qb.andWhere('n.type = :type', { type: fieldFilters.type });
    if (fieldFilters.channel)
      qb.andWhere('n.channel = :channel', { channel: fieldFilters.channel });
    if (fieldFilters.from)
      qb.andWhere('n.createdAt >= :from', { from: fieldFilters.from });
    if (fieldFilters.to)
      qb.andWhere('n.createdAt <= :to', { to: fieldFilters.to });

    const sortMap: Record<string, string> = {
      createdAt: 'n.createdAt',
      readAt: 'n.readAt',
      type: 'n.type',
    };
    qb.orderBy(sortMap[sortBy] ?? 'n.createdAt', sortOrder);

    return this.paginationProvider.paginateQueryBuilder(qb, { page, limit });
  }

  async getInboxSummary(userId: string): Promise<NotificationInboxSummary> {
    const unread = await this.notificationRepo
      .createQueryBuilder('n')
      .where('n.userId = :userId', { userId })
      .andWhere('n.status = :status', { status: NotificationStatus.UNREAD })
      .getMany();

    const byType: Partial<Record<NotificationType, number>> = {};
    const byChannel: Partial<Record<NotificationChannel, number>> = {};

    for (const n of unread) {
      byType[n.type] = (byType[n.type] ?? 0) + 1;
      byChannel[n.channel] = (byChannel[n.channel] ?? 0) + 1;
    }

    return { totalUnread: unread.length, byType, byChannel };
  }

  async getOne(userId: string, notificationId: string): Promise<Notification> {
    const n = await this.notificationRepo.findOne({
      where: { id: notificationId, userId },
    });
    if (!n) throw new NotFoundException('Notification not found.');
    return n;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MARK READ / ARCHIVE / DELETE
  // ═══════════════════════════════════════════════════════════════════════════

  async markRead(
    userId: string,
    dto: MarkReadDto,
  ): Promise<{ updated: number }> {
    const qb = this.notificationRepo
      .createQueryBuilder()
      .update()
      .set({ status: NotificationStatus.READ, readAt: new Date() })
      .where('userId = :userId', { userId })
      .andWhere('status = :status', { status: NotificationStatus.UNREAD });

    if (dto.ids?.length) {
      qb.andWhere('id IN (:...ids)', { ids: dto.ids });
    }

    const result = await qb.execute();
    return { updated: result.affected ?? 0 };
  }

  async markAllRead(userId: string): Promise<{ updated: number }> {
    const result = await this.notificationRepo
      .createQueryBuilder()
      .update()
      .set({ status: NotificationStatus.READ, readAt: new Date() })
      .where('userId = :userId', { userId })
      .andWhere('status = :status', { status: NotificationStatus.UNREAD })
      .execute();

    return { updated: result.affected ?? 0 };
  }

  async archiveOne(userId: string, id: string): Promise<{ id: string }> {
    await this.getOne(userId, id);
    await this.notificationRepo.update(
      { id, userId },
      { status: NotificationStatus.ARCHIVED },
    );
    return { id };
  }

  async deleteOne(userId: string, id: string): Promise<{ id: string }> {
    await this.getOne(userId, id);
    await this.notificationRepo.delete({ id, userId });
    return { id };
  }

  async clearAll(userId: string): Promise<{ deleted: number }> {
    const result = await this.notificationRepo
      .createQueryBuilder()
      .delete()
      .where('userId = :userId', { userId })
      .andWhere('status IN (:...statuses)', {
        statuses: [NotificationStatus.READ, NotificationStatus.ARCHIVED],
      })
      .execute();

    return { deleted: result.affected ?? 0 };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // USER PREFERENCES
  // ═══════════════════════════════════════════════════════════════════════════

  async getPreferences(userId: string): Promise<UserNotificationPreferences> {
    const prefs = await this.prefsRepo.findOne({
      where: { user: { id: userId } },
    });
    if (!prefs)
      throw new NotFoundException('Notification preferences not found.');
    return prefs;
  }

  async updatePreferences(
    userId: string,
    dto: Partial<UserNotificationPreferences>,
  ): Promise<UserNotificationPreferences> {
    const prefs = await this.getPreferences(userId);
    Object.assign(prefs, dto);
    return this.prefsRepo.save(prefs);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ADMIN
  // ═══════════════════════════════════════════════════════════════════════════

  async adminFindAll(
    filters: AdminNotificationFiltersDto,
  ): Promise<PaginatedResult<Notification>> {
    const {
      page,
      limit,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      ...fieldFilters
    } = filters;

    const qb = this.notificationRepo
      .createQueryBuilder('n')
      .leftJoin('n.user', 'u')
      .addSelect(['u.id', 'u.firstName', 'u.lastName', 'u.email']);

    if (fieldFilters.userId)
      qb.andWhere('n.userId = :userId', { userId: fieldFilters.userId });
    if (fieldFilters.type)
      qb.andWhere('n.type = :type', { type: fieldFilters.type });
    if (fieldFilters.channel)
      qb.andWhere('n.channel = :channel', { channel: fieldFilters.channel });
    if (fieldFilters.status)
      qb.andWhere('n.status = :status', { status: fieldFilters.status });
    if (fieldFilters.from)
      qb.andWhere('n.createdAt >= :from', { from: fieldFilters.from });
    if (fieldFilters.to)
      qb.andWhere('n.createdAt <= :to', { to: fieldFilters.to });

    const sortMap: Record<string, string> = {
      createdAt: 'n.createdAt',
      type: 'n.type',
      status: 'n.status',
    };
    qb.orderBy(sortMap[sortBy] ?? 'n.createdAt', sortOrder);

    return this.paginationProvider.paginateQueryBuilder(qb, { page, limit });
  }

  async adminGetStats() {
    const [total, unread, byType, byChannel] = await Promise.all([
      this.notificationRepo.count(),
      this.notificationRepo.count({
        where: { status: NotificationStatus.UNREAD },
      }),
      this.notificationRepo
        .createQueryBuilder('n')
        .select('n.type', 'type')
        .addSelect('COUNT(*)', 'count')
        .groupBy('n.type')
        .getRawMany<{ type: string; count: string }>(),
      this.notificationRepo
        .createQueryBuilder('n')
        .select('n.channel', 'channel')
        .addSelect('COUNT(*)', 'count')
        .groupBy('n.channel')
        .getRawMany<{ channel: string; count: string }>(),
    ]);

    return {
      total,
      unread,
      read: total - unread,
      byType: Object.fromEntries(byType.map((r) => [r.type, Number(r.count)])),
      byChannel: Object.fromEntries(
        byChannel.map((r) => [r.channel, Number(r.count)]),
      ),
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PRIVATE HELPERS
  // ═══════════════════════════════════════════════════════════════════════════

  private shouldSkip(
    type: NotificationType,
    channel: NotificationChannel,
    prefs: UserNotificationPreferences,
  ): string | null {
    if (channel === NotificationChannel.EMAIL && !prefs.emailEnabled)
      return 'email notifications disabled';
    if (channel === NotificationChannel.SMS && !prefs.smsEnabled)
      return 'SMS notifications disabled';
    if (channel === NotificationChannel.PUSH && !prefs.pushEnabled)
      return 'push notifications disabled';
    if (channel === NotificationChannel.WHATSAPP && !prefs.whatsappEnabled)
      return 'WhatsApp notifications disabled';

    if (prefs.quietHoursEnabled && channel === NotificationChannel.IN_APP) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const [sh, sm] = prefs.quietHoursStart.split(':').map(Number);
      const [eh, em] = prefs.quietHoursEnd.split(':').map(Number);
      const startMinutes = sh * 60 + sm;
      const endMinutes = eh * 60 + em;

      const inQuietHours =
        startMinutes > endMinutes
          ? currentMinutes >= startMinutes || currentMinutes < endMinutes
          : currentMinutes >= startMinutes && currentMinutes < endMinutes;

      if (inQuietHours && type !== NotificationType.SYSTEM) {
        return 'quiet hours active';
      }
    }

    const typeMap: Partial<
      Record<NotificationType, keyof UserNotificationPreferences>
    > = {
      [NotificationType.EXAM_REMINDER]: 'examReminders',
      [NotificationType.STREAK_ALERT]: 'streakAlerts',
      [NotificationType.NEW_MESSAGE]: 'newMessages',
      [NotificationType.TUTOR_BOOKING]: 'tutorBookingUpdates',
      [NotificationType.SESSION_START]: 'tutorBookingUpdates',
      [NotificationType.SESSION_COMPLETE]: 'tutorBookingUpdates',
      [NotificationType.PAYMENT_SUCCESS]: 'paymentNotifications',
      [NotificationType.PAYMENT_FAILED]: 'paymentNotifications',
      [NotificationType.SUBSCRIPTION_EXPIRING]: 'subscriptionAlerts',
      [NotificationType.RESULT_PUBLISHED]: 'resultPublished',
      [NotificationType.NEW_CONTENT]: 'newContentAlerts',
      [NotificationType.ACHIEVEMENT_UNLOCKED]: 'achievementAlerts',
      [NotificationType.LEADERBOARD_UPDATE]: 'leaderboardUpdates',
      [NotificationType.WEEKLY_REPORT]: 'weeklyReports',
      [NotificationType.SYSTEM]: 'systemAlerts',
    };

    const prefKey = typeMap[type];
    if (prefKey && prefs[prefKey] === false) {
      return `${String(prefKey)} preference disabled`;
    }

    return null;
  }

  private async dispatchExternal(
    notification: Notification,
    dto: SendNotificationDto,
    prefs: UserNotificationPreferences | null,
  ): Promise<void> {
    if (dto.channel === NotificationChannel.IN_APP) return;

    const user = await this.userRepo.findOne({
      where: { id: dto.userId },
      select: ['id', 'email', 'phoneNumber', 'firstName', 'lastName'],
    });

    if (!user) return;

    switch (dto.channel) {
      case NotificationChannel.EMAIL:
        // await this.mailService.send({ to: user.email, subject: dto.title, ... });
        this.logger.log(`[EMAIL] → ${user.email}: "${dto.title}"`);
        break;
      case NotificationChannel.SMS:
        // await this.smsService.send({ to: user.phoneNumber, message: `${dto.title}: ${dto.body}` });
        this.logger.log(`[SMS] → ${user.phoneNumber}: "${dto.title}"`);
        break;
      case NotificationChannel.PUSH:
        // await this.pushService.send({ token: user.fcmToken, title: dto.title, body: dto.body });
        this.logger.log(`[PUSH] → user ${user.id}: "${dto.title}"`);
        break;
      case NotificationChannel.WHATSAPP:
        // await this.whatsappService.send({ to: prefs?.whatsappNumber, text: `${dto.title}: ${dto.body}` });
        this.logger.log(
          `[WHATSAPP] → ${prefs?.whatsappNumber}: "${dto.title}"`,
        );
        break;
    }
  }
}
