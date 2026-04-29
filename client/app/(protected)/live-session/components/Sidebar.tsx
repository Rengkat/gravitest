"use client";

import { useRef } from "react";
import {
  MessageCircle, Users, FolderOpen, ClipboardList,
  ChevronRight, ChevronLeft,
} from "lucide-react";
import { SidebarTab, Message, Participant, Resource, AttendanceRecord } from "@/types/live-session";
import ChatPanel from "./ChatPanel";
import ParticipantsPanel from "./ParticipantsPanel";
import ResourcesPanel from "./ResourcesPanel";
import AttendancePanel from "./AttendancePanel";

interface SidebarProps {
  isVisible: boolean;
  onToggle: () => void;
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  // chat
  messages: Message[];
  inputMessage: string;
  onInputChange: (v: string) => void;
  onSendMessage: () => void;
  // participants
  participants: Participant[];
  currentUserId: string;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isHandRaised: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  // resources
  resources: Resource[];
  onAddResource: (r: Omit<Resource, "id" | "uploadedAt">) => void;
  isTutor: boolean;
  // attendance
  attendance: AttendanceRecord[];
  onUpdateAttendance: (id: string, status: AttendanceRecord["status"]) => void;
}

const TABS: { id: SidebarTab; label: string; icon: any }[] = [
  { id: "chat",        label: "Chat",        icon: MessageCircle },
  { id: "participants",label: "People",      icon: Users },
  { id: "resources",   label: "Resources",   icon: FolderOpen },
  { id: "attendance",  label: "Attendance",  icon: ClipboardList },
];

export default function Sidebar({
  isVisible, onToggle,
  activeTab, onTabChange,
  messages, inputMessage, onInputChange, onSendMessage,
  participants, currentUserId, isVideoEnabled, isAudioEnabled, isHandRaised, videoRef,
  resources, onAddResource, isTutor,
  attendance, onUpdateAttendance,
}: SidebarProps) {
  const unreadCount = messages.length;
  const handRaisedCount = participants.filter((p) => p.isHandRaised).length;

  return (
    <div className={`relative flex shrink-0 transition-all duration-300 ${isVisible ? "w-80" : "w-10"}`}>
      {/* Toggle button */}
      <button
        onClick={onToggle}
        title={isVisible ? "Collapse sidebar" : "Expand sidebar"}
        className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-6 h-12 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-l-xl flex items-center justify-center transition-all shadow-lg"
      >
        {isVisible ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {isVisible && (
        <div className="flex-1 bg-gray-900 border-l border-gray-700 flex flex-col">
          {/* Tab bar */}
          <div className="flex border-b border-gray-700 shrink-0">
            {TABS.map(({ id, label, icon: Icon }) => {
              const badge =
                id === "chat" && unreadCount > 0
                  ? unreadCount
                  : id === "participants" && handRaisedCount > 0
                  ? handRaisedCount
                  : null;

              return (
                <button
                  key={id}
                  onClick={() => onTabChange(id)}
                  className={`flex-1 py-2.5 text-[11px] font-semibold transition-all flex flex-col items-center gap-1 relative ${
                    activeTab === id
                      ? "text-blue-400 border-b-2 border-blue-400 bg-gray-800/50"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  <div className="relative">
                    <Icon size={15} />
                    {badge !== null && (
                      <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                        {badge}
                      </span>
                    )}
                  </div>
                  <span className="hidden sm:block">{label}</span>
                </button>
              );
            })}
          </div>

          {/* Panel content */}
          <div className="flex-1 min-h-0 flex flex-col">
            {activeTab === "chat" && (
              <ChatPanel
                messages={messages}
                currentUserId={currentUserId}
                inputMessage={inputMessage}
                onInputChange={onInputChange}
                onSend={onSendMessage}
              />
            )}
            {activeTab === "participants" && (
              <ParticipantsPanel
                participants={participants}
                currentUserId={currentUserId}
                isVideoEnabled={isVideoEnabled}
                isAudioEnabled={isAudioEnabled}
                isHandRaised={isHandRaised}
                videoRef={videoRef}
                isTutor={isTutor}
              />
            )}
            {activeTab === "resources" && (
              <ResourcesPanel
                resources={resources}
                onAddResource={onAddResource}
                isTutor={isTutor}
              />
            )}
            {activeTab === "attendance" && (
              <AttendancePanel
                attendance={attendance}
                onUpdateStatus={onUpdateAttendance}
                isTutor={isTutor}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
