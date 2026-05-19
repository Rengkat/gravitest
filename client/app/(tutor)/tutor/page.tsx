"use client";

import Link from "next/link";
import {
  Calendar,
  Video,
  DollarSign,
  Star,
  TrendingUp,
  Clock,
  Users,
  Award,
  ChevronRight,
  MessageCircle,
  FileText,
} from "lucide-react";
import StatCard from "../components/StatCard";

// Mock data
const TUTOR_STATS = {
  totalStudents: 45,
  totalStudentsChange: 12.5,
  totalSessions: 128,
  totalSessionsChange: 8.3,
  totalRevenue: 385000,
  totalRevenueChange: 15.2,
  rating: 4.8,
  ratingChange: 0.2,
  completionRate: 94,
  completionRateChange: 3.1,
  upcomingSessions: 5,
};

const UPCOMING_SESSIONS = [
  {
    id: 1,
    student: "Adebayo Oluwaseun",
    subject: "Mathematics",
    date: "Today",
    time: "4:00 PM",
    duration: "1 hour",
    status: "confirmed",
  },
  {
    id: 2,
    student: "Okafor Chukwudi",
    subject: "Further Maths",
    date: "Tomorrow",
    time: "2:00 PM",
    duration: "1.5 hours",
    status: "pending",
  },
  {
    id: 3,
    student: "Eze Chioma",
    subject: "Physics",
    date: "Jan 20, 2024",
    time: "10:00 AM",
    duration: "1 hour",
    status: "confirmed",
  },
];

const RECENT_REVIEWS = [
  {
    id: 1,
    student: "Bello Aisha",
    rating: 5,
    comment: "Excellent tutor! Very patient and explains concepts clearly.",
    date: "2 days ago",
  },
  {
    id: 2,
    student: "Nwosu Emeka",
    rating: 4.5,
    comment: "Great session, helped me understand calculus better.",
    date: "5 days ago",
  },
  {
    id: 3,
    student: "Okafor Chukwudi",
    rating: 5,
    comment: "Very knowledgeable and professional.",
    date: "1 week ago",
  },
];

const EARNINGS_BREAKDOWN = [
  { month: "Jan", earnings: 85000 },
  { month: "Feb", earnings: 92000 },
  { month: "Mar", earnings: 78000 },
  { month: "Apr", earnings: 95000 },
  { month: "May", earnings: 105000 },
  { month: "Jun", earnings: 112000 },
];

export default function TutorOverview() {
  const maxEarnings = Math.max(...EARNINGS_BREAKDOWN.map((e) => e.earnings));

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-green-900 mb-2">Welcome back, Dr. Williams!</h1>
        <p className="text-text-muted">
          Your teaching impact is growing. Here's your teaching summary.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Users}
          label="Total Students"
          value={TUTOR_STATS.totalStudents}
          color="#2e8b57"
          trend={TUTOR_STATS.totalStudentsChange}
        />
        <StatCard
          icon={Video}
          label="Total Sessions"
          value={TUTOR_STATS.totalSessions}
          color="#f5c842"
          trend={TUTOR_STATS.totalSessionsChange}
        />
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={`₦${(TUTOR_STATS.totalRevenue / 1000).toFixed(0)}`}
          color="#10b981"
          trend={TUTOR_STATS.totalRevenueChange}
          suffix="K"
        />
        <StatCard
          icon={Star}
          label="Rating"
          value={TUTOR_STATS.rating.toString()}
          color="#f59e0b"
          trend={TUTOR_STATS.ratingChange}
          suffix="/5"
        />
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div
          className="p-4 rounded-2xl bg-white border"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-green-600" />
            <span className="text-[12px] text-text-muted">Completion Rate</span>
          </div>
          <div className="text-[22px] font-bold text-green-900">{TUTOR_STATS.completionRate}%</div>
          <div className="text-[10px] text-green-600 mt-1">
            ↑ {TUTOR_STATS.completionRateChange}%
          </div>
        </div>

        <div
          className="p-4 rounded-2xl bg-white border"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={16} className="text-blue-600" />
            <span className="text-[12px] text-text-muted">Upcoming Sessions</span>
          </div>
          <div className="text-[22px] font-bold text-green-900">{TUTOR_STATS.upcomingSessions}</div>
          <div className="text-[10px] text-text-muted mt-1">This week</div>
        </div>

        <div
          className="p-4 rounded-2xl bg-white border"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-green-600" />
            <span className="text-[12px] text-text-muted">Student Satisfaction</span>
          </div>
          <div className="text-[22px] font-bold text-green-900">98%</div>
          <div className="text-[10px] text-green-600 mt-1">↑ 5%</div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Upcoming Sessions & Earnings Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Sessions */}
          <div
            className="p-6 rounded-2xl bg-white border"
            style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl text-green-900">Upcoming Sessions</h2>
              <Link
                href="/tutor/sessions"
                className="text-[12px] font-semibold text-green-600 hover:text-green-700">
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {UPCOMING_SESSIONS.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-cream transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <Video size={16} className="text-green-600" />
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-green-900">
                        {session.student}
                      </div>
                      <div className="text-[11px] text-text-muted">
                        {session.subject} • {session.duration}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[13px] font-semibold text-green-900">{session.time}</div>
                    <div className="text-[11px] text-text-muted">{session.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Earnings Chart */}
          <div
            className="p-6 rounded-2xl bg-white border"
            style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl text-green-900">Earnings Overview</h2>
              <Link
                href="/tutor/revenue"
                className="text-[12px] font-semibold text-green-600 hover:text-green-700">
                View Details →
              </Link>
            </div>
            <div className="h-48 flex items-end gap-3 mb-4">
              {EARNINGS_BREAKDOWN.map((month) => {
                const height = (month.earnings / maxEarnings) * 100;
                return (
                  <div key={month.month} className="flex-1 flex flex-col items-center gap-2 group">
                    <div
                      className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg transition-all group-hover:from-green-500 group-hover:to-green-300"
                      style={{ height: `${height}%`, minHeight: "4px" }}
                    />
                    <span className="text-[10px] text-text-muted">{month.month}</span>
                  </div>
                );
              })}
            </div>
            <div className="pt-4 border-t flex justify-between text-[12px] text-text-muted">
              <span>Total: ₦{(TUTOR_STATS.totalRevenue / 1000).toFixed(0)}K</span>
              <span>Avg: ₦{(TUTOR_STATS.totalRevenue / 6 / 1000).toFixed(0)}K/month</span>
            </div>
          </div>
        </div>

        {/* Right Column - Recent Reviews & Quick Actions */}
        <div className="space-y-6">
          {/* Recent Reviews */}
          <div
            className="p-6 rounded-2xl bg-white border"
            style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <div className="flex items-center gap-2 mb-4">
              <Star size={18} className="text-gold" />
              <h2 className="font-serif text-xl text-green-900">Recent Reviews</h2>
            </div>
            <div className="space-y-4">
              {RECENT_REVIEWS.map((review) => (
                <div key={review.id} className="pb-3 border-b last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] font-semibold text-green-900">
                      {review.student}
                    </span>
                    <span className="text-[11px] text-text-muted">{review.date}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={
                          i < Math.floor(review.rating) ? "fill-gold text-gold" : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-[12px] text-text-muted line-clamp-2">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="space-y-3">
            <Link
              href="/tutor/sessions/create"
              className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-800 to-green-700 text-white group transition-all hover:scale-[1.02]">
              <div className="flex items-center gap-3">
                <Video size={18} />
                <div>
                  <div className="text-[13px] font-semibold">Start a Session</div>
                  <div className="text-[11px] text-white/60">Launch live tutoring</div>
                </div>
              </div>
              <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition" />
            </Link>

            <Link
              href="/tutor/ai"
              className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-green-900 group transition-all hover:scale-[1.02]">
              <div className="flex items-center gap-3">
                <MessageCircle size={18} />
                <div>
                  <div className="text-[13px] font-semibold">AI Teaching Assistant</div>
                  <div className="text-[11px] text-green-900/60">Get lesson suggestions</div>
                </div>
              </div>
              <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition" />
            </Link>

            <Link
              href="/tutor/library"
              className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white group transition-all hover:scale-[1.02]">
              <div className="flex items-center gap-3">
                <FileText size={18} />
                <div>
                  <div className="text-[13px] font-semibold">Browse Resources</div>
                  <div className="text-[11px] text-white/60">Access teaching materials</div>
                </div>
              </div>
              <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
