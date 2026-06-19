"use client";

import {
  Zap,
  Trophy,
  BookOpen,
  Clock,
  Star,
  Users,
  CheckCircle2,
  School,
  Crown,
  StickyNote,
  TrendingUp,
  Flame,
} from "lucide-react";
import type { User } from "../../types";
import { Badge } from "../../components/Primitives";
import { SUBSCRIPTION_CONFIG } from "../../constants";

// ─── Local stat card ──────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  sub,
}: {
  icon: any;
  label: string;
  value: string | number;
  color: string;
  sub?: string;
}) {
  return (
    <div
      className="p-4 rounded-xl bg-white border flex items-center gap-3"
      style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${color}15` }}>
        <Icon size={16} style={{ color }} />
      </div>
      <div className="min-w-0">
        <div className="text-[15px] font-bold text-green-900 leading-tight truncate">{value}</div>
        <div className="text-[10px] text-text-muted leading-none mt-0.5">{label}</div>
        {sub && (
          <div className="text-[10px] mt-0.5" style={{ color }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white border p-5" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <h2 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function OverviewTab({ user }: { user: User }) {
  const subCfg = SUBSCRIPTION_CONFIG[user.subscriptionTier];
  const SubIcon = subCfg.icon;

  return (
    <div className="space-y-5">
      {/* ── Subscription ── */}
      <Section title="Subscription & Spend">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: subCfg.bg }}>
              <SubIcon size={18} style={{ color: subCfg.color }} />
            </div>
            <div>
              <div className="text-[14px] font-bold text-green-900">{subCfg.label}</div>
              <div className="text-[11px] text-text-muted">{subCfg.price}</div>
            </div>
          </div>

          {[
            {
              label: "Status",
              value: <span className="capitalize">{user.subscriptionStatus}</span>,
            },
            ...(user.subscriptionExpiry
              ? [{ label: "Expires", value: user.subscriptionExpiry }]
              : []),
            {
              label: "Total Spent",
              value:
                user.totalSpent > 0 ? (
                  <strong className="text-green-900">₦{user.totalSpent.toLocaleString()}</strong>
                ) : (
                  "—"
                ),
            },
            { label: "Logins", value: user.totalLogins },
            { label: "Referrals", value: user.referralCount },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-0.5 pl-4 border-l border-gray-100">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                {label}
              </span>
              <span className="text-[13px] text-green-900 font-medium">{value}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Student ── */}
      {user.role === "student" &&
        user.studentProfile &&
        (() => {
          const p = user.studentProfile;
          return (
            <Section title="Student Statistics">
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 mb-4">
                <StatCard
                  icon={Zap}
                  label="XP Points"
                  value={p.xpPoints.toLocaleString()}
                  color="#f59e0b"
                />
                <StatCard
                  icon={Trophy}
                  label="Avg Score"
                  value={`${p.averageScore}%`}
                  color={p.averageScore >= 60 ? "#10b981" : "#ef4444"}
                />
                <StatCard
                  icon={BookOpen}
                  label="Sessions"
                  value={p.sessionsCompleted.toLocaleString()}
                  color="#3b82f6"
                />
                <StatCard
                  icon={Clock}
                  label="Study Hours"
                  value={p.totalStudyHours}
                  color="#8b5cf6"
                />
                <StatCard
                  icon={Flame}
                  label="Study Streak"
                  value={`${p.streak} days`}
                  color="#f97316"
                />
                {p.rank && (
                  <StatCard icon={Crown} label="Leaderboard" value={`#${p.rank}`} color="#2e8b57" />
                )}
              </div>

              {p.schoolName && (
                <div className="flex items-center gap-2 text-[12px] text-text-muted mb-3">
                  <School size={13} className="text-green-700 shrink-0" />
                  <span className="font-semibold text-green-900">{p.schoolName}</span>
                  {p.className && <span>— {p.className}</span>}
                  {p.studentIdNumber && (
                    <span className="ml-auto font-mono text-[11px]">{p.studentIdNumber}</span>
                  )}
                </div>
              )}

              {p.examTargets.length > 0 && (
                <div className="mb-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted mb-1.5">
                    Target Exams
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {p.examTargets.map((e) => (
                      <Badge key={e} label={e} color="#2e8b57" bg="#2e8b5715" size="xs" />
                    ))}
                  </div>
                </div>
              )}

              {p.subjectsEnrolled.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted mb-1.5">
                    Subjects Enrolled
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {p.subjectsEnrolled.map((s) => (
                      <Badge key={s} label={s} color="#0284c7" bg="#0284c715" size="xs" />
                    ))}
                  </div>
                </div>
              )}
            </Section>
          );
        })()}

      {/* ── Tutor ── */}
      {user.role === "tutor" &&
        user.tutorProfile &&
        (() => {
          const p = user.tutorProfile;
          const availColor =
            p.availabilityStatus === "available"
              ? "#10b981"
              : p.availabilityStatus === "busy"
                ? "#f59e0b"
                : "#6b7280";

          return (
            <Section title="Tutor Statistics">
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 mb-4">
                <StatCard
                  icon={Star}
                  label={`Rating (${p.ratingCount})`}
                  value={`${p.rating} / 5.0`}
                  color="#f59e0b"
                />
                <StatCard
                  icon={Users}
                  label="Students Taught"
                  value={p.totalStudentsTaught.toLocaleString()}
                  color="#3b82f6"
                />
                <StatCard
                  icon={BookOpen}
                  label="Sessions Conducted"
                  value={p.totalSessionsConducted.toLocaleString()}
                  color="#8b5cf6"
                />
                <StatCard
                  icon={Clock}
                  label="Experience"
                  value={`${p.yearsOfExperience} yrs`}
                  color="#2e8b57"
                />
                {p.hourlyRate && (
                  <StatCard
                    icon={TrendingUp}
                    label="Hourly Rate"
                    value={`₦${p.hourlyRate.toLocaleString()}`}
                    color="#f59e0b"
                  />
                )}
              </div>

              <div className="flex items-center gap-4 mb-4">
                {p.isVerified && (
                  <span className="flex items-center gap-1.5 text-[12px] text-green-600 font-semibold">
                    <CheckCircle2 size={14} /> Verified Tutor
                  </span>
                )}
                <span
                  className="text-[12px] font-semibold capitalize"
                  style={{ color: availColor }}>
                  ● {p.availabilityStatus.replace("_", " ")}
                </span>
              </div>

              {p.subjects.length > 0 && (
                <div className="mb-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted mb-1.5">
                    Subjects
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {p.subjects.map((s) => (
                      <Badge key={s} label={s} color="#8b5cf6" bg="#8b5cf615" size="xs" />
                    ))}
                  </div>
                </div>
              )}

              {p.qualifications.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted mb-1.5">
                    Qualifications
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {p.qualifications.map((q) => (
                      <Badge key={q} label={q} color="#2e8b57" bg="#2e8b5715" size="xs" />
                    ))}
                  </div>
                </div>
              )}

              {p.bio && (
                <p
                  className="mt-3 text-[12px] text-text-muted italic leading-relaxed border-t pt-3"
                  style={{ borderColor: "rgba(30,80,50,0.06)" }}>
                  {p.bio}
                </p>
              )}
            </Section>
          );
        })()}

      {/* ── School Admin ── */}
      {user.role === "school_admin" &&
        user.schoolAdminProfile &&
        (() => {
          const p = user.schoolAdminProfile;
          const typeColor =
            p.schoolType === "private"
              ? "#7c3aed"
              : p.schoolType === "international"
                ? "#3b82f6"
                : "#2e8b57";
          return (
            <Section title="School Overview">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                <StatCard
                  icon={Users}
                  label="Students Managed"
                  value={p.managedStudentCount.toLocaleString()}
                  color="#f59e0b"
                />
                <StatCard
                  icon={BookOpen}
                  label="Teachers"
                  value={p.managedTeacherCount}
                  color="#3b82f6"
                />
                <StatCard
                  icon={School}
                  label="Classes"
                  value={p.managedClasses.length}
                  color="#8b5cf6"
                />
              </div>
              <div className="flex items-center gap-2 text-[12px] text-text-muted mb-2">
                <School size={13} className="text-green-700" />
                <span className="font-semibold text-green-900">{p.schoolName}</span>
                <Badge label={p.schoolType} color={typeColor} bg={`${typeColor}15`} size="xs" />
              </div>
              <p className="text-[12px] text-text-muted">
                Admin Role:{" "}
                <span className="font-semibold text-green-900 capitalize">
                  {p.adminRole.replace(/_/g, " ")}
                </span>
                <span className="mx-2 opacity-40">·</span>
                Plan:{" "}
                <span className="font-semibold text-green-900 capitalize">
                  {p.subscriptionManaged}
                </span>
              </p>
            </Section>
          );
        })()}

      {/* ── Admin Notes ── */}
      {user.notes && (
        <div className="rounded-2xl bg-amber-50 border border-amber-100 p-5">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-amber-700 mb-2">
            <StickyNote size={13} />
            Admin Notes
          </div>
          <p className="text-[13px] text-amber-900 leading-relaxed">{user.notes}</p>
        </div>
      )}
    </div>
  );
}
