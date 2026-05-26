import Link from "next/link";
import { Users, Star, Video, MapPin, Eye, Edit } from "lucide-react";
import { BOOKING_STATUS_CONFIG } from "../constants";
import { Pagination } from "./Primitives";
import type { Booking } from "../types";

interface Props {
  bookings: Booking[];
  currentPage: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

function AvatarCell({ src, idx }: { src?: string; idx: number }) {
  return (
    <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center overflow-hidden shrink-0">
      {src
        ? <img src={src} alt="" className="w-full h-full object-cover" />
        : <Users size={14} className="text-green-800" />
      }
    </div>
  );
}

const TH = "text-left px-4 py-3 text-[12px] font-semibold text-text-muted uppercase tracking-wide";

export function BookingsTable({ bookings, currentPage, totalPages, onPageChange }: Props) {
  if (bookings.length === 0) {
    return (
      <div
        className="bg-white rounded-2xl border p-12 text-center"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <p className="text-text-muted text-[14px]">No bookings match your search or filters.</p>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-2xl border overflow-hidden"
      style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-cream/50 border-b" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
              <th className={TH}>Reference</th>
              <th className={TH}>Student</th>
              <th className={TH}>Tutor</th>
              <th className={TH}>Subject</th>
              <th className={TH}>Date & Time</th>
              <th className={TH}>Type</th>
              <th className={`${TH} text-center`}>Status</th>
              <th className={`${TH} text-right`}>Amount</th>
              <th className={`${TH} text-center`}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "rgba(30,80,50,0.05)" }}>
            {bookings.map((booking) => {
              const statusConfig = BOOKING_STATUS_CONFIG[booking.status];
              const StatusIcon = statusConfig.icon;

              return (
                <tr key={booking.id} className="hover:bg-cream/20 transition-colors">
                  {/* Reference */}
                  <td className="px-4 py-3">
                    <span className="text-[12px] font-mono text-green-900">
                      {booking.bookingReference}
                    </span>
                    {booking.isFlagged && (
                      <span className="ml-1 text-[9px] text-red-500 font-semibold">⚑</span>
                    )}
                  </td>

                  {/* Student */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <AvatarCell src={booking.studentAvatar} idx={0} />
                      <div>
                        <div className="text-[13px] font-semibold text-green-900">{booking.studentName}</div>
                        <div className="text-[11px] text-text-muted">{booking.studentLevel ?? "—"}</div>
                      </div>
                    </div>
                  </td>

                  {/* Tutor */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <AvatarCell src={booking.tutorAvatar} idx={1} />
                      <div>
                        <div className="text-[13px] text-green-900">{booking.tutorName}</div>
                        <div className="flex items-center gap-1 text-[11px] text-text-muted">
                          <Star size={10} className="text-gold fill-gold" /> {booking.tutorRating}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Subject */}
                  <td className="px-4 py-3">
                    <div className="text-[13px] text-green-900">{booking.subject}</div>
                    <div className="text-[11px] text-text-muted line-clamp-1">{booking.topic}</div>
                  </td>

                  {/* Date & Time */}
                  <td className="px-4 py-3">
                    <div className="text-[13px] text-green-900">{booking.date}</div>
                    <div className="text-[11px] text-text-muted">{booking.time} ({booking.duration}h)</div>
                  </td>

                  {/* Type */}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        booking.type === "online"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-green-50 text-green-600"
                      }`}>
                      {booking.type === "online" ? <Video size={10} /> : <MapPin size={10} />}
                      {booking.type}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 text-center">
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                      style={{ background: statusConfig.bg, color: statusConfig.text }}>
                      <StatusIcon size={12} /> {statusConfig.label}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-3 text-right text-[13px] font-bold text-green-900">
                    ₦{booking.totalPaid.toLocaleString()}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <Link
                        href={`/admin/bookings/${booking.id}`}
                        className="p-1.5 rounded-lg hover:bg-green-50 transition-colors group">
                        <Eye size={14} className="text-text-muted group-hover:text-green-600" />
                      </Link>
                      <button className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors group">
                        <Edit size={14} className="text-text-muted group-hover:text-blue-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onChange={onPageChange}
      />
    </div>
  );
}
