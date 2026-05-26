import Link from "next/link";
import { ArrowLeft, AlertCircle, RotateCcw, XCircle, CheckCircle, UserX } from "lucide-react";
import { STATUS_CONFIG } from "../constants";
import type { Booking } from "../types";

interface Props {
  booking: Booking;
  onReschedule: () => void;
  onCancelClick: () => void;
  onMarkComplete: () => void;
  onMarkNoShow: () => void;
}

export function BookingPageHeader({
  booking,
  onReschedule,
  onCancelClick,
  onMarkComplete,
  onMarkNoShow,
}: Props) {
  const currentStatus = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.upcoming;
  const StatusIcon = currentStatus.icon;

  return (
    <div className="mb-8">
      <Link
        href="/admin/bookings"
        className="inline-flex items-center gap-2 text-[14px] text-text-muted hover:text-green-800 mb-4 transition-colors">
        <ArrowLeft size={16} /> Back to Bookings
      </Link>

      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h1 className="font-serif text-3xl text-green-900">
              Booking {booking.bookingReference}
            </h1>
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold"
              style={{ background: currentStatus.bg, color: currentStatus.text }}>
              <StatusIcon size={14} /> {currentStatus.label}
            </span>
            {booking.isFlagged && (
              <span className="px-3 py-1 rounded-full text-[12px] font-semibold bg-red-100 text-red-600 flex items-center gap-1">
                <AlertCircle size={14} /> Flagged
              </span>
            )}
          </div>
          <p className="text-text-muted">
            {booking.subject} session with {booking.tutorName} &bull; {booking.date} at{" "}
            {booking.time}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {booking.status === "upcoming" && (
            <>
              <button
                onClick={onReschedule}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-cream transition-all text-[14px] font-medium text-text-muted">
                <RotateCcw size={16} /> Reschedule
              </button>
              <button
                onClick={onMarkNoShow}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-cream transition-all text-[14px] font-medium text-text-muted">
                <UserX size={16} /> No Show
              </button>
              <button
                onClick={onCancelClick}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-all text-[14px] font-semibold">
                <XCircle size={16} /> Cancel
              </button>
            </>
          )}
          {booking.status === "ongoing" && (
            <button
              onClick={onMarkComplete}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-800 text-white hover:bg-green-700 transition-all text-[14px] font-semibold">
              <CheckCircle size={16} /> Mark Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
