// ── Core enums / union types ──────────────────────────────────────────────

export type ExamType =
  | "JAMB"
  | "WAEC"
  | "NECO"
  | "NABTEB"
  | "BECE"
  | "JUNIOR_NECO"
  | "ICAN"
  | "NMCN"
  | "CIPM"
  | "NIM"
  | "NIESV";

export type ExamCategoryId = "secondary" | "professional";
export type QuestionFormat = "MCQ" | "THEORY" | "PRACTICAL" | "ALL";
export type DifficultyLevel = "easy" | "medium" | "hard";
export type QuestionStatus = "active" | "inactive" | "draft" | "archived";

// ── View/navigation state ─────────────────────────────────────────────────

export type BreadcrumbLevel =
  | { level: "overview" }
  | { level: "exam";    examType: ExamType }
  | { level: "year";    examType: ExamType; year: string }
  | { level: "subject"; examType: ExamType; subject: string }
  | { level: "topic";   examType: ExamType; subject: string; topic: string };

// ── Data models ───────────────────────────────────────────────────────────

export interface QuestionBankStats {
  total: number;
  active: number;
  inactive: number;
  draft: number;
  archived: number;
  byFormat: Record<QuestionFormat, number>;
  byDifficulty: Record<DifficultyLevel, number>;
  recentlyAdded: number;    // last 7 days
  totalUsage: number;
  avgQualityScore: number;  // 0–100
}

export interface ExamCategoryMeta {
  id: ExamCategoryId;
  name: string;
  examTypes: ExamType[];
  totalQuestions: number;
  byFormat: Partial<Record<QuestionFormat, number>>;
  yearsOfData: number;
}

export interface ExamMeta {
  examType: ExamType;
  name: string;
  fullName: string;
  description: string;
  category: ExamCategoryId;
  supportedFormats: QuestionFormat[];
  subjects: string[];
  totalQuestions: number;
  yearsCovered: number;
  avgQualityScore: number;
  // JAMB-specific: only MCQ, no THEORY/PRACTICAL
  isMultipleChoiceOnly: boolean;
}

export interface YearMeta {
  year: string;
  examType: ExamType;
  totalQuestions: number;
  byFormat: Partial<Record<QuestionFormat, number>>;
  subjects: string[];
}

export interface SubjectMeta {
  subject: string;
  examType: ExamType;
  totalQuestions: number;
  byFormat: Partial<Record<QuestionFormat, number>>;
  topics: string[];
  avgQualityScore: number;
}

export interface Question {
  id: string;
  examType: ExamType;
  subject: string;
  year: string;
  format: QuestionFormat;
  difficulty: DifficultyLevel;
  status: QuestionStatus;
  topic: string;
  marks: number;
  question: string;
  options?: string[];           // MCQ only
  correctAnswer?: number;       // MCQ option index
  correctAnswerText?: string;   // THEORY/PRACTICAL expected answer key
  explanation?: string;
  usageCount: number;
  avgScore: number;             // % of students who got it right
  qualityScore: number;         // 0–100 admin quality rating
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// ── Filter state ──────────────────────────────────────────────────────────

export interface QuestionFilters {
  examType: ExamType | "";
  year: string;
  subject: string;
  topic: string;
  format: QuestionFormat | "";
  difficulty: DifficultyLevel | "";
  status: QuestionStatus | "";
  searchQuery: string;
}

export const DEFAULT_FILTERS: QuestionFilters = {
  examType: "",
  year: "",
  subject: "",
  topic: "",
  format: "",
  difficulty: "",
  status: "",
  searchQuery: "",
};
