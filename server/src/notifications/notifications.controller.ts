import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
  Sse,
  MessageEvent,
  UseGuards,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { NotificationsService } from './notifications.service';
import { NotificationEventsEmitter } from './providers/notification-events.emitter';
import {
  AdminNotificationFiltersDto,
  BroadcastNotificationDto,
  MarkReadDto,
  NotificationFiltersDto,
  SendNotificationDto,
} from './dto/notification.dto';
import { UpdateNotificationPreferencesDto } from 'src/user/dto/update-notification-preferences.dto';
import type { Request, Response } from 'express';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserId } from 'src/auth/decorators/current-user.decorator';
import { UserRole } from 'src/common/enums/enums';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly eventsEmitter: NotificationEventsEmitter,
  ) {}

  // ═══════════════════════════════════════════════════════════════
  // REAL-TIME SSE STREAM
  // ═══════════════════════════════════════════════════════════════

  /**
   * GET /notifications/stream/:userId
   *
   * Client opens a persistent SSE connection. Server pushes notification
   * events the moment they are saved — no polling needed.
   *
   * Frontend usage:
   *   const source = new EventSource('/api/v1/notifications/stream/{userId}');
   *   source.onmessage = (e) => {
   *     const notification = JSON.parse(e.data);
   *     // update bell icon, show toast, etc.
   *   };
   *   source.addEventListener('heartbeat', () => {}); // keeps connection alive
   *   source.onerror = () => source.close();          // handle disconnect
   *
   * In production: extract userId from JWT instead of URL param.
   * The connection auto-closes when the client disconnects.
   */
  @Sse('stream')
  stream(
    @UserId() userId: string,
    @Res() res: Response,
  ): Observable<MessageEvent> {
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('X-Accel-Buffering', 'no');

    return this.eventsEmitter.streamFor(userId).pipe(
      map((event) => ({
        data: JSON.stringify(event),
        type: 'notification',
        id: event.notificationId,
      })),
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // USER INBOX
  // ═══════════════════════════════════════════════════════════════

  // GET /notifications/inbox/:userId
  // GET /notifications/inbox/:userId?status=unread&type=exam_reminder&page=1
  @Get('inbox/:userId')
  getInbox(@UserId() userId: string, @Query() filters: NotificationFiltersDto) {
    return this.notificationsService.getInbox(userId, filters);
  }

  // GET /notifications/inbox/:userId/summary
  // Unread count per type — feeds the navbar bell badge
  @Get('inbox/:userId/summary')
  getInboxSummary(@UserId() userId: string) {
    return this.notificationsService.getInboxSummary(userId);
  }

  // GET /notifications/inbox/:userId/:id
  @Get('inbox/:userId/:id')
  getOne(@UserId() userId: string, @Param('id', ParseUUIDPipe) id: string) {
    return this.notificationsService.getOne(userId, id);
  }

  // PATCH /notifications/inbox/:userId/mark-read
  // Body: { ids: [uuid] } — omit ids to mark ALL unread
  @Patch('inbox/:userId/mark-read')
  @HttpCode(HttpStatus.OK)
  markRead(@UserId() userId: string, @Body() dto: MarkReadDto) {
    return this.notificationsService.markRead(userId, dto);
  }

  // PATCH /notifications/inbox/:userId/mark-all-read
  @Patch('inbox/:userId/mark-all-read')
  @HttpCode(HttpStatus.OK)
  markAllRead(@UserId() userId: string) {
    return this.notificationsService.markAllRead(userId);
  }

  // PATCH /notifications/inbox/:userId/:id/archive
  @Patch('inbox/:userId/:id/archive')
  @HttpCode(HttpStatus.OK)
  archiveOne(@UserId() userId: string, @Param('id', ParseUUIDPipe) id: string) {
    return this.notificationsService.archiveOne(userId, id);
  }

  // DELETE /notifications/inbox/:userId/:id
  @Delete('inbox/:userId/:id')
  @HttpCode(HttpStatus.OK)
  deleteOne(@UserId() userId: string, @Param('id', ParseUUIDPipe) id: string) {
    return this.notificationsService.deleteOne(userId, id);
  }

  // DELETE /notifications/inbox/:userId/clear
  // Clears all read + archived notifications
  @Delete('inbox/:userId/clear')
  @HttpCode(HttpStatus.OK)
  clearAll(@UserId() userId: string) {
    return this.notificationsService.clearAll(userId);
  }

  // ═══════════════════════════════════════════════════════════════
  // USER PREFERENCES
  // ═══════════════════════════════════════════════════════════════

  // GET /notifications/preferences/:userId
  @Get('preferences/:userId')
  getPreferences(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.notificationsService.getPreferences(userId);
  }

  // PATCH /notifications/preferences/:userId
  @Patch('preferences/:userId')
  updatePreferences(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: UpdateNotificationPreferencesDto,
  ) {
    return this.notificationsService.updatePreferences(userId, dto as any);
  }

  // ═══════════════════════════════════════════════════════════════
  // ADMIN
  // ═══════════════════════════════════════════════════════════════

  // GET /notifications/admin
  // @Roles(UserRole.SUPER_ADMIN)
  @Get('admin')
  adminFindAll(@Query() filters: AdminNotificationFiltersDto) {
    return this.notificationsService.adminFindAll(filters);
  }

  // GET /notifications/admin/stats
  // @Roles(UserRole.SUPER_ADMIN)
  @Get('admin/stats')
  adminGetStats() {
    return this.notificationsService.adminGetStats();
  }

  // POST /notifications/admin/send
  // @Roles(UserRole.SUPER_ADMIN)
  @Post('admin/send')
  @HttpCode(HttpStatus.OK)
  adminSend(@Body() dto: SendNotificationDto) {
    return this.notificationsService.send(dto);
  }

  // POST /notifications/admin/broadcast
  // @Roles(UserRole.SUPER_ADMIN)
  @Post('admin/broadcast')
  @HttpCode(HttpStatus.OK)
  adminBroadcast(@Body() dto: BroadcastNotificationDto) {
    return this.notificationsService.broadcast(dto);
  }
}
