"use client";

import {
  Users, GraduationCap, BookOpen, School, ShieldCheck,
  UserCheck, Clock, DollarSign, Star, TrendingUp,
  Building2, Hash,
} from "lucide-react";
import type { UserStats } from "../../types";
import { ROLE_CONFIG, STATUS_CONFIG, SUBSCRIPTION_CONFIG } from "../../constants";
import { MiniStatCard, Card } from "./Primitives";

export function AnalyticsDashboard({ stats }: { stats: UserStats }) {
  return (
    <div className="space-y-6">
      {/* ── Quick stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <MiniStatCard icon={Users}       label="Total Users"    value={stats.total.toLocaleString()}                          color="#2e8b57"  trend={8}  />
        <MiniStatCard icon={GraduationCap} label="Students"     value={stats.byRole.students.toLocaleString()}                color="#0284c7"            />
        <MiniStatCard icon={BookOpen}    label="Tutors"         value={stats.byRole.tutors.toLocaleString()}                  color="#8b5cf6"            />
        <MiniStatCard icon={School}      label="School Admins"  value={stats.byRole.schoolAdmins.toLocaleString()}            color="#f59e0b"            />
        <MiniStatCard icon={UserCheck}   label="Active"         value={stats.active.toLocaleString()}                         color="#10b981"  trend={3}  />
        <MiniStatCard icon={Clock}       label="New This Month" value={stats.newThisMonth.toLocaleString()}                   color="#3b82f6"            />
        <MiniStatCard icon={DollarSign}  label="Revenue"        value={`₦${(stats.totalRevenue / 1000000).toFixed(1)}M`}      color="#8b5cf6"  trend={12} />
        <MiniStatCard icon={Star}        label="Tutor Avg Rating" value={`${stats.tutorAvgRating} ★`}                        color="#f59e0b"            />
      </div>

      {/* ── Row 1: Role distribution + Status breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-serif text-lg text-green-900 mb-4">Users by Role</h3>
          <div className="space-y-4">
            {(
              [
                { key: "student",     label: "Students",     count: stats.byRole.students,     cfg: ROLE_CONFIG.student     },
                { key: "tutor",       label: "Tutors",       count: stats.byRole.tutors,       cfg: ROLE_CONFIG.tutor       },
                { key: "school_admin",label: "School Admins",count: stats.byRole.schoolAdmins, cfg: ROLE_CONFIG.school_admin},
                { key: "super_admin", label: "Super Admins", count: stats.byRole.superAdmins,  cfg: ROLE_CONFIG.super_admin },
              ]
            ).map(({ key, label, count, cfg }) => {
              const Icon = cfg.icon;
              const pct = stats.total > 0 ? ((count / stats.total) * 100).toFixed(1) : "0";
              return (
                <div key={key} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: cfg.bg }}>
                    <Icon size={18} style={{ color: cfg.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-[13px] font-semibold text-green-900">{label}</span>
                      <span className="text-[13px] font-bold text-green-900">{count.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-cream overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: cfg.color }} />
                    </div>
                  </div>
                  <span className="text-[11px] text-text-muted w-10 text-right">{pct}%</span>
                </div>
              );
            })}
          </div>

          {/* Account type split */}
          <div className="mt-6 pt-4 border-t grid grid-cols-2 gap-3" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <div className="p-3 rounded-xl bg-cream/40 text-center">
              <div className="text-xl font-bold text-green-900">{stats.byAccountType.individual.toLocaleString()}</div>
              <div className="text-[11px] text-text-muted">Individual</div>
            </div>
            <div className="p-3 rounded-xl bg-cream/40 text-center">
              <div className="text-xl font-bold text-green-900">{stats.byAccountType.schoolBased.toLocaleString()}</div>
              <div className="text-[11px] text-text-muted">School-Based</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-serif text-lg text-green-900 mb-4">Status Distribution</h3>
          <div className="space-y-3 mb-6">
            {(Object.entries(STATUS_CONFIG) as [string, typeof STATUS_CONFIG[keyof typeof STATUS_CONFIG]][]).map(([status, cfg]) => {
              const count = (stats.byStatus as Record<string, number>)[status] ?? 0;
              const pct = stats.total > 0 ? ((count / stats.total) * 100).toFixed(1) : "0";
              const Icon = cfg.icon;
              return (
                <div key={status} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: cfg.bg }}>
                    <Icon size={14} style={{ color: cfg.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-[13px] text-green-900">{cfg.label}</span>
                      <span className="text-[13px] font-bold text-green-900">{count.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-cream overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: cfg.color }} />
                    </div>
                  </div>
                  <span className="text-[11px] text-text-muted w-10 text-right">{pct}%</span>
                </div>
              );
            })}
          </div>

          {/* Subscription breakdown */}
          <h4 className="text-[13px] font-semibold text-green-900 mb-3">Subscriptions</h4>
          <div className="grid grid-cols-3 gap-2">
            {(Object.entries(SUBSCRIPTION_CONFIG) as [string, typeof SUBSCRIPTION_CONFIG[keyof typeof SUBSCRIPTION_CONFIG]][]).filter(([k]) => k !== "enterprise").map(([tier, cfg]) => {
              const Icon = cfg.icon;
              const count = (stats.bySubscription as Record<string, number>)[tier] ?? 0;
              return (
                <div key={tier} className="p-2.5 rounded-xl text-center" style={{ background: cfg.bg }}>
                  <Icon size={16} className="mx-auto mb-1" style={{ color: cfg.color }} />
                  <div className="text-[14px] font-bold" style={{ color: cfg.color }}>{count.toLocaleString()}</div>
                  <div className="text-[10px] font-semibold" style={{ color: cfg.color }}>{cfg.label}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* ── Row 2: Registration trend + top schools + top subjects ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly registrations bar chart */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="font-serif text-lg text-green-900 mb-4">Monthly Registrations (2024)</h3>
          <div className="h-44 flex items-end gap-1.5">
            {stats.registrationTrend.map((m, i) => {
              const max = Math.max(...stats.registrationTrend.map((x) => x.count));
              const pct = (m.count / max) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-[9px] font-semibold text-green-900 opacity-0 group-hover:opacity-100 transition-opacity">
                    {m.count}
                  </span>
                  <div
                    className="w-full rounded-t-md transition-all"
                    style={{ height: `${Math.max(pct, 3)}%`, background: "linear-gradient(180deg, #2e8b57, #1a4a2e)", minHeight: "4px" }}
                  />
                  <span className="text-[9px] text-text-muted">{m.month}</span>
                </div>
              );
            })}
          </div>

          {/* Student-specific snapshot */}
          <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-3" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <div className="text-center">
              <div className="text-xl font-bold text-green-900">{stats.studentAvgScore}%</div>
              <div className="text-[11px] text-text-muted">Student Avg Score</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-900">{stats.activeSubscriptions.toLocaleString()}</div>
              <div className="text-[11px] text-text-muted">Active Subs</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-900">{stats.verifiedUsers.toLocaleString()}</div>
              <div className="text-[11px] text-text-muted">Verified Users</div>
            </div>
          </div>
        </Card>

        {/* Top schools */}
        <Card className="p-6">
          <h3 className="font-serif text-lg text-green-900 mb-4">Top Schools</h3>
          <div className="space-y-2">
            {stats.topSchools.slice(0, 6).map((s, i) => (
              <div key={s.name} className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-green-800 text-white text-[10px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold text-green-900 truncate">{s.name}</div>
                  <div className="text-[10px] text-text-muted">{s.count} users</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <h4 className="text-[13px] font-semibold text-green-900 mb-3">Top Subjects</h4>
            <div className="space-y-1.5">
              {stats.topSubjects.slice(0, 5).map((s) => (
                <div key={s.name} className="flex items-center justify-between">
                  <span className="text-[12px] text-green-900">{s.name}</span>
                  <span className="text-[12px] font-bold text-green-900">{s.students.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
