"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageSquare, Search, Eye, User, Clock, DollarSign } from "lucide-react";

export default function AIConversationsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const conversations = [
    {
      id: "1",
      user: "Oluwaseun Adebayo",
      email: "oluwaseun@email.com",
      messages: 12,
      lastActive: "2 min ago",
      tokens: 2345,
      cost: 0.045,
      subject: "Mathematics",
    },
    {
      id: "2",
      user: "Chioma Eze",
      email: "chioma@email.com",
      messages: 8,
      lastActive: "15 min ago",
      tokens: 1890,
      cost: 0.032,
      subject: "Physics",
    },
    {
      id: "3",
      user: "Emeka Nwosu",
      email: "emeka@email.com",
      messages: 23,
      lastActive: "1 hour ago",
      tokens: 4567,
      cost: 0.089,
      subject: "Chemistry",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-green-900">AI Conversations</h1>
          <p className="text-text-muted text-[13px]">Monitor and review AI tutoring sessions</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by user or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-[13px] w-64 focus:outline-none focus:ring-2 focus:ring-green-500/30"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream/30 border-b" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
              <tr>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-text-muted">
                  User
                </th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-text-muted">
                  Subject
                </th>
                <th className="text-center px-4 py-3 text-[11px] font-semibold text-text-muted">
                  Messages
                </th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold text-text-muted">
                  Tokens
                </th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold text-text-muted">
                  Cost
                </th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-text-muted">
                  Last Active
                </th>
                <th className="text-center px-4 py-3 text-[11px] font-semibold text-text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
              {conversations.map((conv) => (
                <tr key={conv.id} className="hover:bg-cream/20 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <div className="text-[13px] font-medium text-green-900">{conv.user}</div>
                      <div className="text-[10px] text-text-muted">{conv.email}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-green-900">{conv.subject}</td>
                  <td className="px-4 py-3 text-center text-[13px] text-green-900">
                    {conv.messages}
                  </td>
                  <td className="px-4 py-3 text-right text-[12px] text-green-900">
                    {conv.tokens.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-[12px] font-semibold text-green-900">
                    ${conv.cost.toFixed(3)}
                  </td>
                  <td className="px-4 py-3 text-[12px] text-text-muted">{conv.lastActive}</td>
                  <td className="px-4 py-3 text-center">
                    <Link href={`/admin/ai-logs/conversations/${conv.id}`}>
                      <button
                        title="detail"
                        className="p-1.5 rounded-lg hover:bg-green-50 transition-colors">
                        <Eye size={14} className="text-text-muted hover:text-green-600" />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
