"use client";

import { MessageSquare, Flag, CheckCircle, Activity } from "lucide-react";
import { ConversationList } from "./components/ConversationList";
import type { AIConversation } from "../types";

// TODO: replace with GET /admin/ai/conversations
const MOCK_CONVERSATIONS: AIConversation[] = [
  {
    id: "1",
    sessionId: "sess-1",
    userId: "u1",
    userName: "Oluwaseun Adebayo",
    userEmail: "oluwaseun@email.com",
    userRole: "student",
    feature: "sabi_tutor",
    model: "gpt-4o",
    subject: "Mathematics",
    topic: "Quadratic Equations",
    examType: "WAEC",
    startTime: new Date(Date.now() - 30 * 60_000).toISOString(),
    endTime: new Date(Date.now() - 2 * 60_000).toISOString(),
    lastActivity: new Date(Date.now() - 2 * 60_000).toISOString(),
    messageCount: 12,
    totalTokens: 2345,
    totalCost: 0.045,
    status: "completed",
    isFlagged: false,
    userRating: 5,
  },
  {
    id: "2",
    sessionId: "sess-2",
    userId: "u2",
    userName: "Chioma Eze",
    userEmail: "chioma@email.com",
    userRole: "student",
    feature: "sabi_solve",
    model: "gpt-4o-mini",
    subject: "Physics",
    topic: "Newton's Laws",
    startTime: new Date(Date.now() - 20 * 60_000).toISOString(),
    lastActivity: new Date(Date.now() - 15 * 60_000).toISOString(),
    messageCount: 8,
    totalTokens: 1890,
    totalCost: 0.032,
    status: "active",
    isFlagged: false,
  },
  {
    id: "3",
    sessionId: "sess-3",
    userId: "u3",
    userName: "Emeka Nwosu",
    userEmail: "emeka@email.com",
    userRole: "student",
    feature: "sabi_quiz",
    model: "gpt-4o",
    subject: "Chemistry",
    examType: "NECO",
    startTime: new Date(Date.now() - 90 * 60_000).toISOString(),
    endTime: new Date(Date.now() - 60 * 60_000).toISOString(),
    lastActivity: new Date(Date.now() - 60 * 60_000).toISOString(),
    messageCount: 23,
    totalTokens: 4567,
    totalCost: 0.089,
    status: "completed",
    isFlagged: false,
    userRating: 4,
  },
  {
    id: "4",
    sessionId: "sess-4",
    userId: "u4",
    userName: "Test User",
    userEmail: "test.user@email.com",
    userRole: "student",
    feature: "sabi_tutor",
    model: "gpt-4o",
    subject: "Mathematics",
    examType: "JAMB",
    startTime: new Date(Date.now() - 3 * 60 * 60_000).toISOString(),
    endTime: new Date(Date.now() - 2.9 * 60 * 60_000).toISOString(),
    lastActivity: new Date(Date.now() - 2.9 * 60 * 60_000).toISOString(),
    messageCount: 4,
    totalTokens: 612,
    totalCost: 0.018,
    status: "flagged",
    isFlagged: true,
    flagReason: "Attempted to get answers for live exam",
  },
  {
    id: "5",
    sessionId: "sess-5",
    userId: "u5",
    userName: "Another User",
    userEmail: "another.user@email.com",
    userRole: "student",
    feature: "sabi_explain",
    model: "claude-3.5-sonnet",
    subject: "Biology",
    startTime: new Date(Date.now() - 6 * 60 * 60_000).toISOString(),
    endTime: new Date(Date.now() - 5.9 * 60 * 60_000).toISOString(),
    lastActivity: new Date(Date.now() - 5.9 * 60 * 60_000).toISOString(),
    messageCount: 2,
    totalTokens: 340,
    totalCost: 0.009,
    status: "flagged",
    isFlagged: true,
    flagReason: "Explicit content request",
  },
  {
    id: "6",
    sessionId: "sess-6",
    userId: "u6",
    userName: "Ifeoma Obi",
    userEmail: "ifeoma@email.com",
    userRole: "tutor",
    feature: "sabi_essay",
    model: "gpt-4o",
    subject: "English Language",
    topic: "Essay Structure",
    startTime: new Date(Date.now() - 12 * 60 * 60_000).toISOString(),
    endTime: new Date(Date.now() - 11.8 * 60 * 60_000).toISOString(),
    lastActivity: new Date(Date.now() - 11.8 * 60 * 60_000).toISOString(),
    messageCount: 15,
    totalTokens: 5230,
    totalCost: 0.142,
    status: "completed",
    isFlagged: false,
    userRating: 5,
  },
];

export default function AIConversationsPage() {
  const flagged = MOCK_CONVERSATIONS.filter((c) => c.isFlagged).length;
  const active = MOCK_CONVERSATIONS.filter((c) => c.status === "active").length;
  const completed = MOCK_CONVERSATIONS.filter((c) => c.status === "completed").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-green-900">AI Conversations</h1>
        <p className="text-text-muted text-[13px]">Monitor and review AI tutoring sessions</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            icon: MessageSquare,
            label: "Total Sessions",
            value: MOCK_CONVERSATIONS.length,
            color: "#2e8b57",
            bg: "#2e8b5715",
          },
          { icon: Activity, label: "Active Now", value: active, color: "#3b82f6", bg: "#3b82f615" },
          {
            icon: CheckCircle,
            label: "Completed",
            value: completed,
            color: "#10b981",
            bg: "#10b98115",
          },
          { icon: Flag, label: "Flagged", value: flagged, color: "#ef4444", bg: "#ef444415" },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div
            key={label}
            className="flex items-center gap-3 p-4 rounded-2xl bg-white border"
            style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: bg }}>
              <Icon size={17} style={{ color }} />
            </div>
            <div>
              <div className="text-[18px] font-bold text-green-900 leading-tight">{value}</div>
              <div className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                {label}
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConversationList
        conversations={MOCK_CONVERSATIONS}
        basePath="/admin/ai-logs/conversations"
      />
    </div>
  );
}
