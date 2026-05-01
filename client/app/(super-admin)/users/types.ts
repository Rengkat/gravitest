// ─── CORE ENUMS ─────────────────────────────────────────────
export type UserRole = "student" | "tutor" | "school_admin" | "super_admin";
export type UserStatus = "active" | "inactive" | "suspended" | "pending" | "deactivated";
export type SubscriptionTier = "free" | "basic" | "pro" | "premium" | "enterprise";
export type AccountType = "individual" | "school_based";
export type SortField =
  | "name" | "role" | "status" | "joinDate"
  | "lastActive" | "sessionsCompleted" | "totalSpent";
export type ViewMode = "table" | "grid" | "analytics";

// ─── ROLE-SPECIFIC PROFILES ──────────────────────────────────
export interface StudentProfile {
  schoolId?: string;
  schoolName?: string;
  className?: string;
  studentIdNumber?: string;
  examTargets: string[];
  subjectsEnrolled: string[];
  xpPoints: number;
  streak: number;
  averageScore: number;
  sessionsCompleted: number;
  totalStudyHours: number;
  rank?: number;
}

export interface TutorProfile {
  subjects: string[];
  qualifications: string[];
  yearsOfExperience: number;
  rating: number;
  ratingCount: number;
  totalSessionsConducted: number;
  totalStudentsTaught: number;
  hourlyRate?: number;
  bio?: string;
  isVerified: boolean;
  availabilityStatus: "available" | "busy" | "on_leave";
}

export interface SchoolAdminProfile {
  schoolId: string;
  schoolName: string;
  schoolType: "private" | "public" | "international";
  adminRole: "principal" | "vice_principal" | "admin" | "it_admin";
  managedClasses: string[];
  managedStudentCount: number;
  managedTeacherCount: number;
  subscriptionManaged: SubscriptionTier;
}

// ─── UNIFIED USER ────────────────────────────────────────────
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  accountType: AccountType;

  studentProfile?: StudentProfile;
  tutorProfile?: TutorProfile;
  schoolAdminProfile?: SchoolAdminProfile;

  joinDate: string;
  lastActive: string;
  totalLogins: number;
  deviceCount: number;
  lastDevice?: string;
  lastLocation?: string;

  subscriptionTier: SubscriptionTier;
  subscriptionStatus: "active" | "expired" | "cancelled" | "trial";
  subscriptionExpiry?: string;
  totalSpent: number;

  verificationStatus: "verified" | "unverified" | "pending";
  twoFactorEnabled: boolean;

  referralCode?: string;
  referredBy?: string;
  referralCount: number;

  notes?: string;
  tags: string[];
}

// ─── AGGREGATE STATS ────────────────────────────────────────
export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  pending: number;
  newThisMonth: number;
  churnRate: number;
  byRole: { students: number; tutors: number; schoolAdmins: number; superAdmins: number };
  byAccountType: { individual: number; schoolBased: number };
  bySubscription: Record<SubscriptionTier, number>;
  byStatus: Record<UserStatus, number>;
  averageSessionScore: number;
  totalRevenue: number;
  activeSubscriptions: number;
  verifiedUsers: number;
  studentAvgScore: number;
  tutorAvgRating: number;
  schoolAdminSchoolCount: number;
  registrationTrend: { month: string; count: number }[];
  topSchools: { name: string; count: number }[];
  topSubjects: { name: string; students: number }[];
}

// ─── FILTERS ────────────────────────────────────────────────
export interface UserFilters {
  role: UserRole | "";
  status: UserStatus | "";
  accountType: AccountType | "";
  subscriptionTier: SubscriptionTier | "";
  subscriptionStatus: string;
  verificationStatus: string;
  school: string;
  dateFrom: string;
  dateTo: string;
  minSessions: string;
  maxSessions: string;
}
