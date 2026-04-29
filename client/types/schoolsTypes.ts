// ─── ENUMS ──────────────────────────────────────────────────
export type SchoolType = "private" | "public" | "international";
export type SchoolStatus = "active" | "inactive" | "suspended" | "pending";
export type SubscriptionPlan = "free" | "basic" | "pro" | "enterprise";
export type TermType = "first" | "second" | "third";
export type SortField = "name" | "students" | "classes" | "performance" | "subscription";

// ─── NESTED TYPES ───────────────────────────────────────────
export interface SchoolLocation {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  coordinates?: { lat: number; lng: number };
}

export interface SchoolSubject {
  id: string;
  name: string;
  code: string;
  category: "science" | "arts" | "commercial" | "vocational";
  totalQuestions: number;
  teachers: string[];
}

export interface SchoolClass {
  id: string;
  name: string;
  level: string;
  stream?: string;
  totalStudents: number;
  classAdmin: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  subjects: SchoolSubject[];
  sessionsCompleted: number;
  averageScore: number;
  status: "active" | "inactive";
}

export interface SchoolAdmin {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "principal" | "vice_principal" | "admin" | "it_admin";
  lastActive: string;
  status: "active" | "inactive";
}

export interface SchoolStats {
  totalStudents: number;
  activeStudents: number;
  totalClasses: number;
  totalTeachers: number;
  totalAdmins: number;
  sessionsCompleted: number;
  averagePerformance: number;
  subscriptionUsage: number;
  questionsAttempted: number;
  totalSpent: number;
  loginRate: number;
  completionRate: number;
}

export interface SchoolData {
  id: string;
  name: string;
  code: string;
  type: SchoolType;
  status: SchoolStatus;
  location: SchoolLocation;
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  subscription: {
    plan: SubscriptionPlan;
    status: "active" | "expired" | "cancelled" | "trial";
    startDate: string;
    expiryDate: string;
    maxStudents: number;
    maxClasses: number;
    features: string[];
  };
  stats: SchoolStats;
  classes: SchoolClass[];
  admins: SchoolAdmin[];
  foundedYear: number;
  motto?: string;
  logo?: string;
  accreditation: string[];
  facilities: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── FILTER STATE ───────────────────────────────────────────
export interface SchoolFilters {
  type: SchoolType | "";
  status: SchoolStatus | "";
  state: string;
  plan: SubscriptionPlan | "";
  minStudents: string;
  maxStudents: string;
  foundedFrom: string;
  foundedTo: string;
}
