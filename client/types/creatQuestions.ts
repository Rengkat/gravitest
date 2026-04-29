// ─── ENUMS & UNION TYPES ───────────────────────────────────
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

export type QuestionFormat = "MCQ" | "THEORY" | "PRACTICAL" | "MIXED";
export type DifficultyLevel = "easy" | "medium" | "hard";
export type QuestionCategory = "secondary" | "professional";

// ─── NESTED TYPES ───────────────────────────────────────────
export interface QuestionOption {
  id: string;
  text: string;
  image?: string;
  isCorrect: boolean;
}

export interface QuestionDiagram {
  id: string;
  file: File | null;
  preview: string;
  caption: string;
}

// ─── THEORY QUESTION NUMBERING ──────────────────────────────
// Mirrors WAEC/NECO-style structured question numbering:
//   Question 1 → Part (a) → Sub-part (i), (ii), ...
//   Question 2 → Part (a) → ...
export interface SubPart {
  id: string;
  label: string; // "i", "ii", "iii", …
  text: string;
  marks: number;
  answer?: string;
}

export interface QuestionPart {
  id: string;
  label: string; // "a", "b", "c", …
  text: string;
  marks: number;
  answer?: string;
  subParts: SubPart[];
}

export interface TheoryQuestion {
  id: string;
  number: number; // 1, 2, 3, …
  parts: QuestionPart[];
}

// Legacy sub-question (kept for MIXED format)
export interface SubQuestion {
  id: string;
  number: string;
  text: string;
  marks: number;
  diagram?: string;
  answer?: string;
  explanation?: string;
}

export interface FeedbackRule {
  id: string;
  condition: string;
  feedback: string;
  points: number;
}

// ─── MAIN FORM DATA ─────────────────────────────────────────
export interface QuestionFormData {
  // Basic Info
  examCategory: QuestionCategory | "";
  examType: ExamType | "";
  year: string;
  subject: string;
  topic: string;
  subTopic: string;

  // Question Content
  format: QuestionFormat;
  difficulty: DifficultyLevel;
  questionText: string;
  marks: number;
  timeAllocation: number;

  // MCQ Specific
  options: QuestionOption[];

  // Theory / WAEC-style structured questions
  theoryQuestions: TheoryQuestion[];
  wordLimit: number;
  markingScheme: string;
  sampleAnswer: string;
  keyPoints: string[];

  // Practical Specific
  requiredMaterials: string;
  procedure: string;
  observations: string;

  // Media & Resources
  diagrams: QuestionDiagram[];
  referenceText: string;
  externalLinks: string[];

  // Meta
  status: "draft" | "active";
  tags: string[];
  explanation: string;
  hints: string[];
  difficultyRationale: string;

  // Advanced
  subQuestions: SubQuestion[];
  feedbackRules: FeedbackRule[];
  adaptiveDifficulty: boolean;
  bloomTaxonomy: string;
  curriculumAlignment: string;
}
