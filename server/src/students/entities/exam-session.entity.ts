// ============================================================
// 14. EXAM SESSION  (exam_sessions table)
//    Records every CBT attempt by any user.
//    Links student, exam type, subjects, score, per-question answers.
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
import { StudentProfile } from './student-profile.entity';
import {
  DifficultyLevel,
  ExamType,
  QuestionType,
} from 'src/common/enums/enums';

@Entity('exam_sessions')
@Index(['studentProfileId', 'createdAt'])
@Index(['studentProfileId', 'examType'])
@Index(['studentProfileId', 'subject'])
@Index(['schoolId', 'createdAt'])
export class ExamSession {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  studentProfileId!: string;

  // ── Exam Identity ──────────────────────────────────────────
  @Column({ type: 'enum', enum: ExamType, nullable: true })
  examType: ExamType | null; // WAEC, JAMB, etc. Null = school custom exam

  @Column({ type: 'varchar', length: 100, nullable: true })
  subject: string | null; // 'Mathematics', 'Physics'

  @Column({ type: 'varchar', length: 200, nullable: true })
  topic: string | null; // For topic-specific practice

  @Column({ type: 'enum', enum: QuestionType, default: QuestionType.MCQ })
  questionType!: QuestionType;

  @Column({ type: 'enum', enum: DifficultyLevel, nullable: true })
  difficulty: DifficultyLevel | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  sessionTitle: string | null; // e.g. 'WAEC 2019 Mathematics'

  /** Null = platform exam bank, set = school custom exam */
  @Column({ type: 'uuid', nullable: true })
  schoolId: string | null;

  @Column({ type: 'uuid', nullable: true })
  schoolExamId: string | null; // Reference to school's exam definition

  // ── Timing ────────────────────────────────────────────────
  @Column({ type: 'timestamptz' })
  startedAt!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  completedAt: Date | null;

  @Column({ type: 'int', nullable: true })
  durationSeconds: number | null; // Actual time taken

  @Column({ type: 'int', nullable: true })
  allowedDurationSeconds: number | null; // Time limit set

  @Column({ type: 'boolean', default: false })
  isCompleted!: boolean;

  @Column({ type: 'boolean', default: false })
  isTimedOut!: boolean; // Auto-submitted by timer

  // ── Scoring ────────────────────────────────────────────────
  @Column({ type: 'int', default: 0 })
  totalQuestions!: number;

  @Column({ type: 'int', default: 0 })
  questionsAttempted!: number;

  @Column({ type: 'int', default: 0 })
  questionsCorrect!: number;

  @Column({ type: 'int', default: 0 })
  questionsSkipped!: number;

  @Column({ type: 'float', default: 0 })
  score!: number; // Raw percentage 0–100

  @Column({ type: 'float', nullable: true })
  scaledScore: number | null; // JAMB: out of 400, WAEC: out of 100

  @Column({ type: 'int', default: 0 })
  xpEarned!: number;

  // ── Per-Question Detail ────────────────────────────────────
  @Column({ type: 'jsonb', nullable: true })
  answers:
    | {
        questionId: string;
        selectedOptionId: string | null;
        isCorrect: boolean;
        timeSpentSeconds: number;
        markedForReview: boolean;
        writtenAnswer?: string; // For theory questions
      }[]
    | null;

  // ── Per-Topic Breakdown ────────────────────────────────────
  @Column({ type: 'jsonb', nullable: true })
  topicBreakdown:
    | {
        topic: string;
        total: number;
        correct: number;
        score: number;
      }[]
    | null;

  // ── Metadata ───────────────────────────────────────────────
  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    year?: number; // Past question year e.g. 2019
    examYear?: string;
    shuffled?: boolean;
    device?: string;
    ipAddress?: string;
  } | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // ── Relations ──────────────────────────────────────────────
  @ManyToOne(() => StudentProfile, (profile) => profile.examSessions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_profile_id' })
  studentProfile: StudentProfile;

  // ── Domain Methods ─────────────────────────────────────────
  get accuracyRate(): number {
    if (!this.questionsAttempted) return 0;
    return (this.questionsCorrect / this.questionsAttempted) * 100;
  }

  complete(): void {
    this.isCompleted = true;
    this.completedAt = new Date();
    if (this.startedAt) {
      this.durationSeconds = Math.floor(
        (this.completedAt.getTime() - this.startedAt.getTime()) / 1000,
      );
    }
    this.score =
      this.questionsAttempted > 0
        ? (this.questionsCorrect / this.totalQuestions) * 100
        : 0;
  }
}
