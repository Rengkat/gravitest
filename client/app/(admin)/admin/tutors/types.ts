// ─── CORE ENUMS ─────────────────────────────────────────────
export type TutorStatus = "active" | "inactive" | "suspended" | "pending" | "on_leave";
export type VerificationLevel = "verified" | "unverified" | "pending" | "premium";
export type TutorCategory = "secondary" | "professional";
export type TeachingMode = "online" | "in_person" | "both";

export type TutorSpecialization =
  | "mathematics"
  | "english"
  | "physics"
  | "chemistry"
  | "biology"
  | "economics"
  | "government"
  | "literature"
  | "commerce"
  | "geography"
  | "history"
  | "french"
  | "yoruba"
  | "hausa"
  | "igbo"
  | "agriculture"
  | "technical_drawing"
  | "further_mathematics"
  | "computer_studies"
  | "civic_education"
  | "business_studies"
  | "home_economics"
  | "physical_education"
  | "music"
  | "fine_arts"
  | "accounting"
  | "nursing"
  | "hr_management"
  | "estate_management";

export type SortField =
  | "name"
  | "rating"
  | "students"
  | "sessions"
  | "earnings"
  | "experience"
  | "hourlyRate";

// ─── MODELS ─────────────────────────────────────────────────
export interface TutorPackage {
  name: string;
  duration: string;
  price: number;
  savings: number;
  popular?: boolean;
  sessions: number;
}

export interface Tutor {
  id: string;
  name: string;
  avatar?: string;
  title: string;
  email: string;
  phone: string;

  category: TutorCategory;
  specialization: TutorSpecialization[];
  subjects: string[];
  examTypes: string[];

  experience: number;
  education: string;
  certifications: string[];
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

  state: string;
  city: string;
  teachingMode: TeachingMode;
  availability: string[];
  languages: string[];

  totalEarnings: number;
  earningsThisMonth: number;
  platformCommission: number;

  tags: string[];
  achievements: string[];

  studentRetentionRate: number;
  repeatStudentRate: number;
  cancellationRate: number;
}

// ─── FILTERS ────────────────────────────────────────────────
export interface TutorFilters {
  status: TutorStatus | "";
  verification: VerificationLevel | "";
  specialization: string;
  state: string;
  teachingMode: TeachingMode | "";
  minRating: string;
  minExperience: string;
  maxExperience: string;
  minRate: string;
  maxRate: string;
  isOnline: string;
}

// ─── AGGREGATE STATS ─────────────────────────────────────────
export interface TutorStats {
  totalTutors: number;
  activeTutors: number;
  pendingVerification: number;
  suspendedTutors: number;
  onLeaveTutors: number;
  inactiveTutors: number;

  secondaryTutors: number;
  professionalTutors: number;

  onlineTutors: number;
  inPersonTutors: number;

  averageRating: number;
  averageHourlyRate: number;
  averageExperience: number;

  totalStudents: number;
  totalSessionsCompleted: number;
  totalRevenue: number;
  platformCommission: number;

  verifiedPercentage: number;
  featuredTutors: number;

  topSpecializations: { subject: string; count: number; color: string }[];
  tutorsByState: { state: string; count: number }[];
  tutorsByExperience: { range: string; count: number }[];
  monthlyOnboarding: { month: string; count: number }[];
  revenueByCategory: { category: string; revenue: number; count: number }[];
  performanceDistribution: { rating: string; count: number; color: string }[];
  teachingModeBreakdown: { mode: string; count: number; color: string }[];
}
