import { BookingStatus, SessionMode } from 'src/common/enums/enums';

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TutorProfile } from './tutor-profile.entity';

// ============================================================
@Entity('tutor_sessions')
@Index(['tutorId', 'status'])
@Index(['studentProfileId', 'status'])
@Index(['scheduledAt'])
export class TutorSession {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  tutorId!: string;

  @Column({ type: 'uuid' })
  studentProfileId!: string;

  // ── Session Details ────────────────────────────────────────
  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status!: BookingStatus;

  @Column({ type: 'enum', enum: SessionMode, default: SessionMode.ONLINE })
  mode!: SessionMode;

  @Column({ type: 'varchar', array: true, default: '{}' })
  subjects!: string[];

  @Column({ type: 'text', nullable: true })
  studentNotes: string | null; // What the student wants to cover

  @Column({ type: 'text', nullable: true })
  tutorNotes: string | null;

  // ── Scheduling ─────────────────────────────────────────────
  @Column({ type: 'timestamptz' })
  scheduledAt!: Date;

  @Column({ type: 'int' })
  durationMinutes!: number; // 30, 60, 90, 120

  @Column({ type: 'timestamptz', nullable: true })
  startedAt: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  endedAt: Date | null;

  @Column({ type: 'int', nullable: true })
  actualDurationMinutes: number | null;

  // ── Pricing ────────────────────────────────────────────────
  /** Session fee in kobo */
  @Column({ type: 'int' })
  feeKobo!: number;

  /** Tutor's share in kobo (after commission) */
  @Column({ type: 'int', default: 0 })
  tutorEarningsKobo!: number;

  /** Platform commission in kobo */
  @Column({ type: 'int', default: 0 })
  platformFeeKobo!: number;

  // ── Meeting Link (LiveKit / Zoom) ──────────────────────────
  @Column({ type: 'varchar', nullable: true })
  meetingRoomId: string | null;

  @Column({ type: 'varchar', nullable: true })
  meetingUrl: string | null;

  // ── Payment ────────────────────────────────────────────────
  @Column({ type: 'uuid', nullable: true })
  paymentId: string | null;

  @Column({ type: 'boolean', default: false })
  isPaid!: boolean;

  @Column({ type: 'boolean', default: false })
  escrowReleased!: boolean;

  // ── Cancellation ───────────────────────────────────────────
  @Column({ type: 'text', nullable: true })
  cancellationReason: string | null;

  @Column({ type: 'varchar', nullable: true })
  cancelledBy: string | null; // userId

  @Column({ type: 'timestamptz', nullable: true })
  cancelledAt: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // ── Relations ──────────────────────────────────────────────
  @ManyToOne('TutorProfile', (t: TutorProfile) => t.sessions)
  @JoinColumn({ name: 'tutor_id' })
  tutor!: TutorProfile;

  // ── Domain Methods ─────────────────────────────────────────
  start(): void {
    this.status = BookingStatus.ONGOING;
    this.startedAt = new Date();
  }

  complete(): void {
    this.status = BookingStatus.COMPLETED;
    this.endedAt = new Date();
    if (this.startedAt) {
      this.actualDurationMinutes = Math.floor(
        (this.endedAt.getTime() - this.startedAt.getTime()) / 60_000,
      );
    }
  }

  cancel(byUserId: string, reason?: string): void {
    this.status = BookingStatus.CANCELLED;
    this.cancelledBy = byUserId;
    this.cancelledAt = new Date();
    this.cancellationReason = reason ?? null;
  }
}
