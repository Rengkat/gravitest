import { Star } from "lucide-react";
import { SectionCard } from "./Primitives";
import type { BookingFeedback } from "../types";

interface Props {
  feedback: BookingFeedback;
}

export function FeedbackCard({ feedback }: Props) {
  return (
    <SectionCard title="Feedback">
      <div className="flex items-center gap-1 mb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < feedback.rating ? "text-gold fill-gold" : "text-gray-300"}
          />
        ))}
      </div>
      <p className="text-[13px] text-text-muted">{feedback.comment}</p>
      <div className="text-[11px] text-text-muted mt-2">{feedback.date}</div>
    </SectionCard>
  );
}
