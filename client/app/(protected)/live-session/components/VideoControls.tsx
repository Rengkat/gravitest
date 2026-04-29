"use client";

import { Mic, MicOff, Video, VideoOff } from "lucide-react";

interface VideoControlsProps {
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isHandRaised: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleHand: () => void;
}

export default function VideoControls({
  isAudioEnabled,
  isVideoEnabled,
  isHandRaised,
  onToggleAudio,
  onToggleVideo,
  onToggleHand,
}: VideoControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onToggleAudio}
        title={isAudioEnabled ? "Mute mic" : "Unmute mic"}
        className={`p-2.5 rounded-xl transition-all ${
          isAudioEnabled
            ? "bg-gray-700 text-white hover:bg-gray-600"
            : "bg-red-600 text-white hover:bg-red-700"
        }`}
      >
        {isAudioEnabled ? <Mic size={17} /> : <MicOff size={17} />}
      </button>

      <button
        onClick={onToggleVideo}
        title={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
        className={`p-2.5 rounded-xl transition-all ${
          isVideoEnabled
            ? "bg-gray-700 text-white hover:bg-gray-600"
            : "bg-red-600 text-white hover:bg-red-700"
        }`}
      >
        {isVideoEnabled ? <Video size={17} /> : <VideoOff size={17} />}
      </button>

      <button
        onClick={onToggleHand}
        title={isHandRaised ? "Lower hand" : "Raise hand"}
        className={`p-2.5 rounded-xl text-lg transition-all ${
          isHandRaised
            ? "bg-yellow-500 text-white scale-110 shadow-lg shadow-yellow-500/30"
            : "bg-gray-700 text-white hover:bg-gray-600"
        }`}
      >
        ✋
      </button>
    </div>
  );
}
