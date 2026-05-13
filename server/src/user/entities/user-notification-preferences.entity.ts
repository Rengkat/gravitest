// ============================================================
// 3. USER NOTIFICATION PREFERENCES  (user_notification_preferences)
//    Created immediately after User on registration (all roles).
//    Separate from UserSettings to keep the table focused.
// ============================================================
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import type { User } from './user.entity';

@Entity('user_notification_preferences')
export class UserNotificationPreferences {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // ── Channel Toggles ────────────────────────────────────────
  @Column({ type: 'boolean', default: true })
  inAppEnabled!: boolean;

  @Column({ type: 'boolean', default: true })
  emailEnabled!: boolean;

  @Column({ type: 'boolean', default: false })
  smsEnabled!: boolean;

  @Column({ type: 'boolean', default: false })
  pushEnabled!: boolean;

  @Column({ type: 'boolean', default: false })
  whatsappEnabled!: boolean;

  // ── Notification Type Toggles ──────────────────────────────
  @Column({ type: 'boolean', default: true })
  examReminders!: boolean;

  @Column({ type: 'boolean', default: true })
  streakAlerts!: boolean;

  @Column({ type: 'boolean', default: true })
  newMessages!: boolean;

  @Column({ type: 'boolean', default: true })
  tutorBookingUpdates!: boolean;

  @Column({ type: 'boolean', default: true })
  paymentNotifications!: boolean;

  @Column({ type: 'boolean', default: true })
  subscriptionAlerts!: boolean;

  @Column({ type: 'boolean', default: true })
  resultPublished!: boolean;

  @Column({ type: 'boolean', default: true })
  newContentAlerts!: boolean;

  @Column({ type: 'boolean', default: true })
  achievementAlerts!: boolean;

  @Column({ type: 'boolean', default: true })
  leaderboardUpdates!: boolean;

  @Column({ type: 'boolean', default: true })
  weeklyReports!: boolean;

  @Column({ type: 'boolean', default: true })
  systemAlerts!: boolean; // Critical — should rarely be turned off

  // ── Quiet Hours ────────────────────────────────────────────
  @Column({ type: 'boolean', default: false })
  quietHoursEnabled!: boolean;

  @Column({ type: 'varchar', length: 5, default: '22:00' })
  quietHoursStart!: string; // HH:mm

  @Column({ type: 'varchar', length: 5, default: '07:00' })
  quietHoursEnd!: string; // HH:mm

  // ── WhatsApp-specific (for school reports) ─────────────────
  @Column({ type: 'varchar', length: 20, nullable: true })
  whatsappNumber: string | null;

  @Column({ type: 'boolean', default: false })
  weeklyWhatsappReport!: boolean;

  // ── Email Digest ───────────────────────────────────────────
  @Column({ type: 'varchar', default: 'daily', nullable: true })
  emailDigestFrequency: 'instant' | 'daily' | 'weekly' | 'never' | null;

  // ── Timestamps ─────────────────────────────────────────────
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // ── Relations ──────────────────────────────────────────────
  @OneToOne('User', (u: User) => u.notificationPreferences)
  @JoinColumn()
  user!: User;
}
