export interface Teacher {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  avatarUrl: string | null;
  role: "TEACHER" | "CLASS_ADMIN" | "HEAD_OF_DEPARTMENT";
  subjects: string[];
  assignedClasses: TeacherClassAssignment[];
  totalExams: number;
  averageStudentScore: number;
  passRate: number;
  isActive: boolean;
  lastActive: Date | null;
  joinedAt: Date;
}

export interface TeacherClassAssignment {
  classId: string;
  className: string;
  classArm: string | null;
  role: "CLASS_ADMIN" | "SUBJECT_TEACHER";
  subjects: string[];
  assignedAt: Date;
  isActive: boolean;
}

export interface TeacherInvitation {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "TEACHER" | "CLASS_ADMIN" | "HEAD_OF_DEPARTMENT";
  classIds: string[];
  invitedBy: string;
  token: string;
  status: "PENDING" | "ACCEPTED" | "EXPIRED";
  expiresAt: Date;
  createdAt: Date;
}

export interface TeacherFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: "TEACHER" | "CLASS_ADMIN" | "HEAD_OF_DEPARTMENT";
  classIds: string[];
  subjects: string[];
}

export interface TeacherFilters {
  search?: string;
  role?: string;
  classId?: string;
  subject?: string;
  status?: "active" | "inactive";
}
