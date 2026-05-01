import {
  GraduationCap, BookOpen, School, ShieldCheck,
  Crown, Gift, Zap, Star, Shield,
  UserCheck, UserX, Clock, AlertCircle, UserMinus,
} from "lucide-react";
import type { UserRole, UserStatus, SubscriptionTier, AccountType } from "./types";

// ─── ROLE CONFIG ─────────────────────────────────────────────
export const ROLE_CONFIG: Record<
  UserRole,
  { label: string; icon: any; color: string; bg: string; description: string }
> = {
  student: {
    label: "Student",
    icon: GraduationCap,
    color: "#0284c7",
    bg: "#0284c715",
    description: "Learner preparing for exams",
  },
  tutor: {
    label: "Tutor",
    icon: BookOpen,
    color: "#8b5cf6",
    bg: "#8b5cf615",
    description: "Subject expert and content creator",
  },
  school_admin: {
    label: "School Admin",
    icon: School,
    color: "#f59e0b",
    bg: "#f59e0b15",
    description: "Manages school account and users",
  },
  super_admin: {
    label: "Super Admin",
    icon: ShieldCheck,
    color: "#ef4444",
    bg: "#ef444415",
    description: "Full platform access",
  },
};

// ─── STATUS CONFIG ───────────────────────────────────────────
export const STATUS_CONFIG: Record<
  UserStatus,
  { label: string; icon: any; color: string; bg: string }
> = {
  active:      { label: "Active",      icon: UserCheck,  color: "#10b981", bg: "#10b98115" },
  inactive:    { label: "Inactive",    icon: UserX,      color: "#6b7280", bg: "#6b728015" },
  suspended:   { label: "Suspended",   icon: AlertCircle,color: "#ef4444", bg: "#ef444415" },
  pending:     { label: "Pending",     icon: Clock,      color: "#f59e0b", bg: "#f59e0b15" },
  deactivated: { label: "Deactivated", icon: UserMinus,  color: "#9ca3af", bg: "#9ca3af15" },
};

// ─── SUBSCRIPTION CONFIG ─────────────────────────────────────
export const SUBSCRIPTION_CONFIG: Record<
  SubscriptionTier,
  { label: string; icon: any; color: string; bg: string; price: string }
> = {
  free:       { label: "Free",       icon: Gift,   color: "#6b7280", bg: "#6b728015", price: "₦0"           },
  basic:      { label: "Basic",      icon: Zap,    color: "#3b82f6", bg: "#3b82f615", price: "₦2,500/mo"    },
  pro:        { label: "Pro",        icon: Star,   color: "#8b5cf6", bg: "#8b5cf615", price: "₦8,000/mo"    },
  premium:    { label: "Premium",    icon: Crown,  color: "#f59e0b", bg: "#f59e0b15", price: "₦15,000/mo"   },
  enterprise: { label: "Enterprise", icon: Shield, color: "#ef4444", bg: "#ef444415", price: "Custom"        },
};

// ─── ACCOUNT TYPE CONFIG ─────────────────────────────────────
export const ACCOUNT_TYPE_CONFIG: Record<
  AccountType,
  { label: string; color: string; bg: string }
> = {
  individual:   { label: "Individual",   color: "#2e8b57", bg: "#2e8b5715" },
  school_based: { label: "School-Based", color: "#7c3aed", bg: "#7c3aed15" },
};

// ─── VERIFICATION CONFIG ─────────────────────────────────────
export const VERIFICATION_CONFIG = {
  verified:   { label: "Verified",   color: "#10b981", bg: "#10b98115" },
  unverified: { label: "Unverified", color: "#6b7280", bg: "#6b728015" },
  pending:    { label: "Pending",    color: "#f59e0b", bg: "#f59e0b15" },
} as const;

// ─── NIGERIAN SCHOOLS (for filter) ───────────────────────────
export const EXAM_TARGETS = ["JAMB", "WAEC", "NECO", "NABTEB", "BECE", "ICAN", "NMCN", "CIPM"];

export const SUBJECTS = [
  "Mathematics", "English", "Physics", "Chemistry", "Biology",
  "Economics", "Government", "Literature", "Commerce", "Geography",
  "Accounting", "Further Mathematics", "Agricultural Science",
];

export const SCHOOL_NAMES = [
  "Lagos Preparatory School", "Abuja International Academy",
  "Ibadan Grammar School", "Port Harcourt High School",
  "Enugu College of Excellence", "Kaduna Unity School",
];

export const TUTOR_QUALIFICATIONS = [
  "B.Sc Education", "M.Sc Mathematics", "PhD Physics",
  "B.Ed English", "PGDE", "NCE",
];
