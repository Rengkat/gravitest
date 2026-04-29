"use client";

import { Download, CheckCircle, Clock, XCircle, ClipboardList } from "lucide-react";
import { AttendanceRecord } from "@/types/live-session";
import { downloadAttendanceCSV, SESSION_INFO, getInitials } from "@/lib/constants/live-session";

interface AttendancePanelProps {
  attendance: AttendanceRecord[];
  onUpdateStatus: (id: string, status: AttendanceRecord["status"]) => void;
  isTutor: boolean;
}

const STATUS_CONFIG: Record<
  AttendanceRecord["status"],
  { label: string; icon: any; color: string; bg: string }
> = {
  present: { label: "Present", icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-900/40 border-emerald-700" },
  late:    { label: "Late",    icon: Clock,        color: "text-amber-400",   bg: "bg-amber-900/40 border-amber-700" },
  absent:  { label: "Absent",  icon: XCircle,      color: "text-red-400",     bg: "bg-red-900/40 border-red-700" },
};

const AVATAR_BG: Record<string, string> = {
  tutor:   "from-blue-500 to-purple-600",
  student: "from-emerald-500 to-teal-600",
};

export default function AttendancePanel({
  attendance, onUpdateStatus, isTutor,
}: AttendancePanelProps) {
  const presentCount = attendance.filter((a) => a.status === "present").length;
  const lateCount    = attendance.filter((a) => a.status === "late").length;
  const absentCount  = attendance.filter((a) => a.status === "absent").length;
  const total = attendance.length;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header + summary */}
      <div className="p-3 border-b border-gray-700 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[13px] font-bold text-white">Attendance</h3>
          {isTutor && (
            <button
              onClick={() => downloadAttendanceCSV(attendance, SESSION_INFO)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white text-[11px] font-semibold rounded-lg transition-colors"
            >
              <Download size={12} />
              Export CSV
            </button>
          )}
        </div>

        {/* Summary pills */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Present", count: presentCount, color: "text-emerald-400", bg: "bg-emerald-900/30 border border-emerald-800" },
            { label: "Late",    count: lateCount,    color: "text-amber-400",   bg: "bg-amber-900/30 border border-amber-800" },
            { label: "Absent",  count: absentCount,  color: "text-red-400",     bg: "bg-red-900/30 border border-red-800" },
          ].map(({ label, count, color, bg }) => (
            <div key={label} className={`${bg} rounded-xl p-2 text-center`}>
              <div className={`text-lg font-bold ${color}`}>{count}</div>
              <div className="text-[10px] text-gray-400 font-medium">{label}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-3 bg-gray-700 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
            style={{ width: `${((presentCount + lateCount) / total) * 100}%` }}
          />
        </div>
        <p className="text-[10px] text-gray-500 mt-1 text-right">
          {presentCount + lateCount}/{total} joined
        </p>
      </div>

      {/* Records list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {attendance.map((record) => {
          const cfg = STATUS_CONFIG[record.status];
          const Icon = cfg.icon;

          return (
            <div key={record.participantId} className="flex items-center gap-3 p-2.5 bg-gray-800 rounded-xl">
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${AVATAR_BG[record.role]} flex items-center justify-center text-white text-[11px] font-bold shrink-0`}>
                {getInitials(record.name)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[13px] font-medium text-white truncate">{record.name}</span>
                  {record.role === "tutor" && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-blue-700 text-blue-100 rounded-full font-bold shrink-0">
                      TUTOR
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-500">
                  {record.joinedAt && (
                    <span>Joined {new Date(record.joinedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  )}
                  {record.duration > 0 && (
                    <><span>·</span><span>{record.duration} min</span></>
                  )}
                </div>
              </div>

              {/* Status control — tutor editable, student read-only */}
              {isTutor ? (
                <select
                  value={record.status}
                  onChange={(e) => onUpdateStatus(record.participantId, e.target.value as AttendanceRecord["status"])}
                  className={`text-[11px] font-bold px-2 py-1 rounded-lg border ${cfg.bg} ${cfg.color} bg-transparent focus:outline-none cursor-pointer`}
                >
                  <option value="present">Present</option>
                  <option value="late">Late</option>
                  <option value="absent">Absent</option>
                </select>
              ) : (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border ${cfg.bg}`}>
                  <Icon size={11} className={cfg.color} />
                  <span className={`text-[11px] font-bold ${cfg.color}`}>{cfg.label}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!isTutor && (
        <div className="p-3 border-t border-gray-700 text-center">
          <p className="text-[11px] text-gray-500">Only the tutor can edit attendance</p>
        </div>
      )}
    </div>
  );
}
