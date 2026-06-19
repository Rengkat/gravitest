// ─── ENUMS ──────────────────────────────────────────────────
export type BookingStatus =
  | "upcoming"
  | "ongoing"
  | "completed"
  | "cancelled"
  | "no_show"
  | "rescheduled"
  | "pending_confirmation";

export type BookingType = "online" | "physical";
export type SessionType = "single" | "package" | "subscription";
export type MeetingPlatform =
  | "google-meet"
  | "zoom"
  | "microsoft-teams"
  | "whatsapp"
  | "phone-call";

export type ViewMode = "analytics" | "list" | "calendar";
export type SortField = "date" | "price" | "duration" | "status";

// ─── MODELS ─────────────────────────────────────────────────
export interface BookingFeedback {
  rating: number;
  comment: string;
  date: string;
  studentRating?: number;
  tutorRating?: number;
}

export interface Booking {
  id: string;
  bookingReference: string;

  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  studentAvatar?: string;
  studentLevel?: string;

  tutorId: string;
  tutorName: string;
  tutorAvatar?: string;
  tutorEmail: string;
  tutorPhone: string;
  tutorRating: number;
  tutorSpecialization: string[];

  subject: string;
  topic: string;
  sessionTopic: string;
  date: string;
  time: string;
  endTime: string;
  duration: number;
  status: BookingStatus;
  type: BookingType;
  sessionType: SessionType;

  meetingLink?: string;
  meetingPlatform?: MeetingPlatform;
  meetingId?: string;
  meetingPassword?: string;

  location?: string;
  locationAddress?: string;
  locationLat?: number;
  locationLng?: number;
  studentAddress?: string;
  travelFee?: number;
  distance?: number;

  price: number;
  discount: number;
  totalPaid: number;
  paymentStatus: "paid" | "pending" | "refunded" | "partial_refund";
  paymentMethod: string;
  invoiceId: string;
  platformFee: number;
  tutorEarning: number;

  packageName?: string;
  packageSessionsTotal?: number;
  packageSessionsRemaining?: number;
  subscriptionId?: string;

  notes?: string;
  materials?: string[];
  homeworkAssigned?: string;
  topicsCovered?: string[];
  recordingUrl?: string;
  attendanceConfirmed: boolean;

  feedback?: BookingFeedback;

  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  cancelReason?: string;
  completedAt?: string;

  tags: string[];
  isFlagged: boolean;
  flagReason?: string;
}

// ─── FILTERS ────────────────────────────────────────────────
export interface BookingFilters {
  status: BookingStatus | "";
  type: BookingType | "";
  subject: string;
  tutorId: string;
  dateFrom: string;
  dateTo: string;
  minAmount: string;
  maxAmount: string;
}

// ─── STATS ──────────────────────────────────────────────────
export interface BookingStats {
  totalBookings: number;
  upcomingBookings: number;
  ongoingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  noShowBookings: number;

  onlineBookings: number;
  physicalBookings: number;

  totalRevenue: number;
  platformRevenue: number;
  tutorRevenue: number;
  averageBookingValue: number;

  completionRate: number;
  cancellationRate: number;
  noShowRate: number;
  averageRating: number;

  totalHours: number;
  totalStudents: number;
  totalTutors: number;

  topSubjects: { subject: string; count: number; revenue: number; color: string }[];
  topTutors: { name: string; bookings: number; revenue: number; rating: number }[];
  revenueByMonth: { month: string; revenue: number; bookings: number }[];
  bookingsByStatus: { status: string; count: number; color: string }[];
  bookingsByType: { type: string; count: number; color: string }[];
  hourlyDistribution: { hour: string; count: number }[];
  dailyDistribution: { day: string; count: number }[];
}
