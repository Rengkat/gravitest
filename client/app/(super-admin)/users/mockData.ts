import type {
  User, UserRole, UserStatus, SubscriptionTier,
  StudentProfile, TutorProfile, SchoolAdminProfile,
} from "./types";
import { SUBJECTS, EXAM_TARGETS, SCHOOL_NAMES, TUTOR_QUALIFICATIONS } from "./constants";

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const pickMany = <T>(arr: T[], n: number): T[] =>
  [...arr].sort(() => Math.random() - 0.5).slice(0, n);

const FIRST_NAMES = [
  "Adebayo","Chioma","Emeka","Fatima","Segun","Ngozi","Tunde","Amina",
  "Obinna","Blessing","Yusuf","Grace","Ifeanyi","Hauwa","Chidi","Aisha",
  "Kelechi","Rukayat","Biodun","Nkechi","Olumide","Zainab","Uche","Taiwo",
];
const LAST_NAMES = [
  "Okonkwo","Adeyemi","Musa","Eze","Bakare","Ibrahim","Obi","Suleiman",
  "Nwachukwu","Johnson","Bello","Okafor","Abubakar","Oluwole","Chukwu",
];

function makeStudentProfile(schoolBased: boolean): StudentProfile {
  return {
    schoolId: schoolBased ? `sch_${rand(1, 50).toString().padStart(3, "0")}` : undefined,
    schoolName: schoolBased ? pick(SCHOOL_NAMES) : undefined,
    className: schoolBased
      ? `${pick(["JSS1","JSS2","JSS3","SS1","SS2","SS3"])} ${pick(["Science","Arts","Commercial"])}`
      : undefined,
    studentIdNumber: schoolBased ? `STU${rand(10000, 99999)}` : undefined,
    examTargets: pickMany(EXAM_TARGETS, rand(1, 3)),
    subjectsEnrolled: pickMany(SUBJECTS, rand(5, 10)),
    xpPoints: rand(100, 50000),
    streak: rand(0, 180),
    averageScore: rand(35, 98),
    sessionsCompleted: rand(10, 2000),
    totalStudyHours: rand(5, 500),
    rank: schoolBased ? rand(1, 120) : undefined,
  };
}

function makeTutorProfile(): TutorProfile {
  return {
    subjects: pickMany(SUBJECTS, rand(2, 5)),
    qualifications: pickMany(TUTOR_QUALIFICATIONS, rand(1, 3)),
    yearsOfExperience: rand(1, 20),
    rating: parseFloat((3 + Math.random() * 2).toFixed(1)),
    ratingCount: rand(10, 500),
    totalSessionsConducted: rand(50, 5000),
    totalStudentsTaught: rand(20, 2000),
    hourlyRate: pick([2000, 3000, 5000, 7500, 10000]),
    isVerified: Math.random() > 0.3,
    availabilityStatus: pick(["available", "available", "busy", "on_leave"]),
  };
}

function makeSchoolAdminProfile(): SchoolAdminProfile {
  return {
    schoolId: `sch_${rand(1, 50).toString().padStart(3, "0")}`,
    schoolName: pick(SCHOOL_NAMES),
    schoolType: pick(["private", "private", "public", "international"]),
    adminRole: pick(["principal", "vice_principal", "admin", "it_admin"]),
    managedClasses: Array.from({ length: rand(3, 12) }, (_, i) =>
      `${pick(["JSS1","JSS2","JSS3","SS1","SS2","SS3"])} ${pick(["Science","Arts","Commercial"])}${i}`
    ).filter((v, i, a) => a.indexOf(v) === i).slice(0, rand(3, 8)),
    managedStudentCount: rand(100, 800),
    managedTeacherCount: rand(15, 80),
    subscriptionManaged: pick(["basic", "pro", "premium", "enterprise"] as SubscriptionTier[]),
  };
}

export function generateMockUsers(count: number): User[] {
  const statuses: UserStatus[] = ["active","active","active","inactive","pending","suspended"];
  const tiers: SubscriptionTier[] = ["free","free","basic","pro","premium","enterprise"];
  const subStatuses = ["active","active","active","trial","expired","cancelled"] as const;

  return Array.from({ length: count }, (_, i) => {
    const firstName = pick(FIRST_NAMES);
    const lastName = pick(LAST_NAMES);

    // Weight roles: mostly students, then tutors, then school admins
    const roleRoll = Math.random();
    const role: UserRole =
      roleRoll < 0.65 ? "student"
      : roleRoll < 0.82 ? "tutor"
      : roleRoll < 0.97 ? "school_admin"
      : "super_admin";

    const accountType = role === "student" && Math.random() > 0.4
      ? "school_based"
      : "individual";

    const status: UserStatus = pick(statuses);
    const tier: SubscriptionTier = role === "super_admin" ? "enterprise" : pick(tiers);

    const joinDate = new Date(
      2022 + rand(0, 2), rand(0, 11), rand(1, 28)
    ).toISOString().split("T")[0];

    const lastActive = new Date(
      2024, rand(0, 3), rand(1, 28)
    ).toISOString().split("T")[0];

    return {
      id: `usr_${(i + 1).toString().padStart(5, "0")}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${rand(1, 99)}@${
        role === "student" && accountType === "school_based"
          ? "student.school.edu.ng"
          : role === "tutor"
          ? "tutors.gravitas.ng"
          : "gravitas.ng"
      }`,
      phone: `+234${rand(7, 9)}${rand(0, 9)}${rand(10000000, 99999999)}`,
      role,
      status,
      accountType,

      studentProfile: role === "student" ? makeStudentProfile(accountType === "school_based") : undefined,
      tutorProfile:   role === "tutor"   ? makeTutorProfile()                                 : undefined,
      schoolAdminProfile: role === "school_admin" ? makeSchoolAdminProfile()                   : undefined,

      joinDate,
      lastActive,
      totalLogins: rand(1, 2000),
      deviceCount: rand(1, 5),
      lastDevice: pick(["Chrome / Windows","Safari / iPhone","Firefox / MacOS","Samsung Browser / Android"]),
      lastLocation: pick(["Lagos","Abuja","Ibadan","Port Harcourt","Enugu","Kano"]),

      subscriptionTier: tier,
      subscriptionStatus: pick(subStatuses),
      subscriptionExpiry: new Date(2024, rand(3, 11), rand(1, 28)).toISOString().split("T")[0],
      totalSpent: tier === "free" ? 0 : rand(0, 500000),

      verificationStatus: pick(["verified","verified","unverified","pending"]),
      twoFactorEnabled: Math.random() > 0.6,

      referralCode: `GRV${firstName.substring(0, 3).toUpperCase()}${rand(100, 999)}`,
      referredBy: Math.random() > 0.6 ? `usr_${rand(1, i || 1).toString().padStart(5, "0")}` : undefined,
      referralCount: rand(0, 50),

      notes: Math.random() > 0.85 ? "Flagged for review." : undefined,
      tags: pickMany(["nigeria","jamb","waec","active_learner","high_performer","at_risk"], rand(0, 3)),
    };
  });
}

export function generateMockStats(users: User[]) {
  const students     = users.filter((u) => u.role === "student");
  const tutors       = users.filter((u) => u.role === "tutor");
  const schoolAdmins = users.filter((u) => u.role === "school_admin");

  const bySubscription = {} as Record<string, number>;
  const byStatus       = {} as Record<string, number>;
  users.forEach((u) => {
    bySubscription[u.subscriptionTier] = (bySubscription[u.subscriptionTier] || 0) + 1;
    byStatus[u.status] = (byStatus[u.status] || 0) + 1;
  });

  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
  const newThisMonth = users.filter((u) => u.joinDate >= thisMonthStart).length;

  return {
    total: users.length,
    active:    users.filter((u) => u.status === "active").length,
    inactive:  users.filter((u) => u.status === "inactive").length,
    suspended: users.filter((u) => u.status === "suspended").length,
    pending:   users.filter((u) => u.status === "pending").length,
    newThisMonth,
    churnRate: parseFloat((Math.random() * 5 + 1).toFixed(1)),
    byRole: {
      students:    students.length,
      tutors:      tutors.length,
      schoolAdmins: schoolAdmins.length,
      superAdmins: users.filter((u) => u.role === "super_admin").length,
    },
    byAccountType: {
      individual:  users.filter((u) => u.accountType === "individual").length,
      schoolBased: users.filter((u) => u.accountType === "school_based").length,
    },
    bySubscription,
    byStatus,
    averageSessionScore: parseFloat(
      (students.reduce((s, u) => s + (u.studentProfile?.averageScore ?? 0), 0) / (students.length || 1)).toFixed(1)
    ),
    totalRevenue: users.reduce((s, u) => s + u.totalSpent, 0),
    activeSubscriptions: users.filter((u) => u.subscriptionStatus === "active").length,
    verifiedUsers: users.filter((u) => u.verificationStatus === "verified").length,
    studentAvgScore: parseFloat(
      (students.reduce((s, u) => s + (u.studentProfile?.averageScore ?? 0), 0) / (students.length || 1)).toFixed(1)
    ),
    tutorAvgRating: parseFloat(
      (tutors.reduce((s, u) => s + (u.tutorProfile?.rating ?? 0), 0) / (tutors.length || 1)).toFixed(1)
    ),
    schoolAdminSchoolCount: new Set(schoolAdmins.map((u) => u.schoolAdminProfile?.schoolId)).size,
    registrationTrend: Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i, 1).toLocaleString("default", { month: "short" }),
      count: rand(80, 600),
    })),
    topSchools: SCHOOL_NAMES.map((name) => ({
      name, count: rand(40, 400),
    })).sort((a, b) => b.count - a.count),
    topSubjects: SUBJECTS.slice(0, 8).map((name) => ({
      name, students: rand(200, 2000),
    })).sort((a, b) => b.students - a.students),
  };
}
