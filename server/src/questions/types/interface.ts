import { Question } from '../entities/question.entity';

export interface QuestionBankStats {
  total: number;
  active: number;
  inactive: number;
  byExamType: Record<string, number>;
  bySubject: Record<string, number>;
  byDifficulty: Record<string, number>;
  byType: Record<string, number>;
  byYear: Record<number, number>;
  withExplanations: number;
  withImages: number;
}
