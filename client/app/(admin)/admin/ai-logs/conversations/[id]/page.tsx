"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { ConversationDetail } from "../components/ConversationDetail";
import { generateMockSession } from "../../components/AISessionDetails";

export default function ConversationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : (params.id?.[0] ?? "1");

  const [session, setSession] = useState(() => generateMockSession(id));
  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    // TODO: GET /admin/ai/conversations/:id
    await new Promise((r) => setTimeout(r, 600));
    setSession(generateMockSession(id));
    setRefreshing(false);
  };

  const handleFlag = (_sessionId: string, reason: string) => {
    setSession((prev) => ({ ...prev, isFlagged: true, flagReason: reason }));
    // TODO: POST /admin/ai/conversations/:id/flag  { reason }
  };

  const handleDismissFlag = (_sessionId: string) => {
    setSession((prev) => ({ ...prev, isFlagged: false, flagReason: undefined }));
    // TODO: DELETE /admin/ai/conversations/:id/flag
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-[13px] text-text-muted hover:text-green-900 transition-colors">
            <ArrowLeft size={15} /> Back
          </button>
          <div className="w-px h-5 bg-gray-200" />
          <h1 className="font-serif text-xl text-green-900">Session Detail</h1>
          <span className="font-mono text-[11px] text-text-muted bg-cream px-2 py-0.5 rounded-full">
            {session.sessionId}
          </span>
        </div>
        <button
          onClick={refresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-cream transition-all text-[12px]">
          <RefreshCw size={13} className={`text-text-muted ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <ConversationDetail session={session} onFlag={handleFlag} onDismissFlag={handleDismissFlag} />
    </div>
  );
}
