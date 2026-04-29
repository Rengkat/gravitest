export type BookingStatus = "upcoming" | "ongoing" | "completed" | "cancelled" | "rescheduled";
export type BookingType = "online" | "physical"; // online = book, physical = hire

export interface BookingFeedback {
  rating: number;
  comment: string;
  date: string;
}

export interface Booking {
  id: string;
  tutorId: string;
  tutorName: string;
  tutorAvatar: string;
  tutorRating: number;
  subject: string;
  topic: string;
  date: string;
  time: string;
  duration: number; // hours
  price: number;    // NGN
  status: BookingStatus;
  type: BookingType;
  // Online-only
  meetingLink?: string;
  meetingPlatform?: "google-meet" | "zoom" | "teams";
  // Physical (hire) only
  location?: string;
  locationAddress?: string;
  locationLat?: number;
  locationLng?: number;
  studentAddress?: string; // where student inputted for matching
  travelFee?: number;
  // Shared
  notes?: string;
  sessionTopic?: string;
  materials?: string[];
  feedback?: BookingFeedback;
  packageName?: string;
  invoiceId?: string;
}

export interface BookingFilters {
  searchQuery: string;
  status: BookingStatus | "all";
  type: BookingType | "all";
  tab: "upcoming" | "past" | "all";
}

export interface BookingAnalytics {
  totalBookings: number;
  totalSpent: number;
  averageRating: number;
  completionRate: number;
  hoursLearned: number;
  favoriteSubject: string;
  monthlyTrend: { month: string; bookings: number; hours: number; amount: number }[];
  subjectDistribution: { subject: string; count: number; percentage: number }[];
  performanceBySubject: { subject: string; score: number; improvement: number }[];
}

// ── New booking request flow ─────────────────────────────────────────────────

export type NewBookingMode = "online" | "physical"; // user chooses

export interface NewBookingForm {
  mode: NewBookingMode;
  tutorId: string;
  subject: string;
  topic: string;
  date: string;
  time: string;
  packageName: string;
  notes: string;
  // Physical only
  studentAddress: string;
  studentCity: string;
  studentState: string;
  // Online only
  meetingPlatform: "google-meet" | "zoom" | "teams";
}
