"use client";

import { useRef, useState, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Lock,
  SkipBack,
  SkipForward,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { LibraryContent, AccessCheckResult, LibraryAccessRecord } from "../types";
import { formatDuration, formatPrice, TIER_CONFIG, DEFAULT_PREVIEW } from "../constants";
import { PaywallOverlay } from "./PaywallOverlay";

// ─── Video Player ─────────────────────────────────────────────────────────────

function VideoPlayer({
  content,
  access,
  accessRecord,
  onProgress,
  onAddBookmark,
}: {
  content: LibraryContent;
  access: AccessCheckResult;
  accessRecord: LibraryAccessRecord | null;
  onProgress: (pct: number) => void;
  onAddBookmark: (pos: number) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(content.durationSeconds ?? 0);
  const [showPaywall, setShowPaywall] = useState(false);
  const previewLimit = content.previewSeconds ?? DEFAULT_PREVIEW.videoSeconds;

  // Resume from progress
  useEffect(() => {
    if (videoRef.current && accessRecord?.progressPercent && access.hasAccess) {
      const t = (accessRecord.progressPercent / 100) * duration;
      videoRef.current.currentTime = t;
    }
  }, [duration]);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const t = videoRef.current.currentTime;
    const d = videoRef.current.duration || duration;
    setCurrentTime(t);
    const pct = Math.round((t / d) * 100);
    onProgress(pct);

    // Hit preview limit on locked content
    if (!access.hasAccess && t >= previewLimit) {
      videoRef.current.pause();
      setPlaying(false);
      setShowPaywall(true);
    }
  };

  const handleLoaded = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (showPaywall) return;
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  const seek = (delta: number) => {
    if (!videoRef.current) return;
    const newTime = Math.max(0, Math.min(duration, currentTime + delta));
    if (!access.hasAccess && newTime > previewLimit) {
      setShowPaywall(true);
      return;
    }
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSeekBar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = parseFloat(e.target.value);
    if (!access.hasAccess && t > previewLimit) {
      setShowPaywall(true);
      return;
    }
    if (videoRef.current) videoRef.current.currentTime = t;
    setCurrentTime(t);
  };

  return (
    <div className="rounded-2xl overflow-hidden bg-black relative">
      {/* Video */}
      <div className="relative bg-black" style={{ aspectRatio: "16/9" }}>
        <video
          ref={videoRef}
          src={content.fileUrl}
          className="w-full h-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoaded}
          muted={muted}
          preload="metadata"
          onClick={togglePlay}
        />

        {/* Preview watermark */}
        {!access.hasAccess && !showPaywall && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 text-white text-[11px] font-semibold">
            <Lock size={10} />
            Preview: {formatDuration(Math.max(0, previewLimit - Math.floor(currentTime)))} left
          </div>
        )}

        {/* Paywall overlay */}
        {showPaywall && <PaywallOverlay content={content} reason={access.reason} />}

        {/* Play overlay when paused */}
        {!playing && !showPaywall && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center"
            aria-label="Play">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all">
              <Play size={28} className="text-white ml-1" />
            </div>
          </button>
        )}
      </div>

      {/* Controls bar */}
      {!showPaywall && (
        <div className="bg-gray-900 px-4 py-3">
          {/* Seek bar */}
          <div className="relative mb-2">
            <input
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={handleSeekBar}
              className="w-full h-1 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #10b981 ${(currentTime / duration) * 100}%, ${!access.hasAccess ? `#f59e0b ${(previewLimit / duration) * 100}%, ` : ""}#374151 0%)`,
              }}
              aria-label="Seek"
            />
            {/* Preview limit marker */}
            {!access.hasAccess && duration > 0 && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-amber-400 opacity-70"
                style={{ left: `${(previewLimit / duration) * 100}%` }}
                title="Preview limit"
              />
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => seek(-10)}
              className="text-gray-400 hover:text-white"
              aria-label="Back 10s">
              <SkipBack size={16} />
            </button>
            <button
              onClick={togglePlay}
              className="text-white hover:text-green-400"
              aria-label={playing ? "Pause" : "Play"}>
              {playing ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button
              onClick={() => seek(10)}
              className="text-gray-400 hover:text-white"
              aria-label="Forward 10s">
              <SkipForward size={16} />
            </button>

            <span className="text-[11px] text-gray-400 ml-1">
              {formatDuration(Math.floor(currentTime))} / {formatDuration(Math.floor(duration))}
            </span>

            <div className="flex-1" />

            {access.hasAccess && (
              <button
                onClick={() => onAddBookmark(Math.floor(currentTime))}
                className="text-gray-400 hover:text-amber-400 transition-colors"
                aria-label="Add bookmark">
                <Bookmark size={15} />
              </button>
            )}

            <button
              onClick={() => setMuted(!muted)}
              className="text-gray-400 hover:text-white"
              aria-label={muted ? "Unmute" : "Mute"}>
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            <button
              onClick={() => videoRef.current?.requestFullscreen()}
              className="text-gray-400 hover:text-white"
              aria-label="Fullscreen">
              <Maximize2 size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Audio Player ─────────────────────────────────────────────────────────────

function AudioPlayer({
  content,
  access,
  onProgress,
}: {
  content: LibraryContent;
  access: AccessCheckResult;
  onProgress: (pct: number) => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(content.durationSeconds ?? 0);
  const [showPaywall, setShowPaywall] = useState(false);
  const previewLimit = content.previewSeconds ?? DEFAULT_PREVIEW.audioSeconds;

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const t = audioRef.current.currentTime;
    setCurrentTime(t);
    onProgress(Math.round((t / (audioRef.current.duration || duration)) * 100));
    if (!access.hasAccess && t >= previewLimit) {
      audioRef.current.pause();
      setPlaying(false);
      setShowPaywall(true);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || showPaywall) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <div className="rounded-2xl bg-white border p-6" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <audio
        ref={audioRef}
        src={content.fileUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          if (audioRef.current) setDuration(audioRef.current.duration);
        }}
        preload="metadata"
      />

      {/* Waveform visual placeholder */}
      <div
        className="rounded-xl bg-cream flex items-center justify-center mb-6 overflow-hidden"
        style={{ height: 120 }}>
        {showPaywall ? (
          <PaywallOverlay content={content} reason={access.reason} inline />
        ) : (
          <div className="flex items-end gap-0.5 px-4">
            {Array.from({ length: 60 }, (_, i) => (
              <div
                key={i}
                className="rounded-full transition-all"
                style={{
                  width: 3,
                  height: Math.max(
                    8,
                    Math.abs(Math.sin(i * 0.4 + currentTime * 0.1) * 60) + Math.random() * 10,
                  ),
                  background: i / 60 <= currentTime / duration ? "#2e8b57" : "#d1d5db",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {!showPaywall && (
        <>
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={(e) => {
              if (audioRef.current) audioRef.current.currentTime = parseFloat(e.target.value);
            }}
            className="w-full mb-3 cursor-pointer"
            aria-label="Seek audio"
          />
          <div className="flex items-center justify-between text-[12px] text-text-muted mb-4">
            <span>{formatDuration(Math.floor(currentTime))}</span>
            {!access.hasAccess && (
              <span className="text-amber-600 font-semibold flex items-center gap-1">
                <Lock size={10} /> Preview: {formatDuration(previewLimit)} free
              </span>
            )}
            <span>{formatDuration(Math.floor(duration))}</span>
          </div>
          <div className="flex justify-center">
            <button
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-green-800 text-white flex items-center justify-center hover:bg-green-700 transition-all shadow-lg"
              aria-label={playing ? "Pause" : "Play"}>
              {playing ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Document / Ebook / Lesson Note / Past Question Viewer ───────────────────

function DocumentViewer({
  content,
  access,
  onAddBookmark,
}: {
  content: LibraryContent;
  access: AccessCheckResult;
  onAddBookmark: (pos: number) => void;
}) {
  const totalPages = content.totalPages ?? 10;
  const previewPages = content.previewPages ?? DEFAULT_PREVIEW.documentPages;
  const limit = access.hasAccess ? totalPages : previewPages;
  const [page, setPage] = useState(1);
  const showPaywall = !access.hasAccess && page > previewPages;

  const go = (delta: number) => {
    const next = page + delta;
    if (next < 1 || next > totalPages) return;
    if (!access.hasAccess && next > previewPages) {
      setPage(previewPages + 1);
      return;
    }
    setPage(next);
  };

  return (
    <div
      className="rounded-2xl bg-white border overflow-hidden"
      style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b bg-gray-50"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => go(-1)}
            disabled={page <= 1}
            className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30"
            aria-label="Previous page">
            <ChevronLeft size={16} />
          </button>
          <span className="text-[12px] text-green-900 font-semibold min-w-[80px] text-center">
            Page {Math.min(page, limit)} of{" "}
            {access.hasAccess ? totalPages : `${previewPages} (preview)`}
          </span>
          <button
            onClick={() => go(1)}
            disabled={!access.hasAccess ? page >= previewPages : page >= totalPages}
            className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30"
            aria-label="Next page">
            <ChevronRight size={16} />
          </button>
        </div>

        {access.hasAccess && (
          <button
            onClick={() => onAddBookmark(page)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 text-[12px] font-medium hover:bg-amber-100 transition-all">
            <Bookmark size={13} /> Bookmark p.{page}
          </button>
        )}
      </div>

      {/* Page area */}
      {showPaywall ? (
        <PaywallOverlay content={content} reason={access.reason} />
      ) : (
        <div className="relative">
          {/* Embed the PDF */}
          <iframe
            src={`${content.fileUrl}#page=${page}`}
            className="w-full"
            style={{ height: "70vh", border: "none" }}
            title={`${content.title} - Page ${page}`}
          />
          {/* Blur + lock overlay for last preview page */}
          {!access.hasAccess && page === previewPages && (
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent flex items-end justify-center pb-4 pointer-events-none">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border shadow-sm text-[12px] font-semibold text-text-muted">
                <Lock size={12} className="text-amber-500" />
                {totalPages - previewPages} more pages locked
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main ContentPlayer dispatcher ───────────────────────────────────────────

interface ContentPlayerProps {
  content: LibraryContent;
  access: AccessCheckResult;
  accessRecord: LibraryAccessRecord | null;
  onProgress: (pct: number) => void;
  onAddBookmark: (position: number) => void;
}

export function ContentPlayer({
  content,
  access,
  accessRecord,
  onProgress,
  onAddBookmark,
}: ContentPlayerProps) {
  if (content.contentType === "video") {
    return (
      <VideoPlayer
        content={content}
        access={access}
        accessRecord={accessRecord}
        onProgress={onProgress}
        onAddBookmark={onAddBookmark}
      />
    );
  }
  if (content.contentType === "audio") {
    return <AudioPlayer content={content} access={access} onProgress={onProgress} />;
  }
  // document, ebook, lesson_note, past_question, infographic
  return <DocumentViewer content={content} access={access} onAddBookmark={onAddBookmark} />;
}
