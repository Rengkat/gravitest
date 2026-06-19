"use client";

import { Calendar, Star, Target, Clock, TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
} from "recharts";
import { BOOKING_ANALYTICS } from "@/lib/mock/bookings";
import { BOOKINGS } from "@/lib/mock/bookings";
import { formatPrice, PIE_COLORS } from "@/lib/constants/bookings";

export default function AnalyticsDashboard() {
  const a = BOOKING_ANALYTICS;

  const kpis = [
    {
      icon: Calendar,
      color: "bg-blue-100 text-blue-600",
      value: a.totalBookings,
      label: "Total Sessions",
      sub: `+${a.monthlyTrend[3].bookings - a.monthlyTrend[2].bookings} from last month`,
      subColor: "text-green-600",
    },
    {
      icon: () => <span className="text-green-600 font-bold text-lg">₦</span>,
      color: "bg-green-100 text-green-600",
      value: `₦${(a.totalSpent / 1000).toFixed(0)}k`,
      label: "Total Spent",
      sub: `Avg ${formatPrice(Math.round(a.totalSpent / a.totalBookings))}/session`,
      subColor: "text-gray-500",
    },
    {
      icon: Star,
      color: "bg-yellow-100 text-yellow-600",
      value: a.averageRating,
      label: "Avg. Rating",
      sub: `From ${BOOKINGS.filter((b) => b.feedback).length} reviews`,
      subColor: "text-gray-500",
    },
    {
      icon: Target,
      color: "bg-purple-100 text-purple-600",
      value: `${a.completionRate}%`,
      label: "Completion Rate",
      sub: "+5% improvement",
      subColor: "text-green-600",
    },
    {
      icon: Clock,
      color: "bg-orange-100 text-orange-600",
      value: a.hoursLearned,
      label: "Hours Learned",
      sub: `~${(a.hoursLearned / a.totalBookings).toFixed(1)}h/session`,
      subColor: "text-gray-500",
    },
  ];

  return (
    <div className="mb-8 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${kpi.color}`}>
                  <Icon size={20} />
                </div>
                <span className="text-xl font-bold text-gray-800">{kpi.value}</span>
              </div>
              <p className="text-sm text-gray-600">{kpi.label}</p>
              <p className={`text-xs mt-1 ${kpi.subColor}`}>{kpi.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly trend */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Learning Progress</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={a.monthlyTrend}>
              <defs>
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="bookings"
                stroke="#10B981"
                fillOpacity={1}
                fill="url(#colorBookings)"
                name="Bookings"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="amount"
                stroke="#3B82F6"
                name="Amount (₦)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Subject Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Subject Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={a.subjectDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ index }) => {
                  const entry = a.subjectDistribution[index!];
                  return `${entry.subject}: ${entry.percentage}%`;
                }}
                outerRadius={80}
                dataKey="count">
                {a.subjectDistribution.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance by Subject */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance by Subject</h3>
        <div className="space-y-4">
          {a.performanceBySubject.map((subject, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{subject.subject}</span>
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">Score: {subject.score}%</span>
                  <span className="text-green-600 flex items-center gap-1">
                    <TrendingUp size={14} />+{subject.improvement}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${subject.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
