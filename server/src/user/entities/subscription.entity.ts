// ============================================================
// 9. SUBSCRIPTION  (subscriptions table)
//    Created when a user subscribes to a plan.
//    Free tier subscription auto-created at registration.
// ============================================================
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import {
  BillingInterval,
  SubscriptionStatus,
  SubscriptionTier,
} from './../../common/enums/enums';
import type { User } from './user.entity';

@Entity('subscriptions')
@Index(['userId', 'status'])
@Index(['expiresAt'])
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  // ── Plan Details ───────────────────────────────────────────
  @Column({ type: 'enum', enum: SubscriptionTier })
  tier!: SubscriptionTier;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.ACTIVE,
  })
  status!: SubscriptionStatus;

  @Column({ type: 'enum', enum: BillingInterval, nullable: true })
  billingInterval: BillingInterval | null;

  /** Price paid in kobo */
  @Column({ type: 'int', default: 0 })
  amountKobo!: number;

  // ── Dates ──────────────────────────────────────────────────
  @Column({ type: 'timestamptz' })
  startedAt!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  expiresAt: Date | null; // Null = lifetime / free

  @Column({ type: 'timestamptz', nullable: true })
  cancelledAt: Date | null;

  @Column({ type: 'boolean', default: false })
  autoRenew!: boolean;

  // ── Paystack Integration ───────────────────────────────────
  @Column({ type: 'varchar', nullable: true, unique: true })
  paystackSubscriptionCode: string | null;

  @Column({ type: 'varchar', nullable: true })
  paystackPlanCode: string | null;

  @Column({ type: 'varchar', nullable: true })
  paystackCustomerCode: string | null;

  // ── Feature Limits for this Subscription ──────────────────
  @Column({ type: 'jsonb', nullable: true })
  featureLimits: {
    aiChatsPerDay?: number;
    cbtsPerDay?: number;
    libraryDownloads?: number;
    tutorSessionsPerMonth?: number;
    canAccessPremiumContent?: boolean;
    canAccessSchoolPortal?: boolean;
  } | null;

  // ── Timestamps ─────────────────────────────────────────────
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // ── Relations ──────────────────────────────────────────────
  @ManyToOne('User', (u: User) => u.subscriptions)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  // ── Domain Methods ─────────────────────────────────────────
  isActive(): boolean {
    if (this.status !== SubscriptionStatus.ACTIVE) return false;
    if (!this.expiresAt) return true; // lifetime
    return new Date() < this.expiresAt;
  }

  cancel(): void {
    this.status = SubscriptionStatus.CANCELLED;
    this.cancelledAt = new Date();
    this.autoRenew = false;
  }

  daysRemaining(): number | null {
    if (!this.expiresAt) return null;
    const ms = this.expiresAt.getTime() - Date.now();
    return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
  }
}
