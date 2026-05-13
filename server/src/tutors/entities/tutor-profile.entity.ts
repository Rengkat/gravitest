import { SessionMode, TutorStatus } from 'src/common/enums/enums';
// ============================================================
// 5. TUTOR PROFILE  (tutor_profiles table)
//    Created at registration when role = TUTOR (status = PENDING).
//    Covers: subjects, earnings, availability, qualifications.
// ============================================================
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { TutorReview } from './tutor-review.entity';
import { TutorSession } from './tutor-session.entity';
import { TutorAvailability } from './tutor-availability.entity';
import { TutorPayout } from './tutor-payout.entity';

@Entity('tutor_profiles')
@Index(['status'])
@Index(['averageRating'])
@Index(['hourlyRateKobo'])
export class TutorProfile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // ── Basic Info ─────────────────────────────────────────────
  @Column({ type: 'varchar', length: 20, nullable: true })
  title: string | null; // 'Mr', 'Mrs', 'Dr', 'Prof'

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  videoIntroUrl: string | null; // 2-minute intro video

  // ── Teaching Expertise ─────────────────────────────────────
  @Column({ type: 'varchar', array: true, default: '{}' })
  subjects!: string[]; // ['mathematics', 'physics', 'chemistry']

  @Column({ type: 'int', default: 0 })
  yearsOfExperience!: number;

  @Column({ type: 'varchar', array: true, default: '{}' })
  languages!: string[]; // Languages they can teach in

  @Column({ type: 'varchar', array: true, default: '{}' })
  examTypesCoached!: string[]; // ['WAEC', 'JAMB', 'ICAN']

  // ── Qualifications ─────────────────────────────────────────
  @Column({ type: 'jsonb', default: [] })
  qualifications!: {
    title: string;
    institution: string;
    year: number;
    verified: boolean;
  }[];

  @Column({ type: 'jsonb', default: [] })
  certifications!: {
    name: string;
    issuer: string;
    year: number;
    url?: string;
  }[];

  @Column({ type: 'jsonb', default: [] })
  education!: {
    degree: string;
    institution: string;
    graduationYear: string;
  }[];

  // ── Pricing ────────────────────────────────────────────────
  /** Stored in kobo (Naira × 100). Display: divide by 100 */
  @Column({ type: 'int', default: 0 })
  hourlyRateKobo!: number;

  /** Platform commission percentage (0–100). Default 20% */
  @Column({ type: 'int', default: 20 })
  commissionPercent!: number;

  // ── Session Modes ──────────────────────────────────────────
  @Column({ type: 'enum', enum: SessionMode, default: SessionMode.ONLINE })
  preferredSessionMode!: SessionMode;

  @Column({ type: 'boolean', default: true })
  canTeachOnline!: boolean;

  @Column({ type: 'boolean', default: false })
  canTeachInPerson!: boolean;

  @Column({ type: 'varchar', length: 200, nullable: true })
  inPersonLocation: string | null; // Area/LGA for in-person sessions

  // ── Status & Verification ──────────────────────────────────
  @Column({ type: 'enum', enum: TutorStatus, default: TutorStatus.PENDING })
  status!: TutorStatus;

  @Column({ type: 'boolean', default: false })
  isVerified!: boolean; // Manually verified by admin

  @Column({ type: 'boolean', default: false })
  isFeatured!: boolean; // Promoted on discover page

  @Column({ type: 'boolean', default: false })
  isOnline!: boolean; // Currently online/available

  @Column({ type: 'timestamptz', nullable: true })
  lastSeenAt: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  approvedAt: Date | null;

  @Column({ type: 'varchar', nullable: true })
  approvedBy: string | null;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string | null;

  // ── Ratings & Stats ────────────────────────────────────────
  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  averageRating!: number; // 0.00–5.00

  @Column({ type: 'int', default: 0 })
  totalReviews!: number;

  @Column({ type: 'int', default: 0 })
  totalSessionsCompleted!: number;

  @Column({ type: 'int', default: 0 })
  totalStudentsTaught!: number;

  @Column({ type: 'float', default: 0 })
  completionRate!: number; // % of booked sessions completed

  @Column({ type: 'float', default: 0 })
  responseRate!: number; // % of booking requests responded to

  @Column({ type: 'int', default: 0 })
  totalMinutesTaught!: number;

  // ── Financials ─────────────────────────────────────────────
  /** Escrow balance (collected, not yet released) in kobo */
  @Column({ type: 'int', default: 0 })
  escrowBalanceKobo!: number;

  /** Available balance (released, ready for payout) in kobo */
  @Column({ type: 'int', default: 0 })
  availableBalanceKobo!: number;

  /** All-time total earned in kobo */
  @Column({ type: 'int', default: 0 })
  totalEarnedKobo!: number;

  /** Total paid out in kobo */
  @Column({ type: 'int', default: 0 })
  totalPaidOutKobo!: number;

  /** Bank account for payouts — never returned in public API */
  @Column({ type: 'jsonb', nullable: true, select: false })
  bankDetails: {
    bankCode: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
    paystackRecipientCode?: string; // Paystack transfer recipient
  } | null;

  // ── Timestamps ─────────────────────────────────────────────
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // ── Relations ──────────────────────────────────────────────
  @OneToOne('User', (u: User) => u.tutorProfile)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @OneToMany('TutorSession', (s: TutorSession) => s.tutor)
  sessions: TutorSession[];

  @OneToMany('TutorReview', (r: TutorReview) => r.tutor)
  reviews: TutorReview[];

  @OneToMany('TutorAvailability', (a: TutorAvailability) => a.tutor)
  availability: TutorAvailability[];

  @OneToMany('TutorPayout', (p: TutorPayout) => p.tutor)
  payouts: TutorPayout[];

  // ── Domain Methods ─────────────────────────────────────────
  get hourlyRateNaira(): number {
    return this.hourlyRateKobo / 100;
  }

  get availableBalanceNaira(): number {
    return this.availableBalanceKobo / 100;
  }

  calculateTutorEarnings(sessionAmountKobo: number): number {
    // Amount tutor receives after platform commission
    return Math.floor(sessionAmountKobo * (1 - this.commissionPercent / 100));
  }

  approve(adminId: string): void {
    this.status = TutorStatus.APPROVED;
    this.isVerified = true;
    this.approvedAt = new Date();
    this.approvedBy = adminId;
    this.rejectionReason = null;
  }

  reject(reason: string): void {
    this.status = TutorStatus.REJECTED;
    this.rejectionReason = reason;
  }

  releaseEscrow(amountKobo: number): void {
    const tutorShare = this.calculateTutorEarnings(amountKobo);
    this.escrowBalanceKobo = Math.max(0, this.escrowBalanceKobo - amountKobo);
    this.availableBalanceKobo += tutorShare;
    this.totalEarnedKobo += tutorShare;
  }
}
