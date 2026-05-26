import {
  Users, Check, Clock, Ban, Star, DollarSign, GraduationCap, Briefcase,
} from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area,
} from "recharts";
import { MiniCard, SectionCard } from "./Primitives";
import { STATUS_CONFIG } from "../constants";
import type { TutorStats } from "../types";

interface Props {
  stats: TutorStats;
  inactiveTutorCount: number;
}

export function AnalyticsDashboard({ stats, inactiveTutorCount }: Props) {
  return (
    <div className="space-y-6">
      {/* Summary mini cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <MiniCard icon={Users}        label="Total Tutors"   value={stats.totalTutors}                             color="#2e8b57" />
        <MiniCard icon={Check}        label="Active"         value={stats.activeTutors}                            color="#10b981" />
        <MiniCard icon={Clock}        label="Pending"        value={stats.pendingVerification}                     color="#f59e0b" />
        <MiniCard icon={Ban}          label="Suspended"      value={stats.suspendedTutors}                         color="#ef4444" />
        <MiniCard icon={Star}         label="Avg Rating"     value={stats.averageRating.toFixed(1)}                color="#f59e0b" />
        <MiniCard icon={DollarSign}   label="Avg Rate"       value={`₦${(stats.averageHourlyRate / 1000).toFixed(0)}K`} color="#3b82f6" />
        <MiniCard icon={GraduationCap} label="Secondary"     value={stats.secondaryTutors}                         color="#2e8b57" />
        <MiniCard icon={Briefcase}    label="Professional"   value={stats.professionalTutors}                      color="#7c3aed" />
      </div>

      {/* Three column charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status distribution */}
        <SectionCard title="Status Distribution">
          <div className="space-y-3">
            {Object.entries(STATUS_CONFIG).map(([key, config]) => {
              const Icon = config.icon;
              const countMap: Record<string, number> = {
                active:   stats.activeTutors,
                inactive: inactiveTutorCount,
                suspended: stats.suspendedTutors,
                pending:  stats.pendingVerification,
                on_leave: stats.onLeaveTutors,
              };
              const count = countMap[key] ?? 0;
              return (
                <div key={key} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: config.bg }}>
                    <Icon size={14} style={{ color: config.text }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-[13px] text-green-900">{config.label}</span>
                      <span className="text-[13px] font-bold text-green-900">{count}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* Rating distribution pie */}
        <SectionCard title="Rating Distribution">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={stats.performanceDistribution}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="count"
                nameKey="rating">
                {stats.performanceDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Experience levels bar */}
        <SectionCard title="Experience Levels">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.tutorsByExperience} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,80,50,0.1)" />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="range" tick={{ fontSize: 10 }} width={80} />
              <Tooltip />
              <Bar dataKey="count" fill="#2e8b57" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* Specializations & states */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Top Specializations">
          <div className="space-y-3">
            {stats.topSpecializations.map((spec, i) => (
              <div key={spec.subject} className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0"
                  style={{ background: `${spec.color}15`, color: spec.color }}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-[13px] text-green-900">{spec.subject}</span>
                    <span className="text-[13px] font-bold text-green-900">{spec.count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-cream">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(spec.count / stats.topSpecializations[0].count) * 100}%`,
                        background: spec.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Tutors by State">
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {stats.tutorsByState.map((item) => (
              <div key={item.state} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                <span className="text-[13px] text-green-900">{item.state}</span>
                <span className="text-[13px] font-bold text-green-900">{item.count}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Monthly onboarding trend */}
      <SectionCard title="Tutor Onboarding Trend">
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={stats.monthlyOnboarding}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,80,50,0.1)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7280" }} />
            <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
            <Tooltip contentStyle={{ borderRadius: "8px" }} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#2e8b57"
              fill="#2e8b5720"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </SectionCard>
    </div>
  );
}
