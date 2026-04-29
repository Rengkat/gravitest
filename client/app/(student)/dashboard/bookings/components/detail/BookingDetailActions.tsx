"use client";

import {
  ExternalLink, RefreshCw, XCircle, Star, Download, MessageCircle, MapPin,
} from "lucide-react";
import { Booking } from "@/types/bookings";
import { formatPrice } from "@/lib/constants/bookings";

interface BookingDetailActionsProps {
  booking: Booking;
  onJoin: () => void;
  onReschedule: () => void;
  onCancel: () => void;
  onFeedback: () => void;
  onDownload: () => void;
  onMessage: () => void;
}

export default function BookingDetailActions({
  booking,
  onJoin,
  onReschedule,
  onCancel,
  onFeedback,
  onDownload,
  onMessage,
}: BookingDetailActionsProps) {
  const isActive = booking.status === "upcoming" || booking.status === "ongoing";
  const isCompleted = booking.status === "completed";
  const isPhysical = booking.type === "physical";

  return (
    <div className="space-y-4">
      {/* Action card */}
      <div className="bg-white rounded-2xl shadow-lg p-5">
        <h3 className="font-bold text-gray-800 mb-4 text-[15px]">Actions</h3>
        <div className="space-y-2.5">
          {isActive && (
            <>
              <button
                onClick={onJoin}
                className={`w-full py-3 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 transition-all ${
                  booking.status === "ongoing"
                    ? "bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-200"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {isPhysical ? (
                  <><MapPin size={16} /> Get Directions</>
                ) : (
                  <><ExternalLink size={16} /> {booking.status === "ongoing" ? "Join Now" : "Join Session"}</>
                )}
              </button>
              <button
                onClick={onReschedule}
                className="w-full py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-[14px] hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCw size={15} />
                Reschedule
              </button>
              <button
                onClick={onCancel}
                className="w-full py-2.5 rounded-xl border-2 border-red-200 text-red-600 font-semibold text-[14px] hover:bg-red-50 flex items-center justify-center gap-2 transition-colors"
              >
                <XCircle size={15} />
                Cancel Session
              </button>
            </>
          )}

          {isCompleted && !booking.feedback && (
            <button
              onClick={onFeedback}
              className="w-full py-3 rounded-xl bg-amber-500 text-white font-bold text-[14px] hover:bg-amber-600 flex items-center justify-center gap-2 transition-colors"
            >
              <Star size={16} />
              Rate This Session
            </button>
          )}

          <button
            onClick={onMessage}
            className="w-full py-2.5 rounded-xl border-2 border-green-600 text-green-700 font-semibold text-[14px] hover:bg-green-50 flex items-center justify-center gap-2 transition-colors"
          >
            <MessageCircle size={15} />
            Message Tutor
          </button>

          <button
            onClick={onDownload}
            className="w-full py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-[14px] hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
          >
            <Download size={15} />
            Download Invoice
          </button>
        </div>
      </div>

      {/* Payment breakdown */}
      <div className="bg-white rounded-2xl shadow-lg p-5">
        <h3 className="font-bold text-gray-800 mb-4 text-[15px]">Payment Breakdown</h3>
        <div className="space-y-2.5 text-[13px]">
          <div className="flex justify-between">
            <span className="text-gray-600">Session fee ({booking.duration}h)</span>
            <span className="font-semibold text-gray-800">{formatPrice(booking.price - (booking.travelFee ?? 0))}</span>
          </div>
          {booking.travelFee && (
            <div className="flex justify-between">
              <span className="text-gray-600">Travel fee</span>
              <span className="font-semibold text-gray-800">{formatPrice(booking.travelFee)}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-gray-100">
            <span className="font-bold text-gray-800">Total Paid</span>
            <span className="font-bold text-green-700 text-[15px]">{formatPrice(booking.price)}</span>
          </div>
        </div>

        {booking.invoiceId && (
          <p className="text-[11px] text-gray-400 mt-3">Invoice: {booking.invoiceId}</p>
        )}
      </div>

      {/* Trust block */}
      <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-[12px] text-green-700 space-y-1.5">
        <p className="font-bold text-[13px] mb-2">Booking Guarantee</p>
        <p>✓ 100% refund if tutor cancels</p>
        <p>✓ Free reschedule up to 24h before</p>
        <p>✓ Secure payment via Paystack</p>
        <p>✓ Session recording (online) available on request</p>
      </div>
    </div>
  );
}
