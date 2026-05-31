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
  Hash,
  StickyNote,
} from "lucide-react";
import type { User } from "../../types";
import { Badge } from "../../components/Primitives";
import { SUBSCRIPTION_CONFIG } from "../../constants";

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
      <div>
        <div className="text-[15px] font-bold text-green-900 leading-tight">{value}</div>
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

export function OverviewTab({ user }: { user: User }) {
  const subCfg = SUBSCRIPTION_CONFIG[user.subscriptionTier];
  const SubIcon = subCfg.icon;

  return (
    <div className="space-y-5">
      {/* Subscription card */}
      <div
        className="rounded-2xl bg-white border p-5"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-4">
          Subscription
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: subCfg.bg }}>
              <SubIcon size={16} style={{ color: subCfg.color }} />
            </div>
            <div>
              <div className="text-[14px] font-bold text-green-900">{subCfg.label}</div>
              <div className="text-[11px] text-text-muted">{subCfg.price}</div>
            </div>
          </div>
          <div className="h-8 w-px bg-gray-100" />
          <div>
            <div className="text-[11px] text-text-muted">Status</div>
            <div className="text-[13px] font-semibold text-green-900 capitalize">
              {user.subscriptionStatus}
            </div>
          </div>
          {user.subscriptionExpiry && (
            <>
              <div className="h-8 w-px bg-gray-100" />
              <div>
                <div className="text-[11px] text-text-muted">Expires</div>
                <div className="text-[13px] font-semibold text-green-900">
                  {user.subscriptionExpiry}
                </div>
              </div>
            </>
          )}
          <div className="h-8 w-px bg-gray-100" />
          <div>
            <div className="text-[11px] text-text-muted">Total Spent</div>
            <div className="text-[14px] font-bold text-green-900">
              {user.totalSpent > 0 ? `₦${user.totalSpent.toLocaleString()}` : "—"}
            </div>
          </div>
          <div className="h-8 w-px bg-gray-100" />
          <div>
            <div className="text-[11px] text-text-muted">Referrals</div>
            <div className="text-[14px] font-bold text-green-900">{user.referralCount}</div>
          </div>
        </div>
      </div>

      {/* Role-specific stats */}
      {user.role === "student" && user.studentProfile && (
        <div
          className="rounded-2xl bg-white border p-5"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-4">
            Student Stats
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
            <StatCard
              icon={Zap}
              label="XP Points"
              value={user.studentProfile.xpPoints.toLocaleString()}
              color="#f59e0b"
            />
            <StatCard
              icon={Trophy}
              label="Avg Score"
              value={`${user.studentProfile.averageScore}%`}
              color={user.studentProfile.averageScore >= 60 ? "#10b981" : "#ef4444"}
            />
            <StatCard
              icon={BookOpen}
              label="Sessions"
              value={user.studentProfile.sessionsCompleted.toLocaleString()}
              color="#3b82f6"
            />
            <StatCard
              icon={Clock}
              label="Study Hours"
              value={user.studentProfile.totalStudyHours}
              color="#8b5cf6"
            />
            <StatCard
              icon={Zap}
              label="Study Streak"
              value={`${user.studentProfile.streak} days`}
              color="#f97316"
            />
            {user.studentProfile.rank && (
              <StatCard
                icon={Crown}
                label="Leaderboard Rank"
                value={`#${user.studentProfile.rank}`}
                color="#2e8b57"
              />
            )}
          </div>

          {/* School info */}
          {user.studentProfile.schoolName && (
            <div className="flex items-center gap-2 text-[12px] text-text-muted mb-3">
              <School size={13} className="text-green-700" />
              <span className="font-medium text-green-900">{user.studentProfile.schoolName}</span>
              {user.studentProfile.className && <span>— {user.studentProfile.className}</span>}
              {user.studentProfile.studentIdNumber && (
                <span className="ml-auto font-mono text-[11px]">
                  {user.studentProfile.studentIdNumber}
                </span>
              )}
            </div>
          )}

          {/* Exam targets */}
          {user.studentProfile.examTargets.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted mb-1.5">
                Target Exams
              </p>
              <div className="flex flex-wrap gap-1">
                {user.studentProfile.examTargets.map((e) => (
                  <Badge key={e} label={e} color="#2e8b57" bg="#2e8b5715" size="xs" />
                ))}
              </div>
            </div>
          )}

          {/* Subjects */}
          {user.studentProfile.subjectsEnrolled.length > 0 && (
            <div className="mt-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted mb-1.5">
                Subjects Enrolled
              </p>
              <div className="flex flex-wrap gap-1">
                {user.studentProfile.subjectsEnrolled.map((s) => (
                  <Badge key={s} label={s} color="#0284c7" bg="#0284c715" size="xs" />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {user.role === "tutor" && user.tutorProfile && (
        <div
          className="rounded-2xl bg-white border p-5"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-4">
            Tutor Stats
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
            <StatCard
              icon={Star}
              label="Rating"
              value={`${user.tutorProfile.rating} ★ (${user.tutorProfile.ratingCount})`}
              color="#f59e0b"
            />
            <StatCard
              icon={Users}
              label="Students"
              value={user.tutorProfile.totalStudentsTaught.toLocaleString()}
              color="#3b82f6"
            />
            <StatCard
              icon={BookOpen}
              label="Sessions"
              value={user.tutorProfile.totalSessionsConducted.toLocaleString()}
              color="#8b5cf6"
            />
            <StatCard
              icon={Clock}
              label="Experience"
              value={`${user.tutorProfile.yearsOfExperience} yrs`}
              color="#2e8b57"
            />
            {user.tutorProfile.hourlyRate && (
              <StatCard
                icon={Crown}
                label="Hourly Rate"
                value={`₦${user.tutorProfile.hourlyRate.toLocaleString()}`}
                color="#f59e0b"
              />
            )}
          </div>

          <div className="flex items-center gap-3 mb-3">
            {user.tutorProfile.isVerified && (
              <span className="flex items-center gap-1 text-[12px] text-green-600 font-semibold">
                <CheckCircle2 size={13} /> Verified Tutor
              </span>
            )}
            <span
              className="text-[12px] font-semibold capitalize"
              style={{
                color:
                  user.tutorProfile.availabilityStatus === "available"
                    ? "#10b981"
                    : user.tutorProfile.availabilityStatus === "busy"
                      ? "#f59e0b"
                      : "#6b7280",
              }}>
              ● {user.tutorProfile.availabilityStatus.replace("_", " ")}
            </span>
          </div>

          {user.tutorProfile.subjects.length > 0 && (
            <div className="mb-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted mb-1.5">
                Subjects
              </p>
              <div className="flex flex-wrap gap-1">
                {user.tutorProfile.subjects.map((s) => (
                  <Badge key={s} label={s} color="#8b5cf6" bg="#8b5cf615" size="xs" />
                ))}
              </div>
            </div>
          )}

          {user.tutorProfile.qualifications.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted mb-1.5">
                Qualifications
              </p>
              <div className="flex flex-wrap gap-1">
                {user.tutorProfile.qualifications.map((q) => (
                  <Badge key={q} label={q} color="#2e8b57" bg="#2e8b5715" size="xs" />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {user.role === "school_admin" && user.schoolAdminProfile && (
        <div
          className="rounded-2xl bg-white border p-5"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-4">
            School Overview
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            <StatCard
              icon={Users}
              label="Students Managed"
              value={user.schoolAdminProfile.managedStudentCount.toLocaleString()}
              color="#f59e0b"
            />
            <StatCard
              icon={BookOpen}
              label="Teachers"
              value={user.schoolAdminProfile.managedTeacherCount}
              color="#3b82f6"
            />
            <StatCard
              icon={School}
              label="Classes"
              value={user.schoolAdminProfile.managedClasses.length}
              color="#8b5cf6"
            />
          </div>
          <div className="flex items-center gap-2 text-[12px] text-text-muted mb-2">
            <School size={13} className="text-green-700" />
            <span className="font-semibold text-green-900">
              {user.schoolAdminProfile.schoolName}
            </span>
            <Badge
              label={user.schoolAdminProfile.schoolType}
              color="#7c3aed"
              bg="#7c3aed15"
              size="xs"
            />
          </div>
          <p className="text-[12px] text-text-muted">
            Role:{" "}
            <span className="font-semibold text-green-900 capitalize">
              {user.schoolAdminProfile.adminRole.replace(/_/g, " ")}
            </span>
            <span className="mx-2 opacity-40">·</span>
            Plan:{" "}
            <span className="font-semibold text-green-900 capitalize">
              {user.schoolAdminProfile.subscriptionManaged}
            </span>
          </p>
        </div>
      )}

      {/* Notes */}
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
