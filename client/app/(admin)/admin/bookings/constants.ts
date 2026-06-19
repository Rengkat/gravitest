import {
  Calendar, Play, CheckCircle, XCircle, UserX, RotateCcw, Clock,
  BarChart3, List,
} from "lucide-react";
import type { BookingStatus, BookingFilters, MeetingPlatform, ViewMode } from "./types";

// ─── STATUS CONFIG ───────────────────────────────────────────
export const BOOKING_STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; icon: any; bg: string; text: string }
> = {
  upcoming:             { label: "Upcoming",  icon: Calendar,     bg: "#3b82f615", text: "#3b82f6" },
  ongoing:              { label: "Ongoing",   icon: Play,         bg: "#f59e0b15", text: "#f59e0b" },
  completed:            { label: "Completed", icon: CheckCircle,  bg: "#10b98115", text: "#10b981" },
  cancelled:            { label: "Cancelled", icon: XCircle,      bg: "#ef444415", text: "#ef4444" },
  no_show:              { label: "No Show",   icon: UserX,        bg: "#6b728015", text: "#6b7280" },
  rescheduled:          { label: "Rescheduled", icon: RotateCcw,  bg: "#8b5cf615", text: "#8b5cf6" },
  pending_confirmation: { label: "Pending",   icon: Clock,        bg: "#f9731615", text: "#f97316" },
};

// ─── MEETING PLATFORM CONFIG ─────────────────────────────────
export const MEETING_PLATFORM_CONFIG: Record<
  MeetingPlatform,
  { label: string; color: string; bg: string }
> = {
  "google-meet":      { label: "Google Meet", color: "#ef4444", bg: "#ef444415" },
  zoom:               { label: "Zoom",         color: "#3b82f6", bg: "#3b82f615" },
  "microsoft-teams":  { label: "Teams",        color: "#8b5cf6", bg: "#8b5cf615" },
  whatsapp:           { label: "WhatsApp",     color: "#10b981", bg: "#10b98115" },
  "phone-call":       { label: "Phone Call",   color: "#f59e0b", bg: "#f59e0b15" },
};

// ─── SUBJECT COLORS ──────────────────────────────────────────
export const SUBJECT_COLORS = [
  "#2e8b57", "#3b82f6", "#ef4444", "#8b5cf6", "#f59e0b",
  "#10b981", "#ec4899", "#14b8a6", "#f97316", "#6366f1",
];

// ─── VIEW TABS ───────────────────────────────────────────────
export const VIEW_TABS: { key: ViewMode; label: string; icon: any }[] = [
  { key: "analytics", label: "Analytics",    icon: BarChart3  },
  { key: "list",      label: "All Bookings", icon: List       },
  { key: "calendar",  label: "Calendar",     icon: Calendar   },
];

// ─── DEFAULT FILTERS ─────────────────────────────────────────
export const DEFAULT_FILTERS: BookingFilters = {
  status:     "",
  type:       "",
  subject:    "",
  tutorId:    "",
  dateFrom:   "",
  dateTo:     "",
  minAmount:  "",
  maxAmount:  "",
};

// ─── CALENDAR DAYS ───────────────────────────────────────────
export const CALENDAR_DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
