"use client";

import Link from "next/link";
import {
  Star, Calendar, Clock, Video, MapPin, Download, ExternalLink, ChevronRight,
} from "lucide-react";
import { Booking } from "@/types/bookings";
import {
  STATUS_COLORS, STATUS_ICONS, STATUS_LABEL, TYPE_COLORS, PLATFORM_LABELS,
  formatPrice, formatDate, getInitials,
} from "@/lib/constants/bookings";

interface BookingCardProps {
  booking: Booking;
  onJoin: (b: Booking) => void;
  onReschedule: (b: Booking) => void;
  onCancel: (b: Booking) => void;
  onFeedback: (b: Booking) => void;
  onDownloadInvoice: (b: Booking) => void;
}

export default function BookingCard({
  booking,
  onJoin,
  onReschedule,
  onCancel,
  onFeedback,
  onDownloadInvoice,
}: BookingCardProps) {
  const StatusIcon = STATUS_ICONS[booking.status];
  const isActive = booking.status === "upcoming" || booking.status === "ongoing";
  const isCompleted = booking.status === "completed";
  const isPhysical = booking.type === "physical";

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden">
      {/* Coloured left stripe based on type */}
      <div className={`h-1.5 w-full ${isPhysical ? "bg-emerald-500" : "bg-blue-500"}`} />

      <div className="p-5 sm:p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* ── Tutor + session info ── */}
          <div className="flex-1">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shrink-0 text-white font-bold text-lg">
                {getInitials(booking.tutorName)}
              </div>

              <div className="flex-1 min-w-0">
                {/* Name + badges */}
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-[16px] font-bold text-gray-800">{booking.tutorName}</h3>
                  <div className="flex items-center gap-1">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    <span className="text-[12px] text-gray-600">{booking.tutorRating}</span>
                  </div>

                  {/* Status badge */}
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border flex items-center gap-1 ${STATUS_COLORS[booking.status]}`}>
                    <StatusIcon size={11} />
                    {STATUS_LABEL[booking.status]}
                  </span>

                  {/* Type badge */}
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${TYPE_COLORS[booking.type]}`}>
                    {isPhysical ? "In-Person" : "Online"}
                  </span>
                </div>

                <p className="text-[14px] text-gray-600 mb-2">
                  {booking.subject} — {booking.topic}
                </p>

                {/* Meta row */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} />
                    {formatDate(booking.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={13} />
                    {booking.time} · {booking.duration}h
                  </span>
                  {isPhysical ? (
                    <span className="flex items-center gap-1">
                      <MapPin size={13} />
                      {booking.location}
                      {booking.travelFee && (
                        <span className="text-orange-500 font-medium">+{formatPrice(booking.travelFee)} travel</span>
                      )}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Video size={13} />
                      {booking.meetingPlatform ? PLATFORM_LABELS[booking.meetingPlatform] : "Online Session"}
                    </span>
                  )}
                  {booking.packageName && (
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                      {booking.packageName}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Session details */}
            {(booking.notes || booking.sessionTopic || booking.materials?.length) && (
              <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {booking.sessionTopic && (
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Session Topic</p>
                    <p className="text-[13px] text-gray-700">{booking.sessionTopic}</p>
                  </div>
                )}
                {booking.notes && (
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Notes</p>
                    <p className="text-[13px] text-gray-700">{booking.notes}</p>
                  </div>
                )}
                {booking.materials && booking.materials.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Materials</p>
                    <div className="flex flex-wrap gap-1.5">
                      {booking.materials.map((m, i) => (
                        <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Feedback display */}
            {booking.feedback && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="bg-green-50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className={i < booking.feedback!.rating ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}
                      />
                    ))}
                    <span className="text-[11px] text-gray-400 ml-auto">{booking.feedback.date}</span>
                  </div>
                  <p className="text-[13px] text-gray-700">{booking.feedback.comment}</p>
                </div>
              </div>
            )}
          </div>

          {/* ── Price + actions ── */}
          <div className="md:text-right md:min-w-[180px] shrink-0">
            <p className="text-[11px] text-gray-500 mb-0.5">Session Fee</p>
            <p className="text-2xl font-bold text-green-700">{formatPrice(booking.price)}</p>
            {isPhysical && booking.travelFee && (
              <p className="text-[11px] text-gray-400">+{formatPrice(booking.travelFee)} travel</p>
            )}

            <div className="flex flex-wrap gap-2 mt-3 md:justify-end">
              {/* Active session actions */}
              {isActive && (
                <>
                  <button
                    onClick={() => onJoin(booking)}
                    className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-colors flex items-center gap-1.5 ${
                      booking.status === "ongoing"
                        ? "bg-green-600 text-white hover:bg-green-700 animate-pulse"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {isPhysical ? (
                      <><MapPin size={14} /> Get Directions</>
                    ) : (
                      <><ExternalLink size={14} /> {booking.status === "ongoing" ? "Join Now" : "Join Session"}</>
                    )}
                  </button>
                  <button
                    onClick={() => onReschedule(booking)}
                    className="px-3 py-2 rounded-xl border border-gray-200 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => onCancel(booking)}
                    className="px-3 py-2 rounded-xl border border-red-200 text-[13px] text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}

              {/* Leave feedback */}
              {isCompleted && !booking.feedback && (
                <button
                  onClick={() => onFeedback(booking)}
                  className="px-4 py-2 bg-amber-500 text-white rounded-xl text-[13px] font-semibold hover:bg-amber-600 transition-colors"
                >
                  Rate Session
                </button>
              )}

              {/* View detail */}
              <Link
                href={`/bookings/${booking.id}`}
                className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:text-green-700 hover:border-green-300 transition-colors"
                title="View details"
              >
                <ChevronRight size={16} />
              </Link>

              {/* Download invoice */}
              <button
                onClick={() => onDownloadInvoice(booking)}
                className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
                title="Download Invoice"
              >
                <Download size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
