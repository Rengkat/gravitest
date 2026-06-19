import { SPECIALIZATIONS, NIGERIAN_STATES } from "./constants";
import type {
  Tutor,
  TutorCategory,
  TutorSpecialization,
  TutorStatus,
  VerificationLevel,
  TutorPackage,
  TutorStats,
} from "./types";

// ─── PACKAGE BUILDER ────────────────────────────────────────
function buildPackages(hourly: number): TutorPackage[] {
  return [
    { name: "Single Session", duration: "1 hour", price: hourly, savings: 0, sessions: 1 },
    {
      name: "5 Sessions Pack",
      duration: "5 hours",
      price: hourly * 5 - Math.round(hourly * 0.07),
      savings: Math.round(hourly * 0.35),
      sessions: 5,
      popular: true,
    },
    {
      name: "10 Sessions Pack",
      duration: "10 hours",
      price: hourly * 10 - Math.round(hourly * 1.5),
      savings: Math.round(hourly * 1.5),
      sessions: 10,
    },
    {
      name: "Monthly Plan",
      duration: "8 hrs/month",
      price: Math.round(hourly * 8 * 0.8),
      savings: Math.round(hourly * 8 * 0.2),
      sessions: 8,
    },
  ];
}

// ─── TUTOR GENERATOR ────────────────────────────────────────
export function generateMockTutors(count: number): Tutor[] {
  const secondarySpecs: TutorSpecialization[] = [
    "mathematics",
    "english",
    "physics",
    "chemistry",
    "biology",
    "economics",
    "government",
    "literature",
    "commerce",
    "geography",
    "further_mathematics",
    "technical_drawing",
    "agriculture",
    "computer_studies",
    "french",
    "yoruba",
    "hausa",
    "igbo",
    "civic_education",
    "business_studies",
  ];
  const professionalSpecs: TutorSpecialization[] = [
    "accounting",
    "nursing",
    "hr_management",
    "estate_management",
  ];
  const tutorNames = [
    { name: "Dr. Adebayo Ola", title: "PhD Mathematics — 15+ years experience" },
    { name: "Prof. Chukwuma Eze", title: "Physics Specialist — Former WAEC Examiner" },
    { name: "Mrs. Grace Okonkwo", title: "Chemistry & Biology Expert — MSc UNN" },
    { name: "Mr. Segun Adeyemi", title: "English Literature & Language Coach" },
    { name: "Dr. Funmilayo Adebayo", title: "Economics & Government Specialist" },
    { name: "Mr. Michael Okafor", title: "Mathematics & Further Maths Tutor" },
    { name: "Dr. Ifeoma Obi", title: "Biology & Health Science Specialist" },
    { name: "Mr. Tunde Adesanya", title: "Government & History Teacher" },
    { name: "Mrs. Amaka Nwosu", title: "Economics & Commerce Expert" },
    { name: "Dr. Ibrahim Musa", title: "Physics & Technical Drawing Specialist" },
    { name: "Ms. Aisha Bello", title: "English & Literature Tutor" },
    { name: "Mr. David Okafor", title: "Chemistry & Biology Teacher" },
    { name: "Mrs. Fatima Suleiman", title: "Mathematics & Computer Studies" },
    { name: "Dr. Emeka Nwachukwu", title: "Physics & Further Maths Expert" },
    { name: "Mr. Oluwaseun Adeyemi", title: "Government & Civic Education" },
  ];

  return Array.from({ length: count }, (_, i) => {
    const isProfessional = Math.random() > 0.8;
    const category: TutorCategory = isProfessional ? "professional" : "secondary";
    const specs = isProfessional ? professionalSpecs : secondarySpecs;
    const numSpecs = Math.floor(Math.random() * 3) + 1;
    const tutorSpecs = specs
      .sort(() => Math.random() - 0.5)
      .slice(0, numSpecs) as TutorSpecialization[];
    const tutorName = tutorNames[i % tutorNames.length];
    const hourlyRate = isProfessional
      ? Math.floor(Math.random() * 10000 + 15000)
      : Math.floor(Math.random() * 8000 + 5000);
    const totalSessions = Math.floor(Math.random() * 3500) + 200;
    const monthlyEarnings = Math.floor(Math.random() * 300000 + 80000);

    return {
      id: `tutor_${(i + 1).toString().padStart(4, "0")}`,
      name: tutorName.name,
      avatar: `https://i.pravatar.cc/150?u=tutor${i}`,
      title: tutorName.title,
      email: `${tutorName.name
        .toLowerCase()
        .replace(/ /g, ".")
        .replace(/[^a-z.]/g, "")}@graviest.com`,
      phone: `+234${Math.floor(Math.random() * 900000000 + 100000000)}`,
      category,
      specialization: tutorSpecs,
      subjects: tutorSpecs.map((s) => SPECIALIZATIONS[s]?.label || s),
      examTypes: isProfessional
        ? ["ICAN", "NMCN", "CIPM", "NIM", "NIESV"].slice(0, Math.floor(Math.random() * 2) + 1)
        : ["JAMB", "WAEC", "NECO", "NABTEB", "BECE"].slice(0, Math.floor(Math.random() * 3) + 1),
      experience: Math.floor(Math.random() * 20) + 1,
      education: ["PhD", "MSc", "BSc", "BEd", "MA", "MBBS", "HND"][Math.floor(Math.random() * 7)],
      certifications: [
        "Certified Educator",
        "WAEC Examiner",
        "TRCN Certified",
        "NUC Lecturer",
        "ICAN Certified",
      ].slice(0, Math.floor(Math.random() * 3) + 1),
      about: `${tutorName.name} is a dedicated educator with extensive experience.`,
      teachingStyle: "Interactive and student-centered approach.",
      status: [
        "active",
        "active",
        "active",
        "active",
        "inactive",
        "pending",
        "on_leave",
        "suspended",
      ][Math.floor(Math.random() * 8)] as TutorStatus,
      verificationLevel: ["verified", "verified", "verified", "pending", "premium", "unverified"][
        Math.floor(Math.random() * 6)
      ] as VerificationLevel,
      rating: 3.5 + Math.random() * 1.5,
      reviewCount: Math.floor(Math.random() * 900) + 50,
      totalStudents: Math.floor(Math.random() * 1200) + 100,
      totalSessions,
      completionRate: 80 + Math.floor(Math.random() * 20),
      responseTime: ["< 30 mins", "< 1 hour", "< 2 hours", "< 4 hours"][
        Math.floor(Math.random() * 4)
      ],
      isOnline: Math.random() > 0.3,
      isFeatured: Math.random() > 0.85,
      isVerified: Math.random() > 0.2,
      joinedDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
        .toISOString()
        .split("T")[0],
      lastActive: new Date(2025, 2, Math.floor(Math.random() * 28) + 1).toISOString().split("T")[0],
      hourlyRate,
      packages: buildPackages(hourlyRate),
      state: NIGERIAN_STATES[Math.floor(Math.random() * NIGERIAN_STATES.length)],
      city: [
        "Ikeja",
        "Surulere",
        "Wuse",
        "Garki",
        "Ibadan",
        "Enugu",
        "Port Harcourt",
        "Kaduna",
        "Benin City",
        "Jos",
      ][Math.floor(Math.random() * 10)],
      teachingMode: ["online", "in_person", "both"][Math.floor(Math.random() * 3)] as any,
      availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].slice(
        0,
        Math.floor(Math.random() * 4) + 3,
      ),
      languages: [
        "English",
        ...["Yoruba", "Igbo", "Hausa"].slice(0, Math.floor(Math.random() * 2)),
      ],
      totalEarnings: monthlyEarnings * (Math.floor(Math.random() * 18) + 6),
      earningsThisMonth: monthlyEarnings,
      platformCommission: Math.floor(monthlyEarnings * 0.2),
      tags: [
        "JAMB Expert",
        "WAEC Specialist",
        "Quick Response",
        "Patient Teacher",
        "Exam Strategy",
        "Practical Focus",
        "Affordable",
      ].slice(0, Math.floor(Math.random() * 4) + 2),
      achievements: [
        "Best Tutor Award 2023",
        "Helped 500+ students",
        "Published author",
        "Featured in Education Magazine",
      ].slice(0, Math.floor(Math.random() * 3) + 1),
      studentRetentionRate: 55 + Math.floor(Math.random() * 40),
      repeatStudentRate: 35 + Math.floor(Math.random() * 55),
      cancellationRate: Math.floor(Math.random() * 15),
    };
  });
}

// ─── STATS GENERATOR ────────────────────────────────────────
export function generateTutorStats(tutors: Tutor[]): TutorStats {
  const activeTutors = tutors.filter((t) => t.status === "active");
  const secondaryTutors = tutors.filter((t) => t.category === "secondary");
  const professionalTutors = tutors.filter((t) => t.category === "professional");

  const specCount: Record<string, number> = {};
  tutors.forEach((t) =>
    t.specialization.forEach((s) => {
      specCount[s] = (specCount[s] || 0) + 1;
    }),
  );

  const stateCount: Record<string, number> = {};
  tutors.forEach((t) => {
    stateCount[t.state] = (stateCount[t.state] || 0) + 1;
  });

  const experienceCount: Record<string, number> = {
    "0-2 years": 0,
    "3-5 years": 0,
    "6-10 years": 0,
    "11-15 years": 0,
    "16+ years": 0,
  };
  tutors.forEach((t) => {
    if (t.experience <= 2) experienceCount["0-2 years"]++;
    else if (t.experience <= 5) experienceCount["3-5 years"]++;
    else if (t.experience <= 10) experienceCount["6-10 years"]++;
    else if (t.experience <= 15) experienceCount["11-15 years"]++;
    else experienceCount["16+ years"]++;
  });

  const ratingColors = ["#10b981", "#22c55e", "#f59e0b", "#f97316", "#ef4444"];

  return {
    totalTutors: tutors.length,
    activeTutors: activeTutors.length,
    pendingVerification: tutors.filter((t) => t.verificationLevel === "pending").length,
    suspendedTutors: tutors.filter((t) => t.status === "suspended").length,
    onLeaveTutors: tutors.filter((t) => t.status === "on_leave").length,
    inactiveTutors: tutors.filter((t) => t.status === "inactive").length,
    secondaryTutors: secondaryTutors.length,
    professionalTutors: professionalTutors.length,
    onlineTutors: tutors.filter((t) => t.isOnline).length,
    inPersonTutors: tutors.filter(
      (t) => t.teachingMode === "in_person" || t.teachingMode === "both",
    ).length,
    averageRating:
      tutors.length > 0
        ? parseFloat((tutors.reduce((s, t) => s + t.rating, 0) / tutors.length).toFixed(1))
        : 0,
    averageHourlyRate:
      tutors.length > 0
        ? Math.round(tutors.reduce((s, t) => s + t.hourlyRate, 0) / tutors.length)
        : 0,
    averageExperience:
      tutors.length > 0
        ? Math.round(tutors.reduce((s, t) => s + t.experience, 0) / tutors.length)
        : 0,
    totalStudents: tutors.reduce((s, t) => s + t.totalStudents, 0),
    totalSessionsCompleted: tutors.reduce((s, t) => s + t.totalSessions, 0),
    totalRevenue: tutors.reduce((s, t) => s + t.totalEarnings, 0),
    platformCommission: Math.round(tutors.reduce((s, t) => s + t.totalEarnings, 0) * 0.2),
    verifiedPercentage:
      tutors.length > 0
        ? Math.round((tutors.filter((t) => t.isVerified).length / tutors.length) * 100)
        : 0,
    featuredTutors: tutors.filter((t) => t.isFeatured).length,
    topSpecializations: Object.entries(specCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([subject, count]) => ({
        subject: SPECIALIZATIONS[subject as TutorSpecialization]?.label || subject,
        count,
        color: SPECIALIZATIONS[subject as TutorSpecialization]?.color || "#6b7280",
      })),
    tutorsByState: Object.entries(stateCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([state, count]) => ({ state, count })),
    tutorsByExperience: Object.entries(experienceCount).map(([range, count]) => ({ range, count })),
    monthlyOnboarding: Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i, 1).toLocaleString("default", { month: "short" }),
      count: Math.floor(Math.random() * 15 + 5),
    })),
    revenueByCategory: [
      {
        category: "Secondary",
        revenue: secondaryTutors.reduce((s, t) => s + t.totalEarnings, 0),
        count: secondaryTutors.length,
      },
      {
        category: "Professional",
        revenue: professionalTutors.reduce((s, t) => s + t.totalEarnings, 0),
        count: professionalTutors.length,
      },
    ],
    performanceDistribution: [
      {
        rating: "4.5-5.0",
        count: tutors.filter((t) => t.rating >= 4.5).length,
        color: ratingColors[0],
      },
      {
        rating: "4.0-4.4",
        count: tutors.filter((t) => t.rating >= 4.0 && t.rating < 4.5).length,
        color: ratingColors[1],
      },
      {
        rating: "3.5-3.9",
        count: tutors.filter((t) => t.rating >= 3.5 && t.rating < 4.0).length,
        color: ratingColors[2],
      },
      {
        rating: "3.0-3.4",
        count: tutors.filter((t) => t.rating >= 3.0 && t.rating < 3.5).length,
        color: ratingColors[3],
      },
      {
        rating: "<3.0",
        count: tutors.filter((t) => t.rating < 3.0).length,
        color: ratingColors[4],
      },
    ],
    teachingModeBreakdown: [
      {
        mode: "Online",
        count: tutors.filter((t) => t.teachingMode === "online").length,
        color: "#3b82f6",
      },
      {
        mode: "In-Person",
        count: tutors.filter((t) => t.teachingMode === "in_person").length,
        color: "#10b981",
      },
      {
        mode: "Both",
        count: tutors.filter((t) => t.teachingMode === "both").length,
        color: "#8b5cf6",
      },
    ],
  };
}
