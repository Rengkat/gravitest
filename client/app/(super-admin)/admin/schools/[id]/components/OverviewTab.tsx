"use client";

import {
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Activity,
  CreditCard,
  Calendar,
  Zap,
  BarChart3,
  Award,
  Wifi,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { SchoolData } from "@/types/schoolsTypes";
import { SUBSCRIPTION_PLANS } from "@/lib/constants/schools";
import { StatsMiniCard } from "../../components/Primitives";

export function OverviewTab({ school }: { school: SchoolData }) {
  const planCfg = SUBSCRIPTION_PLANS[school.subscription.plan];
  const PlanIcon = planCfg.icon;
  const usagePct = school.stats.subscriptionUsage;
  const usageColor = usagePct >= 90 ? "#ef4444" : usagePct >= 70 ? "#f59e0b" : "#10b981";

  const subExpiry = new Date(school.subscription.expiryDate);
  const daysLeft = Math.ceil((subExpiry.getTime() - Date.now()) / 86_400_000);
  const expiryColor = daysLeft <= 7 ? "#ef4444" : daysLeft <= 30 ? "#f59e0b" : "#10b981";

  return (
    <div className="space-y-5">
      {/* ── Key stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        <StatsMiniCard
          icon={Users}
          label="Total Students"
          value={school.stats.totalStudents.toLocaleString()}
          color="#3b82f6"
        />
        <StatsMiniCard
          icon={Activity}
          label="Active Students"
          value={school.stats.activeStudents.toLocaleString()}
          color="#10b981"
        />
        <StatsMiniCard
          icon={BookOpen}
          label="Classes"
          value={school.stats.totalClasses}
          color="#8b5cf6"
        />
        <StatsMiniCard
          icon={GraduationCap}
          label="Teachers"
          value={school.stats.totalTeachers}
          color="#f59e0b"
        />
        <StatsMiniCard
          icon={TrendingUp}
          label="Avg Performance"
          value={`${school.stats.averagePerformance}%`}
          color={school.stats.averagePerformance >= 60 ? "#10b981" : "#ef4444"}
        />
        <StatsMiniCard
          icon={BarChart3}
          label="Sessions"
          value={school.stats.sessionsCompleted.toLocaleString()}
          color="#0284c7"
        />
      </div>

      {/* ── Engagement row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatsMiniCard
          icon={Zap}
          label="Questions Attempted"
          value={school.stats.questionsAttempted.toLocaleString()}
          color="#f97316"
        />
        <StatsMiniCard
          icon={TrendingUp}
          label="Completion Rate"
          value={`${school.stats.completionRate}%`}
          color="#8b5cf6"
        />
        <StatsMiniCard
          icon={Activity}
          label="Login Rate"
          value={`${school.stats.loginRate}%`}
          color="#0284c7"
        />
        <StatsMiniCard
          icon={Award}
          label="Total Admins"
          value={school.stats.totalAdmins}
          color="#f59e0b"
        />
      </div>

      {/* ── Subscription card ── */}
      <div
        className="rounded-2xl bg-white border p-5"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-4">
          Subscription
        </h2>

        <div className="flex flex-wrap items-center gap-6 mb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: planCfg.bg }}>
              <PlanIcon size={18} style={{ color: planCfg.color }} />
            </div>
            <div>
              <div className="text-[15px] font-bold text-green-900">{planCfg.label}</div>
              <div className="text-[11px] text-text-muted">{planCfg.price}</div>
            </div>
          </div>

          {[
            {
              label: "Status",
              value: <span className="capitalize">{school.subscription.status}</span>,
            },
            { label: "Started", value: school.subscription.startDate },
            { label: "Expires", value: school.subscription.expiryDate },
            {
              label: "Days Left",
              value: (
                <span style={{ color: expiryColor }} className="font-bold">
                  {daysLeft > 0 ? `${daysLeft}d` : "Expired"}
                </span>
              ),
            },
            { label: "Max Students", value: school.subscription.maxStudents.toLocaleString() },
            { label: "Max Classes", value: school.subscription.maxClasses },
            {
              label: "Total Spent",
              value: (
                <strong className="text-green-900">
                  ₦{school.stats.totalSpent.toLocaleString()}
                </strong>
              ),
            },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-0.5 pl-4 border-l border-gray-100">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                {label}
              </span>
              <span className="text-[13px] text-green-900 font-medium">{value}</span>
            </div>
          ))}
        </div>

        {/* Usage bar */}
        <div>
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="text-text-muted font-semibold">Student Capacity Used</span>
            <span className="font-bold" style={{ color: usageColor }}>
              {usagePct}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${usagePct}%`, background: usageColor }}
            />
          </div>
          <p className="text-[10px] text-text-muted mt-1">
            {school.stats.totalStudents.toLocaleString()} of{" "}
            {school.subscription.maxStudents.toLocaleString()} students
          </p>
        </div>

        {/* Features */}
        {school.subscription.features.length > 0 && (
          <div className="mt-4 pt-4 border-t" style={{ borderColor: "rgba(30,80,50,0.06)" }}>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted mb-2">
              Included Features
            </p>
            <div className="flex flex-wrap gap-1.5">
              {school.subscription.features.map((f) => (
                <span
                  key={f}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[11px] font-medium">
                  <CheckCircle2 size={10} /> {f}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Facilities + Address row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Facilities */}
        {school.facilities && school.facilities.length > 0 && (
          <div
            className="rounded-2xl bg-white border p-5"
            style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-3">
              Facilities
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {school.facilities.map((f) => (
                <span
                  key={f}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-gray-200 text-[11px] text-green-900 font-medium">
                  <Wifi size={10} className="text-green-700" /> {f}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Full address */}
        <div
          className="rounded-2xl bg-white border p-5"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-3">
            Address
          </h2>
          <address className="not-italic space-y-1 text-[13px] text-green-900">
            <p>{school.location.address}</p>
            <p>
              {school.location.city}, {school.location.state}
            </p>
            <p>{school.location.country}</p>
            {school.location.lga && (
              <p className="text-text-muted text-[11px]">LGA: {school.location.lga}</p>
            )}
          </address>
        </div>
      </div>
    </div>
  );
}
