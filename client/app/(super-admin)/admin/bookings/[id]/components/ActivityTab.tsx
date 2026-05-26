import { SectionCard } from "./Primitives";
import type { ActivityLogEntry } from "../types";

const ACTOR_LABELS: Record<ActivityLogEntry["actor"], string> = {
  student: "Student",
  tutor:   "Tutor",
  system:  "System",
  admin:   "Admin",
};

const ACTOR_COLORS: Record<ActivityLogEntry["actor"], string> = {
  student: "bg-blue-500",
  tutor:   "bg-green-600",
  system:  "bg-gray-400",
  admin:   "bg-purple-500",
};

interface Props {
  log: ActivityLogEntry[];
}

export function ActivityTab({ log }: Props) {
  return (
    <SectionCard title="Activity Log">
      {log.length === 0 ? (
        <p className="text-[13px] text-text-muted">No activity recorded yet.</p>
      ) : (
        <div className="space-y-3">
          {log.map((entry, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-cream/30">
              <div
                className={`w-2 h-2 rounded-full shrink-0 ${ACTOR_COLORS[entry.actor] ?? "bg-green-800"}`}
              />
              <div className="flex-1">
                <div className="text-[13px] font-semibold text-green-900">{entry.action}</div>
                <div className="text-[11px] text-text-muted">
                  {entry.date} &bull; by {ACTOR_LABELS[entry.actor] ?? entry.actor}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
