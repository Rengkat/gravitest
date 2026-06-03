import { Injectable } from '@nestjs/common';
import { Subject, Observable, filter } from 'rxjs';
import { NotificationType, NotificationChannel } from 'src/common/enums/enums';

// ─── SSE Event shape ──────────────────────────────────────────────────────────

export interface NotificationEvent {
  userId: string;
  notificationId: string;
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  body: string;
  actionUrl: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

@Injectable()
export class NotificationEventsEmitter {
  /**
   * Single shared Subject — all notification events flow through here.
   * Each SSE connection filters by userId.
   */
  private readonly events$ = new Subject<NotificationEvent>();

  /**
   * Called by NotificationsService after every successful persist.
   * Other modules never call this directly — they call notify() on the service.
   */
  emit(event: NotificationEvent): void {
    this.events$.next(event);
  }

  /**
   * Returns an Observable filtered to a specific user.
   * Each SSE controller subscription calls this.
   */
  streamFor(userId: string): Observable<NotificationEvent> {
    return this.events$.pipe(filter((event) => event.userId === userId));
  }
}
