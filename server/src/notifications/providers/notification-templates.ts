import { NotificationType } from 'src/common/enums/enums';
import {
  NotificationTemplate,
  NotificationTemplateMap,
} from '../types/notification.types';

/**
 * Central template registry.
 * Each key maps to a function that accepts a context object
 * and returns { title, body, actionUrl }.
 *
 * Context shape is documented per-type below.
 * Other modules call NotificationsService.notify() and pass the
 * relevant context — the template formats the message automatically.
 */
export const NOTIFICATION_TEMPLATES: NotificationTemplateMap = {
  // ── Auth / Account ──────────────────────────────────────────────────────
  [NotificationType.ACCOUNT_ALERT]: (ctx) => ({
    title: 'Account Alert',
    body: ctx.message ?? 'There is an important update on your account.',
    actionUrl: '/settings/security',
  }),

  // ── Exam ────────────────────────────────────────────────────────────────
  [NotificationType.EXAM_REMINDER]: (ctx) => ({
    title: `Exam Reminder — ${ctx.examType?.toUpperCase() ?? 'Your Exam'}`,
    body:
      ctx.daysLeft === 1
        ? `Your exam is tomorrow! Make sure you're prepared.`
        : `${ctx.daysLeft} days until your ${ctx.examType?.toUpperCase()} exam. Keep studying!`,
    actionUrl: '/dashboard/practice',
  }),

  [NotificationType.RESULT_PUBLISHED]: (ctx) => ({
    title: 'Result Published',
    body: `Your ${ctx.sessionTitle ?? 'exam'} result is now available. You scored ${ctx.score}%.`,
    actionUrl: ctx.sessionId
      ? `/dashboard/sessions/${ctx.sessionId}`
      : '/dashboard/reports',
  }),

  // ── Streak ──────────────────────────────────────────────────────────────
  [NotificationType.STREAK_ALERT]: (ctx) => ({
    title:
      ctx.type === 'milestone'
        ? `🎉 ${ctx.days}-Day Streak!`
        : ctx.type === 'at_risk'
          ? '⚠️ Your Streak is at Risk'
          : '🔥 Streak Broken',
    body:
      ctx.type === 'milestone'
        ? `Incredible! You've studied ${ctx.days} days in a row. Keep it up!`
        : ctx.type === 'at_risk'
          ? `Study today to keep your ${ctx.currentStreak}-day streak alive!`
          : `Your ${ctx.lostStreak}-day streak has ended. Start a new one today!`,
    actionUrl: '/dashboard/practice',
  }),

  // ── Gamification ────────────────────────────────────────────────────────
  [NotificationType.ACHIEVEMENT_UNLOCKED]: (ctx) => ({
    title: `Achievement Unlocked 🏆`,
    body: `You just earned "${ctx.achievementName}". ${ctx.description ?? ''}`.trim(),
    actionUrl: '/dashboard/achievements',
  }),

  [NotificationType.LEADERBOARD_UPDATE]: (ctx) => ({
    title: 'Leaderboard Update',
    body:
      ctx.moved === 'up'
        ? `You moved up to rank #${ctx.newRank} on the leaderboard!`
        : `You're now ranked #${ctx.newRank}. Keep pushing!`,
    actionUrl: '/dashboard/leaderboard',
  }),

  // ── Tutor Booking ────────────────────────────────────────────────────────
  [NotificationType.TUTOR_BOOKING]: (ctx) => ({
    title:
      ctx.action === 'confirmed'
        ? 'Booking Confirmed'
        : ctx.action === 'cancelled'
          ? 'Booking Cancelled'
          : 'Booking Update',
    body:
      ctx.action === 'confirmed'
        ? `Your session with ${ctx.tutorName} on ${ctx.date} at ${ctx.time} is confirmed.`
        : ctx.action === 'cancelled'
          ? `Your session with ${ctx.tutorName} on ${ctx.date} has been cancelled.`
          : `There's an update on your booking with ${ctx.tutorName}.`,
    actionUrl: ctx.bookingId
      ? `/dashboard/bookings/${ctx.bookingId}`
      : '/dashboard/bookings',
  }),

  [NotificationType.SESSION_START]: (ctx) => ({
    title: 'Session Starting Soon',
    body: `Your session with ${ctx.tutorName} starts in ${ctx.minutesBefore ?? 15} minutes.`,
    actionUrl: ctx.sessionUrl ?? '/dashboard/sessions',
  }),

  [NotificationType.SESSION_COMPLETE]: (ctx) => ({
    title: 'Session Completed',
    body: `Your session with ${ctx.tutorName} is complete. Leave a review!`,
    actionUrl: ctx.bookingId
      ? `/dashboard/bookings/${ctx.bookingId}/review`
      : '/dashboard/bookings',
  }),

  // ── Messages ─────────────────────────────────────────────────────────────
  [NotificationType.NEW_MESSAGE]: (ctx) => ({
    title: `New Message from ${ctx.senderName ?? 'Someone'}`,
    body: ctx.preview ?? 'You have a new message.',
    actionUrl: ctx.threadId
      ? `/dashboard/messages/${ctx.threadId}`
      : '/dashboard/messages',
  }),

  // ── Payments ─────────────────────────────────────────────────────────────
  [NotificationType.PAYMENT_SUCCESS]: (ctx) => ({
    title: 'Payment Successful ✅',
    body: `Your payment of ₦${ctx.amount?.toLocaleString() ?? '0'} was successful. ${ctx.description ?? ''}`.trim(),
    actionUrl: ctx.transactionId
      ? `/dashboard/transactions/${ctx.transactionId}`
      : '/dashboard/transactions',
  }),

  [NotificationType.PAYMENT_FAILED]: (ctx) => ({
    title: 'Payment Failed ❌',
    body: `Your payment of ₦${ctx.amount?.toLocaleString() ?? '0'} failed. ${ctx.reason ?? 'Please try again.'}`,
    actionUrl: '/dashboard/transactions',
  }),

  // ── Subscriptions ─────────────────────────────────────────────────────────
  [NotificationType.SUBSCRIPTION_EXPIRING]: (ctx) => ({
    title: 'Subscription Expiring Soon',
    body:
      ctx.daysLeft === 0
        ? 'Your subscription expires today! Renew now to keep access.'
        : `Your ${ctx.tier ?? 'Pro'} subscription expires in ${ctx.daysLeft} day${ctx.daysLeft === 1 ? '' : 's'}.`,
    actionUrl: '/dashboard/subscription',
  }),

  // ── Content ───────────────────────────────────────────────────────────────
  [NotificationType.NEW_CONTENT]: (ctx) => ({
    title: 'New Content Available 📚',
    body: `"${ctx.contentTitle ?? 'New content'}" is now available${ctx.subject ? ` for ${ctx.subject}` : ''}.`,
    actionUrl: ctx.contentId
      ? `/dashboard/library/${ctx.contentId}`
      : '/dashboard/library',
  }),

  // ── Weekly Report ─────────────────────────────────────────────────────────
  [NotificationType.WEEKLY_REPORT]: (ctx) => ({
    title: 'Your Weekly Study Report 📊',
    body: `This week: ${ctx.questionsAttempted ?? 0} questions, ${ctx.minutesStudied ?? 0} mins studied, avg score ${ctx.averageScore ?? 0}%.`,
    actionUrl: '/dashboard/reports',
  }),

  // ── System ────────────────────────────────────────────────────────────────
  [NotificationType.SYSTEM]: (ctx) => ({
    title: ctx.title ?? 'System Notification',
    body: ctx.body ?? 'A system event has occurred.',
    actionUrl: ctx.actionUrl ?? null,
  }),
};

/**
 * Resolve a template for a given type + context.
 * Falls back to a generic message if template not found.
 */
export function resolveTemplate(
  type: NotificationType,
  ctx: Record<string, any> = {},
): NotificationTemplate {
  const builder = NOTIFICATION_TEMPLATES[type];
  if (builder) {
    return builder(ctx);
  }
  return {
    title: 'Gravitas Notification',
    body: ctx.body ?? 'You have a new notification.',
    actionUrl: ctx.actionUrl ?? '/dashboard',
  };
}
