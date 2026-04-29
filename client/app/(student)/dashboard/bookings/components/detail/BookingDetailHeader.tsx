import Link from "next/link";
import { ChevronLeft, Download, Share2 } from "lucide-react";
import { Booking } from "@/types/bookings";
import {
  STATUS_COLORS, STATUS_ICONS, STATUS_LABEL, TYPE_COLORS,
  formatPrice, formatDate, getInitials,
} from "@/lib/constants/bookings";
import { Star } from "lucide-react";

interface BookingDetailHeaderProps {
  booking: Booking;
  onDownload: () => void;
  onShare: () => void;
}

export default function BookingDetailHeader({ booking, onDownload, onShare }: BookingDetailHeaderProps) {
  const StatusIcon = STATUS_ICONS[booking.status];
  const isPhysical = booking.type === "physical";

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Top stripe */}
      <div className={`h-2 w-full ${isPhysical ? "bg-emerald-500" : "bg-blue-500"}`} />

      <div className="p-6">
        {/* Back nav */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/bookings"
            className="inline-flex items-center gap-1.5 text-green-700 hover:text-green-800 text-[14px] font-medium transition-colors"
          >
            <ChevronLeft size={18} />
            Back to Bookings
          </Link>
          <div className="flex gap-2">
            <button
              onClick={onShare}
              className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:text-green-700 hover:border-green-300 transition-colors"
              title="Share"
            >
              <Share2 size={16} />
            </button>
            <button
              onClick={onDownload}
              className="px-3 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-[13px] font-medium flex items-center gap-1.5"
            >
              <Download size={15} />
              Invoice
            </button>
          </div>
        </div>

        {/* Tutor profile row */}
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {getInitials(booking.tutorName)}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-gray-800">{booking.tutorName}</h1>
              <div className="flex items-center gap-1">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <span className="text-[13px] text-gray-600">{booking.tutorRating}</span>
              </div>
            </div>
            <p className="text-gray-600 mb-3">
              {booking.subject} — {booking.topic}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-[12px] font-semibold border flex items-center gap-1.5 ${STATUS_COLORS[booking.status]}`}>
                <StatusIcon size={12} />
                {STATUS_LABEL[booking.status]}
              </span>
              <span className={`px-3 py-1 rounded-full text-[12px] font-semibold border ${TYPE_COLORS[booking.type]}`}>
                {isPhysical ? "In-Person Session" : "Online Session"}
              </span>
              {booking.invoiceId && (
                <span className="px-3 py-1 rounded-full text-[12px] font-semibold border border-gray-200 bg-gray-50 text-gray-600">
                  {booking.invoiceId}
                </span>
              )}
            </div>
          </div>

          {/* Price callout */}
          <div className="text-right shrink-0">
            <p className="text-[11px] text-gray-500">Total</p>
            <p className="text-3xl font-bold text-green-700">{formatPrice(booking.price)}</p>
            {isPhysical && booking.travelFee && (
              <p className="text-[12px] text-gray-400 mt-0.5">
                +{formatPrice(booking.travelFee)} travel fee
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
