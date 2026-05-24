import {
  DifficultyLevel,
  ExamType,
  QuestionType,
  Subject,
} from 'src/common/enums/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { QuestionOption } from './question-option.entity';
import { QuestionAnswer } from './question-answer.entity';
import { QuestionExplanation } from './question-explanation.entity';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', nullable: true })
  questionNumber: string | null; // for theory questions e.g Question 1a, 1b etc

  @Column({ type: 'enum', enum: ExamType })
  examType!: ExamType; // JAMB, WAEC, NECO etc

  @Column({ type: 'enum', enum: Subject })
  subject!: Subject;

  @Column({ type: 'int' })
  year!: number; // 2019, 2020 etc — past questions

  @Column({ type: 'text' })
  questionText!: string; // the actual question

  // ── Image support ──────────────────────────
  @Column({ type: 'varchar', nullable: true })
  questionImageUrl: string | null; // question has an image/diagram

  @Column({ type: 'enum', enum: DifficultyLevel })
  difficulty!: DifficultyLevel;

  @Column({ type: 'enum', enum: QuestionType })
  type!: QuestionType; // MCQ, THEORY etc

  @Column({ type: 'varchar', nullable: true })
  topic: string | null; // e.g "Organic Chemistry", "Algebra"

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'uuid', nullable: true, name: 'school_id' })
  schoolId: string | null;

  @Column({ type: 'uuid', nullable: true, name: 'class_id' })
  classId: string | null;

  // ── Timestamps ─────────────────────────────────────────────
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // ── Relations ──────────────────────────────
  @OneToMany(() => QuestionOption, (o) => o.question, { cascade: true })
  options: QuestionOption[]; // A, B, C, D

  @OneToOne(() => QuestionAnswer, (a) => a.question, { cascade: true })
  answer: QuestionAnswer; // correct answer — separate table!

  @OneToMany(() => QuestionExplanation, (e) => e.question)
  explanations: QuestionExplanation[];
}
