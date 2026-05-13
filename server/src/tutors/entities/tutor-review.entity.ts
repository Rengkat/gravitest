// ============================================================
// 22. TUTOR REVIEW  (tutor_reviews table)
//    Student reviews a tutor after a completed session.

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
@Entity('tutor_reviews')
@Index(['tutorId'])
@Index(['sessionId'], { unique: true })
@Index(['studentProfileId', 'tutorId'], { unique: true })
export class TutorReview {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  tutorId!: string;

  @Column({ type: 'uuid' })
  studentProfileId!: string;

  @Column({ type: 'uuid', unique: true })
  sessionId!: string;

  // ── Rating (1–5 stars, stored as x10 for precision: 45 = 4.5) ─
  @Column({ type: 'int' })
  rating!: number; // 10–50 (displayed as 1.0–5.0)

  // ── Detailed Ratings ───────────────────────────────────────
  @Column({ type: 'int', nullable: true })
  teachingQuality: number | null; // 10–50

  @Column({ type: 'int', nullable: true })
  punctuality: number | null;

  @Column({ type: 'int', nullable: true })
  communication: number | null;

  @Column({ type: 'int', nullable: true })
  subjectKnowledge: number | null;

  @Column({ type: 'text', nullable: true })
  comment: string | null;

  @Column({ type: 'boolean', default: false })
  wouldRecommend!: boolean;

  @Column({ type: 'boolean', default: true })
  isVisible!: boolean; // Admin can hide inappropriate reviews

  @Column({ type: 'text', nullable: true })
  tutorResponse: string | null; // Tutor can reply to review

  @Column({ type: 'timestamptz', nullable: true })
  tutorRespondedAt: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne('TutorProfile', (t: TutorProfile) => t.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tutor_id' })
  tutor!: TutorProfile;

  get displayRating(): number {
    return this.rating / 10;
  }
}
