import { Star, Eye, Edit, Download, Plus } from "lucide-react";
import { SESSION_STATUS_COLOR } from "../constants";
import type { TutorSession } from "../types";

interface Props {
  sessions: TutorSession[];
}

const TH = "text-left px-4 py-3 text-[12px] font-semibold text-text-muted";

export function SessionsTab({ sessions }: Props) {
  return (
    <div
      className="bg-white rounded-2xl border overflow-hidden"
      style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      {/* Table header */}
      <div
        className="px-6 py-4 border-b flex items-center justify-between"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <h3 className="font-serif text-lg text-green-900">Recent Sessions</h3>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-[13px] text-text-muted hover:bg-cream transition-colors">
            <Download size={14} /> Export
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-800 text-white text-[13px] font-medium hover:bg-green-700 transition-colors">
            <Plus size={14} /> Schedule Session
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-cream/30 border-b" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
              <th className={TH}>Student</th>
              <th className={TH}>Subject</th>
              <th className={TH}>Date & Time</th>
              <th className={TH}>Duration</th>
              <th className={`${TH} text-center`}>Status</th>
              <th className={`${TH} text-right`}>Amount</th>
              <th className={`${TH} text-center`}>Rating</th>
              <th className={`${TH} text-center`}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "rgba(30,80,50,0.05)" }}>
            {sessions.map((session) => (
              <tr key={session.id} className="hover:bg-cream/20 transition-colors">
                <td className="px-4 py-3">
                  <div className="text-[13px] font-semibold text-green-900">{session.studentName}</div>
                  <div className="text-[11px] text-text-muted">{session.studentEmail}</div>
                </td>
                <td className="px-4 py-3 text-[13px] text-green-900">{session.subject}</td>
                <td className="px-4 py-3">
                  <div className="text-[13px] text-green-900">{session.date}</div>
                  <div className="text-[11px] text-text-muted">{session.time}</div>
                </td>
                <td className="px-4 py-3 text-[13px] text-green-900">{session.duration} min</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${
                      SESSION_STATUS_COLOR[session.status] ?? "bg-gray-100 text-gray-600"
                    }`}>
                    {session.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-[13px] font-bold text-green-900">
                  ₦{session.amount.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-center">
                  {session.rating ? (
                    <span className="flex items-center justify-center gap-1 text-[13px] text-green-900">
                      <Star size={12} className="text-gold fill-gold" /> {session.rating}
                    </span>
                  ) : (
                    <span className="text-text-muted">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-green-50 transition-colors">
                      <Eye size={14} className="text-text-muted" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                      <Edit size={14} className="text-text-muted" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
