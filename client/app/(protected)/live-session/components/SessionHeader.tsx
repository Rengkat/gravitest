"use client";

import {
  Clock, PhoneOff, Maximize2, Minimize2, Radio,
  ScreenShare, ScreenShareOff,
} from "lucide-react";
import { formatTime } from "@/lib/constants/live-session";

interface SessionHeaderProps {
  subject: string;
  topic: string;
  duration: number;
  isFullscreen: boolean;
  isRecording: boolean;
  isScreenSharing: boolean;
  onToggleFullscreen: () => void;
  onToggleScreenShare: () => void;
  onToggleRecording: () => void;
  onLeave: () => void;
}

export default function SessionHeader({
  subject,
  topic,
  duration,
  isFullscreen,
  isRecording,
  isScreenSharing,
  onToggleFullscreen,
  onToggleScreenShare,
  onToggleRecording,
  onLeave,
}: SessionHeaderProps) {
  return (
    <div className="bg-gray-900 border-b border-gray-700 px-4 py-2.5 flex items-center justify-between shrink-0">
      {/* Left: live indicator + timer + subject */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
          </span>
          <span className="text-[12px] font-bold text-white uppercase tracking-wider">Live</span>
        </div>

        <div className="flex items-center gap-1.5 text-gray-400">
          <Clock size={13} />
          <span className="text-[13px] font-mono text-white">{formatTime(duration)}</span>
        </div>

        <div className="hidden md:block">
          <span className="text-[13px] text-gray-300 font-medium">
            {subject}
          </span>
          <span className="text-gray-500 mx-1.5">·</span>
          <span className="text-[13px] text-gray-400">{topic}</span>
        </div>

        {isRecording && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-900/40 border border-red-700 rounded-full">
            <Radio size={11} className="text-red-400 animate-pulse" />
            <span className="text-[11px] font-bold text-red-400">REC</span>
          </div>
        )}
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-2">
        {/* Screen share */}
        <button
          onClick={onToggleScreenShare}
          title={isScreenSharing ? "Stop sharing" : "Share screen"}
          className={`p-2 rounded-lg transition-all text-[13px] hidden sm:flex items-center gap-1.5 ${
            isScreenSharing
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
          }`}
        >
          {isScreenSharing ? <ScreenShareOff size={16} /> : <ScreenShare size={16} />}
          <span className="hidden md:inline">{isScreenSharing ? "Stop Share" : "Share Screen"}</span>
        </button>

        {/* Record */}
        <button
          onClick={onToggleRecording}
          title={isRecording ? "Stop recording" : "Record session"}
          className={`p-2 rounded-lg transition-all hidden sm:flex items-center gap-1.5 text-[13px] ${
            isRecording
              ? "bg-red-700 text-white"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
          }`}
        >
          <Radio size={16} />
          <span className="hidden md:inline">{isRecording ? "Stop Rec" : "Record"}</span>
        </button>

        {/* Fullscreen */}
        <button
          onClick={onToggleFullscreen}
          title="Toggle fullscreen"
          className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-all"
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>

        {/* Leave */}
        <button
          onClick={onLeave}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors text-[13px] font-semibold"
        >
          <PhoneOff size={15} />
          <span className="hidden sm:inline">Leave</span>
        </button>
      </div>
    </div>
  );
}
