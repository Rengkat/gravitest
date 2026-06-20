import type { AIConversation, AIMessage, AIFeature, AIModel } from "../types";

// ─── Extended detail shape used by the conversation detail page ──────────────

export interface AISessionDetail extends AIConversation {
  messages: AIMessage[];
}

// ─── Feature display config ───────────────────────────────────────────────────

export const FEATURE_LABELS: Record<AIFeature, string> = {
  sabi_tutor: "Sabi Tutor",
  sabi_explain: "Sabi Explain",
  sabi_solve: "Sabi Solve",
  sabi_quiz: "Sabi Quiz",
  sabi_essay: "Sabi Essay",
  sabi_translate: "Sabi Translate",
  practice_scoring: "Practice Scoring",
  exam_grading: "Exam Grading",
  feedback_generation: "Feedback Generation",
};

export const FEATURE_COLORS: Record<AIFeature, { color: string; bg: string }> = {
  sabi_tutor: { color: "#2e8b57", bg: "#2e8b5715" },
  sabi_explain: { color: "#3b82f6", bg: "#3b82f615" },
  sabi_solve: { color: "#8b5cf6", bg: "#8b5cf615" },
  sabi_quiz: { color: "#f59e0b", bg: "#f59e0b15" },
  sabi_essay: { color: "#ec4899", bg: "#ec489915" },
  sabi_translate: { color: "#0891b2", bg: "#0891b215" },
  practice_scoring: { color: "#10b981", bg: "#10b98115" },
  exam_grading: { color: "#f97316", bg: "#f9731615" },
  feedback_generation: { color: "#6366f1", bg: "#6366f115" },
};

// ─── Model display config ─────────────────────────────────────────────────────

export const MODEL_LABELS: Record<AIModel, string> = {
  "gpt-4o": "GPT-4o",
  "gpt-4o-mini": "GPT-4o Mini",
  "gpt-3.5-turbo": "GPT-3.5 Turbo",
  "claude-3.5-sonnet": "Claude 3.5 Sonnet",
  "claude-3-opus": "Claude 3 Opus",
  "gemini-1.5-pro": "Gemini 1.5 Pro",
  "gemini-1.5-flash": "Gemini 1.5 Flash",
  "deepseek-v3": "DeepSeek V3",
  "mistral-large": "Mistral Large",
};

export const MODEL_PROVIDERS: Record<AIModel, string> = {
  "gpt-4o": "OpenAI",
  "gpt-4o-mini": "OpenAI",
  "gpt-3.5-turbo": "OpenAI",
  "claude-3.5-sonnet": "Anthropic",
  "claude-3-opus": "Anthropic",
  "gemini-1.5-pro": "Google",
  "gemini-1.5-flash": "Google",
  "deepseek-v3": "DeepSeek",
  "mistral-large": "Mistral AI",
};

// ─── Status display config — matches AISessionStatus exactly ─────────────────

export const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: "Active", color: "#3b82f6", bg: "#3b82f615" },
  completed: { label: "Completed", color: "#10b981", bg: "#10b98115" },
  expired: { label: "Expired", color: "#6b7280", bg: "#6b728015" },
  flagged: { label: "Flagged", color: "#ef4444", bg: "#ef444415" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatTokens(tokens: number): string {
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(2)}M`;
  if (tokens >= 1_000) return `${(tokens / 1_000).toFixed(1)}K`;
  return `${tokens}`;
}

export function formatCost(cost: number): string {
  if (cost < 0.01) return `$${cost.toFixed(4)}`;
  return `$${cost.toFixed(3)}`;
}

export function formatDuration(startTime: string, endTime?: string): string {
  const start = new Date(startTime).getTime();
  const end = endTime ? new Date(endTime).getTime() : Date.now();
  const diff = Math.max(0, Math.floor((end - start) / 1000));
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ${diff % 60}s`;
  return `${Math.floor(diff / 3600)}h ${Math.floor((diff % 3600) / 60)}m`;
}

export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Mock session generator (replace with real API fetch later) ─────────────

export function generateMockSession(id: string): AISessionDetail {
  const now = Date.now();
  return {
    id,
    sessionId: `sess-${id}`,
    userId: "user-001",
    userName: "Oluwaseun Adebayo",
    userEmail: "oluwaseun@gravitas.ng",
    userRole: "student",
    feature: "sabi_tutor",
    model: "gpt-4o",
    subject: "Mathematics",
    topic: "Quadratic Equations",
    examType: "WAEC",
    startTime: new Date(now - 25 * 60_000).toISOString(),
    endTime: new Date(now - 5 * 60_000).toISOString(),
    lastActivity: new Date(now - 5 * 60_000).toISOString(),
    messageCount: 8,
    totalTokens: 3_421,
    totalCost: 0.068,
    status: "completed",
    isFlagged: false,
    userRating: 5,
    userFeedback: "Very helpful explanation of the quadratic formula!",
    messages: [
      {
        id: "m1",
        conversationId: id,
        role: "user",
        content: "Can you explain how to solve quadratic equations using the quadratic formula?",
        timestamp: new Date(now - 25 * 60_000).toISOString(),
        tokens: 18,
        cost: 0.0004,
      },
      {
        id: "m2",
        conversationId: id,
        role: "assistant",
        content:
          "Great question! For any equation in the form ax² + bx + c = 0, the solution is:\n\nx = (-b ± √(b² - 4ac)) / 2a\n\nThe discriminant (b² - 4ac) tells us how many solutions exist. Shall we try a practice problem?",
        timestamp: new Date(now - 24 * 60_000).toISOString(),
        tokens: 142,
        cost: 0.0042,
        responseTime: 1240,
      },
      {
        id: "m3",
        conversationId: id,
        role: "user",
        content: "Yes! Let's try: x² + 5x + 6 = 0",
        timestamp: new Date(now - 22 * 60_000).toISOString(),
        tokens: 22,
        cost: 0.0005,
      },
      {
        id: "m4",
        conversationId: id,
        role: "assistant",
        content:
          "Perfect! a = 1, b = 5, c = 6.\n\nx = (-5 ± √(25 - 24)) / 2 = (-5 ± 1) / 2\n\nSo x = -2 or x = -3. Verify: (-2)² + 5(-2) + 6 = 0 ✓",
        timestamp: new Date(now - 21 * 60_000).toISOString(),
        tokens: 168,
        cost: 0.0051,
        responseTime: 1580,
      },
      {
        id: "m5",
        conversationId: id,
        role: "user",
        content: "That makes sense! Can you give me a harder WAEC-style question?",
        timestamp: new Date(now - 18 * 60_000).toISOString(),
        tokens: 19,
        cost: 0.0005,
      },
      {
        id: "m6",
        conversationId: id,
        role: "assistant",
        content:
          "Try this: Find the values of x for which 3x² - 10x + 3 = 0. Identify a, b, c first!",
        timestamp: new Date(now - 17 * 60_000).toISOString(),
        tokens: 65,
        cost: 0.0019,
        responseTime: 980,
      },
      {
        id: "m7",
        conversationId: id,
        role: "user",
        content: "I got x = 3 and x = 1/3. Is that right?",
        timestamp: new Date(now - 12 * 60_000).toISOString(),
        tokens: 20,
        cost: 0.0005,
      },
      {
        id: "m8",
        conversationId: id,
        role: "assistant",
        content:
          "Excellent work! That's exactly right. For WAEC, also practice factorization as a quicker method when the equation factors nicely. Keep it up!",
        timestamp: new Date(now - 10 * 60_000).toISOString(),
        tokens: 138,
        cost: 0.0041,
        responseTime: 1120,
      },
    ],
  };
}
