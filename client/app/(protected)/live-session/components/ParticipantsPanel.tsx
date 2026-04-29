"use client";

import { useRef } from "react";
import { Mic, MicOff, Video, VideoOff, Monitor, MoreVertical } from "lucide-react";
import { Participant } from "@/types/live-session";
import { getInitials } from "@/lib/constants/live-session";

interface ParticipantsPanelProps {
  participants: Participant[];
  currentUserId: string;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isHandRaised: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  isTutor: boolean;
}

const ROLE_GRADIENTS: Record<string, string> = {
  tutor: "from-blue-500 to-purple-600",
  student: "from-emerald-500 to-teal-600",
};

export default function ParticipantsPanel({
  participants, currentUserId, isVideoEnabled, isAudioEnabled, isHandRaised, videoRef, isTutor,
}: ParticipantsPanelProps) {
  const tutor = participants.find((p) => p.role === "tutor");
  const students = participants.filter((p) => p.role === "student");

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-3">
      {/* My video preview */}
      <div className="bg-gray-800 rounded-2xl overflow-hidden">
        <div className="relative aspect-video bg-gray-700 flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className={`w-full h-full object-cover ${!isVideoEnabled ? "hidden" : ""}`}
          />
          {!isVideoEnabled && (
            <div className="flex flex-col items-center gap-2">
              <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${ROLE_GRADIENTS.student} flex items-center justify-center text-white font-bold text-xl`}>
                {getInitials("Adaeze Okonkwo")}
              </div>
              <span className="text-[11px] text-gray-400">Camera off</span>
            </div>
          )}
          <div className="absolute bottom-2 left-2 flex gap-1.5">
            {!isAudioEnabled && (
              <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                <MicOff size={10} className="text-white" />
              </div>
            )}
          </div>
          <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-0.5 rounded-full">
            <span className="text-[11px] text-white font-medium">
              You {isHandRaised ? "✋" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Tutor */}
      {tutor && (
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">Tutor</p>
          <ParticipantRow participant={tutor} isTutor={isTutor} isCurrentUser={tutor.id === currentUserId} />
        </div>
      )}

      {/* Students */}
      <div>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">
          Students ({students.length})
        </p>
        <div className="space-y-2">
          {students.map((p) => (
            <ParticipantRow
              key={p.id}
              participant={p}
              isTutor={isTutor}
              isCurrentUser={p.id === currentUserId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ParticipantRow({
  participant, isTutor, isCurrentUser,
}: {
  participant: Participant;
  isTutor: boolean;
  isCurrentUser: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 p-2.5 rounded-xl ${isCurrentUser ? "bg-blue-900/30 border border-blue-800/50" : "bg-gray-800 hover:bg-gray-750"} transition-colors`}>
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${ROLE_GRADIENTS[participant.role]} flex items-center justify-center text-white text-[12px] font-bold`}>
          {getInitials(participant.name)}
        </div>
        {participant.isHandRaised && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center text-[8px]">
            ✋
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[13px] font-medium text-white truncate">
            {isCurrentUser ? `${participant.name} (You)` : participant.name}
          </span>
          {participant.role === "tutor" && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-blue-600 text-white rounded-full shrink-0">
              TUTOR
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {participant.isAudioOn ? (
            <Mic size={11} className="text-emerald-400" />
          ) : (
            <MicOff size={11} className="text-red-400" />
          )}
          {participant.isVideoOn ? (
            <Video size={11} className="text-emerald-400" />
          ) : (
            <VideoOff size={11} className="text-red-400" />
          )}
          {participant.isScreenSharing && (
            <Monitor size={11} className="text-blue-400" />
          )}
        </div>
      </div>

      {/* Tutor actions */}
      {isTutor && !isCurrentUser && (
        <button className="p-1.5 text-gray-500 hover:text-white transition-colors">
          <MoreVertical size={14} />
        </button>
      )}
    </div>
  );
}
