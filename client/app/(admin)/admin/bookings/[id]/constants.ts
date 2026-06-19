import {
  Calendar, Play, CheckCircle, XCircle, UserX,
  BookOpen, DollarSign, Activity,
} from "lucide-react";
import type { BookingStatus } from "./types";

// ─── STATUS CONFIG ───────────────────────────────────────────
export const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; icon: any; bg: string; text: string }
> = {
  upcoming:  { label: "Upcoming",  icon: Calendar,     bg: "#3b82f615", text: "#3b82f6" },
  ongoing:   { label: "Ongoing",   icon: Play,         bg: "#f59e0b15", text: "#f59e0b" },
  completed: { label: "Completed", icon: CheckCircle,  bg: "#10b98115", text: "#10b981" },
  cancelled: { label: "Cancelled", icon: XCircle,      bg: "#ef444415", text: "#ef4444" },
  no_show:   { label: "No Show",   icon: UserX,        bg: "#6b728015", text: "#6b7280" },
};

// ─── TABS CONFIG ─────────────────────────────────────────────
export const DETAIL_TABS = [
  { key: "details"   as const, label: "Session Details", icon: BookOpen   },
  { key: "financial" as const, label: "Financial Info",  icon: DollarSign },
  { key: "activity"  as const, label: "Activity Log",    icon: Activity   },
];

// ─── MOCK DATA ───────────────────────────────────────────────
export function getMockBooking(id: string | string[]) {
  return {
    id,
    bookingReference: "GRA-2025-0042",
    studentId: "s1",
    studentName: "Oluwaseun Adebayo",
    studentEmail: "oluwaseun@email.com",
    studentPhone: "+2348111111111",
    studentAvatar: "https://i.pravatar.cc/80?u=stu1",
    studentLevel: "SS3",
    tutorId: "t1",
    tutorName: "Dr. Adebayo Ola",
    tutorAvatar: "https://i.pravatar.cc/80?u=tutor1",
    tutorEmail: "adebayo@graviest.com",
    tutorPhone: "+2348012345678",
    tutorRating: 4.9,
    tutorSpecialization: ["Mathematics", "Physics"],
    subject: "Mathematics",
    topic: "Calculus - Differentiation",
    sessionTopic: "Advanced Calculus Techniques",
    date: "2025-03-20",
    time: "10:00 AM",
    endTime: "11:30 AM",
    duration: 1.5,
    status: "upcoming" as const,
    type: "online" as const,
    sessionType: "single" as const,
    meetingLink: "https://meet.google.com/abc-defg-hij",
    meetingPlatform: "google-meet",
    meetingId: "abc-defg-hij",
    price: 15000,
    discount: 0,
    totalPaid: 15000,
    paymentStatus: "paid" as const,
    paymentMethod: "card" as const,
    invoiceId: "INV-2025-042",
    platformFee: 3000,
    tutorEarning: 12000,
    notes: "Focus on differentiation rules and chain rule applications",
    materials: ["Practice Worksheet", "Formula Sheet"],
    attendanceConfirmed: false,
    createdAt: "2025-03-13",
    updatedAt: "2025-03-13",
    confirmedAt: "2025-03-14",
    isFlagged: false,
    tags: [],
    feedback: null,
    activityLog: [
      { action: "Booking Created",   date: "2025-03-13 14:30", actor: "student" as const },
      { action: "Payment Received",  date: "2025-03-13 14:31", actor: "system"  as const },
      { action: "Booking Confirmed", date: "2025-03-14 09:00", actor: "tutor"   as const },
    ],
  };
}
