import { Eye, Calendar, Star, DollarSign, FileText } from "lucide-react";
import type { ActiveTab, TutorStatus } from "./types";

// ─── TABS ─────────────────────────────────────────────────────
export const DETAIL_TABS: { key: ActiveTab; label: string; icon: any }[] = [
  { key: "overview",  label: "Overview",  icon: Eye        },
  { key: "sessions",  label: "Sessions",  icon: Calendar   },
  { key: "reviews",   label: "Reviews",   icon: Star       },
  { key: "earnings",  label: "Earnings",  icon: DollarSign },
  { key: "documents", label: "Documents", icon: FileText   },
];

// ─── STATUS COLOURS ───────────────────────────────────────────
export const STATUS_COLOR: Record<TutorStatus, string> = {
  active:   "bg-green-100 text-green-600",
  inactive: "bg-gray-100 text-gray-600",
  suspended:"bg-red-100 text-red-600",
  on_leave: "bg-blue-100 text-blue-600",
};

// ─── SESSION STATUS COLOURS ───────────────────────────────────
export const SESSION_STATUS_COLOR: Record<string, string> = {
  completed:   "bg-green-100 text-green-600",
  upcoming:    "bg-blue-100 text-blue-600",
  in_progress: "bg-yellow-100 text-yellow-600",
  cancelled:   "bg-red-100 text-red-600",
};
