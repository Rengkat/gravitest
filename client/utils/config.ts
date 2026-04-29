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
  CheckCircle,
  AlertCircle,
  Clock,
  Archive,
} from "lucide-react";
import { ExamType, QuestionFormat, DifficultyLevel, QuestionStatus } from "@/types/questions";

// ── Exam visual configs ───────────────────────────────────────────────────

export const EXAM_CONFIG: Record<
  ExamType,
  {
    icon: any;
    color: string;
    bg: string;
    ring: string;
  }
> = {
  JAMB: {
    icon: Brain,
    color: "#7c3aed",
    bg: "from-violet-500 to-purple-600",
    ring: "ring-violet-400/30",
  },
  WAEC: {
    icon: BookOpen,
    color: "#0284c7",
    bg: "from-sky-500 to-blue-600",
    ring: "ring-sky-400/30",
  },
  NECO: {
    icon: Library,
    color: "#059669",
    bg: "from-emerald-500 to-teal-600",
    ring: "ring-emerald-400/30",
  },
  NABTEB: {
    icon: FlaskConical,
    color: "#d97706",
    bg: "from-amber-500 to-orange-500",
    ring: "ring-amber-400/30",
  },
  BECE: {
    icon: GraduationCap,
    color: "#16a34a",
    bg: "from-green-500 to-emerald-500",
    ring: "ring-green-400/30",
  },
  JUNIOR_NECO: {
    icon: Landmark,
    color: "#0d9488",
    bg: "from-teal-500 to-cyan-500",
    ring: "ring-teal-400/30",
  },
  ICAN: {
    icon: Calculator,
    color: "#dc2626",
    bg: "from-red-500 to-rose-600",
    ring: "ring-red-400/30",
  },
  NMCN: {
    icon: Stethoscope,
    color: "#0284c7",
    bg: "from-sky-500 to-blue-600",
    ring: "ring-sky-400/30",
  },
  CIPM: {
    icon: Users,
    color: "#7c3aed",
    bg: "from-violet-500 to-purple-600",
    ring: "ring-violet-400/30",
  },
  NIM: {
    icon: Briefcase,
    color: "#d97706",
    bg: "from-amber-500 to-yellow-500",
    ring: "ring-amber-400/30",
  },
  NIESV: {
    icon: BarChart,
    color: "#059669",
    bg: "from-emerald-500 to-green-600",
    ring: "ring-emerald-400/30",
  },
};

// ── Format configs ────────────────────────────────────────────────────────

export const FORMAT_CONFIG: Record<
  QuestionFormat,
  {
    label: string;
    icon: any;
    color: string;
    bg: string;
    border: string;
  }
> = {
  MCQ: {
    label: "MCQ",
    icon: CircleDot,
    color: "#3b82f6",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  THEORY: {
    label: "Theory",
    icon: PenLine,
    color: "#8b5cf6",
    bg: "bg-violet-50",
    border: "border-violet-200",
  },
  PRACTICAL: {
    label: "Practical",
    icon: Microscope,
    color: "#14b8a6",
    bg: "bg-teal-50",
    border: "border-teal-200",
  },
  ALL: {
    label: "Mixed",
    icon: Layers,
    color: "#f97316",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
};

// ── Difficulty configs ────────────────────────────────────────────────────

export const DIFFICULTY_CONFIG: Record<
  DifficultyLevel,
  {
    label: string;
    color: string;
    bg: string;
    border: string;
    bar: string;
  }
> = {
  easy: {
    label: "Easy",
    color: "#10b981",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    bar: "bg-emerald-500",
  },
  medium: {
    label: "Medium",
    color: "#f59e0b",
    bg: "bg-amber-50",
    border: "border-amber-200",
    bar: "bg-amber-500",
  },
  hard: {
    label: "Hard",
    color: "#ef4444",
    bg: "bg-red-50",
    border: "border-red-200",
    bar: "bg-red-500",
  },
};

// ── Status configs ────────────────────────────────────────────────────────

export const STATUS_CONFIG: Record<
  QuestionStatus,
  {
    label: string;
    icon: any;
    color: string;
    bg: string;
    border: string;
  }
> = {
  active: {
    label: "Active",
    icon: CheckCircle,
    color: "#16a34a",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  inactive: {
    label: "Inactive",
    icon: AlertCircle,
    color: "#d97706",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  draft: {
    label: "Draft",
    icon: Clock,
    color: "#6b7280",
    bg: "bg-gray-100",
    border: "border-gray-200",
  },
  archived: {
    label: "Archived",
    icon: Archive,
    color: "#ef4444",
    bg: "bg-red-50",
    border: "border-red-200",
  },
};

// ── Category colours ──────────────────────────────────────────────────────

export const CATEGORY_CONFIG = {
  secondary: { bg: "from-green-500 to-emerald-600", iconColor: "text-white" },
  professional: { bg: "from-purple-500 to-violet-600", iconColor: "text-white" },
};

// ── Helpers ───────────────────────────────────────────────────────────────

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

export function pct(part: number, total: number): string {
  if (!total) return "0";
  return ((part / total) * 100).toFixed(1);
}
