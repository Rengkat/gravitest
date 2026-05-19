// app/school/page.tsx (Overview)
"use client";

import Link from "next/link";
import {
  Users,
  GraduationCap,
  BarChart3,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  School as SchoolIcon,
  BookOpen,
  HelpCircle,
  Zap,
} from "lucide-react";
import StatCard from "@/components/StatCard";

// Mock data
const SCHOOL_STATS = {
  totalStudents: 1245,
  totalStudentsChange: 8.2,
  averageScore: 72.5,
  averageScoreChange: 5.3,
  passRate: 78.3,
  passRateChange: 6.1,
  activeClasses: 24,
  activeClassesChange: 0,
  completionRate: 68.4,
  completionRateChange: 4.2,
  topPerformer: 94.5,
};

const RECENT_ACTIVITIES = [
  {
    id: 1,
    type: "exam",
    description: "SS3 Mock Exam Completed",
    detail: "120 students participated",
    time: "2 hours ago",
    icon: BarChart3,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600",
  },
  {
    id: 2,
    type: "student",
    description: "New Students Enrolled",
    detail: "45 students added to SS1",
    time: "5 hours ago",
    icon: Users,
    iconBg: "bg-green-500/10",
    iconColor: "text-green-600",
  },
  {
    id: 3,
    type: "class",
    description: "New Class Created",
    detail: "SS3 Science Set A",
    time: "1 day ago",
    icon: GraduationCap,
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-600",
  },
];

const TOP_PERFORMING_STUDENTS = [
  { id: 1, name: "Adebayo Oluwaseun", score: 94.5, class: "SS3 Science", improvement: 12 },
  { id: 2, name: "Okafor Chukwudi", score: 92.3, class: "SS3 Science", improvement: 8 },
  { id: 3, name: "Eze Chioma", score: 91.8, class: "SS3 Art", improvement: 15 },
  { id: 4, name: "Bello Aisha", score: 90.2, class: "SS3 Science", improvement: 5 },
  { id: 5, name: "Nwosu Emeka", score: 89.7, class: "SS3 Commercial", improvement: 10 },
];

const WEAK_AREAS = [
  { subject: "Mathematics", score: 65.2, students: 234, trend: "down" },
  { subject: "Physics", score: 68.5, students: 189, trend: "down" },
  { subject: "Chemistry", score: 70.1, students: 156, trend: "up" },
];

export default function SchoolOverview() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-green-900 mb-2">School Overview</h1>
        <p className="text-text-muted">
          Welcome back, Lagos Preparatory School. Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Users}
          label="Total Students"
          value={SCHOOL_STATS.totalStudents.toLocaleString()}
          color="#2e8b57"
          trend={SCHOOL_STATS.totalStudentsChange}
        />
        <StatCard
          icon={GraduationCap}
          label="Avg Score"
          value={`${SCHOOL_STATS.averageScore}%`}
          color="#f5c842"
          trend={SCHOOL_STATS.averageScoreChange}
        />
        <StatCard
          icon={Award}
          label="Pass Rate"
          value={`${SCHOOL_STATS.passRate}%`}
          color="#6366f1"
          trend={SCHOOL_STATS.passRateChange}
        />
        <StatCard
          icon={BarChart3}
          label="Active Classes"
          value={SCHOOL_STATS.activeClasses.toString()}
          color="#f97316"
          trend={SCHOOL_STATS.activeClassesChange}
        />
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div
          className="p-4 rounded-2xl bg-white border"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={16} className="text-green-600" />
            <span className="text-[12px] text-text-muted">Completion Rate</span>
          </div>
          <div className="text-[22px] font-bold text-green-900">{SCHOOL_STATS.completionRate}%</div>
          <div className="text-[10px] text-green-600 mt-1">
            ↑ {SCHOOL_STATS.completionRateChange}%
          </div>
        </div>

        <div
          className="p-4 rounded-2xl bg-white border"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-blue-600" />
            <span className="text-[12px] text-text-muted">Top Performer</span>
          </div>
          <div className="text-[22px] font-bold text-green-900">{SCHOOL_STATS.topPerformer}%</div>
          <div className="text-[10px] text-text-muted mt-1">Highest individual score</div>
        </div>

        <div
          className="p-4 rounded-2xl bg-white border"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-orange-600" />
            <span className="text-[12px] text-text-muted">Active Sessions</span>
          </div>
          <div className="text-[22px] font-bold text-green-900">3</div>
          <div className="text-[10px] text-text-muted mt-1">In progress now</div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Recent Activity & Weak Areas */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Activity */}
          <div
            className="p-6 rounded-2xl bg-white border"
            style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl text-green-900">Recent Activity</h2>
              <Link
                href="/school/students"
                className="text-[12px] font-semibold text-green-600 hover:text-green-700">
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {RECENT_ACTIVITIES.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-cream transition-colors">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg ${activity.iconBg} flex items-center justify-center`}>
                        <Icon size={16} className={activity.iconColor} />
                      </div>
                      <div>
                        <div className="text-[13px] font-semibold text-green-900">
                          {activity.description}
                        </div>
                        <div className="text-[11px] text-text-muted">{activity.detail}</div>
                      </div>
                    </div>
                    <div className="text-[11px] text-text-muted">{activity.time}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weak Areas */}
          <div
            className="p-6 rounded-2xl bg-white border"
            style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle size={18} className="text-orange-500" />
              <h2 className="font-serif text-xl text-green-900">Areas Needing Improvement</h2>
            </div>
            <div className="space-y-4">
              {WEAK_AREAS.map((area) => (
                <div key={area.subject}>
                  <div className="flex justify-between text-[13px] mb-1">
                    <span className="font-semibold text-green-900">{area.subject}</span>
                    <span className="text-text-muted">{area.students} students</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-cream rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-orange-500"
                        style={{ width: `${area.score}%` }}
                      />
                    </div>
                    <span className="text-[13px] font-semibold text-green-900">{area.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Top Students & Quick Actions */}
        <div className="space-y-6">
          {/* Top Performing Students */}
          <div
            className="p-6 rounded-2xl bg-white border"
            style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award size={18} className="text-gold" />
                <h2 className="font-serif text-xl text-green-900">Top Performers</h2>
              </div>
              <Link
                href="/school/students"
                className="text-[12px] font-semibold text-green-600 hover:text-green-700">
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {TOP_PERFORMING_STUDENTS.map((student, idx) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-cream transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-green-800 flex items-center justify-center text-white text-[11px] font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-green-900">{student.name}</div>
                      <div className="text-[10px] text-text-muted">{student.class}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[14px] font-bold text-green-900">{student.score}%</div>
                    <div className="text-[10px] text-green-600">↑ {student.improvement}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="space-y-3">
            <Link
              href="/school/students/bulk-upload"
              className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-800 to-green-700 text-white group transition-all hover:scale-[1.02]">
              <div className="flex items-center gap-3">
                <Download size={18} />
                <div>
                  <div className="text-[13px] font-semibold">Bulk Upload Students</div>
                  <div className="text-[11px] text-white/60">Import CSV file</div>
                </div>
              </div>
              <Eye size={16} className="opacity-0 group-hover:opacity-100 transition" />
            </Link>

            <Link
              href="/school/questions/create"
              className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-green-900 group transition-all hover:scale-[1.02]">
              <div className="flex items-center gap-3">
                <HelpCircle size={18} />
                <div>
                  <div className="text-[13px] font-semibold">Create CBT Test</div>
                  <div className="text-[11px] text-green-900/60">Build custom exam</div>
                </div>
              </div>
              <Eye size={16} className="opacity-0 group-hover:opacity-100 transition" />
            </Link>

            <Link
              href="/school/ai"
              className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white group transition-all hover:scale-[1.02]">
              <div className="flex items-center gap-3">
                <Zap size={18} />
                <div>
                  <div className="text-[13px] font-semibold">AI Insights</div>
                  <div className="text-[11px] text-white/60">View AI analytics</div>
                </div>
              </div>
              <Eye size={16} className="opacity-0 group-hover:opacity-100 transition" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
