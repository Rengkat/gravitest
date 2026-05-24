import { School } from '../entities/school.entity';
import { SchoolClass } from '../entities/school-class.entity';

// ─── School Overview (dashboard) ──────────────────────────────────────────────

export interface SchoolOverview {
  school: School;
  stats: {
    totalStudents: number;
    totalClasses: number;
    activeClasses: number;
    averageScore: number;
    passRate: number;
    completionRate: number;
    topPerformerScore: number;
    activeSessions: number;
    newStudentsThisMonth: number;
  };
  topPerformers: {
    studentProfileId: string;
    name: string;
    avatarUrl: string | null;
    score: number;
    className: string;
    improvement: number;
  }[];
  weakSubjects: {
    subject: string;
    averageScore: number;
    studentCount: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  recentActivity: {
    type: 'exam' | 'enrollment' | 'class';
    description: string;
    detail: string;
    createdAt: Date;
  }[];
}

// ─── Class with student count ──────────────────────────────────────────────────

export interface ClassWithStats extends SchoolClass {
  studentCount: number;
  averageScore: number;
  examCount: number;
}

// ─── PIN verify result ────────────────────────────────────────────────────────

export interface PinVerifyResult {
  valid: boolean;
  schoolClass?: {
    id: string;
    name: string;
    schoolId: string;
    classCode: string;
    defaultExamDurationMinutes: number;
    defaultQuestionCount: number;
  };
}
