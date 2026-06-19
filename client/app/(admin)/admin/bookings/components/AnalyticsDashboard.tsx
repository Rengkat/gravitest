import {
  Calendar, CheckCircle, XCircle, DollarSign, Target, Star, Clock, Play,
} from "lucide-react";
import {
  ComposedChart, Bar, Line, BarChart, PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { MiniCard, SectionCard } from "./Primitives";
import type { BookingStats } from "../types";

interface Props {
  stats: BookingStats;
}

export function AnalyticsDashboard({ stats }: Props) {
  return (
    <div className="space-y-6">
      {/* Summary mini cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <MiniCard icon={Calendar}     label="Total Bookings" value={stats.totalBookings}                        color="#2e8b57" />
        <MiniCard icon={Play}         label="Upcoming"       value={stats.upcomingBookings}                     color="#3b82f6" />
        <MiniCard icon={CheckCircle}  label="Completed"      value={stats.completedBookings}                    color="#10b981" />
        <MiniCard icon={XCircle}      label="Cancelled"      value={stats.cancelledBookings}                    color="#ef4444" />
        <MiniCard icon={DollarSign}   label="Total Revenue"  value={`₦${(stats.totalRevenue / 1000).toFixed(0)}K`} color="#f59e0b" />
        <MiniCard icon={Target}       label="Completion"     value={`${stats.completionRate}%`}                 color="#8b5cf6" />
        <MiniCard icon={Star}         label="Avg Rating"     value={stats.averageRating.toFixed(1)}             color="#f59e0b" />
        <MiniCard icon={Clock}        label="Total Hours"    value={stats.totalHours}                           color="#6366f1" />
      </div>

      {/* Revenue & bookings composed chart */}
      <SectionCard title="Revenue & Bookings Overview">
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={stats.revenueByMonth}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,80,50,0.1)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7280" }} />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 11, fill: "#6b7280" }}
              tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}K`}
            />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#6b7280" }} />
            <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
            <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#2e8b57" radius={[4,4,0,0]} />
            <Line yAxisId="right" type="monotone" dataKey="bookings" name="Bookings" stroke="#f59e0b" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </SectionCard>

      {/* Three column row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status distribution */}
        <SectionCard title="Status Breakdown">
          <ResponsiveContainer width="100%" height={220}>
            <RechartsPie>
              <Pie
                data={stats.bookingsByStatus.filter((b) => b.count > 0)}
                cx="50%" cy="50%"
                innerRadius={45} outerRadius={75}
                paddingAngle={3}
                dataKey="count" nameKey="status">
                {stats.bookingsByStatus.filter((b) => b.count > 0).map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RechartsPie>
          </ResponsiveContainer>
        </SectionCard>

        {/* Top subjects */}
        <SectionCard title="Top Subjects">
          <div className="space-y-3">
            {stats.topSubjects.map((subject, i) => (
              <div key={subject.subject} className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0"
                  style={{ background: `${subject.color}15`, color: subject.color }}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-[13px] text-green-900">{subject.subject}</span>
                    <span className="text-[13px] font-bold text-green-900">{subject.count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-cream">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${stats.topSubjects[0].count > 0 ? (subject.count / stats.topSubjects[0].count) * 100 : 0}%`,
                        background: subject.color,
                      }}
                    />
                  </div>
                </div>
                <span className="text-[11px] text-text-muted shrink-0">
                  ₦{(subject.revenue / 1000).toFixed(0)}K
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Peak hours */}
        <SectionCard title="Peak Hours">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.hourlyDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,80,50,0.1)" />
              <XAxis dataKey="hour" tick={{ fontSize: 9, fill: "#6b7280" }} />
              <YAxis tick={{ fontSize: 9, fill: "#6b7280" }} />
              <Tooltip />
              <Bar dataKey="count" fill="#2e8b57" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>
    </div>
  );
}
