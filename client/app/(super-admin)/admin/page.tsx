"use client";

import Link from "next/link";
import {
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  School,
  CreditCard,
  AlertCircle,
  HelpCircle,
  Bot,
  ArrowUp,
  ArrowDown,
  Calendar,
  Clock,
  Settings,
} from "lucide-react";
import StatCard from "../components/StatCard";

// Sample data - replace with actual API data
const PLATFORM_STATS = {
  dailyActiveUsers: 2450,
  dailyActiveUsersChange: 12.5,
  monthlyRevenue: 850000,
  monthlyRevenueChange: -2.3,
  totalSessionsToday: 1280,
  totalSessionsChange: 8.7,
  activeSubscriptions: 890,
  activeSubscriptionsChange: 5.2,
  totalUsers: 12450,
  totalSchools: 145,
  totalTutors: 320,
  questionsInBank: 8500,
};

const RECENT_ACTIVITIES = [
  {
    id: 1,
    type: "user_signup",
    description: "New student registered",
    detail: "Adebayo Oluwaseun",
    time: "2 minutes ago",
    icon: Users,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600",
  },
  {
    id: 2,
    type: "payment",
    description: "Subscription payment received",
    detail: "₦15,000 - Premium Plan",
    time: "15 minutes ago",
    icon: CreditCard,
    iconBg: "bg-green-500/10",
    iconColor: "text-green-600",
  },
  {
    id: 3,
    type: "school",
    description: "New school onboarded",
    detail: "Lagos Preparatory School",
    time: "1 hour ago",
    icon: School,
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-600",
  },
  {
    id: 4,
    type: "question",
    description: "Questions added to bank",
    detail: "50 Physics questions uploaded",
    time: "2 hours ago",
    icon: HelpCircle,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-600",
  },
  {
    id: 5,
    type: "ai_usage",
    description: "High AI usage detected",
    detail: "2,340 API calls this hour",
    time: "3 hours ago",
    icon: Bot,
    iconBg: "bg-red-500/10",
    iconColor: "text-red-600",
  },
];

const AI_USAGE_SUMMARY = {
  totalCalls: 45670,
  totalCost: 125000,
  averageResponseTime: "1.2s",
  topFeature: "Sabi-Explain",
};

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-green-900 mb-2">Platform Overview</h1>
        <p className="text-text-muted">
          Monitor platform performance, user activity, and key metrics in real-time.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Users}
          label="Daily Active Users"
          value={PLATFORM_STATS.dailyActiveUsers.toLocaleString()}
          color="#2e8b57"
          trend={PLATFORM_STATS.dailyActiveUsersChange}
        />
        <StatCard
          icon={DollarSign}
          label="Monthly Revenue"
          value={`₦${(PLATFORM_STATS.monthlyRevenue / 1000).toFixed(0)}K`}
          color="#f5c842"
          trend={PLATFORM_STATS.monthlyRevenueChange}
        />
        <StatCard
          icon={Activity}
          label="Sessions Today"
          value={PLATFORM_STATS.totalSessionsToday.toLocaleString()}
          color="#6366f1"
          trend={PLATFORM_STATS.totalSessionsChange}
        />
        <StatCard
          icon={CreditCard}
          label="Active Subscriptions"
          value={PLATFORM_STATS.activeSubscriptions.toLocaleString()}
          color="#f97316"
          trend={PLATFORM_STATS.activeSubscriptionsChange}
        />
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div
          className="p-4 rounded-2xl bg-white border"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-blue-600" />
            <span className="text-[12px] text-text-muted">Total Users</span>
          </div>
          <div className="text-[22px] font-bold text-green-900">
            {PLATFORM_STATS.totalUsers.toLocaleString()}
          </div>
        </div>

        <div
          className="p-4 rounded-2xl bg-white border"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center gap-2 mb-2">
            <School size={16} className="text-purple-600" />
            <span className="text-[12px] text-text-muted">Schools</span>
          </div>
          <div className="text-[22px] font-bold text-green-900">
            {PLATFORM_STATS.totalSchools.toLocaleString()}
          </div>
        </div>

        <div
          className="p-4 rounded-2xl bg-white border"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-green-600" />
            <span className="text-[12px] text-text-muted">Tutors</span>
          </div>
          <div className="text-[22px] font-bold text-green-900">
            {PLATFORM_STATS.totalTutors.toLocaleString()}
          </div>
        </div>

        <div
          className="p-4 rounded-2xl bg-white border"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle size={16} className="text-orange-600" />
            <span className="text-[12px] text-text-muted">Question Bank</span>
          </div>
          <div className="text-[22px] font-bold text-green-900">
            {PLATFORM_STATS.questionsInBank.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div
            className="p-6 rounded-2xl bg-white border"
            style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl text-green-900">Recent Activity</h2>
              <Link
                href="/admin/activity"
                className="text-[12px] font-semibold text-green-600 hover:text-green-700">
                View All →
              </Link>
            </div>
            <div className="space-y-1">
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

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/users"
              className="p-5 rounded-2xl bg-gradient-to-r from-green-800 to-green-700 text-white group transition-all hover:scale-[1.02]">
              <Users size={24} className="mb-3" />
              <div className="text-[15px] font-semibold mb-1">Manage Users</div>
              <div className="text-[12px] text-white/60">View, search, and manage all users</div>
            </Link>

            <Link
              href="/admin/questions"
              className="p-5 rounded-2xl bg-gradient-to-r from-gold to-gold-dark text-green-900 group transition-all hover:scale-[1.02]">
              <HelpCircle size={24} className="mb-3" />
              <div className="text-[15px] font-semibold mb-1">Question Bank</div>
              <div className="text-[12px] text-green-900/60">Manage past questions</div>
            </Link>

            <Link
              href="/admin/settings"
              className="p-5 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 text-white group transition-all hover:scale-[1.02]">
              <Settings size={24} className="mb-3" />
              <div className="text-[15px] font-semibold mb-1">Settings</div>
              <div className="text-[12px] text-white/60">Platform configuration</div>
            </Link>
          </div>
        </div>

        {/* Right Column - AI Usage & Alerts */}
        <div className="space-y-6">
          {/* AI Usage Summary */}
          <div
            className="p-6 rounded-2xl bg-white border"
            style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <div className="flex items-center gap-2 mb-4">
              <Bot size={18} className="text-green-600" />
              <h2 className="font-serif text-xl text-green-900">AI Usage</h2>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="text-text-muted">Total API Calls</span>
                  <span className="font-semibold text-green-900">
                    {AI_USAGE_SUMMARY.totalCalls.toLocaleString()}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="text-text-muted">Total Cost</span>
                  <span className="font-semibold text-green-900">
                    ₦{AI_USAGE_SUMMARY.totalCost.toLocaleString()}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="text-text-muted">Avg Response Time</span>
                  <span className="font-semibold text-green-900">
                    {AI_USAGE_SUMMARY.averageResponseTime}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="text-text-muted">Top Feature</span>
                  <span className="font-semibold text-green-900">
                    {AI_USAGE_SUMMARY.topFeature}
                  </span>
                </div>
              </div>
              <Link
                href="/admin/ai-logs"
                className="w-full block text-center py-2 rounded-lg text-[12px] font-semibold transition-all"
                style={{ background: "rgba(26,74,46,0.08)", color: "#1a4a2e" }}>
                View AI Logs →
              </Link>
            </div>
          </div>

          {/* System Alerts */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-green-800 to-green-700 text-white">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle size={18} />
              <h2 className="font-serif text-xl">System Status</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <div>
                  <div className="text-[13px] font-semibold">All Systems Operational</div>
                  <div className="text-[11px] text-white/60">99.9% uptime</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <div>
                  <div className="text-[13px] font-semibold">Database Backup</div>
                  <div className="text-[11px] text-white/60">Last backup: 2 hours ago</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <div>
                  <div className="text-[13px] font-semibold">API Rate Limit</div>
                  <div className="text-[11px] text-white/60">32% of daily limit used</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
