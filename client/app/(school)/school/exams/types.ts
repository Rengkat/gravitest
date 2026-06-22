export enum QuestionType {
  MCQ = "MCQ",
  THEORY = "THEORY",
  PRACTICAL = "PRACTICAL",
  TRUE_FALSE = "TRUE_FALSE",
  FILL_IN_BLANK = "FILL_IN_BLANK",
  MATCHING = "MATCHING",
  ESSAY = "ESSAY",
  OBJECTIVE = "OBJECTIVE",
}

export enum DifficultyLevel {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
  VERY_HARD = "VERY_HARD",
}

export enum ExamStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  ARCHIVED = "ARCHIVED",
}

export enum Term {
  FIRST = "FIRST",
  SECOND = "SECOND",
  THIRD = "THIRD",
}

export interface Question {
  id: string;
  examId: string;
  type: QuestionType;
  category: string;
  questionText: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  marks: number;
  difficulty: DifficultyLevel;
  orderIndex: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Exam {
  id: string;
  schoolId: string;
  classId: string;
  className?: string;
  classArm?: string;
  subject: string;
  title: string;
  term: Term;
  termYear: string;
  description?: string;
  totalMarks: number;
  totalQuestions: number;
  durationMinutes: number;
  startDate: Date;
  endDate: Date;
  instruction?: string;
  status: ExamStatus;
  questions: Question[];
  totalStudents: number;
  submittedCount: number;
  averageScore?: number;
  passingScore?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExamStats {
  totalExams: number;
  draftExams: number;
  publishedExams: number;
  ongoingExams: number;
  completedExams: number;
  totalQuestions: number;
  averageMarks: number;
}

export interface ClassExamStats {
  classId: string;
  className: string;
  classArm?: string;
  totalExams: number;
  publishedExams: number;
  completedExams: number;
  averageScore: number;
  totalStudents: number;
}

export interface CreateExamDto {
  classId: string;
  subject: string;
  title: string;
  term: Term;
  termYear: string;
  description?: string;
  totalMarks: number;
  durationMinutes: number;
  startDate: Date;
  endDate: Date;
  instruction?: string;
  passingScore?: number;
}

export interface UpdateExamDto {
  title?: string;
  description?: string;
  totalMarks?: number;
  durationMinutes?: number;
  startDate?: Date;
  endDate?: Date;
  instruction?: string;
  status?: ExamStatus;
  passingScore?: number;
}

export interface CreateQuestionDto {
  examId: string;
  type: QuestionType;
  category: string;
  questionText: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  marks: number;
  difficulty: DifficultyLevel;
  orderIndex?: number;
}

export interface ExamFilters {
  search?: string;
  classId?: string;
  subject?: string;
  term?: Term;
  status?: ExamStatus;
  sortBy?: "title" | "startDate" | "totalMarks" | "totalQuestions";
  sortOrder?: "ASC" | "DESC";
}
