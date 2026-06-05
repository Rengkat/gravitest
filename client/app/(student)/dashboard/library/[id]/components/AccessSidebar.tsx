"use client";

import {
  Lock,
  Crown,
  CreditCard,
  CheckCircle2,
  Bookmark,
  Trash2,
  Clock,
  Download,
  Eye,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { LibraryContent, AccessCheckResult, LibraryAccessRecord } from "../types";
import { TIER_CONFIG, formatPrice, formatDuration } from "../constants";
import Link from "next/link";

interface Props {
  content: LibraryContent;
  access: AccessCheckResult | null;
  accessRecord: LibraryAccessRecord | null;
  progressPercent: number;
  showBookmarkInput: boolean;
  bookmarkNote: string;
  onSetShowBookmarkInput: (b: boolean) => void;
  onSetBookmarkNote: (s: string) => void;
}

export function AccessSidebar({
  content,
  access,
  accessRecord,
  progressPercent,
  showBookmarkInput,
  bookmarkNote,
  onSetShowBookmarkInput,
  onSetBookmarkNote,
}: Props) {
  const tierCfg = content.requiredTier ? TIER_CONFIG[content.requiredTier] : null;
  const TierIcon = tierCfg?.icon ?? Crown;
  const hasAccess = access?.hasAccess;

  return (
    <aside className="space-y-4">
      {/* ── Access gate card ── */}
      {!hasAccess && access && (
        <div
          className="rounded-2xl bg-white border p-5"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-bold text-green-900">
              {access.reason === "expired" ? "Access Expired" : "Unlock Content"}
            </h3>
            <div className="w-8 h-8 rounded-full bg-green-800 flex items-center justify-center">
              <Lock size={14} className="text-white" />
            </div>
          </div>

          {/* Price / tier */}
          {content.priceKobo && (
            <div className="mb-4">
              <div className="text-[26px] font-bold text-green-900">
                {formatPrice(content.priceKobo)}
              </div>
              <div className="text-[11px] text-text-muted">One-time purchase · Lifetime access</div>
            </div>
          )}
          {tierCfg && (
            <div
              className="flex items-center gap-2 p-3 rounded-xl mb-4"
              style={{ background: tierCfg.bg }}>
              <TierIcon size={16} style={{ color: tierCfg.color }} />
              <div>
                <div className="text-[13px] font-semibold" style={{ color: tierCfg.color }}>
                  {tierCfg.label} Plan Required
                </div>
                <div className="text-[11px] text-text-muted">
                  Includes all {tierCfg.label} content
                </div>
              </div>
            </div>
          )}

          {/* CTA buttons */}
          {content.priceKobo && (
            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-800 text-white font-semibold text-[14px] hover:bg-green-700 transition-all mb-2">
              <CreditCard size={15} />
              Buy for {formatPrice(content.priceKobo)}
            </button>
          )}
          {tierCfg && (
            <button
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-[14px] hover:opacity-90 transition-all mb-2"
              style={{ background: tierCfg.color, color: "#fff" }}>
              <TierIcon size={15} />
              Upgrade to {tierCfg.label}
            </button>
          )}
          {!content.priceKobo && !tierCfg && (
            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-800 text-white font-semibold text-[14px] hover:bg-green-700 transition-all mb-2">
              <Zap size={15} /> Subscribe to Access
            </button>
          )}
          <Link
            href="/plans"
            className="block text-center text-[12px] text-green-700 hover:underline mt-2">
            View all plans →
          </Link>

          {/* Preview note */}
          <p className="text-[11px] text-text-muted mt-3 text-center">
            {content.contentType === "video" || content.contentType === "audio"
              ? `Free preview: ${formatDuration(content.previewSeconds ?? 90)}`
              : `Free preview: ${content.previewPages ?? 2} pages`}
          </p>
        </div>
      )}

      {/* ── Access granted card ── */}
      {hasAccess && (
        <div
          className="rounded-2xl bg-white border p-5"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-bold text-green-900">Your Access</h3>
            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle2 size={16} className="text-green-600" />
            </div>
          </div>

          <div className="flex items-center gap-2 text-[12px] text-green-700 font-semibold mb-4">
            <CheckCircle2 size={14} />
            {access?.reason === "free"
              ? "Free content"
              : access?.reason === "owned"
                ? "Purchased"
                : "Included in your plan"}
          </div>

          {/* Progress bar */}
          {progressPercent > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="text-text-muted font-semibold">Progress</span>
                <span
                  className="font-bold"
                  style={{ color: progressPercent >= 100 ? "#10b981" : "#2e8b57" }}>
                  {progressPercent}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-green-600 transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              {progressPercent >= 100 && (
                <p className="text-[11px] text-green-600 font-semibold mt-1 text-center">
                  Completed!
                </p>
              )}
            </div>
          )}

          {/* Stats */}
          {accessRecord && (
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Eye, label: "Views", value: accessRecord.viewCount },
                { icon: Download, label: "Downloads", value: accessRecord.downloadCount },
                {
                  icon: Clock,
                  label: "Last Access",
                  value: accessRecord.lastAccessedAt
                    ? new Date(accessRecord.lastAccessedAt).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                      })
                    : "—",
                },
                {
                  icon: TrendingUp,
                  label: "Bookmarks",
                  value: accessRecord.bookmarks?.length ?? 0,
                },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="p-2 rounded-xl bg-cream flex items-center gap-2">
                  <Icon size={12} className="text-green-700 shrink-0" />
                  <div>
                    <div className="text-[12px] font-bold text-green-900">{value}</div>
                    <div className="text-[10px] text-text-muted">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Bookmarks card ── */}
      {hasAccess && accessRecord?.bookmarks && accessRecord.bookmarks.length > 0 && (
        <div
          className="rounded-2xl bg-white border p-5"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-3">
            Bookmarks
          </h3>
          <ul className="space-y-2">
            {accessRecord.bookmarks.map((bm, i) => (
              <li key={i} className="flex items-start gap-2 text-[12px]">
                <Bookmark size={12} className="text-amber-500 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-green-900">
                    {content.contentType === "video" || content.contentType === "audio"
                      ? formatDuration(bm.position)
                      : `Page ${bm.position}`}
                  </span>
                  {bm.note && <p className="text-text-muted text-[11px] truncate">{bm.note}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
