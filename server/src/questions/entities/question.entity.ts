import {
  DifficultyLevel,
  ExamType,
  QuestionType,
  Subject,
} from 'src/common/enums/enums';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

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

  // ── Relations ──────────────────────────────
  @OneToMany(() => QuestionOption, (o) => o.question, { cascade: true })
  options: QuestionOption[]; // A, B, C, D

  @OneToOne(() => QuestionAnswer, (a) => a.question, { cascade: true })
  answer: QuestionAnswer; // correct answer — separate table!

  @OneToMany(() => QuestionExplanation, (e) => e.question)
  explanations: QuestionExplanation[];
}
