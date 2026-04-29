"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  INITIAL_PARTICIPANTS,
  INITIAL_RESOURCES,
  INITIAL_ATTENDANCE,
  SESSION_INFO,
  formatTime,
} from "@/lib/constants/live-session";
import { Participant, Message, Resource, AttendanceRecord, SidebarTab } from "@/types/live-session";

import SessionHeader from "./components/SessionHeader";
import Whiteboard from "./components/Whiteboard";
import VideoControls from "./components/VideoControls";
import Sidebar from "./components/Sidebar";

export default function LiveSessionPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Media state ──────────────────────────────────────────────────────────
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);

  // ── Session state ────────────────────────────────────────────────────────
  const [duration, setDuration] = useState(0);
  const [participants, setParticipants] = useState<Participant[]>(INITIAL_PARTICIPANTS);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "sys-1",
      userId: "system",
      userName: "System",
      content: "Session started. Welcome everyone!",
      timestamp: new Date(),
      type: "system",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);

  // ── UI state ─────────────────────────────────────────────────────────────
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activeTab, setActiveTab] = useState<SidebarTab>("chat");

  const isTutor = SESSION_INFO.currentUserRole === "tutor";

  // ── Timer ────────────────────────────────────────────────────────────────
  useEffect(() => {
    timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ── Camera ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch {
        // Camera/mic not available in this environment
      }
    };
    start();
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // ── Chat ─────────────────────────────────────────────────────────────────
  const sendMessage = useCallback(() => {
    if (!inputMessage.trim()) return;
    const msg: Message = {
      id: Date.now().toString(),
      userId: SESSION_INFO.currentUserId,
      userName: SESSION_INFO.currentUserName,
      content: inputMessage,
      timestamp: new Date(),
      type: "text",
    };
    setMessages((prev) => [...prev, msg]);
    setInputMessage("");

    // Simulated tutor response
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        userId: "1",
        userName: "Dr. Adebayo Ola",
        content: "Great question! Let me show you on the board.",
        timestamp: new Date(),
        type: "text",
      };
      setMessages((prev) => [...prev, reply]);
    }, 2000);
  }, [inputMessage]);

  // ── Participants ──────────────────────────────────────────────────────────
  const toggleHand = useCallback(() => {
    setIsHandRaised((v) => {
      const next = !v;
      setParticipants((prev) =>
        prev.map((p) => (p.id === SESSION_INFO.currentUserId ? { ...p, isHandRaised: next } : p)),
      );
      const sysMsg: Message = {
        id: Date.now().toString(),
        userId: "system",
        userName: "System",
        content: next
          ? `${SESSION_INFO.currentUserName} raised their hand ✋`
          : `${SESSION_INFO.currentUserName} lowered their hand`,
        timestamp: new Date(),
        type: "system",
      };
      setMessages((prev) => [...prev, sysMsg]);
      return next;
    });
  }, []);

  // ── Resources ─────────────────────────────────────────────────────────────
  const handleAddResource = useCallback((r: Omit<Resource, "id" | "uploadedAt">) => {
    const newRes: Resource = {
      ...r,
      id: `r${Date.now()}`,
      uploadedAt: new Date(),
    };
    setResources((prev) => [newRes, ...prev]);

    // System message to chat
    const sysMsg: Message = {
      id: Date.now().toString(),
      userId: "system",
      userName: "System",
      content: `📎 ${r.uploadedBy.split(" ")[0]} shared "${r.name}"`,
      timestamp: new Date(),
      type: "system",
    };
    setMessages((prev) => [...prev, sysMsg]);

    // Switch to resources tab
    setActiveTab("resources");
    setSidebarVisible(true);
  }, []);

  // ── Attendance ────────────────────────────────────────────────────────────
  const handleUpdateAttendance = useCallback((id: string, status: AttendanceRecord["status"]) => {
    setAttendance((prev) => prev.map((a) => (a.participantId === id ? { ...a, status } : a)));
  }, []);

  // ── Fullscreen ────────────────────────────────────────────────────────────
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // ── Screen share ──────────────────────────────────────────────────────────
  const toggleScreenShare = useCallback(async () => {
    if (!isScreenSharing) {
      try {
        const stream = await (navigator.mediaDevices as any).getDisplayMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
        setIsScreenSharing(true);
      } catch {
        // Cancelled or not available
      }
    } else {
      setIsScreenSharing(false);
      // Restore camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch {}
    }
  }, [isScreenSharing]);

  // ── Leave ─────────────────────────────────────────────────────────────────
  const handleLeave = useCallback(() => {
    if (confirm("Are you sure you want to leave the session?")) {
      window.location.href = "/dashboard/bookings";
    }
  }, []);

  return (
    <div ref={containerRef} className="h-screen bg-gray-950 flex flex-col overflow-hidden">
      {/* Top header */}
      <SessionHeader
        subject={SESSION_INFO.subject}
        topic={SESSION_INFO.topic}
        duration={duration}
        isFullscreen={isFullscreen}
        isRecording={isRecording}
        isScreenSharing={isScreenSharing}
        onToggleFullscreen={toggleFullscreen}
        onToggleScreenShare={toggleScreenShare}
        onToggleRecording={() => setIsRecording((v) => !v)}
        onLeave={handleLeave}
      />

      {/* Body: whiteboard + sidebar */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Main whiteboard area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Whiteboard fills all available vertical space */}
          <Whiteboard />

          {/* Bottom media bar */}
          <div className="bg-gray-900 border-t border-gray-700 px-4 py-2.5 flex items-center justify-between shrink-0">
            <div className="text-[12px] text-gray-500 font-mono">{formatTime(duration)}</div>

            <VideoControls
              isAudioEnabled={isAudioEnabled}
              isVideoEnabled={isVideoEnabled}
              isHandRaised={isHandRaised}
              onToggleAudio={() => setIsAudioEnabled((v) => !v)}
              onToggleVideo={() => setIsVideoEnabled((v) => !v)}
              onToggleHand={toggleHand}
            />

            <div className="flex items-center gap-2 text-[12px] text-gray-500">
              <span>{participants.length} in session</span>
            </div>
          </div>
        </div>

        {/* Collapsible sidebar */}
        <Sidebar
          isVisible={sidebarVisible}
          onToggle={() => setSidebarVisible((v) => !v)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          // chat
          messages={messages}
          inputMessage={inputMessage}
          onInputChange={setInputMessage}
          onSendMessage={sendMessage}
          // participants
          participants={participants}
          currentUserId={SESSION_INFO.currentUserId}
          isVideoEnabled={isVideoEnabled}
          isAudioEnabled={isAudioEnabled}
          isHandRaised={isHandRaised}
          videoRef={videoRef}
          // resources
          resources={resources}
          onAddResource={handleAddResource}
          isTutor={isTutor}
          // attendance
          attendance={attendance}
          onUpdateAttendance={handleUpdateAttendance}
        />
      </div>
    </div>
  );
}
