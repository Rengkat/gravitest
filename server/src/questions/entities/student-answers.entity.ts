import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SessionQuestion } from './session-questions.entity';

@Entity('student_answers')
export class StudentAnswer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'char', length: 1, nullable: true })
  selectedLabel: string | null; // 'A', 'B', 'C', 'D' or null if skipped

  @Column({ type: 'uuid', nullable: true })
  selectedOptionId: string | null;

  @Column({ type: 'boolean', default: false })
  isCorrect!: boolean;

  @Column({ type: 'timestamptz' })
  answeredAt!: Date;

  @OneToOne(() => SessionQuestion, (sq) => sq.studentAnswer, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'session_question_id' })
  sessionQuestion!: SessionQuestion;
}
