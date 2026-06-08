"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  TrendingUp,
  Clock,
  Users,
  MessageSquare,
  Key,
  Shield,
  History,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { StudentBasicInfo } from "./components/StudentBasicInfo";
import { StudentPerformanceStats } from "./components/StudentPerformanceStats";
import { StudentDetailView } from "./components/StudentDetailView";
import { ActivityTimeline } from "./components/ActivityTimeline";
import type { StudentWithUser, ActivityLog } from "../types";

// ─── Mock data (replace with API fetch) ──────────────────────────────────────

const mockStudent: StudentWithUser = {
  user: {
    id: "user-001",
    firstName: "Oluwaseun",
    middleName: "Adebayo",
    lastName: "Ogunleye",
    email: "seun.ogunleye@student.edu.ng",
    phoneNumber: "+2347012345678",
    dateOfBirth: new Date("2006-03-15"),
    gender: "MALE" as any,
    stateOfResidence: "Lagos" as any,
    lga: "Ikeja",
    avatarUrl: null,
    bio: "Aspiring medical doctor passionate about biology and chemistry. Active in the school science club.",
    role: "STUDENT" as any,
    isEmailVerified: true,
    isPhoneVerified: true,
    isActive: true,
    isOnboarded: true,
    lastLoginAt: new Date("2025-06-07"),
    totalLoginCount: 187,
    referralCode: null,
    referredByCode: null,
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2025-03-10"),
  },
  studentProfile: {
    id: "profile-001",
    currentSchool: "Lagos State Model College, Ikeja", // stored but not displayed in school context
    currentClass: "SS3 Science",
    graduationYear: 2025,
    admissionNo: "LSMC/2024/0342",
    examTargets: [], // not shown in school context
    examDate: null,
    targetScore: null,
    targetUniversity: null,
    targetCourse: null,
    focusSubjects: ["Biology", "Chemistry", "Physics", "English Language", "Mathematics"],
    totalXp: 4850,
    level: 12,
    levelTitle: "Scholar Pro",
    totalBadges: 15,
    streakShields: 3,
    currentStreak: 23,
    longestStreak: 45,
    lastStudyDate: new Date("2025-06-06"),
    averageScore: 80.9,
    totalQuestionsAttempted: 2450,
    totalQuestionsCorrect: 1982,
    totalExamsTaken: 24,
    totalMinutesStudied: 4875,
    bestScore: 96,
    worstScore: 58,
    leaderboardRank: 12,
    percentileStanding: 92.5,
    parentName: "Chief Adebayo Ogunleye",
    parentPhone: "+2348023456789",
    socialLinks: null,
    subjectPerformance: {
      Biology: {
        averageScore: 88.5,
        questionsAttempted: 520,
        questionsCorrect: 460,
        totalMinutes: 1245,
        lastPracticedAt: "2025-06-05T10:00:00Z",
      },
      Chemistry: {
        averageScore: 82.3,
        questionsAttempted: 480,
        questionsCorrect: 395,
        totalMinutes: 985,
        lastPracticedAt: "2025-06-04T14:00:00Z",
      },
      Physics: {
        averageScore: 78.7,
        questionsAttempted: 495,
        questionsCorrect: 390,
        totalMinutes: 1100,
        lastPracticedAt: "2025-06-03T11:00:00Z",
      },
      "English Language": {
        averageScore: 85.2,
        questionsAttempted: 365,
        questionsCorrect: 311,
        totalMinutes: 720,
        lastPracticedAt: "2025-06-05T09:00:00Z",
      },
      Mathematics: {
        averageScore: 76.4,
        questionsAttempted: 590,
        questionsCorrect: 426,
        totalMinutes: 825,
        lastPracticedAt: "2025-06-01T08:00:00Z",
      },
    },
    examPerformance: null, // not shown in school context
  },
};

// ─── Sidebar card ─────────────────────────────────────────────────────────────

function SchoolContextSidebar({ student }: { student: StudentWithUser }) {
  const { user, studentProfile } = student;
  const accuracyRate =
    studentProfile.totalQuestionsAttempted > 0
      ? (
          (studentProfile.totalQuestionsCorrect / studentProfile.totalQuestionsAttempted) *
          100
        ).toFixed(1)
      : "—";

  return (
    <div className="space-y-4">
      {/* At-a-glance card */}
      <div
        className="rounded-2xl bg-white border p-5"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-3">
          At a Glance
        </h3>
        <dl className="space-y-2.5">
          {[
            { label: "Class", value: studentProfile.currentClass ?? "—" },
            { label: "Admission No.", value: studentProfile.admissionNo ?? "—", mono: true },
            { label: "Avg. Score", value: `${studentProfile.averageScore.toFixed(1)}%` },
            { label: "Accuracy", value: `${accuracyRate}%` },
            { label: "Sessions", value: studentProfile.totalExamsTaken },
            {
              label: "Last Login",
              value: user.lastLoginAt
                ? new Date(user.lastLoginAt).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "—",
            },
            { label: "Logins (Total)", value: user.totalLoginCount },
          ].map(({ label, value, mono }) => (
            <div key={label} className="flex items-center justify-between">
              <dt className="text-[11px] text-text-muted">{label}</dt>
              <dd
                className={`text-[12px] font-semibold text-green-900 ${mono ? "font-mono text-[11px]" : ""}`}>
                {value}
              </dd>
            </div>
          ))}
        </dl>

        {/* Account status */}
        <div
          className="mt-3 pt-3 border-t flex items-center gap-2"
          style={{ borderColor: "rgba(30,80,50,0.06)" }}>
          {user.isActive ? (
            <>
              <CheckCircle2 size={14} className="text-green-500" />
              <span className="text-[12px] font-semibold text-green-700">Active</span>
            </>
          ) : (
            <>
              <AlertCircle size={14} className="text-red-500" />
              <span className="text-[12px] font-semibold text-red-600">Deactivated</span>
            </>
          )}
          {!user.isEmailVerified && (
            <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
              Email unverified
            </span>
          )}
        </div>
      </div>

      {/* Subjects offered */}
      {studentProfile.focusSubjects.length > 0 && (
        <div
          className="rounded-2xl bg-white border p-5"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-3">
            Subjects Offered
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {studentProfile.focusSubjects.map((s) => (
              <span
                key={s}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[11px] font-semibold">
                <BookOpen size={10} /> {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Parent / guardian */}
      {(studentProfile.parentName || studentProfile.parentPhone) && (
        <div
          className="rounded-2xl bg-white border p-5"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-3">
            Parent / Guardian
          </h3>
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center shrink-0 text-[11px] font-bold">
              {studentProfile.parentName
                ? studentProfile.parentName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                : "?"}
            </div>
            <div>
              <p className="text-[13px] font-semibold text-green-900">
                {studentProfile.parentName ?? "—"}
              </p>
              {studentProfile.parentPhone && (
                <p className="text-[11px] text-text-muted">{studentProfile.parentPhone}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div
        className="rounded-2xl bg-white border p-5"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-3">
          Quick Actions
        </h3>
        <div className="space-y-1">
          {[
            { icon: MessageSquare, label: "Send Message", hint: "via email" },
            { icon: Key, label: "Reset Password", hint: "send link" },
            { icon: Shield, label: "Resend Verification", hint: "email link" },
            { icon: History, label: "View Login History", hint: "" },
          ].map(({ icon: Icon, label, hint }) => (
            <button
              key={label}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-cream transition-colors">
              <div className="flex items-center gap-2.5">
                <Icon size={13} className="text-green-700 shrink-0" />
                <span className="text-[12px] font-medium text-green-900">{label}</span>
              </div>
              {hint && <span className="text-[10px] text-text-muted">{hint}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Tab = "overview" | "performance" | "activity" | "settings";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "performance", label: "Performance" },
  { id: "activity", label: "Activity" },
  { id: "settings", label: "Settings" },
];

export default function StudentDetailPage() {
  const router = useRouter();
  const [student, setStudent] = useState<StudentWithUser>(mockStudent);
  const [activities] = useState<ActivityLog[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const { user, studentProfile } = student;
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  const fullName = [user.firstName, user.middleName, user.lastName].filter(Boolean).join(" ");

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-text-muted hover:text-green-900 transition-colors mb-5 text-[13px]">
        <ArrowLeft size={15} /> Back to Students
      </button>

      {/* Profile header */}
      <div
        className="rounded-2xl bg-white border p-5 mb-6 flex flex-col sm:flex-row items-start gap-4"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 text-[18px] font-bold text-green-700">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={fullName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            initials
          )}
        </div>

        {/* Identity */}
        <div className="flex-1 min-w-0">
          <h1 className="font-serif text-[22px] text-green-900 leading-tight mb-1">{fullName}</h1>
          <div className="flex flex-wrap items-center gap-2 text-[12px] text-text-muted">
            <span>{user.email}</span>
            <span className="opacity-40">·</span>
            {studentProfile.currentClass && (
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-[11px]">
                {studentProfile.currentClass}
              </span>
            )}
            {studentProfile.admissionNo && (
              <span className="font-mono text-[11px]">{studentProfile.admissionNo}</span>
            )}
          </div>

          {/* Mini stats row */}
          <div className="flex flex-wrap gap-4 mt-2.5 text-[11px]">
            {[
              {
                icon: TrendingUp,
                value: `${studentProfile.averageScore.toFixed(1)}%`,
                label: "avg score",
                color:
                  studentProfile.averageScore >= 75
                    ? "#10b981"
                    : studentProfile.averageScore >= 50
                      ? "#f59e0b"
                      : "#ef4444",
              },
              {
                icon: BookOpen,
                value: studentProfile.focusSubjects.length,
                label: "subjects",
                color: "#3b82f6",
              },
              {
                icon: Clock,
                value: `${Math.floor(studentProfile.totalMinutesStudied / 60)}h`,
                label: "studied",
                color: "#8b5cf6",
              },
              {
                icon: Users,
                value: studentProfile.leaderboardRank ? `#${studentProfile.leaderboardRank}` : "—",
                label: "class rank",
                color: "#f59e0b",
              },
            ].map(({ icon: Icon, value, label, color }) => (
              <div key={label} className="flex items-center gap-1">
                <Icon size={12} style={{ color }} />
                <span className="font-bold text-green-900" style={{ color }}>
                  {value}
                </span>
                <span className="text-text-muted">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status chip */}
        <div className="shrink-0">
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {user.isActive ? "Active" : "Deactivated"}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 border-b mb-6"
        style={{ borderColor: "rgba(30,80,50,0.1)" }}
        role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-[13px] font-medium border-b-2 -mb-px transition-all ${
              activeTab === tab.id
                ? "border-green-800 text-green-900 font-semibold"
                : "border-transparent text-text-muted hover:text-green-900"
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Two-column body */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5 items-start">
        <main className="space-y-5">
          {activeTab === "overview" && <StudentBasicInfo student={student} />}
          {activeTab === "performance" && <StudentPerformanceStats student={student} />}
          {activeTab === "activity" && <ActivityTimeline activities={activities} />}
          {activeTab === "settings" && (
            <StudentDetailView student={student} onStudentUpdate={setStudent} />
          )}
        </main>

        {/* Sidebar — school context, no gamification */}
        <aside className="lg:sticky lg:top-6">
          <SchoolContextSidebar student={student} />
        </aside>
      </div>
    </div>
  );
}
