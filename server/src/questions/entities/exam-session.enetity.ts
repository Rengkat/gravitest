import {
  ExamMode,
  ExamType,
  SessionStatus,
  Subject,
} from 'src/common/enums/enums';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SessionQuestion } from './session-questions.entity';

@Entity('exam_sessions')
export class ExamSession {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  studentProfileId!: string; // raw FK — cross module

  @Column({ type: 'enum', enum: ExamType })
  examType!: ExamType;

  @Column({ type: 'enum', enum: ExamMode })
  mode!: ExamMode; // PRACTICE, MOCK, SCHOOL_EXAM

  @Column({ type: 'jsonb' })
  subjects!: Subject[]; // JAMB = 4 subjects

  @Column({ type: 'int' })
  totalQuestions!: number;

  @Column({ type: 'int' })
  durationSeconds!: number; // total time allowed

  @Column({ type: 'int', default: 0 })
  timeSpentSeconds!: number; // how long they actually took

  @Column({ type: 'timestamptz' })
  startedAt!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  submittedAt: Date | null;

  @Column({ type: 'enum', enum: SessionStatus })
  status!: SessionStatus;

  // ── Score breakdown ────────────────────────
  @Column({ type: 'int', default: 0 })
  score!: number; // total raw score

  @Column({ type: 'float', default: 0 })
  percentage!: number;

  @Column({ type: 'jsonb', nullable: true })
  subjectScores:
    | {
        subject: Subject;
        score: number;
        total: number;
        percentage: number;
      }[]
    | null;

  // ── Relations (same module) ────────────────
  @OneToMany(() => SessionQuestion, (sq) => sq.examSession, { cascade: true })
  sessionQuestions: SessionQuestion[];
}
