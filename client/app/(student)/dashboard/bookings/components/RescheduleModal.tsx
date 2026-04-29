"use client";

import { useState } from "react";
import { X, Calendar, Clock } from "lucide-react";
import { Booking } from "@/types/bookings";

interface RescheduleModalProps {
  booking: Booking;
  onClose: () => void;
  onConfirm: (newDate: string, newTime: string) => void;
}

const TIME_SLOTS = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
];

function generateDates() {
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d;
  });
}

export default function RescheduleModal({ booking, onClose, onConfirm }: RescheduleModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");

  const dates = generateDates();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b border-gray-100 rounded-t-2xl">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Reschedule Session</h3>
            <p className="text-[13px] text-gray-500">
              {booking.tutorName} — {booking.subject}
            </p>
          </div>
          <button title="on close" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Current session info */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-[13px]">
            <p className="font-semibold text-amber-800 mb-1">Current Booking</p>
            <p className="text-amber-700">
              {booking.date} at {booking.time}
            </p>
          </div>

          {/* Date picker */}
          <div>
            <label className="flex items-center gap-2 text-[13px] font-bold text-gray-700 mb-2">
              <Calendar size={14} /> New Date
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {dates.map((date, idx) => {
                const isSelected = selectedDate?.toDateString() === date.toDateString();
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(date)}
                    className={`p-2 rounded-xl text-center text-[12px] transition-all ${
                      isSelected
                        ? "bg-green-600 text-white font-bold"
                        : "border border-gray-200 hover:border-green-400 text-gray-700"
                    }`}>
                    <div>{date.toLocaleDateString("en-US", { weekday: "short" })}</div>
                    <div className="font-bold">{date.getDate()}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time picker */}
          <div>
            <label className="flex items-center gap-2 text-[13px] font-bold text-gray-700 mb-2">
              <Clock size={14} /> New Time
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  className={`py-2 rounded-xl text-[13px] font-medium transition-all ${
                    selectedTime === slot
                      ? "bg-green-600 text-white"
                      : "border border-gray-200 hover:border-green-400 text-gray-700"
                  }`}>
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-2">
              Reason (optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              placeholder="Let the tutor know why you're rescheduling..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-[13px] resize-none"
            />
          </div>

          <p className="text-[11px] text-gray-400">
            ℹ️ Free reschedule up to 24 hours before the session. Rescheduling within 24 hours may
            incur a fee.
          </p>
        </div>

        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-[14px] text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => {
              if (!selectedDate || !selectedTime) {
                alert("Please select a new date and time");
                return;
              }
              onConfirm(selectedDate.toISOString().split("T")[0], selectedTime);
            }}
            className="flex-[2] py-2.5 bg-green-600 text-white rounded-xl text-[14px] font-bold hover:bg-green-700">
            Confirm Reschedule
          </button>
        </div>
      </div>
    </div>
  );
}
