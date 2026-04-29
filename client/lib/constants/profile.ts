import { User, Shield, Bell, Link as LinkIcon, CreditCard, GraduationCap } from "lucide-react";
import { UserProfile, NotificationSettings, ActiveSession, ProfileSection } from "@/types/profile";

export const MOCK_USER: UserProfile = {
  id: "1",
  firstName: "Adaeze",
  lastName: "Okonkwo",
  middleName: "Chiamaka",
  email: "adaeze.okonkwo@example.com",
  phoneNumber: "+2348012345678",
  role: "student",
  avatarUrl: null,
  dateOfBirth: "2005-08-14",
  gender: "female",
  stateOfResidence: "Lagos",
  lga: "Surulere",
  bio: "Aspiring Computer Scientist. Passionate about technology and education. Currently preparing for JAMB and WAEC examinations.",
  isEmailVerified: true,
  isPhoneVerified: true,
  createdAt: "2024-01-15T10:00:00Z",
  lastLoginAt: "2024-01-20T08:30:00Z",
  // Academic
  currentClass: "SSS 3",
  targetExams: ["JAMB", "WAEC"],
  school: "Queens College Lagos",
  aspirations: "Computer Science at University of Lagos",
  // Stats
  totalXP: 4820,
  level: 12,
  streak: 8,
  completedSessions: 24,
  rank: 156,
};

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  emailNotifications: true,
  pushNotifications: true,
  smsNotifications: false,
  marketingEmails: false,
  sessionReminders: true,
  achievementAlerts: true,
  weeklyReport: true,
  newResourceAlerts: true,
};

export const ACTIVE_SESSIONS: ActiveSession[] = [
  {
    id: "s1",
    device: "Desktop",
    browser: "Chrome",
    location: "Lagos, Nigeria",
    lastActive: "Now",
    isCurrent: true,
  },
  {
    id: "s2",
    device: "Mobile",
    browser: "Safari",
    location: "Lagos, Nigeria",
    lastActive: "2 hours ago",
    isCurrent: false,
  },
  {
    id: "s3",
    device: "Desktop",
    browser: "Firefox",
    location: "Abuja, Nigeria",
    lastActive: "Yesterday",
    isCurrent: false,
  },
];

export const SECTION_NAV: {
  id: ProfileSection;
  label: string;
  icon: any;
  description: string;
}[] = [
  { id: "profile", label: "Profile", icon: User, description: "Personal information" },
  {
    id: "academic",
    label: "Academic Info",
    icon: GraduationCap,
    description: "School & exam goals",
  },
  { id: "security", label: "Security", icon: Shield, description: "Password & 2FA" },
  { id: "notifications", label: "Notifications", icon: Bell, description: "Alert preferences" },
  { id: "connected", label: "Connected", icon: LinkIcon, description: "Social accounts" },
  { id: "billing", label: "Billing", icon: CreditCard, description: "Plan & payments" },
];

export const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT Abuja",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

export const CLASS_OPTIONS = [
  "SSS 1",
  "SSS 2",
  "SSS 3",
  "JSS 1",
  "JSS 2",
  "JSS 3",
  "University Level",
  "Post-Secondary",
];

export const EXAM_OPTIONS = ["JAMB", "WAEC", "NECO", "NABTEB", "GCE", "Cambridge IGCSE"];

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getInitials(user: UserProfile): string {
  return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
}

export function getAge(dob: string): number {
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
}

export function getMemberDuration(createdAt: string): string {
  const months = Math.floor(
    (Date.now() - new Date(createdAt).getTime()) / (30 * 24 * 60 * 60 * 1000),
  );
  if (months < 1) return "Less than a month";
  if (months === 1) return "1 month";
  if (months < 12) return `${months} months`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? "s" : ""}`;
}

export function getXPToNextLevel(level: number): number {
  return level * 500;
}

export function getRoleBadgeConfig(role: UserProfile["role"]) {
  const map = {
    student: {
      label: "Student",
      bg: "bg-green-100",
      text: "text-green-700",
      border: "border-green-200",
    },
    tutor: { label: "Tutor", bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" },
    school_admin: {
      label: "School Admin",
      bg: "bg-purple-100",
      text: "text-purple-700",
      border: "border-purple-200",
    },
    super_admin: {
      label: "Super Admin",
      bg: "bg-red-100",
      text: "text-red-700",
      border: "border-red-200",
    },
  };
  return map[role] ?? map.student;
}

export function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak", color: "bg-red-500" };
  if (score <= 2) return { score, label: "Fair", color: "bg-orange-500" };
  if (score <= 3) return { score, label: "Good", color: "bg-amber-500" };
  if (score <= 4) return { score, label: "Strong", color: "bg-emerald-500" };
  return { score, label: "Very Strong", color: "bg-green-500" };
}
