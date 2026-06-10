"use client";

import { Activity, User, RotateCcw, Flag, Mail, RefreshCw } from "lucide-react";
import type { ActivityLogEntry } from "../types";

interface Props {
  entries: ActivityLogEntry[];
  transactionId: string;
}

export function ActivityLog({ entries, transactionId }: Props) {
  const getActivityIcon = (action: string) => {
    if (action.includes("refund")) return RotateCcw;
    if (action.includes("flag")) return Flag;
    if (action.includes("receipt")) return Mail;
    if (action.includes("webhook")) return RefreshCw;
    return Activity;
  };

  const getActivityColor = (action: string) => {
    if (action.includes("refund")) return "text-amber-600 bg-amber-50";
    if (action.includes("flag")) return "text-red-600 bg-red-50";
    if (action.includes("receipt")) return "text-blue-600 bg-blue-50";
    if (action.includes("webhook")) return "text-purple-600 bg-purple-50";
    return "text-gray-600 bg-gray-50";
  };

  if (entries.length === 0) {
    return (
      <div
        className="bg-white rounded-2xl border p-6"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <h3 className="font-serif text-lg text-green-900 mb-4">Activity Log</h3>
        <div className="text-center py-8 text-text-muted text-[13px]">
          No activity recorded for this transaction
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <h3 className="font-serif text-lg text-green-900 mb-4">Activity Log</h3>

      <div className="space-y-3">
        {entries.map((entry) => {
          const Icon = getActivityIcon(entry.action);
          const colorClass = getActivityColor(entry.action);

          return (
            <div key={entry.id} className="flex gap-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
                <Icon size={14} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[12px] font-semibold text-green-900 capitalize">
                    {entry.action.replace(/_/g, " ")}
                  </span>
                  <span className="text-[10px] text-text-muted">
                    {new Date(entry.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="text-[11px] text-text-muted">
                  By {entry.user}
                  {entry.ipAddress && ` • IP: ${entry.ipAddress}`}
                </div>
                {Object.keys(entry.details).length > 0 && (
                  <div className="mt-1 text-[10px] text-text-muted font-mono">
                    {JSON.stringify(entry.details)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
