"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { StudentDetailView } from "./components/StudentDetailView";
import { StudentBasicInfo } from "./components/StudentBasicInfo";
import { StudentAcademicInfo } from "./components/StudentAcademicInfo";
import { StudentPerformanceStats } from "./components/StudentPerformanceStats";
import { StudentGamification } from "../components/StudentGamification";
import { ActivityTimeline } from "./components/ActivityTimeline";
import type { StudentWithUser, ActivityLog } from "../types";
const mockStudent: StudentWithUser = {
  user: {
    id: "user-001",
    firstName: "Oluwaseun",
    middleName: "Adebayo",
    lastName: "Ogunleye",
    email: "seun.ogunleye@student.edu.ng",
    phoneNumber: "+2347012345678",
    dateOfBirth: new Date("2006-03-15"),
    gender: "Male",
    stateOfResidence: "Lagos",
    lga: "Ikeja",
    bio: "Aspiring medical doctor passionate about biology and chemistry. Active member of the school science club and debate team.",
    isEmailVerified: true,
    isPhoneVerified: true,
    avatarUrl: null,
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2025-03-10"),
    totalLoginCount: 187,
    lastLoginAt: new Date("2025-06-07"),
    isActive: true,
  },
  studentProfile: {
    id: "profile-001",
    userId: "user-001",
    currentSchool: "Lagos State Model College, Ikeja",
    currentClass: "SS3 Science",
    graduationYear: 2025,
    admissionNo: "LSMC/2024/0342",
    examTargets: ["JAMB", "WAEC", "NECO"],
    examDate: new Date("2025-05-15"),
    targetScore: 320,
    targetUniversity: "University of Lagos",
    targetCourse: "Medicine and Surgery",
    focusSubjects: ["Biology", "Chemistry", "Physics", "English Language"],
    parentName: "Chief Adebayo Ogunleye",
    parentPhone: "+2348023456789",
    totalQuestionsAttempted: 2450,
    totalQuestionsCorrect: 1982,
    averageScore: 80.9,
    totalMinutesStudied: 4875,
    totalExamsTaken: 24,
    bestScore: 96,
    worstScore: 58,
    lastStudyDate: new Date("2025-06-06"),
    level: 12,
    levelTitle: "Scholar Pro",
    totalXp: 4850,
    totalBadges: 15,
    currentStreak: 23,
    longestStreak: 45,
    streakShields: 3,
    leaderboardRank: 12,
    percentileStanding: 92.5,
    subjectPerformance: {
      Biology: {
        subject: "Biology",
        averageScore: 88.5,
        totalMinutes: 1245,
        questionsAttempted: 520,
        questionsCorrect: 460,
        lastAttemptAt: new Date("2025-06-05"),
      },
      Chemistry: {
        subject: "Chemistry",
        averageScore: 82.3,
        totalMinutes: 985,
        questionsAttempted: 480,
        questionsCorrect: 395,
        lastAttemptAt: new Date("2025-06-04"),
      },
      Physics: {
        subject: "Physics",
        averageScore: 78.7,
        totalMinutes: 1100,
        questionsAttempted: 495,
        questionsCorrect: 390,
        lastAttemptAt: new Date("2025-06-03"),
      },
      "English Language": {
        subject: "English Language",
        averageScore: 85.2,
        totalMinutes: 720,
        questionsAttempted: 365,
        questionsCorrect: 311,
        lastAttemptAt: new Date("2025-06-05"),
      },
      Mathematics: {
        subject: "Mathematics",
        averageScore: 76.4,
        totalMinutes: 825,
        questionsAttempted: 590,
        questionsCorrect: 426,
        lastAttemptAt: new Date("2025-06-01"),
      },
    },
    examPerformance: {
      JAMB: {
        examType: "JAMB",
        examsTaken: 8,
        averageScore: 78.4,
        bestScore: 92,
        worstScore: 65,
        lastAttemptAt: new Date("2025-05-07"),
      },
      WAEC: {
        examType: "WAEC",
        examsTaken: 12,
        averageScore: 82.1,
        bestScore: 96,
        worstScore: 58,
        lastAttemptAt: new Date("2025-05-22"),
      },
      NECO: {
        examType: "NECO",
        examsTaken: 4,
        averageScore: 74.8,
        bestScore: 88,
        worstScore: 62,
        lastAttemptAt: new Date("2025-04-22"),
      },
    },
  },
};

export default function StudentDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [student, setStudent] = useState<StudentWithUser | null>(mockStudent);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "performance" | "activity" | "settings">(
    "overview",
  );

  //   useEffect(() => {
  //     fetchStudentDetails();
  //     fetchActivityLogs();
  //   }, [id]);

  const fetchStudentDetails = async () => {
    // try {
    //   const response = await fetch(`/api/school/students/${id}`);
    //   const data = await response.json();
    // //   setStudent(data);
    // } catch (error) {
    //   console.error("Error fetching student details:", error);
    // } finally {
    //   setLoading(false);
    // }
  };

  const fetchActivityLogs = async () => {
    // try {
    //   const response = await fetch(`/api/school/students/${id}/activities`);
    //   const data = await response.json();
    //   setActivities(data);
    // } catch (error) {
    //   console.error("Error fetching activity logs:", error);
    // }
  };

  const handleStudentUpdate = (updatedStudent: StudentWithUser) => {
    setStudent(updatedStudent);
  };

  if (loading || !student) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-text-muted hover:text-green-900 transition-colors mb-4">
          <ArrowLeft size={18} /> Back to Students
        </button>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
              {student.user.avatarUrl ? (
                <img
                  src={student.user.avatarUrl}
                  alt={`${student.user.firstName} ${student.user.lastName}`}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl font-semibold text-green-700">
                  {student.user.firstName[0]}
                  {student.user.lastName[0]}
                </span>
              )}
            </div>
            <div>
              <h1 className="font-serif text-3xl text-green-900 mb-1">
                {student.user.firstName} {student.user.middleName} {student.user.lastName}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-text-muted">{student.user.email}</span>
                <span className="text-text-muted">•</span>
                <span className="text-text-muted">
                  {student.studentProfile.currentClass || "Class not assigned"}
                </span>
                <span className="text-text-muted">•</span>
                <span className="text-text-muted">
                  Admission: {student.studentProfile.admissionNo || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b">
        <div className="flex gap-6">
          {(["overview", "performance", "activity", "settings"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-1 py-3 text-sm font-medium capitalize transition-colors relative ${
                activeTab === tab ? "text-green-800" : "text-text-muted hover:text-green-700"
              }`}>
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-800 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === "overview" && (
            <>
              <StudentBasicInfo student={student} />
              <StudentAcademicInfo student={student} />
            </>
          )}

          {activeTab === "performance" && <StudentPerformanceStats student={student} />}

          {activeTab === "activity" && <ActivityTimeline activities={activities} />}

          {activeTab === "settings" && (
            <StudentDetailView student={student} onStudentUpdate={handleStudentUpdate} />
          )}
        </div>

        <div className="space-y-6">
          <StudentGamification student={student} />

          {/* Quick Actions Card */}
          <div
            className="p-6 rounded-2xl bg-white border"
            style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <h3 className="font-semibold text-green-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-cream transition-colors text-sm">
                Send Message
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-cream transition-colors text-sm">
                Reset Password
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-cream transition-colors text-sm">
                Force Email Verification
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-cream transition-colors text-sm">
                View Login History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
