import { Question } from '../entities/question.entity';

export interface PaginatedQuestions {
  data: Question[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

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
