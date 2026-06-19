"use client";

import { useRef, useState, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  SkipBack,
  SkipForward,
  Lock,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Crown,
  CreditCard,
  Zap,
  ArrowRight,
} from "lucide-react";
import type { LibraryContent, AccessCheckResult, LibraryAccess } from "../types";
import { fmtDuration, fmtPrice, TIER_CFG, PREVIEW } from "../config";

// ─── Paywall ──────────────────────────────────────────────────────────────────

function Paywall({ content, reason }: { content: LibraryContent; reason?: string }) {
  const tierCfg = content.requiredTier ? TIER_CFG[content.requiredTier] : null;
  const TierIcon = tierCfg?.icon ?? Crown;
  const isExpired = reason === "expired";

  const mediaPreview = content.contentType === "VIDEO" || content.contentType === "AUDIO";
  const previewNote = mediaPreview
    ? `${fmtDuration(content.previewSeconds ?? PREVIEW.VIDEO_SECONDS)} free preview`
    : `${content.previewPages ?? PREVIEW.PAGES} pages free preview`;

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6"
      style={{ background: "rgba(10,20,15,0.92)", backdropFilter: "blur(10px)" }}>
      <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-4">
        <Lock size={24} className="text-white" />
      </div>

      <h3 className="text-white text-[18px] font-bold mb-1">
        {isExpired ? "Access expired" : "Preview ended"}
      </h3>
      <p className="text-gray-400 text-[13px] mb-6 max-w-[280px] leading-relaxed">
        {isExpired
          ? "Renew your access to continue."
          : tierCfg
            ? `This content requires a ${tierCfg.label} plan.`
            : "Purchase once for lifetime access."}
      </p>

      <div className="flex flex-col gap-2 w-full max-w-[260px]">
        {content.priceKobo && (
          <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-700 text-white font-semibold text-[14px] hover:bg-green-600 transition-all">
            <CreditCard size={15} /> Buy — {fmtPrice(content.priceKobo)}
          </button>
        )}
        {tierCfg && (
          <button
            className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-[14px] hover:opacity-90 transition-all"
            style={{ background: tierCfg.color, color: "#fff" }}>
            <TierIcon size={15} /> Upgrade to {tierCfg.label}
          </button>
        )}
        {!content.priceKobo && !tierCfg && (
          <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-700 text-white font-semibold text-[14px]">
            <Zap size={15} /> Subscribe to Unlock
          </button>
        )}
        <button className="flex items-center justify-center gap-1.5 py-2 text-[12px] text-gray-400 hover:text-white transition-colors">
          View plans <ArrowRight size={12} />
        </button>
      </div>

      <p className="text-gray-600 text-[10px] mt-4">{previewNote}</p>
    </div>
  );
}

// ─── Video ────────────────────────────────────────────────────────────────────

function VideoViewer({
  content,
  access,
  record,
  onProgress,
  onBookmark,
}: {
  content: LibraryContent;
  access: AccessCheckResult;
  record: LibraryAccess | null;
  onProgress: (p: number) => void;
  onBookmark: (pos: number) => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const limit = content.previewSeconds ?? PREVIEW.VIDEO_SECONDS;
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [dur, setDur] = useState(content.durationSeconds ?? 0);
  const [walled, setWalled] = useState(false);

  // Resume from saved progress on mount
  useEffect(() => {
    if (ref.current && access.hasAccess && record?.progressPercent && dur > 0) {
      ref.current.currentTime = (record.progressPercent / 100) * dur;
    }
  }, [dur]);

  const onTimeUpdate = () => {
    if (!ref.current) return;
    const t = ref.current.currentTime;
    const d = ref.current.duration || dur;
    setCurrent(t);
    onProgress(Math.round((t / d) * 100));
    if (!access.hasAccess && t >= limit) {
      ref.current.pause();
      setPlaying(false);
      setWalled(true);
    }
  };

  const toggle = () => {
    if (!ref.current || walled) return;
    if (playing) {
      ref.current.pause();
      setPlaying(false);
    } else {
      ref.current.play();
      setPlaying(true);
    }
  };

  const skip = (d: number) => {
    if (!ref.current) return;
    const next = Math.max(0, Math.min(dur, current + d));
    if (!access.hasAccess && next > limit) {
      setWalled(true);
      return;
    }
    ref.current.currentTime = next;
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = parseFloat(e.target.value);
    if (!access.hasAccess && t > limit) {
      setWalled(true);
      return;
    }
    if (ref.current) ref.current.currentTime = t;
    setCurrent(t);
  };

  const pct = dur > 0 ? (current / dur) * 100 : 0;
  const lim = dur > 0 ? (limit / dur) * 100 : 0;

  return (
    <div className="rounded-2xl overflow-hidden bg-black">
      {/* Video area */}
      <div className="relative bg-black" style={{ aspectRatio: "16/9" }}>
        <video
          ref={ref}
          src={content.fileUrl}
          className="w-full h-full object-contain"
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={() => {
            if (ref.current) setDur(ref.current.duration);
          }}
          muted={muted}
          preload="metadata"
          onClick={toggle}
        />

        {/* Preview timer badge */}
        {!access.hasAccess && !walled && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 text-white text-[11px] font-semibold">
            <Lock size={10} /> {fmtDuration(Math.max(0, limit - Math.floor(current)))} left
          </div>
        )}

        {/* Big play button when paused */}
        {!playing && !walled && (
          <button
            onClick={toggle}
            className="absolute inset-0 flex items-center justify-center"
            aria-label="Play">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all">
              <Play size={26} className="text-white ml-1" />
            </div>
          </button>
        )}

        {/* Paywall */}
        {walled && <Paywall content={content} reason={access.reason} />}
      </div>

      {/* Controls */}
      {!walled && (
        <div className="bg-gray-900 px-4 py-3">
          {/* Seek bar */}
          <div className="relative mb-2.5">
            <div
              className="absolute inset-0 h-1.5 rounded-full overflow-hidden pointer-events-none"
              style={{ top: "50%", transform: "translateY(-50%)" }}>
              <div className="h-full bg-green-500" style={{ width: `${pct}%` }} />
              {/* Preview cap marker */}
              {!access.hasAccess && (
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-amber-400"
                  style={{ left: `${lim}%` }}
                />
              )}
            </div>
            <input
              type="range"
              min={0}
              max={dur || 1}
              step={1}
              value={current}
              onChange={seek}
              className="relative w-full h-1.5 opacity-0 cursor-pointer"
              aria-label="Seek"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => skip(-10)}
              className="text-gray-400 hover:text-white p-1"
              aria-label="Back 10s">
              <SkipBack size={15} />
            </button>
            <button
              onClick={toggle}
              className="text-white hover:text-green-400 p-1"
              aria-label={playing ? "Pause" : "Play"}>
              {playing ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button
              onClick={() => skip(10)}
              className="text-gray-400 hover:text-white p-1"
              aria-label="Forward 10s">
              <SkipForward size={15} />
            </button>

            <span className="text-[11px] text-gray-400 ml-1 tabular-nums">
              {fmtDuration(Math.floor(current))} / {fmtDuration(Math.floor(dur))}
            </span>

            <div className="flex-1" />

            {access.hasAccess && (
              <button
                onClick={() => onBookmark(Math.floor(current))}
                className="text-gray-400 hover:text-amber-400 p-1 transition-colors"
                aria-label="Bookmark this moment">
                <Bookmark size={14} />
              </button>
            )}

            <button
              onClick={() => setMuted(!muted)}
              className="text-gray-400 hover:text-white p-1"
              aria-label={muted ? "Unmute" : "Mute"}>
              {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>

            <button
              onClick={() => ref.current?.requestFullscreen()}
              className="text-gray-400 hover:text-white p-1"
              aria-label="Fullscreen">
              <Maximize2 size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Audio ────────────────────────────────────────────────────────────────────

function AudioViewer({
  content,
  access,
  onProgress,
}: {
  content: LibraryContent;
  access: AccessCheckResult;
  onProgress: (p: number) => void;
}) {
  const ref = useRef<HTMLAudioElement>(null);
  const limit = content.previewSeconds ?? PREVIEW.AUDIO_SECONDS;
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [dur, setDur] = useState(content.durationSeconds ?? 0);
  const [walled, setWalled] = useState(false);
  const [tick, setTick] = useState(0); // for waveform animation

  useEffect(() => {
    let id: any;
    if (playing) id = setInterval(() => setTick((t) => t + 1), 100);
    return () => clearInterval(id);
  }, [playing]);

  const onTimeUpdate = () => {
    if (!ref.current) return;
    const t = ref.current.currentTime;
    const d = ref.current.duration || dur;
    setCurrent(t);
    onProgress(Math.round((t / d) * 100));
    if (!access.hasAccess && t >= limit) {
      ref.current.pause();
      setPlaying(false);
      setWalled(true);
    }
  };

  const toggle = () => {
    if (!ref.current || walled) return;
    if (playing) {
      ref.current.pause();
      setPlaying(false);
    } else {
      ref.current.play();
      setPlaying(true);
    }
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = parseFloat(e.target.value);
    if (!access.hasAccess && t > limit) {
      setWalled(true);
      return;
    }
    if (ref.current) ref.current.currentTime = t;
    setCurrent(t);
  };

  return (
    <div
      className="rounded-2xl bg-white border overflow-hidden"
      style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <audio
        ref={ref}
        src={content.fileUrl}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={() => {
          if (ref.current) setDur(ref.current.duration);
        }}
        preload="metadata"
      />

      {/* Thumbnail + waveform area */}
      <div
        className="relative bg-green-900 flex items-center justify-center overflow-hidden"
        style={{ height: 160 }}>
        {content.thumbnailUrl && (
          <img
            src={content.thumbnailUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
        )}
        {walled ? (
          <div className="relative z-10 w-full h-full">
            <Paywall content={content} reason={access.reason} />
          </div>
        ) : (
          <div className="relative z-10 flex items-end gap-0.5 px-6">
            {Array.from({ length: 50 }, (_, i) => {
              const playedFraction = dur > 0 ? current / dur : 0;
              const barFraction = i / 50;
              const played = barFraction <= playedFraction;
              const height = 12 + Math.abs(Math.sin((i + tick * 0.3) * 0.5) * 40);
              return (
                <div
                  key={i}
                  className="rounded-full transition-none"
                  style={{
                    width: 3,
                    height: playing ? height : 12 + Math.abs(Math.sin(i * 0.5) * 30),
                    background: played ? "#4ade80" : "rgba(255,255,255,0.25)",
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Preview badge */}
        {!access.hasAccess && !walled && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 text-white text-[11px] font-semibold">
            <Lock size={10} /> {fmtDuration(Math.max(0, limit - Math.floor(current)))} left
          </div>
        )}
      </div>

      {!walled && (
        <div className="px-5 py-4">
          {/* Seek */}
          <input
            type="range"
            min={0}
            max={dur || 1}
            step={0.5}
            value={current}
            onChange={seek}
            className="w-full mb-1 cursor-pointer accent-green-700"
            aria-label="Seek audio"
          />
          <div className="flex items-center justify-between text-[11px] text-text-muted mb-4">
            <span className="tabular-nums">{fmtDuration(Math.floor(current))}</span>
            {!access.hasAccess && (
              <span className="flex items-center gap-1 text-amber-600 font-semibold">
                <Lock size={9} /> {fmtDuration(limit)} preview
              </span>
            )}
            <span className="tabular-nums">{fmtDuration(Math.floor(dur))}</span>
          </div>

          <div className="flex justify-center">
            <button
              onClick={toggle}
              className="w-12 h-12 rounded-full bg-green-800 text-white flex items-center justify-center hover:bg-green-700 transition-all shadow-md"
              aria-label={playing ? "Pause" : "Play"}>
              {playing ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Document / Ebook / Lesson Note / Past Question ──────────────────────────

function DocViewer({
  content,
  access,
  onBookmark,
}: {
  content: LibraryContent;
  access: AccessCheckResult;
  onBookmark: (page: number) => void;
}) {
  const total = content.totalPages ?? 10;
  const preview =
    content.previewPages ?? (content.contentType === "EBOOK" ? PREVIEW.EBOOK_PAGES : PREVIEW.PAGES);
  const limit = access.hasAccess ? total : preview;
  const [page, setPage] = useState(1);

  const go = (d: number) => {
    const next = page + d;
    if (next < 1) return;
    if (!access.hasAccess && next > preview) return; // hit paywall
    if (next > total) return;
    setPage(next);
  };

  const hitWall = !access.hasAccess && page >= preview;

  return (
    <div
      className="rounded-2xl bg-white border overflow-hidden"
      style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b bg-gray-50"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <div className="flex items-center gap-1">
          <button
            onClick={() => go(-1)}
            disabled={page <= 1}
            className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 transition-colors"
            aria-label="Previous page">
            <ChevronLeft size={16} />
          </button>
          <span className="text-[12px] font-semibold text-green-900 min-w-[100px] text-center">
            Page {page} of {access.hasAccess ? total : `${preview} (preview)`}
          </span>
          <button
            onClick={() => go(1)}
            disabled={access.hasAccess ? page >= total : page >= preview}
            className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 transition-colors"
            aria-label="Next page">
            <ChevronRight size={16} />
          </button>
        </div>

        {access.hasAccess && (
          <button
            onClick={() => onBookmark(page)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-[12px] font-medium hover:bg-amber-100 transition-all">
            <Bookmark size={12} /> Bookmark p.{page}
          </button>
        )}
      </div>

      {/* PDF frame */}
      <div className="relative">
        <iframe
          src={`${content.fileUrl}#page=${page}&toolbar=0&navpanes=0`}
          className="w-full border-0"
          style={{ height: "72vh" }}
          title={`${content.title} page ${page}`}
        />

        {/* Fade + lock on last preview page */}
        {hitWall && (
          <div className="absolute inset-0 flex flex-col">
            <div className="flex-1 bg-gradient-to-b from-transparent to-white/95" />
            <div className="bg-white flex items-center justify-center py-8 px-6">
              <Paywall content={content} reason={access.reason} />
            </div>
          </div>
        )}

        {/* Soft fade + "X more pages" hint on second-to-last preview page */}
        {!access.hasAccess && page === preview - 1 && preview > 1 && (
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/60 to-transparent flex items-end justify-center pb-3 pointer-events-none">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border shadow-sm text-[11px] text-text-muted font-semibold">
              <Lock size={10} className="text-amber-500" />
              {total - preview} more page{total - preview !== 1 ? "s" : ""} — unlock to read
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Dispatcher ───────────────────────────────────────────────────────────────

export function Player({
  content,
  access,
  record,
  onProgress,
  onBookmark,
}: {
  content: LibraryContent;
  access: AccessCheckResult;
  record: LibraryAccess | null;
  onProgress: (p: number) => void;
  onBookmark: (position: number) => void;
}) {
  if (content.contentType === "VIDEO") {
    return (
      <VideoViewer
        content={content}
        access={access}
        record={record}
        onProgress={onProgress}
        onBookmark={onBookmark}
      />
    );
  }
  if (content.contentType === "AUDIO") {
    return <AudioViewer content={content} access={access} onProgress={onProgress} />;
  }
  return <DocViewer content={content} access={access} onBookmark={onBookmark} />;
}
