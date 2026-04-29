import {
  Brain,
  BookOpen,
  Library,
  FlaskConical,
  GraduationCap,
  Landmark,
  Calculator,
  Stethoscope,
  Users,
  Briefcase,
  BarChart,
  CircleDot,
  PenLine,
  Microscope,
  Layers,
} from "lucide-react";
import type {
  ExamType,
  QuestionCategory,
  QuestionFormat,
  DifficultyLevel,
} from "@/types/creatQuestions";

export const EXAM_CONFIGS: Record<
  ExamType,
  {
    name: string;
    icon: any;
    color: string;
    bg: string;
    category: QuestionCategory;
    formats: QuestionFormat[];
    subjects: string[];
    description: string;
    supportsStructuredQuestions: boolean; // theory/practical exams with Q1a, b(i)…
  }
> = {
  JAMB: {
    name: "JAMB UTME",
    icon: Brain,
    color: "#7c3aed",
    bg: "from-violet-500 to-purple-600",
    category: "secondary",
    formats: ["MCQ"],
    subjects: [
      "Mathematics",
      "English",
      "Physics",
      "Chemistry",
      "Biology",
      "Economics",
      "Government",
      "Literature",
      "Commerce",
      "Geography",
      "History",
      "CRS",
      "IRS",
    ],
    description: "Unified Tertiary Matriculation Examination - CBT",
    supportsStructuredQuestions: false,
  },
  WAEC: {
    name: "WAEC SSCE",
    icon: BookOpen,
    color: "#0284c7",
    bg: "from-sky-500 to-blue-600",
    category: "secondary",
    formats: ["MCQ", "THEORY", "PRACTICAL", "MIXED"],
    subjects: [
      "Mathematics",
      "English",
      "Physics",
      "Chemistry",
      "Biology",
      "Economics",
      "Government",
      "Literature",
      "Geography",
      "Agricultural Science",
      "Further Mathematics",
      "Technical Drawing",
    ],
    description: "West African Senior School Certificate Examination",
    supportsStructuredQuestions: true,
  },
  NECO: {
    name: "NECO SSCE",
    icon: Library,
    color: "#059669",
    bg: "from-emerald-500 to-teal-600",
    category: "secondary",
    formats: ["MCQ", "THEORY", "PRACTICAL", "MIXED"],
    subjects: [
      "Mathematics",
      "English",
      "Physics",
      "Chemistry",
      "Biology",
      "Economics",
      "Government",
      "Literature",
      "Geography",
      "Further Mathematics",
      "Home Economics",
    ],
    description: "National Examination Council Senior School Certificate",
    supportsStructuredQuestions: true,
  },
  NABTEB: {
    name: "NABTEB",
    icon: FlaskConical,
    color: "#d97706",
    bg: "from-amber-500 to-orange-500",
    category: "secondary",
    formats: ["MCQ", "THEORY", "PRACTICAL", "MIXED"],
    subjects: [
      "Mathematics",
      "English",
      "Physics",
      "Chemistry",
      "Biology",
      "Technical Drawing",
      "Building Construction",
      "Electrical Installation",
      "Woodwork",
      "Metalwork",
    ],
    description: "National Business and Technical Examinations Board",
    supportsStructuredQuestions: true,
  },
  BECE: {
    name: "BECE",
    icon: GraduationCap,
    color: "#16a34a",
    bg: "from-green-500 to-emerald-500",
    category: "secondary",
    formats: ["MCQ", "THEORY"],
    subjects: [
      "Mathematics",
      "English",
      "Basic Science",
      "Social Studies",
      "Civic Education",
      "Christian Studies",
      "Islamic Studies",
      "Business Studies",
      "Home Economics",
    ],
    description: "Basic Education Certificate Examination",
    supportsStructuredQuestions: true,
  },
  JUNIOR_NECO: {
    name: "Junior NECO",
    icon: Landmark,
    color: "#0d9488",
    bg: "from-teal-500 to-cyan-500",
    category: "secondary",
    formats: ["MCQ", "THEORY"],
    subjects: [
      "Mathematics",
      "English",
      "Basic Science",
      "Social Studies",
      "Civic Education",
      "PVS",
      "Business Studies",
    ],
    description: "Junior Secondary Certificate Examination",
    supportsStructuredQuestions: true,
  },
  ICAN: {
    name: "ICAN",
    icon: Calculator,
    color: "#dc2626",
    bg: "from-red-500 to-rose-600",
    category: "professional",
    formats: ["MCQ"],
    subjects: [
      "Financial Accounting",
      "Management Accounting",
      "Taxation",
      "Audit & Assurance",
      "Corporate Law",
      "Strategic Management",
    ],
    description: "Institute of Chartered Accountants of Nigeria",
    supportsStructuredQuestions: false,
  },
  NMCN: {
    name: "NMCN",
    icon: Stethoscope,
    color: "#0284c7",
    bg: "from-sky-500 to-blue-600",
    category: "professional",
    formats: ["MCQ"],
    subjects: [
      "Nursing Fundamentals",
      "Medical-Surgical Nursing",
      "Pediatric Nursing",
      "Mental Health Nursing",
      "Community Health",
      "Midwifery",
    ],
    description: "Nursing and Midwifery Council of Nigeria",
    supportsStructuredQuestions: false,
  },
  CIPM: {
    name: "CIPM",
    icon: Users,
    color: "#7c3aed",
    bg: "from-violet-500 to-purple-600",
    category: "professional",
    formats: ["MCQ"],
    subjects: [
      "HR Management",
      "Organizational Behavior",
      "Employment Law",
      "Training & Development",
      "Compensation & Benefits",
    ],
    description: "Chartered Institute of Personnel Management",
    supportsStructuredQuestions: false,
  },
  NIM: {
    name: "NIM",
    icon: Briefcase,
    color: "#d97706",
    bg: "from-amber-500 to-yellow-500",
    category: "professional",
    formats: ["MCQ"],
    subjects: [
      "Management Principles",
      "Strategic Management",
      "Operations Management",
      "Marketing Management",
      "Financial Management",
    ],
    description: "Nigerian Institute of Management",
    supportsStructuredQuestions: false,
  },
  NIESV: {
    name: "NIESV",
    icon: BarChart,
    color: "#059669",
    bg: "from-emerald-500 to-green-600",
    category: "professional",
    formats: ["MCQ"],
    subjects: [
      "Property Valuation",
      "Real Estate Law",
      "Property Management",
      "Land Economics",
      "Investment Appraisal",
    ],
    description: "Nigerian Institution of Estate Surveyors & Valuers",
    supportsStructuredQuestions: false,
  },
};

export const YEARS = Array.from({ length: 26 }, (_, i) => (2025 - i).toString());

export const BLOOM_TAXONOMY = ["Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"];

export const DIFFICULTY_MAP: Record<
  DifficultyLevel,
  { label: string; bg: string; text: string; description: string }
> = {
  easy: {
    label: "Easy",
    bg: "#10b98115",
    text: "#10b981",
    description: "Basic recall and comprehension",
  },
  medium: {
    label: "Medium",
    bg: "#f59e0b15",
    text: "#f59e0b",
    description: "Application and analysis",
  },
  hard: {
    label: "Hard",
    bg: "#ef444415",
    text: "#ef4444",
    description: "Synthesis and evaluation",
  },
};

export const FORMAT_DETAILS: Record<
  QuestionFormat,
  {
    label: string;
    icon: any;
    color: string;
    bg: string;
    description: string;
    features: string[];
  }
> = {
  MCQ: {
    label: "Multiple Choice",
    icon: CircleDot,
    color: "#3b82f6",
    bg: "from-blue-500 to-blue-600",
    description: "Single or multiple correct options",
    features: ["Options with images", "Negative marking option", "Single/Multi select"],
  },
  THEORY: {
    label: "Theory/Essay",
    icon: PenLine,
    color: "#8b5cf6",
    bg: "from-violet-500 to-purple-600",
    description: "Written explanations and essays",
    features: ["Word limit", "Marking scheme", "Sample answer"],
  },
  PRACTICAL: {
    label: "Practical",
    icon: Microscope,
    color: "#14b8a6",
    bg: "from-teal-500 to-cyan-600",
    description: "Hands-on practical questions",
    features: ["Materials list", "Procedure steps", "Observations"],
  },
  MIXED: {
    label: "Mixed Format",
    icon: Layers,
    color: "#f97316",
    bg: "from-orange-500 to-red-500",
    description: "Combination of different formats",
    features: ["Sub-questions", "Multiple parts", "Various requirements"],
  },
};

// Roman numeral helpers for sub-part labels
export const ROMAN_NUMERALS = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];
export const PART_LETTERS = "abcdefghij".split("");
