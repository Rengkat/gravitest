"use client";

import Link from "next/link";
import {
  ChevronRight,
  Eye,
  Download,
  Star,
  Clock,
  FileText,
  Calendar,
  User,
  Tag,
} from "lucide-react";
import type { LibraryContent, AccessCheckResult } from "../types";
import {
  CONTENT_TYPE_CONFIG,
  SUBJECT_CONFIG,
  EXAM_LABELS,
  CLASS_LABELS,
  TIER_CONFIG,
  formatDuration,
  formatFileSize,
  formatPrice,
} from "../constants";

interface Props {
  content: LibraryContent;
  access: AccessCheckResult | null;
  progressPercent: number;
}

export function ContentHeader({ content, access, progressPercent }: Props) {
  const typeCfg = CONTENT_TYPE_CONFIG[content.contentType];
  const TypeIcon = typeCfg.icon;
  const subjectCfg = content.subject ? SUBJECT_CONFIG[content.subject] : null;

  // Access label
  const accessLabel = content.isFree
    ? { label: "Free", color: "#10b981", bg: "#10b98115" }
    : content.requiredTier
      ? {
          label: `${TIER_CONFIG[content.requiredTier].label} Plan`,
          color: TIER_CONFIG[content.requiredTier].color,
          bg: TIER_CONFIG[content.requiredTier].bg,
        }
      : { label: formatPrice(content.priceKobo!), color: "#f59e0b", bg: "#f59e0b15" };

  return (
    <div className="mb-6">
      {/* Breadcrumb */}
      <nav
        className="flex items-center gap-1.5 text-[12px] text-text-muted mb-5"
        aria-label="Breadcrumb">
        <Link href="/library" className="hover:text-green-700 transition-colors">
          Library
        </Link>
        <ChevronRight size={12} />
        <Link
          href={`/library?type=${content.contentType}`}
          className="hover:text-green-700 transition-colors capitalize">
          {typeCfg.label}
        </Link>
        <ChevronRight size={12} />
        <span className="text-green-900 font-medium truncate max-w-[200px]">{content.title}</span>
      </nav>

      {/* Card */}
      <div
        className="rounded-2xl bg-white border overflow-hidden"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        {/* Thumbnail */}
        <div className="relative w-full aspect-video bg-gray-900 overflow-hidden max-h-72">
          {content.thumbnailUrl ? (
            <img
              src={content.thumbnailUrl}
              alt={content.title}
              className="w-full h-full object-cover opacity-80"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: typeCfg.bg }}>
              <TypeIcon size={64} style={{ color: typeCfg.color }} className="opacity-30" />
            </div>
          )}
          {/* Type badge overlay */}
          <div
            className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-sm"
            style={{ background: `${typeCfg.color}ee` }}>
            <TypeIcon size={12} className="text-white" />
            <span className="text-white text-[11px] font-bold">{typeCfg.label}</span>
          </div>
          {/* Progress bar overlay */}
          {access?.hasAccess && progressPercent > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/30">
              <div
                className="h-full bg-green-400 transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-5">
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            {subjectCfg && (
              <span
                className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
                style={{ background: `${subjectCfg.color}15`, color: subjectCfg.color }}>
                {subjectCfg.label}
              </span>
            )}
            {content.topic && (
              <span className="flex items-center gap-1 text-[11px] text-text-muted">
                <Tag size={10} /> {content.topic}
              </span>
            )}
            <span
              className="px-2 py-0.5 rounded-full text-[11px] font-semibold ml-auto"
              style={{ background: accessLabel.bg, color: accessLabel.color }}>
              {accessLabel.label}
            </span>
          </div>

          <h1 className="font-serif text-[22px] text-green-900 leading-snug mb-2">
            {content.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-[12px] text-text-muted mb-4">
            {content.author && (
              <span className="flex items-center gap-1">
                <User size={11} /> {content.author}
              </span>
            )}
            {content.durationSeconds && (
              <span className="flex items-center gap-1">
                <Clock size={11} /> {formatDuration(content.durationSeconds)}
              </span>
            )}
            {content.totalPages && (
              <span className="flex items-center gap-1">
                <FileText size={11} /> {content.totalPages} pages
              </span>
            )}
            {content.fileSizeBytes && (
              <span className="flex items-center gap-1">
                <Download size={11} /> {formatFileSize(content.fileSizeBytes)}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Eye size={11} /> {content.totalViews.toLocaleString()} views
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={11} />{" "}
              {new Date(content.createdAt).toLocaleDateString("en-NG", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Rating summary */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={14}
                  className={
                    s <= Math.round(content.averageRating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-200 fill-gray-200"
                  }
                />
              ))}
            </div>
            <span className="text-[13px] font-bold text-green-900">
              {content.averageRating.toFixed(1)}
            </span>
            <span className="text-[12px] text-text-muted">
              ({content.ratingCount.toLocaleString()} ratings)
            </span>
            {access?.hasAccess && progressPercent > 0 && (
              <span
                className="ml-auto text-[11px] font-semibold"
                style={{ color: progressPercent >= 100 ? "#10b981" : "#2e8b57" }}>
                {progressPercent >= 100 ? "Completed" : `${progressPercent}% complete`}
              </span>
            )}
          </div>

          {/* Exam / Class chips */}
          <div className="flex flex-wrap gap-1.5">
            {content.examTypes.map((e) => (
              <span
                key={e}
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-50 text-green-700">
                {EXAM_LABELS[e] ?? e}
              </span>
            ))}
            {content.classLevels.map((c) => (
              <span
                key={c}
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700">
                {CLASS_LABELS[c] ?? c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
