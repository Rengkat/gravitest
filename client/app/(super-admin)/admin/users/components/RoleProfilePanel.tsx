"use client";

import {
  Star,
  BookOpen,
  School,
  Trophy,
  Clock,
  Zap,
  Users,
  CheckCircle2,
  AlertCircle,
  MapPin,
} from "lucide-react";
import type { User } from "../types";
import { Badge } from "./Primitives";

/**
 * Renders role-specific stats/info for a user.
 * Keeps role-display logic in one place so TableRow and GridCard
 * both stay thin.
 */
export function RoleProfilePanel({ user, compact = false }: { user: User; compact?: boolean }) {
  if (user.role === "student" && user.studentProfile) {
    const p = user.studentProfile;
    return (
      <div className={`flex flex-wrap gap-${compact ? "2" : "4"}`}>
        <Stat icon={Zap} label="XP" value={p.xpPoints.toLocaleString()} color="#f59e0b" />
        <Stat
          icon={Trophy}
          label="Avg Score"
          value={`${p.averageScore}%`}
          color={p.averageScore >= 60 ? "#10b981" : "#ef4444"}
        />
        <Stat
          icon={BookOpen}
          label="Sessions"
          value={p.sessionsCompleted.toLocaleString()}
          color="#3b82f6"
        />
        <Stat icon={Clock} label="Study hrs" value={p.totalStudyHours.toString()} color="#8b5cf6" />
        {p.streak > 0 && <Stat icon={Zap} label="Streak" value={`${p.streak}d`} color="#f97316" />}
        {!compact && p.examTargets.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1 w-full">
            {p.examTargets.map((e) => (
              <Badge key={e} label={e} color="#2e8b57" bg="#2e8b5715" size="xs" />
            ))}
          </div>
        )}
        {!compact && p.schoolName && (
          <div className="flex items-center gap-1 text-[11px] text-text-muted w-full">
            <School size={11} />
            <span>{p.schoolName}</span>
            {p.className && <span className="font-medium">— {p.className}</span>}
            {p.rank && <span className="ml-auto text-green-700 font-semibold">Rank #{p.rank}</span>}
          </div>
        )}
      </div>
    );
  }

  if (user.role === "tutor" && user.tutorProfile) {
    const p = user.tutorProfile;
    const availColor =
      p.availabilityStatus === "available"
        ? "#10b981"
        : p.availabilityStatus === "busy"
          ? "#f59e0b"
          : "#6b7280";
    return (
      <div className={`flex flex-wrap gap-${compact ? "2" : "4"}`}>
        <Stat icon={Star} label="Rating" value={`${p.rating} ★`} color="#f59e0b" />
        <Stat
          icon={Users}
          label="Students"
          value={p.totalStudentsTaught.toLocaleString()}
          color="#3b82f6"
        />
        <Stat
          icon={BookOpen}
          label="Sessions"
          value={p.totalSessionsConducted.toLocaleString()}
          color="#8b5cf6"
        />
        <Stat icon={Clock} label="Exp" value={`${p.yearsOfExperience}yr`} color="#2e8b57" />
        {p.isVerified && (
          <span className="flex items-center gap-1 text-[11px] text-green-600 font-semibold">
            <CheckCircle2 size={12} /> Verified
          </span>
        )}
        <span className={`text-[11px] font-semibold`} style={{ color: availColor }}>
          ● {p.availabilityStatus.replace("_", " ")}
        </span>
        {!compact && p.subjects.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1 w-full">
            {p.subjects.map((s) => (
              <Badge key={s} label={s} color="#8b5cf6" bg="#8b5cf615" size="xs" />
            ))}
          </div>
        )}
        {!compact && p.hourlyRate && (
          <div className="text-[11px] text-text-muted w-full">
            Hourly rate:{" "}
            <span className="font-semibold text-green-900">₦{p.hourlyRate.toLocaleString()}</span>
          </div>
        )}
      </div>
    );
  }

  if (user.role === "school_admin" && user.schoolAdminProfile) {
    const p = user.schoolAdminProfile;
    const typeColor =
      p.schoolType === "private"
        ? "#7c3aed"
        : p.schoolType === "international"
          ? "#3b82f6"
          : "#2e8b57";
    return (
      <div className={`flex flex-wrap gap-${compact ? "2" : "4"}`}>
        <Stat
          icon={School}
          label="Students"
          value={p.managedStudentCount.toLocaleString()}
          color="#f59e0b"
        />
        <Stat
          icon={Users}
          label="Teachers"
          value={p.managedTeacherCount.toLocaleString()}
          color="#3b82f6"
        />
        <Stat
          icon={BookOpen}
          label="Classes"
          value={p.managedClasses.length.toString()}
          color="#8b5cf6"
        />
        {!compact && (
          <>
            <div className="w-full flex items-center gap-2 text-[11px] text-text-muted">
              <School size={11} />
              <span className="font-semibold text-green-900">{p.schoolName}</span>
              <Badge label={p.schoolType} color={typeColor} bg={`${typeColor}15`} size="xs" />
            </div>
            <div className="text-[11px] text-text-muted">
              Role:{" "}
              <span className="font-semibold text-green-900 capitalize">
                {p.adminRole.replace(/_/g, " ")}
              </span>
              <span className="mx-2">·</span>
              Plan:{" "}
              <span className="font-semibold text-green-900 capitalize">
                {p.subscriptionManaged}
              </span>
            </div>
          </>
        )}
        {compact && (
          <span className="text-[11px] text-text-muted font-medium truncate">{p.schoolName}</span>
        )}
      </div>
    );
  }

  return null;
}

function Stat({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="w-6 h-6 rounded flex items-center justify-center"
        style={{ background: `${color}15` }}>
        <Icon size={11} style={{ color }} />
      </div>
      <div>
        <div className="text-[12px] font-bold text-green-900 leading-none">{value}</div>
        <div className="text-[9px] text-text-muted leading-none mt-0.5">{label}</div>
      </div>
    </div>
  );
}
