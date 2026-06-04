"use client";

import {
  UserPlus,
  UserMinus,
  CreditCard,
  Settings,
  ShieldOff,
  ShieldCheck,
  PlusCircle,
  Trash2,
  KeyRound,
  LogIn,
  AlertCircle,
} from "lucide-react";

export type SchoolActivityAction =
  | "admin_added"
  | "admin_removed"
  | "class_added"
  | "class_removed"
  | "subscription_changed"
  | "payment_received"
  | "school_suspended"
  | "school_activated"
  | "settings_updated"
  | "admin_login"
  | "password_reset";

export interface SchoolActivityEntry {
  id: string;
  action: SchoolActivityAction;
  description: string;
  performedBy: string;
  timestamp: string;
}

const ACTION_META: Record<SchoolActivityAction, { icon: any; color: string }> = {
  admin_added: { icon: UserPlus, color: "#10b981" },
  admin_removed: { icon: UserMinus, color: "#ef4444" },
  class_added: { icon: PlusCircle, color: "#3b82f6" },
  class_removed: { icon: Trash2, color: "#ef4444" },
  subscription_changed: { icon: CreditCard, color: "#8b5cf6" },
  payment_received: { icon: CreditCard, color: "#10b981" },
  school_suspended: { icon: ShieldOff, color: "#ef4444" },
  school_activated: { icon: ShieldCheck, color: "#10b981" },
  settings_updated: { icon: Settings, color: "#f59e0b" },
  admin_login: { icon: LogIn, color: "#3b82f6" },
  password_reset: { icon: KeyRound, color: "#f59e0b" },
};

// Seed mock activity from school id
export function generateMockActivity(schoolId: string): SchoolActivityEntry[] {
  return [
    {
      id: "sa1",
      action: "payment_received",
      description: "₦180,000 payment received — Enterprise Annual renewal",
      performedBy: "System",
      timestamp: "2025-05-27T10:00:00Z",
    },
    {
      id: "sa2",
      action: "class_added",
      description: "New class added: SS3 Science",
      performedBy: "Admin Taiwo",
      timestamp: "2025-05-20T09:15:00Z",
    },
    {
      id: "sa3",
      action: "admin_added",
      description: "New admin added: Mrs. Funke Adeyemi (Finance)",
      performedBy: "Super Admin",
      timestamp: "2025-05-14T14:30:00Z",
    },
    {
      id: "sa4",
      action: "subscription_changed",
      description: "Plan upgraded: Professional → Enterprise",
      performedBy: "Super Admin",
      timestamp: "2025-05-01T08:00:00Z",
    },
    {
      id: "sa5",
      action: "settings_updated",
      description: "School contact info and address updated",
      performedBy: "Admin Taiwo",
      timestamp: "2025-04-22T11:00:00Z",
    },
    {
      id: "sa6",
      action: "admin_login",
      description: "Admin login: admin@school.edu.ng from Lagos",
      performedBy: "Admin Taiwo",
      timestamp: "2025-04-18T07:45:00Z",
    },
    {
      id: "sa7",
      action: "class_removed",
      description: "Class removed: JSS1C (merged into JSS1B)",
      performedBy: "Super Admin",
      timestamp: "2025-04-10T15:20:00Z",
    },
    {
      id: "sa8",
      action: "password_reset",
      description: "Password reset sent to admin@school.edu.ng",
      performedBy: "Super Admin",
      timestamp: "2025-03-28T09:00:00Z",
    },
  ];
}

function fmt(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }),
    time: d.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" }),
  };
}

export function ActivityTab({ schoolId }: { schoolId: string }) {
  const entries = generateMockActivity(schoolId);

  return (
    <div className="rounded-2xl bg-white border p-5" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <h2 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-5">
        Audit Log
      </h2>

      {entries.length === 0 ? (
        <p className="text-[13px] text-text-muted text-center py-8">No activity recorded yet.</p>
      ) : (
        <ol aria-label="School activity log">
          {entries.map((entry, i) => {
            const meta = ACTION_META[entry.action] ?? { icon: AlertCircle, color: "#6b7280" };
            const Icon = meta.icon;
            const { date, time } = fmt(entry.timestamp);
            const isLast = i === entries.length - 1;

            return (
              <li key={entry.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm"
                    style={{ background: `${meta.color}15` }}>
                    <Icon size={14} style={{ color: meta.color }} />
                  </div>
                  {!isLast && <div className="w-px flex-1 bg-gray-100 my-1" />}
                </div>

                <div className="pb-4 flex-1 min-w-0 pt-1">
                  <p className="text-[13px] font-medium text-green-900 leading-snug mb-0.5">
                    {entry.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-text-muted">
                    <time dateTime={entry.timestamp}>
                      {date} · {time}
                    </time>
                    <span className="bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded text-[10px]">
                      {entry.performedBy}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
