import { Gender, NigerianState, ExamType, UserRole, DeactivationType } from "@/utils/enums";

export interface StudentProfileData {
  id: string;
  currentSchool: string | null;
  currentClass: string | null;
  graduationYear: number | null;
  admissionNo: string | null;
  examTargets: ExamType[];
  examDate: Date | null;
  targetScore: number | null;
  targetUniversity: string | null;
  targetCourse: string | null;
  focusSubjects: string[];
  totalXp: number;
  level: number;
  levelTitle: string;
  totalBadges: number;
  streakShields: number;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: Date | null;
  averageScore: number;
  totalQuestionsAttempted: number;
  totalQuestionsCorrect: number;
  totalExamsTaken: number;
  totalMinutesStudied: number;
  bestScore: number | null;
  worstScore: number | null;
  subjectPerformance: Record<string, any> | null;
  examPerformance: Record<string, any> | null;
  leaderboardRank: number | null;
  percentileStanding: number | null;
  parentPhone: string | null;
  parentName: string | null;
  socialLinks: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  } | null;
}

export interface UserData {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  dateOfBirth: Date | null;
  gender: Gender | null;
  stateOfResidence: NigerianState | null;
  lga: string | null;
  avatarUrl: string | null;
  bio: string | null;
  role: UserRole;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  isOnboarded: boolean;
  lastLoginAt: Date | null;
  totalLoginCount: number;
  referralCode: string | null;
  referredByCode: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentWithUser {
  user: UserData;
  studentProfile: StudentProfileData;
}

export interface EditStudentFormData {
  firstName: string;
  middleName: string | null;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  dateOfBirth: Date | null;
  gender: Gender | null;
  stateOfResidence: NigerianState | null;
  lga: string | null;
  bio: string | null;
  currentSchool: string | null;
  currentClass: string | null;
  graduationYear: number | null;
  admissionNo: string | null;
  examTargets: ExamType[];
  examDate: Date | null;
  targetScore: number | null;
  targetUniversity: string | null;
  targetCourse: string | null;
  focusSubjects: string[];
  parentPhone: string | null;
  parentName: string | null;
}

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  performedBy: string;
  performedAt: Date;
  metadata?: Record<string, any>;
}
