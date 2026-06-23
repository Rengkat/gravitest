export const QUESTION_TYPES = [
  "MCQ",
  "THEORY",
  "PRACTICAL",
  "TRUE_FALSE",
  "FILL_IN_BLANK",
  "MATCHING",
  "ESSAY",
  "OBJECTIVE",
] as const;
export type QuestionType = (typeof QUESTION_TYPES)[number];

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  MCQ: "Multiple Choice",
  THEORY: "Theory",
  PRACTICAL: "Practical",
  TRUE_FALSE: "True / False",
  FILL_IN_BLANK: "Fill in the Blank",
  MATCHING: "Matching",
  ESSAY: "Essay",
  OBJECTIVE: "Objective",
};

export const DIFFICULTY_LEVELS = ["EASY", "MEDIUM", "HARD", "VERY_HARD"] as const;
export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];

export const EXAM_STATUSES = ["DRAFT", "PUBLISHED", "ONGOING", "COMPLETED", "ARCHIVED"] as const;
export type ExamStatus = (typeof EXAM_STATUSES)[number];

export const EXAM_STATUS_LABELS: Record<ExamStatus, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  ONGOING: "Ongoing",
  COMPLETED: "Completed",
  ARCHIVED: "Archived",
};

export const TERMS = ["FIRST", "SECOND", "THIRD"] as const;
export type Term = (typeof TERMS)[number];

export const TERM_LABELS: Record<Term, string> = {
  FIRST: "First Term",
  SECOND: "Second Term",
  THIRD: "Third Term",
};

export interface Question {
  id: string;
  examId: string;
  type: QuestionType;
  /** Free-text topic within the subject, e.g. "Algebra", "Mechanics". */
  topic: string;
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
  className: string;
  classArm?: string | null;
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

/** A school class (e.g. "SS3 Science", arm "A"). */
export interface SchoolClass {
  classId: string;
  className: string;
  classArm?: string | null;
  totalStudents: number;
  /** Subjects offered by this class, used to scaffold per-subject stats. */
  subjects: string[];
}

/** Aggregate exam stats for one subject, scoped to a single class. */
export interface SubjectExamStats {
  subject: string;
  totalExams: number;
  publishedExams: number;
  completedExams: number;
  totalQuestions: number;
  averageScore: number | null;
}

/** Aggregate exam stats for a class, shown on the classes overview grid. */
export interface ClassExamStats {
  classId: string;
  className: string;
  classArm?: string | null;
  totalStudents: number;
  totalExams: number;
  publishedExams: number;
  completedExams: number;
  averageScore: number | null;
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

export type CreateQuestionDto = Omit<
  Question,
  "id" | "examId" | "orderIndex" | "isActive" | "createdAt" | "updatedAt"
> & {
  orderIndex?: number;
};

export interface ExamFilters {
  search?: string;
  classId?: string;
  subject?: string;
  term?: Term;
  status?: ExamStatus;
  sortBy?: "title" | "startDate" | "totalMarks" | "totalQuestions";
  sortOrder?: "ASC" | "DESC";
}
