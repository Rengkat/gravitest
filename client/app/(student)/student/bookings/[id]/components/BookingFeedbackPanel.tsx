import { Star, MessageSquare } from "lucide-react";
import { Booking } from "@/types/bookings";

interface BookingFeedbackPanelProps {
  booking: Booking;
  onLeaveFeedback: () => void;
}

export default function BookingFeedbackPanel({ booking, onLeaveFeedback }: BookingFeedbackPanelProps) {
  const isCompleted = booking.status === "completed";

  if (!isCompleted) return null;

  if (booking.feedback) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Your Feedback</h2>
        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <div className="flex items-center gap-2 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={20}
                className={i < booking.feedback!.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}
              />
            ))}
            <span className="text-[13px] font-bold text-gray-600 ml-1">
              {booking.feedback.rating}/5
            </span>
            <span className="text-[12px] text-gray-400 ml-auto">{booking.feedback.date}</span>
          </div>
          <p className="text-[14px] text-gray-700 leading-relaxed">{booking.feedback.comment}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-2">Rate This Session</h2>
      <p className="text-[13px] text-gray-500 mb-4">
        How was your session with {booking.tutorName}? Your feedback helps other students.
      </p>
      <button
        onClick={onLeaveFeedback}
        className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-xl font-semibold text-[14px] hover:bg-amber-600 transition-colors"
      >
        <MessageSquare size={16} />
        Leave a Review
      </button>
    </div>
  );
}
