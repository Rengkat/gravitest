// ─── ENUMS ───────────────────────────────────────────────────
export type TutorStatus       = "active" | "inactive" | "suspended" | "on_leave";
export type TeachingMode      = "online" | "in_person" | "both";
export type VerificationLevel = "verified" | "unverified" | "pending" | "premium";
export type ActiveTab         = "overview" | "sessions" | "reviews" | "earnings" | "documents";
export type SessionStatus     = "completed" | "upcoming" | "in_progress" | "cancelled";

// ─── NESTED MODELS ───────────────────────────────────────────
export interface TutorPackage {
  name: string;
  duration: string;
  price: number;
  savings: number;
  sessions: number;
  popular?: boolean;
}

export interface MonthlyBreakdown {
  month: string;
  earnings: number;
  sessions: number;
  students: number;
}

export interface SubjectEarning {
  subject: string;
  amount: number;
}

export interface TutorEarnings {
  totalEarnings: number;
  thisMonth: number;
  lastMonth: number;
  pendingPayout: number;
  nextPayoutDate: string;
  commissionRate: number;
  platformFees: number;
  netEarnings: number;
  monthlyBreakdown: MonthlyBreakdown[];
  earningsBySubject: SubjectEarning[];
}

export interface TutorSession {
  id: string;
  studentName: string;
  studentEmail: string;
  subject: string;
  date: string;
  time: string;
  duration: number; // minutes
  status: SessionStatus;
  amount: number;
  rating?: number;
  notes?: string;
}

export interface TutorReview {
  id: string;
  studentName: string;
  studentAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  subject: string;
  sessionType: string;
  helpful: number;
  response?: string;
  responseDate?: string;
}

// ─── MAIN MODEL ──────────────────────────────────────────────
export interface Tutor {
  id: string;
  name: string;
  avatar?: string;
  coverImage?: string;
  title: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;

  specialization: string[];
  subjects: string[];
  experience: number;
  education: string;
  certifications: string[];
  qualifications: string[];
  about: string;
  teachingStyle: string;

  status: TutorStatus;
  verificationLevel: VerificationLevel;
  rating: number;
  reviewCount: number;
  totalStudents: number;
  totalSessions: number;
  completionRate: number;
  responseTime: string;
  isOnline: boolean;
  isFeatured: boolean;
  isVerified: boolean;
  joinedDate: string;
  lastActive: string;

  hourlyRate: number;
  packages: TutorPackage[];

  availability: string[];
  timeSlots: string[];
  maxStudentsPerDay: number;
  preferredSessionDuration: number;

  languages: string[];
  state: string;
  city: string;
  teachingMode: TeachingMode;

  achievements: string[];
  tags: string[];

  bankName: string;
  accountNumber: string;
  accountName: string;

  earnings: TutorEarnings;
  recentSessions: TutorSession[];
  recentReviews: TutorReview[];

  studentRetentionRate: number;
  averageSessionRating: number;
  repeatStudentRate: number;
  cancellationRate: number;

  cvUrl?: string;
  idCardUrl?: string;
  certificateUrls: string[];
  profileCompleted: number;
}
