import { BOOKING_STATUS_CONFIG, SUBJECT_COLORS } from "./constants";
import type { Booking, BookingStats, BookingStatus, BookingType, MeetingPlatform, SessionType } from "./types";

const TUTORS = [
  { id: "t1", name: "Dr. Adebayo Ola",      email: "adebayo@graviest.com",    phone: "+2348012345678", rating: 4.9, spec: ["Mathematics", "Physics"]   },
  { id: "t2", name: "Prof. Chukwuma Eze",   email: "chukwuma@graviest.com",   phone: "+2348023456789", rating: 4.8, spec: ["Physics", "Mathematics"]   },
  { id: "t3", name: "Mrs. Grace Okonkwo",   email: "grace@graviest.com",      phone: "+2348034567890", rating: 4.9, spec: ["Chemistry", "Biology"]     },
  { id: "t4", name: "Mr. Segun Adeyemi",    email: "segun@graviest.com",      phone: "+2348045678901", rating: 4.7, spec: ["English", "Literature"]    },
  { id: "t5", name: "Dr. Funmilayo Adebayo",email: "funmilayo@graviest.com",  phone: "+2348056789012", rating: 4.8, spec: ["Economics", "Government"]  },
];

const STUDENTS = [
  { id: "s1", name: "Oluwaseun Adebayo", email: "oluwaseun@email.com", phone: "+2348111111111" },
  { id: "s2", name: "Chioma Eze",        email: "chioma@email.com",    phone: "+2348222222222" },
  { id: "s3", name: "Emeka Nwachukwu",   email: "emeka@email.com",     phone: "+2348333333333" },
  { id: "s4", name: "Fatima Suleiman",   email: "fatima@email.com",    phone: "+2348444444444" },
  { id: "s5", name: "Tunde Bakare",      email: "tunde@email.com",     phone: "+2348555555555" },
];

const STATUSES: BookingStatus[] = [
  "upcoming","upcoming","upcoming","ongoing",
  "completed","completed","completed",
  "cancelled","no_show","rescheduled","pending_confirmation",
];
const TYPES: BookingType[] = ["online","online","online","physical"];
const SUBJECTS = ["Mathematics","Physics","Chemistry","Biology","English","Economics","Government","Literature"];
const TOPIC_SUFFIXES = ["Advanced Concepts","Exam Preparation","Practical Applications","Theory & Practice","Problem Solving"];
const LOCATIONS = ["Ikeja, Lagos","Surulere, Lagos","Wuse, Abuja","Ibadan"];
const LEVELS = ["SS1","SS2","SS3","JSS3"];
const PLATFORMS: MeetingPlatform[] = ["google-meet","zoom","microsoft-teams"];
const SESSION_TYPES: SessionType[] = ["single","package","subscription"];
const PACKAGE_NAMES = ["Single Session","5 Sessions Pack","10 Sessions Pack","Monthly Plan"];
const CANCEL_REASONS = ["Schedule conflict","Emergency","Tutor unavailable","Technical issues"];
const FEEDBACK_COMMENTS = ["Excellent session!","Very helpful and clear","Great tutor, learned a lot","Good but could be more detailed"];
const PAYMENT_METHODS = ["card","bank_transfer","wallet"];
const DURATIONS = [0.5,1,1,1,1.5,2];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function rand(n: number) { return Math.floor(Math.random() * n); }
function maybe<T>(val: T, chance = 0.5): T | undefined { return Math.random() > chance ? val : undefined; }

export function generateMockBookings(count: number): Booking[] {
  return Array.from({ length: count }, (_, i) => {
    const status = pick(STATUSES);
    const type = pick(TYPES);
    const tutor = pick(TUTORS);
    const student = pick(STUDENTS);
    const subject = pick(SUBJECTS);
    const price = rand(20000) + 5000;
    const platformFee = Math.round(price * 0.2);
    const discount = Math.random() > 0.7 ? Math.floor(price * 0.1) : 0;
    const date = new Date(2025, rand(3), rand(28) + 1);
    const hour = 8 + rand(12);
    const duration = pick(DURATIONS);
    const dateStr = date.toISOString().split("T")[0];

    return {
      id: `bk_${(i + 1).toString().padStart(5, "0")}`,
      bookingReference: `GRA-${date.getFullYear()}-${(i + 1).toString().padStart(4, "0")}`,

      studentId: student.id,
      studentName: student.name,
      studentEmail: student.email,
      studentPhone: student.phone,
      studentAvatar: `https://i.pravatar.cc/80?u=stu${i}`,
      studentLevel: pick(LEVELS),

      tutorId: tutor.id,
      tutorName: tutor.name,
      tutorAvatar: `https://i.pravatar.cc/80?u=tutor${TUTORS.indexOf(tutor)}`,
      tutorEmail: tutor.email,
      tutorPhone: tutor.phone,
      tutorRating: tutor.rating,
      tutorSpecialization: tutor.spec,

      subject,
      topic: `${subject} - ${pick(TOPIC_SUFFIXES)}`,
      sessionTopic: `${subject} Session`,
      date: dateStr,
      time: `${hour}:00 ${hour >= 12 ? "PM" : "AM"}`,
      endTime: `${hour + Math.ceil(duration)}:00 ${hour + Math.ceil(duration) >= 12 ? "PM" : "AM"}`,
      duration,
      status,
      type,
      sessionType: pick(SESSION_TYPES),

      meetingLink:     type === "online" ? `https://meet.google.com/${Math.random().toString(36).substr(2, 10)}` : undefined,
      meetingPlatform: type === "online" ? pick(PLATFORMS) : undefined,

      location:        type === "physical" ? pick(LOCATIONS) : undefined,
      locationAddress: type === "physical" ? `${rand(100)} Main Street` : undefined,
      studentAddress:  type === "physical" ? `${rand(100)} Student Avenue` : undefined,
      travelFee:       type === "physical" ? rand(3000) + 1000 : undefined,

      price,
      discount,
      totalPaid: price - discount,
      paymentStatus: status === "cancelled" ? "refunded" : "paid",
      paymentMethod: pick(PAYMENT_METHODS),
      invoiceId: `INV-2025-${(i + 1).toString().padStart(3, "0")}`,
      platformFee,
      tutorEarning: price - platformFee,

      packageName:              maybe(pick(PACKAGE_NAMES)),
      packageSessionsTotal:     maybe(rand(10) + 1),
      packageSessionsRemaining: maybe(rand(8)),

      notes:            maybe("Please focus on exam-style questions"),
      materials:        maybe(["Practice Worksheet","Formula Sheet","Past Questions"]),
      homeworkAssigned: maybe("Complete practice problems 1-10", 0.6),
      topicsCovered:    status === "completed" ? ["Topic A","Topic B","Topic C"] : undefined,
      recordingUrl:     status === "completed" && type === "online"
        ? `https://recordings.graviest.com/${Math.random().toString(36).substr(2, 8)}`
        : undefined,
      attendanceConfirmed: status === "completed" || status === "ongoing",

      feedback: status === "completed"
        ? {
            rating:  rand(2) + 4,
            comment: pick(FEEDBACK_COMMENTS),
            date:    new Date(date.getTime() + 86400000).toISOString().split("T")[0],
          }
        : undefined,

      createdAt:   new Date(date.getTime() - 7 * 86400000).toISOString().split("T")[0],
      updatedAt:   dateStr,
      confirmedAt: maybe(new Date(date.getTime() - 3 * 86400000).toISOString().split("T")[0], 0.2),
      cancelledAt: status === "cancelled" ? new Date(date.getTime() - 86400000).toISOString().split("T")[0] : undefined,
      cancelledBy:  status === "cancelled" ? pick(["student","tutor","admin"]) : undefined,
      cancelReason: status === "cancelled" ? pick(CANCEL_REASONS) : undefined,

      tags: [],
      isFlagged:  Math.random() > 0.9,
      flagReason: Math.random() > 0.9 ? "Payment dispute" : undefined,
    };
  });
}

export function generateBookingStats(bookings: Booking[]): BookingStats {
  const totalRevenue = bookings.reduce((s, b) => s + b.totalPaid, 0);
  const withFeedback = bookings.filter((b) => b.feedback);

  return {
    totalBookings:     bookings.length,
    upcomingBookings:  bookings.filter((b) => b.status === "upcoming").length,
    ongoingBookings:   bookings.filter((b) => b.status === "ongoing").length,
    completedBookings: bookings.filter((b) => b.status === "completed").length,
    cancelledBookings: bookings.filter((b) => b.status === "cancelled").length,
    noShowBookings:    bookings.filter((b) => b.status === "no_show").length,
    onlineBookings:    bookings.filter((b) => b.type === "online").length,
    physicalBookings:  bookings.filter((b) => b.type === "physical").length,

    totalRevenue,
    platformRevenue:     Math.round(totalRevenue * 0.2),
    tutorRevenue:        Math.round(totalRevenue * 0.8),
    averageBookingValue: bookings.length > 0 ? Math.round(totalRevenue / bookings.length) : 0,

    completionRate:  bookings.length > 0 ? Math.round((bookings.filter((b) => b.status === "completed").length / bookings.length) * 100) : 0,
    cancellationRate:bookings.length > 0 ? Math.round((bookings.filter((b) => b.status === "cancelled").length / bookings.length) * 100) : 0,
    noShowRate:      bookings.length > 0 ? Math.round((bookings.filter((b) => b.status === "no_show").length / bookings.length) * 100) : 0,
    averageRating:   withFeedback.length > 0
      ? parseFloat((withFeedback.reduce((s, b) => s + (b.feedback?.rating ?? 0), 0) / withFeedback.length).toFixed(1))
      : 0,

    totalHours:   Math.round(bookings.reduce((s, b) => s + b.duration, 0)),
    totalStudents: new Set(bookings.map((b) => b.studentId)).size,
    totalTutors:   new Set(bookings.map((b) => b.tutorId)).size,

    topSubjects: ["Mathematics","Physics","Chemistry","English","Economics"].map((subject, i) => ({
      subject,
      count:   bookings.filter((b) => b.subject === subject).length,
      revenue: bookings.filter((b) => b.subject === subject).reduce((s, b) => s + b.totalPaid, 0),
      color:   SUBJECT_COLORS[i],
    })),

    topTutors: Array.from(new Set(bookings.map((b) => b.tutorName))).slice(0, 5).map((name) => {
      const tutorBookings = bookings.filter((b) => b.tutorName === name);
      const tutorWithFeedback = tutorBookings.filter((b) => b.feedback);
      return {
        name,
        bookings: tutorBookings.length,
        revenue:  tutorBookings.reduce((s, b) => s + b.totalPaid, 0),
        rating:   tutorWithFeedback.length > 0
          ? parseFloat((tutorWithFeedback.reduce((s, b) => s + (b.feedback?.rating ?? 0), 0) / tutorWithFeedback.length).toFixed(1))
          : 0,
      };
    }),

    revenueByMonth: ["Jan","Feb","Mar"].map((month) => ({
      month,
      revenue:  Math.floor(Math.random() * 500000 + 200000),
      bookings: Math.floor(Math.random() * 30 + 15),
    })),

    bookingsByStatus: Object.entries(BOOKING_STATUS_CONFIG).map(([key, config]) => ({
      status: config.label,
      count:  bookings.filter((b) => b.status === key).length,
      color:  config.text,
    })),

    bookingsByType: [
      { type: "Online",   count: bookings.filter((b) => b.type === "online").length,   color: "#3b82f6" },
      { type: "Physical", count: bookings.filter((b) => b.type === "physical").length, color: "#10b981" },
    ],

    hourlyDistribution: Array.from({ length: 12 }, (_, i) => ({
      hour:  `${8 + i}:00`,
      count: Math.floor(Math.random() * 20 + 5),
    })),

    dailyDistribution: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day) => ({
      day,
      count: Math.floor(Math.random() * 30 + 10),
    })),
  };
}
