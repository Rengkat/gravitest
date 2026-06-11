"use client";

import { useState, useEffect, useCallback } from "react";
// import { toast } from "sonner";

interface AIStats {
  totalSessions: number;
  activeUsers: number;
  averageRating: number;
  flaggedCount: number;
  activeModels: number;
  featureUsage: { name: string; count: number; cost: number }[];
  recentActivity: {
    id: string;
    userName: string;
    feature: string;
    preview: string;
    time: string;
    cost: number;
  }[];
  features: Record<string, boolean>;
}

interface AICostStats {
  dailyCost: { date: string; cost: number; tokens: number }[];
  monthlyCost: number;
  projectedMonthlyCost: number;
  budgetLimit: number;
  costByFeature: { feature: string; cost: number; percentage: number }[];
  costByModel: { model: string; cost: number; tokens: number }[];
  costByUser: {
    userId: string;
    userName: string;
    cost: number;
    requests: number;
    tokens: number;
  }[];
}

interface AIPerformanceStats {
  avgResponseTime: number;
  p95ResponseTime: number;
  successRate: number;
  errorRate: number;
  rateLimitHits: number;
  cacheHitRate: number;
  tokensPerSecond: number;
  concurrentSessions: number;
}

interface FlaggedSession {
  id: string;
  userId: string;
  userName: string;
  reason: string;
  severity: "low" | "medium" | "high";
  timestamp: string;
  messages: { id: string; content: string; role: string; flagReason: string; timestamp: string }[];
  status: "pending" | "reviewed" | "dismissed";
}

export function useAIData() {
  const [stats, setStats] = useState<AIStats | null>(null);
  const [costStats, setCostStats] = useState<AICostStats | null>(null);
  const [performanceStats, setPerformanceStats] = useState<AIPerformanceStats | null>(null);
  const [flaggedSessions, setFlaggedSessions] = useState<FlaggedSession[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    // Mock API calls - replace with actual endpoints
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock Stats
    setStats({
      totalSessions: 15423,
      activeUsers: 3421,
      averageRating: 4.6,
      flaggedCount: 47,
      activeModels: 3,
      featureUsage: [
        { name: "Sabi Tutor", count: 8234, cost: 342.5 },
        { name: "Sabi Explain", count: 4321, cost: 98.2 },
        { name: "Sabi Solve", count: 2198, cost: 156.75 },
        { name: "Sabi Quiz", count: 1876, cost: 67.3 },
        { name: "Sabi Essay", count: 794, cost: 234.8 },
      ],
      recentActivity: [
        {
          id: "1",
          userName: "Oluwaseun Adebayo",
          feature: "Sabi Tutor",
          preview: "Can you explain quadratic equations...",
          time: "2 min ago",
          cost: 0.023,
        },
        {
          id: "2",
          userName: "Chioma Eze",
          feature: "Sabi Solve",
          preview: "Solve: 2x + 5 = 15...",
          time: "5 min ago",
          cost: 0.015,
        },
        {
          id: "3",
          userName: "Emeka Nwosu",
          feature: "Sabi Quiz",
          preview: "Generate JAMB practice questions...",
          time: "12 min ago",
          cost: 0.042,
        },
      ],
      features: {
        sabi_tutor: true,
        sabi_explain: true,
        sabi_solve: true,
        sabi_quiz: true,
        sabi_essay: false,
        practice_scoring: true,
        exam_grading: true,
      },
    });

    // Mock Cost Stats
    setCostStats({
      dailyCost: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString(),
        cost: Math.random() * 50 + 20,
        tokens: Math.random() * 500000 + 200000,
      })),
      monthlyCost: 1245.67,
      projectedMonthlyCost: 1600.0,
      budgetLimit: 2500.0,
      costByFeature: [
        { feature: "Sabi Tutor", cost: 542.5, percentage: 43.5 },
        { feature: "Sabi Essay", cost: 234.8, percentage: 18.8 },
        { feature: "Sabi Solve", cost: 156.75, percentage: 12.6 },
        { feature: "Sabi Explain", cost: 98.2, percentage: 7.9 },
        { feature: "Sabi Quiz", cost: 67.3, percentage: 5.4 },
      ],
      costByModel: [
        { model: "GPT-4o", cost: 890.45, tokens: 1234567 },
        { model: "GPT-4o Mini", cost: 234.12, tokens: 2345678 },
        { model: "Claude 3.5", cost: 121.1, tokens: 345678 },
      ],
      costByUser: [
        { userId: "u1", userName: "Oluwaseun Adebayo", cost: 45.67, requests: 234, tokens: 45678 },
        { userId: "u2", userName: "Chioma Eze", cost: 34.23, requests: 189, tokens: 34567 },
        { userId: "u3", userName: "Emeka Nwosu", cost: 28.9, requests: 156, tokens: 28901 },
      ],
    });

    // Mock Performance Stats
    setPerformanceStats({
      avgResponseTime: 487,
      p95ResponseTime: 892,
      successRate: 98.5,
      errorRate: 1.5,
      rateLimitHits: 127,
      cacheHitRate: 34.2,
      tokensPerSecond: 142,
      concurrentSessions: 342,
    });

    // Mock Flagged Sessions
    setFlaggedSessions([
      {
        id: "f1",
        userId: "u123",
        userName: "Test User",
        reason: "Attempted to get answers for live exam",
        severity: "high",
        timestamp: new Date().toISOString(),
        messages: [
          {
            id: "m1",
            content: "Can you give me the answers for my JAMB exam?",
            role: "user",
            flagReason: "Exam cheating attempt",
            timestamp: new Date().toISOString(),
          },
          {
            id: "m2",
            content:
              "I understand you need help, but I can't provide exam answers. Let me help you study instead.",
            role: "assistant",
            flagReason: "",
            timestamp: new Date().toISOString(),
          },
        ],
        status: "pending",
      },
      {
        id: "f2",
        userId: "u456",
        userName: "Another User",
        reason: "Explicit content request",
        severity: "medium",
        timestamp: new Date().toISOString(),
        messages: [],
        status: "pending",
      },
    ]);

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refreshData = useCallback(() => {
    fetchData();
    // toast.success("Data refreshed");
  }, [fetchData]);

  const updateModelConfig = useCallback(async (config: any) => {
    // toast.success("Model configuration updated");
  }, []);

  const updateRateLimits = useCallback(async (configs: any[]) => {
    // toast.success("Rate limits updated");
  }, []);

  const updateSystemPrompt = useCallback(async (prompt: string, name: string) => {
    // toast.success(`System prompt "${name}" saved`);
  }, []);

  const toggleFeature = useCallback(async (feature: string, enabled: boolean) => {
    setStats((prev) =>
      prev
        ? {
            ...prev,
            features: { ...prev.features, [feature]: enabled },
          }
        : null,
    );
    // toast.success(`${feature} ${enabled ? "enabled" : "disabled"}`);
  }, []);

  return {
    stats,
    costStats,
    performanceStats,
    flaggedSessions,
    loading,
    refreshData,
    updateModelConfig,
    updateRateLimits,
    updateSystemPrompt,
    toggleFeature,
  };
}
