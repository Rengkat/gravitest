import type { Tutor } from "./types";

const STUDENT_NAMES = [
  "Oluwaseun Adebayo","Chioma Eze","Emeka Nwachukwu","Fatima Suleiman",
  "Tunde Bakare","Ngozi Okonkwo","Ibrahim Musa","Aisha Bello","David Okafor","Grace Peters",
];

const REVIEW_COMMENTS = [
  "Dr. Adebayo is an exceptional tutor! He explained complex calculus concepts in a way I could easily understand.",
  "Very patient and knowledgeable. He doesn't move on until you truly understand the concept.",
  "Great tutor! His teaching style is very engaging. Highly recommended!",
  "The best mathematics teacher I've ever had. My JAMB score improved dramatically.",
  "Excellent at breaking down complex topics. Worth every naira!",
  "Professional, punctual, and incredibly effective teaching methods.",
];

export function getMockTutor(id: string): Tutor {
  const hourlyRate = 15000;

  return {
    id,
    name:        "Dr. Adebayo Ola",
    avatar:      "https://i.pravatar.cc/150?u=tutor1",
    coverImage:  "https://picsum.photos/1200/300",
    title:       "PhD Mathematics — 15+ years experience",
    email:       "adebayo.ola@graviest.com",
    phone:       "+2348012345678",
    gender:      "male",
    dateOfBirth: "1975-03-15",

    specialization:  ["mathematics", "physics"],
    subjects:        ["Mathematics", "Physics", "Further Mathematics"],
    experience:      15,
    education:       "PhD Mathematics, University of Ibadan",
    certifications:  ["Certified Mathematics Educator", "WAEC Examiner Certification", "TRCN Certified"],
    qualifications:  ["STEM Curriculum Developer", "Assessment Specialist"],
    about:           "Dr. Adebayo Ola is a renowned mathematics educator with over 15 years of experience helping students excel in JAMB, WAEC, and NECO examinations. His unique teaching methodology has helped over 1,000 students achieve distinctions in mathematics.",
    teachingStyle:   "Interactive and student-centered approach with focus on practical problem-solving. Uses real-life examples to explain abstract concepts.",

    status:           "active",
    verificationLevel:"verified",
    rating:           4.9,
    reviewCount:      847,
    totalStudents:    1250,
    totalSessions:    3420,
    completionRate:   98,
    responseTime:     "< 1 hour",
    isOnline:         true,
    isFeatured:       true,
    isVerified:       true,
    joinedDate:       "2023-06-15",
    lastActive:       "2025-03-20",

    hourlyRate,
    packages: [
      { name: "Single Session",    duration: "1 hour",      price: hourlyRate,                                     savings: 0,                            sessions: 1 },
      { name: "5 Sessions Pack",   duration: "5 hours",     price: hourlyRate * 5 - Math.round(hourlyRate * 0.07), savings: Math.round(hourlyRate * 0.35), sessions: 5,  popular: true },
      { name: "10 Sessions Pack",  duration: "10 hours",    price: hourlyRate * 10 - Math.round(hourlyRate * 1.5), savings: Math.round(hourlyRate * 1.5),  sessions: 10 },
      { name: "Monthly Plan",      duration: "8 hrs/month", price: Math.round(hourlyRate * 8 * 0.8),               savings: Math.round(hourlyRate * 8 * 0.2),sessions: 8 },
    ],

    availability:             ["Monday","Tuesday","Wednesday","Thursday","Friday"],
    timeSlots:                ["8:00 AM","10:00 AM","12:00 PM","2:00 PM","4:00 PM","6:00 PM"],
    maxStudentsPerDay:        6,
    preferredSessionDuration: 60,

    languages:    ["English","Yoruba"],
    state:        "Lagos",
    city:         "Ikeja",
    teachingMode: "online",

    achievements: [
      "Best Mathematics Tutor Award 2023",
      "Helped 500+ students score A's in JAMB Mathematics",
      "Published author of 'Mathematics Made Simple'",
      "Featured in Educational Excellence Magazine",
    ],
    tags: ["JAMB Expert","WAEC Specialist","Quick Response","Patient Teacher"],

    bankName:      "GTBank",
    accountNumber: "0123456789",
    accountName:   "Adebayo Ola",

    earnings: {
      totalEarnings:  4500000,
      thisMonth:      380000,
      lastMonth:      350000,
      pendingPayout:  304000,
      nextPayoutDate: "2025-04-15",
      commissionRate: 20,
      platformFees:   76000,
      netEarnings:    304000,
      monthlyBreakdown: Array.from({ length: 12 }, (_, i) => ({
        month:    new Date(2024, i, 1).toLocaleString("default", { month: "short" }),
        earnings: Math.floor(Math.random() * 200000 + 250000),
        sessions: Math.floor(Math.random() * 30 + 25),
        students: Math.floor(Math.random() * 15 + 10),
      })),
      earningsBySubject: [
        { subject: "Mathematics",    amount: 250000 },
        { subject: "Physics",        amount: 100000 },
        { subject: "Further Maths",  amount: 30000  },
      ],
    },

    recentSessions: Array.from({ length: 10 }, (_, i) => ({
      id:           `sess_${i}`,
      studentName:  STUDENT_NAMES[i],
      studentEmail: `student${i}@email.com`,
      subject:      i % 3 === 0 ? "Physics" : "Mathematics",
      date:         new Date(Date.now() - i * 2 * 86400000).toISOString().split("T")[0],
      time:         `${8 + Math.floor(Math.random() * 10)}:00 ${Math.random() > 0.5 ? "AM" : "PM"}`,
      duration:     [30,45,60,90][Math.floor(Math.random() * 4)],
      status:       (i < 7 ? "completed" : i < 9 ? "upcoming" : "cancelled") as any,
      amount:       hourlyRate,
      rating:       i < 7 ? Math.floor(Math.random() * 2) + 4 : undefined,
      notes:        i < 7 ? "Good progress on calculus topics." : undefined,
    })),

    recentReviews: Array.from({ length: 6 }, (_, i) => ({
      id:           `rev_${i}`,
      studentName:  ["Emmanuel O.","Precious N.","David A.","Fatima M.","Chidi O.","Aisha B."][i],
      studentAvatar:`https://i.pravatar.cc/40?u=stu${i}`,
      rating:       4 + Math.floor(Math.random() * 2),
      date:         new Date(Date.now() - i * 5 * 86400000).toISOString().split("T")[0],
      comment:      REVIEW_COMMENTS[i],
      subject:      i % 2 === 0 ? "Mathematics" : "Physics",
      sessionType:  "One-on-One",
      helpful:      Math.floor(Math.random() * 50) + 10,
      response:     i < 2 ? "Thank you for the wonderful review! Keep practicing." : undefined,
      responseDate: i < 2 ? new Date(Date.now() - i * 4 * 86400000).toISOString().split("T")[0] : undefined,
    })),

    studentRetentionRate: 85,
    averageSessionRating: 4.8,
    repeatStudentRate:    72,
    cancellationRate:     3,

    cvUrl:           "#",
    idCardUrl:       "#",
    certificateUrls: ["#","#","#"],
    profileCompleted: 95,
  };
}
