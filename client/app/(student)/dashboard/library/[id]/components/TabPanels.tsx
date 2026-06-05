"use client";

import { Star, ThumbsUp, CheckCircle2, BookOpen, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { LibraryContent, RatingEntry, RelatedContent } from "../types";
import { CONTENT_TYPE_CONFIG, SUBJECT_CONFIG, formatDuration, formatPrice } from "../constants";

// ─── About Tab ────────────────────────────────────────────────────────────────

export function AboutTab({ content }: { content: LibraryContent }) {
  return (
    <div
      className="rounded-2xl bg-white border p-5 space-y-4"
      style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <div>
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2">
          Description
        </h2>
        <p className="text-[14px] text-green-900 leading-relaxed">
          {content.description ?? "No description provided."}
        </p>
      </div>

      {content.tags && content.tags.length > 0 && (
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2">
            Tags
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {content.tags.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 rounded-full border border-gray-200 text-[11px] text-text-muted font-medium">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
        {[
          { label: "Content Type", value: CONTENT_TYPE_CONFIG[content.contentType].label },
          ...(content.subject
            ? [{ label: "Subject", value: SUBJECT_CONFIG[content.subject].label }]
            : []),
          ...(content.topic ? [{ label: "Topic", value: content.topic }] : []),
          ...(content.author ? [{ label: "Author", value: content.author }] : []),
          ...(content.totalPages ? [{ label: "Pages", value: `${content.totalPages}` }] : []),
          ...(content.durationSeconds
            ? [{ label: "Duration", value: formatDuration(content.durationSeconds) }]
            : []),
          {
            label: "Published",
            value: new Date(content.createdAt).toLocaleDateString("en-NG", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
          },
          { label: "Total Views", value: content.totalViews.toLocaleString() },
          { label: "Downloads", value: content.totalDownloads.toLocaleString() },
        ].map(({ label, value }) => (
          <div key={label}>
            <div className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
              {label}
            </div>
            <div className="text-[13px] font-medium text-green-900">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Ratings Tab ──────────────────────────────────────────────────────────────

interface RatingsTabProps {
  content: LibraryContent;
  ratings: RatingEntry[];
  userRating: number;
  hoverRating: number;
  reviewText: string;
  submitting: boolean;
  submitted: boolean;
  onSetUserRating: (n: number) => void;
  onSetHoverRating: (n: number) => void;
  onSetReviewText: (s: string) => void;
  onSubmit: () => void;
  hasAccess: boolean;
}

function StarRow({ filled, size = 18 }: { filled: boolean; size?: number }) {
  return (
    <Star
      size={size}
      className={filled ? "fill-amber-400 text-amber-400" : "text-gray-300 fill-gray-300"}
    />
  );
}

export function RatingsTab({
  content,
  ratings,
  userRating,
  hoverRating,
  reviewText,
  submitting,
  submitted,
  onSetUserRating,
  onSetHoverRating,
  onSetReviewText,
  onSubmit,
  hasAccess,
}: RatingsTabProps) {
  // Rating distribution
  const dist = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    count: ratings.filter((r) => r.rating === s).length,
    pct:
      ratings.length > 0
        ? Math.round((ratings.filter((r) => r.rating === s).length / ratings.length) * 100)
        : 0,
  }));

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div
        className="rounded-2xl bg-white border p-5"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-4">
          Ratings & Reviews
        </h2>
        <div className="flex gap-8 flex-wrap">
          <div className="text-center">
            <div className="text-[48px] font-bold text-green-900 leading-none">
              {content.averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center gap-0.5 my-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <StarRow key={s} filled={s <= Math.round(content.averageRating)} size={16} />
              ))}
            </div>
            <div className="text-[11px] text-text-muted">
              {content.ratingCount.toLocaleString()} ratings
            </div>
          </div>
          <div className="flex-1 min-w-[160px] space-y-1.5">
            {dist.map(({ star, pct, count }) => (
              <div key={star} className="flex items-center gap-2 text-[12px]">
                <span className="text-text-muted w-4 text-right">{star}</span>
                <Star size={11} className="fill-amber-400 text-amber-400 shrink-0" />
                <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-text-muted w-5 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submit rating */}
      {hasAccess && !submitted && (
        <div
          className="rounded-2xl bg-white border p-5"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <h3 className="text-[13px] font-bold text-green-900 mb-3">Leave a Review</h3>
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => onSetUserRating(s)}
                onMouseEnter={() => onSetHoverRating(s)}
                onMouseLeave={() => onSetHoverRating(0)}
                className="p-1 transition-transform hover:scale-110"
                aria-label={`Rate ${s} stars`}>
                <Star
                  size={28}
                  className={
                    (hoverRating || userRating) >= s
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300 fill-gray-300"
                  }
                />
              </button>
            ))}
          </div>
          <textarea
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[13px] text-green-900 resize-none focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-all"
            rows={3}
            value={reviewText}
            onChange={(e) => onSetReviewText(e.target.value)}
            placeholder="Share your thoughts on this content (optional)…"
          />
          <button
            onClick={onSubmit}
            disabled={!userRating || submitting}
            className="mt-3 px-5 py-2.5 rounded-xl bg-green-800 text-white text-[13px] font-semibold hover:bg-green-700 transition-all disabled:opacity-40">
            {submitting ? "Submitting…" : "Submit Review"}
          </button>
        </div>
      )}
      {submitted && (
        <div className="rounded-2xl bg-green-50 border border-green-100 p-4 flex items-center gap-3 text-[13px] text-green-700">
          <CheckCircle2 size={18} /> Thank you for your review!
        </div>
      )}

      {/* Reviews list */}
      <div
        className="rounded-2xl bg-white border overflow-hidden"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        {ratings.map((r, i) => (
          <div
            key={r.id}
            className={`p-5 ${i < ratings.length - 1 ? "border-b" : ""}`}
            style={{ borderColor: "rgba(30,80,50,0.06)" }}>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-green-800 text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                {r.avatarInitials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[13px] font-semibold text-green-900">{r.userName}</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <StarRow key={s} filled={s <= r.rating} size={12} />
                    ))}
                  </div>
                  <span className="text-[11px] text-text-muted ml-auto">
                    {new Date(r.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {r.review && (
                  <p className="text-[13px] text-text-muted leading-relaxed">{r.review}</p>
                )}
                <button className="flex items-center gap-1 text-[11px] text-text-muted mt-2 hover:text-green-700 transition-colors">
                  <ThumbsUp size={11} /> Helpful ({r.helpful})
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Related Tab ──────────────────────────────────────────────────────────────

export function RelatedTab({ items }: { items: RelatedContent[] }) {
  return (
    <div className="space-y-3">
      <h2 className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
        Related Content
      </h2>
      {items.map((item) => {
        const typeCfg = CONTENT_TYPE_CONFIG[item.contentType];
        const TypeIcon = typeCfg.icon;
        const subjectCfg = item.subject ? SUBJECT_CONFIG[item.subject] : null;

        const accessLabel = item.isFree
          ? { label: "Free", color: "#10b981" }
          : item.requiredTier
            ? { label: item.requiredTier, color: "#8b5cf6" }
            : { label: formatPrice(item.priceKobo!), color: "#f59e0b" };

        return (
          <Link
            key={item.id}
            href={`/library/${item.id}`}
            className="flex gap-3 p-3 rounded-2xl bg-white border hover:border-green-200 hover:shadow-sm transition-all"
            style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            {/* Thumbnail */}
            <div className="w-20 h-14 rounded-xl overflow-hidden shrink-0 bg-cream flex items-center justify-center">
              {item.thumbnailUrl ? (
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <TypeIcon size={24} style={{ color: typeCfg.color }} />
              )}
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-semibold" style={{ color: typeCfg.color }}>
                  {typeCfg.label}
                </span>
                {subjectCfg && (
                  <span className="text-[10px] text-text-muted">· {subjectCfg.label}</span>
                )}
              </div>
              <p className="text-[13px] font-semibold text-green-900 leading-snug line-clamp-2">
                {item.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <StarRow key={s} filled={s <= Math.round(item.averageRating)} size={10} />
                  ))}
                </div>
                <span className="text-[10px] text-text-muted">{item.averageRating.toFixed(1)}</span>
                <span
                  className="text-[11px] font-semibold ml-auto"
                  style={{ color: accessLabel.color }}>
                  {accessLabel.label}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
