"use client";

import {
  Upload,
  Edit,
  Globe,
  EyeOff,
  Star,
  Trash2,
  Lock,
  UserPlus,
  BarChart3,
  AlertCircle,
} from "lucide-react";

type AuditAction =
  | "uploaded"
  | "edited"
  | "published"
  | "unpublished"
  | "featured"
  | "unfeatured"
  | "deleted"
  | "access_granted"
  | "price_changed"
  | "flagged";

interface AuditEntry {
  id: string;
  action: AuditAction;
  description: string;
  performedBy: string;
  timestamp: string;
}

const ACTION_META: Record<AuditAction, { icon: any; color: string }> = {
  uploaded: { icon: Upload, color: "#3b82f6" },
  edited: { icon: Edit, color: "#f59e0b" },
  published: { icon: Globe, color: "#10b981" },
  unpublished: { icon: EyeOff, color: "#6b7280" },
  featured: { icon: Star, color: "#9333ea" },
  unfeatured: { icon: Star, color: "#6b7280" },
  deleted: { icon: Trash2, color: "#ef4444" },
  access_granted: { icon: UserPlus, color: "#10b981" },
  price_changed: { icon: Lock, color: "#f59e0b" },
  flagged: { icon: AlertCircle, color: "#ef4444" },
};

const MOCK_LOG: AuditEntry[] = [
  {
    id: "a1",
    action: "published",
    description: "Content published and made available to students",
    performedBy: "Admin Taiwo",
    timestamp: "2025-05-20T10:00:00Z",
  },
  {
    id: "a2",
    action: "featured",
    description: "Marked as featured on the library homepage",
    performedBy: "Super Admin",
    timestamp: "2025-05-18T14:30:00Z",
  },
  {
    id: "a3",
    action: "edited",
    description: "Title and description updated",
    performedBy: "Admin Taiwo",
    timestamp: "2025-05-15T09:00:00Z",
  },
  {
    id: "a4",
    action: "price_changed",
    description: "Price changed from ₦3,000 to ₦5,000",
    performedBy: "Super Admin",
    timestamp: "2025-05-10T11:00:00Z",
  },
  {
    id: "a5",
    action: "access_granted",
    description: "Manual access granted to 3 users",
    performedBy: "Admin Funke",
    timestamp: "2025-05-05T16:00:00Z",
  },
  {
    id: "a6",
    action: "uploaded",
    description: "Content file uploaded (42 MB)",
    performedBy: "Admin Taiwo",
    timestamp: "2025-04-30T08:00:00Z",
  },
];

function fmt(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }),
    time: d.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" }),
  };
}

export function ActivityTab() {
  return (
    <div className="rounded-2xl bg-white border p-5" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <h2 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-5">
        Audit Log
      </h2>
      <ol aria-label="Content activity log">
        {MOCK_LOG.map((entry, i) => {
          const meta = ACTION_META[entry.action];
          const Icon = meta.icon;
          const { date, time } = fmt(entry.timestamp);
          return (
            <li key={entry.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm"
                  style={{ background: `${meta.color}15` }}>
                  <Icon size={14} style={{ color: meta.color }} />
                </div>
                {i < MOCK_LOG.length - 1 && <div className="w-px flex-1 bg-gray-100 my-1" />}
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
    </div>
  );
}
