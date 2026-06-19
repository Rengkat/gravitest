import { Star, ThumbsUp, Users } from "lucide-react";
import type { TutorReview } from "../types";

interface Props {
  reviews: TutorReview[];
  tutorName: string;
}

export function ReviewsTab({ reviews, tutorName }: Props) {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="p-5 rounded-2xl bg-white border"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center overflow-hidden shrink-0">
              {review.studentAvatar
                ? <img src={review.studentAvatar} alt="" className="w-full h-full object-cover" />
                : <Users size={18} className="text-green-800" />
              }
            </div>

            <div className="flex-1">
              {/* Name, date & stars */}
              <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                <div>
                  <span className="text-[14px] font-semibold text-green-900">{review.studentName}</span>
                  <span className="text-[12px] text-text-muted ml-2">{review.date}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < review.rating ? "text-gold fill-gold" : "text-gray-300"}
                    />
                  ))}
                </div>
              </div>

              {/* Comment */}
              <p className="text-[13px] text-text-muted mb-2">{review.comment}</p>

              {/* Meta */}
              <div className="flex items-center gap-3 text-[11px] text-text-muted">
                <span>Subject: {review.subject}</span>
                <span>•</span>
                <span>{review.sessionType}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ThumbsUp size={10} /> {review.helpful} helpful
                </span>
              </div>

              {/* Tutor response */}
              {review.response && (
                <div className="mt-3 p-3 rounded-lg bg-green-50 border border-green-100">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[12px] font-semibold text-green-800">{tutorName}</span>
                    <span className="text-[10px] text-text-muted">{review.responseDate}</span>
                  </div>
                  <p className="text-[12px] text-green-700">{review.response}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
