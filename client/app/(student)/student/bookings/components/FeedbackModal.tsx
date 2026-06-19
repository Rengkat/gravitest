"use client";

import { useState } from "react";
import { X, Star } from "lucide-react";
import { Booking } from "@/types/bookings";

interface FeedbackModalProps {
  booking: Booking;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}

export default function FeedbackModal({ booking, onClose, onSubmit }: FeedbackModalProps) {
  const [rating, setRating] = useState(5);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");

  const STAR_LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Rate Your Session</h3>
            <p className="text-[13px] text-gray-500">with {booking.tutorName}</p>
          </div>
          <button
            title="close"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Session summary */}
          <div className="bg-gray-50 rounded-xl p-3 text-[13px] text-gray-600">
            <span className="font-semibold">{booking.subject}</span> — {booking.topic}
          </div>

          {/* Star rating */}
          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-3">Overall Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  title="star"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  className="focus:outline-none transition-transform hover:scale-110">
                  <Star
                    size={36}
                    className={
                      star <= (hovered || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-200 fill-gray-200"
                    }
                  />
                </button>
              ))}
              <span className="text-[14px] font-semibold text-amber-600 ml-2">
                {STAR_LABELS[hovered || rating]}
              </span>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-2">Your Feedback</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder={`Share your experience with ${booking.tutorName.split(" ")[0]}...`}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-[13px] resize-none"
            />
          </div>
        </div>

        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-[14px] text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onSubmit(rating, comment)}
            className="flex-[2] py-2.5 bg-green-600 text-white rounded-xl text-[14px] font-bold hover:bg-green-700 transition-colors">
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  );
}
