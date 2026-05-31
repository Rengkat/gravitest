import type { User } from "../../types";
import type { ActivityLogEntry, PaymentRecord } from "./types";

// ─── Seed a realistic User from an ID ────────────────────────────────────────

export function mockUserById(userId: string): User {
  const seed = userId.charCodeAt(userId.length - 1) % 4;

  const base = {
    id: userId,
    phone: `0803${userId.slice(-7).padStart(7, "0")}`,
    joinDate: "15 Mar 2024",
    lastActive: "27 May 2025",
    totalLogins: 184,
    deviceCount: 2,
    lastDevice: "Chrome / Android",
    lastLocation: "Lagos, Nigeria",
    subscriptionStatus: "active" as const,
    subscriptionExpiry: "2025-12-31",
    twoFactorEnabled: true,
    referralCode: `GRV-${userId.slice(-4).toUpperCase()}`,
    referralCount: 3,
    tags: ["high-engagement"],
    verificationStatus: "verified" as const,
  };

  if (seed === 0) {
    return {
      ...base,
      firstName: "Chukwuemeka",
      lastName: "Okonkwo",
      email: `c.okonkwo.${userId}@gmail.com`,
      avatar: undefined,
      role: "student",
      status: "active",
      accountType: "school_based",
      subscriptionTier: "premium",
      totalSpent: 36_000,
      notes: "High-performing student. Flagged for scholarship review.",
      studentProfile: {
        schoolId: "sch-001",
        schoolName: "Command Secondary School, Lagos",
        className: "SS2 Science",
        studentIdNumber: "CSS/2024/1042",
        examTargets: ["WAEC", "NECO", "JAMB"],
        subjectsEnrolled: ["Mathematics", "Physics", "Chemistry", "Biology", "English"],
        xpPoints: 12_450,
        streak: 18,
        averageScore: 78,
        sessionsCompleted: 214,
        totalStudyHours: 320,
        rank: 4,
      },
    };
  }

  if (seed === 1) {
    return {
      ...base,
      firstName: "Adaeze",
      lastName: "Nwachukwu",
      email: `adaeze.nwachukwu.${userId}@tutors.ng`,
      avatar: undefined,
      role: "tutor",
      status: "active",
      accountType: "individual",
      subscriptionTier: "enterprise",
      totalSpent: 0,
      twoFactorEnabled: true,
      notes: "Top-rated Mathematics tutor. Contract renewal due Q3.",
      tutorProfile: {
        subjects: ["Mathematics", "Physics", "Further Mathematics"],
        qualifications: ["B.Sc Mathematics (UNILAG)", "PGDE", "NCE"],
        yearsOfExperience: 7,
        rating: 4.9,
        ratingCount: 312,
        totalSessionsConducted: 890,
        totalStudentsTaught: 430,
        hourlyRate: 8_500,
        bio: "Passionate educator focused on exam excellence.",
        isVerified: true,
        availabilityStatus: "available",
      },
    };
  }

  if (seed === 2) {
    return {
      ...base,
      firstName: "Babatunde",
      lastName: "Fashola",
      email: `b.fashola.${userId}@loyola.edu.ng`,
      avatar: undefined,
      role: "school_admin",
      status: "suspended",
      accountType: "school_based",
      subscriptionTier: "enterprise",
      totalSpent: 480_000,
      twoFactorEnabled: false,
      verificationStatus: "pending",
      notes: "Account suspended pending payment verification.",
      schoolAdminProfile: {
        schoolId: "sch-007",
        schoolName: "Loyola Jesuit College, Ibadan",
        schoolType: "private",
        adminRole: "principal",
        managedClasses: ["JSS1A","JSS1B","JSS2A","JSS2B","JSS3","SS1","SS2","SS3"],
        managedStudentCount: 1_240,
        managedTeacherCount: 68,
        subscriptionManaged: "enterprise",
      },
    };
  }

  return {
    ...base,
    firstName: "Ngozi",
    lastName: "Eze",
    email: `ngozi.eze.${userId}@gmail.com`,
    avatar: undefined,
    role: "student",
    status: "pending",
    accountType: "individual",
    subscriptionTier: "basic",
    totalSpent: 7_500,
    twoFactorEnabled: false,
    verificationStatus: "unverified",
    notes: "",
    studentProfile: {
      examTargets: ["WAEC", "NECO"],
      subjectsEnrolled: ["English", "Mathematics", "Economics"],
      xpPoints: 1_200,
      streak: 3,
      averageScore: 61,
      sessionsCompleted: 28,
      totalStudyHours: 42,
    },
  };
}

// ─── Activity Log ─────────────────────────────────────────────────────────────

export function mockActivityLog(): ActivityLogEntry[] {
  return [
    { id: "a1", action: "login",                description: "Logged in from Lagos",                              timestamp: "2025-05-27T14:22:00Z", ipAddress: "102.89.45.12", device: "Chrome / Android" },
    { id: "a2", action: "quiz_completed",        description: "Completed WAEC Chemistry Mock — Score: 82%",        timestamp: "2025-05-27T13:05:00Z", device: "Chrome / Android" },
    { id: "a3", action: "content_accessed",      description: 'Opened ebook: "WAEC Maths Past Questions 2010–2023"', timestamp: "2025-05-26T18:44:00Z" },
    { id: "a4", action: "subscription_upgraded", description: "Upgraded Free → Premium via Paystack",             timestamp: "2025-05-20T10:00:00Z", ipAddress: "102.89.45.12" },
    { id: "a5", action: "password_changed",      description: "Password changed successfully",                    timestamp: "2025-05-14T09:30:00Z", ipAddress: "102.89.45.12" },
    { id: "a6", action: "two_factor_enabled",    description: "Two-factor authentication enabled",               timestamp: "2025-05-10T11:00:00Z" },
    { id: "a7", action: "profile_updated",       description: "Updated phone number and state",                   timestamp: "2025-04-28T16:10:00Z" },
    { id: "a8", action: "quiz_completed",        description: "Completed JAMB CBT Practice — Score: 67%",         timestamp: "2025-04-20T11:20:00Z", device: "Firefox / Desktop" },
    { id: "a9", action: "login",                 description: "Logged in from Abuja",                             timestamp: "2025-04-15T08:00:00Z", ipAddress: "105.112.22.44", device: "Safari / iOS" },
    { id: "a10", action: "payment_failed",       description: "Payment failed — Flutterwave timeout",             timestamp: "2025-03-20T10:05:00Z" },
  ];
}

// ─── Payments ─────────────────────────────────────────────────────────────────

export function mockPayments(): PaymentRecord[] {
  return [
    { id: "p1", amount: 15_000, plan: "Premium Monthly",         status: "successful", channel: "Paystack",    reference: "PSK-20250520-AB123", date: "2025-05-20T10:00:00Z" },
    { id: "p2", amount: 15_000, plan: "Premium Monthly",         status: "successful", channel: "Paystack",    reference: "PSK-20250420-CD456", date: "2025-04-20T10:00:00Z" },
    { id: "p3", amount: 15_000, plan: "Premium Monthly",         status: "failed",     channel: "Flutterwave", reference: "FLW-20250320-EF789", date: "2025-03-20T10:00:00Z" },
    { id: "p4", amount: 8_000,  plan: "Pro Monthly (Promo)",     status: "successful", channel: "Bank",        reference: "BNK-20250220-GH012", date: "2025-02-20T10:00:00Z" },
    { id: "p5", amount: 8_000,  plan: "Pro Monthly (Promo)",     status: "refunded",   channel: "Paystack",    reference: "PSK-20250120-IJ345", date: "2025-01-20T10:00:00Z" },
  ];
}
