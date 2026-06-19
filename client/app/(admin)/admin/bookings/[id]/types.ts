// ─── ENUMS ─────────────────────────────────────────────────
export type BookingStatus = "upcoming" | "ongoing" | "completed" | "cancelled" | "no_show";
export type SessionType = "online" | "physical";
export type PaymentStatus = "paid" | "pending" | "refunded" | "failed";
export type PaymentMethod = "card" | "bank_transfer" | "wallet" | "cash";
export type BookingCategory = "single" | "package";

// ─── MODELS ────────────────────────────────────────────────
export interface ActivityLogEntry {
  action: string;
  date: string;
  actor: "student" | "tutor" | "system" | "admin";
}

export interface BookingFeedback {
  rating: number;
  comment: string;
  date: string;
}

export interface Booking {
  id: string | string[];
  bookingReference: string;

  // Participants
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  studentAvatar?: string;
  studentLevel?: string;
  studentAddress?: string;

  tutorId: string;
  tutorName: string;
  tutorEmail: string;
  tutorPhone: string;
  tutorAvatar?: string;
  tutorRating: number;
  tutorSpecialization: string[];

  // Session
  subject: string;
  topic: string;
  sessionTopic: string;
  date: string;
  time: string;
  endTime: string;
  duration: number;

  status: BookingStatus;
  type: SessionType;
  sessionType: BookingCategory;

  // Online
  meetingLink?: string;
  meetingPlatform?: string;
  meetingId?: string;

  // Physical
  location?: string;
  locationAddress?: string;
  travelFee?: number;
  distance?: number;

  // Financial
  price: number;
  discount: number;
  totalPaid: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  invoiceId: string;
  platformFee: number;
  tutorEarning: number;

  // Meta
  notes?: string;
  materials: string[];
  attendanceConfirmed: boolean;
  isFlagged: boolean;
  tags: string[];

  // Timestamps
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  cancelledAt?: string;
  completedAt?: string;

  feedback: BookingFeedback | null;
  activityLog: ActivityLogEntry[];
}

export type ActiveTab = "details" | "financial" | "activity";
