"use client";

import { useEffect, useRef } from "react";
import { Send, Paperclip, MessageCircle } from "lucide-react";
import { Message } from "@/types/live-session";
import { getInitials } from "@/lib/constants/live-session";

interface ChatPanelProps {
  messages: Message[];
  currentUserId: string;
  inputMessage: string;
  onInputChange: (v: string) => void;
  onSend: () => void;
}

const AVATAR_COLORS = [
  "from-blue-500 to-purple-500",
  "from-green-500 to-teal-500",
  "from-orange-500 to-red-500",
  "from-pink-500 to-rose-500",
];

function getAvatarColor(userId: string) {
  const idx = parseInt(userId, 10) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx] ?? AVATAR_COLORS[0];
}

export default function ChatPanel({
  messages, currentUserId, inputMessage, onInputChange, onSend,
}: ChatPanelProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <MessageCircle size={28} className="mx-auto mb-2 opacity-40" />
            <p className="text-[13px]">No messages yet</p>
            <p className="text-[11px] mt-1 opacity-60">Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.userId === currentUserId;
            const isSystem = msg.type === "system";

            if (isSystem) {
              return (
                <div key={msg.id} className="text-center">
                  <span className="text-[11px] text-gray-500 bg-gray-800 px-3 py-1 rounded-full">
                    {msg.content}
                  </span>
                </div>
              );
            }

            return (
              <div key={msg.id} className={`flex gap-2.5 ${isMe ? "flex-row-reverse" : ""}`}>
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-full bg-gradient-to-br ${getAvatarColor(msg.userId)} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}
                >
                  {getInitials(msg.userName)}
                </div>

                {/* Bubble */}
                <div className={`flex-1 ${isMe ? "items-end" : "items-start"} flex flex-col max-w-[80%]`}>
                  <div className={`flex items-baseline gap-1.5 mb-1 ${isMe ? "flex-row-reverse" : ""}`}>
                    <span className="text-[11px] font-semibold text-gray-300">
                      {isMe ? "You" : msg.userName.split(" ")[0]}
                    </span>
                    <span className="text-[10px] text-gray-600">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {msg.type === "file" ? (
                    <div className={`rounded-xl p-2.5 text-[12px] flex items-center gap-2 ${
                      isMe ? "bg-blue-700" : "bg-gray-700"
                    } text-white`}>
                      <Paperclip size={13} />
                      <span>{msg.fileName}</span>
                      {msg.fileSize && <span className="text-gray-300 text-[10px]">({msg.fileSize})</span>}
                    </div>
                  ) : (
                    <p className={`text-[13px] rounded-2xl px-3 py-2 leading-relaxed ${
                      isMe
                        ? "bg-blue-600 text-white rounded-tr-sm"
                        : "bg-gray-700 text-gray-100 rounded-tl-sm"
                    }`}>
                      {msg.content}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-700 shrink-0">
        <div className="flex gap-2">
          <button className="p-2 rounded-xl bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors shrink-0">
            <Paperclip size={16} />
          </button>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); }
            }}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 bg-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-[13px] placeholder:text-gray-500"
          />
          <button
            onClick={onSend}
            disabled={!inputMessage.trim()}
            className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-[10px] text-gray-600 mt-1.5 text-center">Press Enter to send</p>
      </div>
    </div>
  );
}
