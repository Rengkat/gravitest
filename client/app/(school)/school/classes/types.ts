export interface SchoolClass {
  id: string;
  schoolId: string;
  name: string;
  arm: string | null;
  year: number | null;
  description: string | null;
  classCode: string;
  pinHash: string;
  pinLastChangedAt: Date | null;
  defaultExamDurationMinutes: number;
  defaultQuestionCount: number;
  totalStudents: number;
  totalExamsCreated: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClassWithDetails extends SchoolClass {
  students?: ClassStudent[];
  classAdmins?: ClassAdmin[];
}

export interface ClassStudent {
  id: string;
  userId: string;
  studentProfileId: string;
  firstName: string;
  lastName: string;
  email: string;
  admissionNo: string | null;
  avatarUrl: string | null;
  joinedAt: Date;
  averageScore?: number;
}

export interface ClassAdmin {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  assignedAt: Date;
}

export interface CreateClassDto {
  name: string;
  arm?: string;
  year?: number;
  description?: string;
  defaultExamDurationMinutes?: number;
  defaultQuestionCount?: number;
}

export interface UpdateClassDto {
  name?: string;
  arm?: string;
  year?: number;
  description?: string;
  isActive?: boolean;
  defaultExamDurationMinutes?: number;
  defaultQuestionCount?: number;
}

export interface RotatePinDto {
  newPin: string;
}

export interface ClassFilters {
  search?: string;
  isActive?: boolean;
  sortBy?: "name" | "totalStudents" | "totalExamsCreated" | "createdAt";
  sortOrder?: "ASC" | "DESC";
}
