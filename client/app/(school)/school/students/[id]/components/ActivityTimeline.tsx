"use client";

import {
  Activity,
  Calendar,
  Award,
  TrendingUp,
  User,
  Settings,
  LogIn,
  Edit,
  Flame,
} from "lucide-react";
import type { ActivityLog } from "../../types";

function relativeTime(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(date).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const ACTION_META: Record<string, { icon: any; color: string; bg: string }> = {
  login: { icon: LogIn, color: "#3b82f6", bg: "#3b82f615" },
  exam_completed: { icon: TrendingUp, color: "#10b981", bg: "#10b98115" },
  profile_update: { icon: User, color: "#8b5cf6", bg: "#8b5cf615" },
  badge_earned: { icon: Award, color: "#f59e0b", bg: "#f59e0b15" },
  streak_milestone: { icon: Flame, color: "#f97316", bg: "#f9731615" },
  settings_change: { icon: Settings, color: "#6b7280", bg: "#6b728015" },
  edit: { icon: Edit, color: "#6366f1", bg: "#6366f115" },
};

const DEFAULT_META = { icon: Activity, color: "#6b7280", bg: "#6b728015" };

export function ActivityTimeline({ activities }: { activities: ActivityLog[] }) {
  if (activities.length === 0) {
    return (
      <div
        className="rounded-2xl bg-white border p-12 text-center"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <Activity size={40} className="mx-auto text-text-muted mb-3 opacity-30" />
        <p className="text-[14px] font-semibold text-green-900 mb-1">No activity yet</p>
        <p className="text-[12px] text-text-muted">
          Activity records will appear here as the student uses the platform.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white border p-5" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <h2 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-5">
        Recent Activity
      </h2>

      <ol aria-label="Student activity timeline">
        {activities.map((entry, i) => {
          const meta = ACTION_META[entry.action] ?? DEFAULT_META;
          const Icon = meta.icon;
          const isLast = i === activities.length - 1;

          return (
            <li key={entry.id} className="flex gap-3">
              {/* Spine */}
              <div className="flex flex-col items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm"
                  style={{ background: meta.bg }}>
                  <Icon size={14} style={{ color: meta.color }} />
                </div>
                {!isLast && <div className="w-px flex-1 bg-gray-100 my-1" />}
              </div>

              {/* Content */}
              <div className="pb-4 flex-1 min-w-0 pt-1">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <p className="text-[13px] font-medium text-green-900 leading-snug">
                      {entry.description}
                    </p>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      By: {entry.performedBy === "system" ? "System" : entry.performedBy}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-text-muted shrink-0">
                    <Calendar size={10} />
                    <time
                      dateTime={new Date(entry.performedAt).toISOString()}
                      title={new Date(entry.performedAt).toLocaleString("en-NG")}>
                      {relativeTime(entry.performedAt)}
                    </time>
                  </div>
                </div>

                {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    {Object.entries(entry.metadata).map(([k, v]) => (
                      <span
                        key={k}
                        className="px-2 py-0.5 rounded-lg bg-cream text-[10px] text-text-muted">
                        <strong>{k}:</strong> {String(v)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
