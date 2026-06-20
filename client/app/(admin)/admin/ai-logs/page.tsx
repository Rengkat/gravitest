"use client";

import { useState } from "react";
import {
  Brain,
  DollarSign,
  Activity,
  Shield,
  Settings,
  MessageSquare,
  BarChart3,
  FileText,
  Clock,
  Target,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  Users,
  Zap,
  CheckCircle,
  Bot,
} from "lucide-react";
import { useAIData } from "./useAIData";
import { AICostAnalytics } from "./components/AICostAnalytics";
import { AIPerformanceMonitor } from "./components/AIPerformanceMonitor";
import { AIModelSelector } from "./components/AIModelSelector";
import { FlaggedConversations } from "./components/FlaggedConversations";
import { SystemPromptEditor } from "./components/SystemPromptEditor";
import { RateLimitControls } from "./components/RateLimitControls";
import { AIConfigPanel } from "./components/AIConfigPanel";
import { LoadingSpinner } from "./components/LoadingSinner";

type Tab =
  | "overview"
  | "cost"
  | "performance"
  | "models"
  | "flagged"
  | "prompts"
  | "limits"
  | "config";

export default function AIManagementPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const {
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
  } = useAIData();

  const tabs: { id: Tab; label: string; icon: any; color: string }[] = [
    { id: "overview", label: "Overview", icon: BarChart3, color: "#2e8b57" },
    { id: "cost", label: "Cost Analytics", icon: DollarSign, color: "#f59e0b" },
    { id: "performance", label: "Performance", icon: Activity, color: "#3b82f6" },
    { id: "models", label: "Model Management", icon: Brain, color: "#8b5cf6" },
    { id: "flagged", label: "Flagged Content", icon: Shield, color: "#ef4444" },
    { id: "prompts", label: "System Prompts", icon: FileText, color: "#10b981" },
    { id: "limits", label: "Rate Limits", icon: Clock, color: "#f97316" },
    { id: "config", label: "Feature Flags", icon: Settings, color: "#6b7280" },
  ];

  if (loading) {
    return <LoadingSpinner text="Loading AI management dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-800 to-green-600 flex items-center justify-center shadow-sm">
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-serif text-2xl text-green-900">AI Tutor Management</h1>
              <p className="text-text-muted text-[13px] -mt-0.5">
                Monitor usage, manage costs, and ensure quality
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={refreshData}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-cream transition-all text-[13px]">
          <RefreshCw size={14} className="text-text-muted" />
          <span className="text-text-muted">Refresh</span>
        </button>
      </div>

      {/* Tabs */}
      <div
        className="flex items-center gap-1 border-b overflow-x-auto pb-0"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 text-[12px] font-medium transition-all flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
              activeTab === tab.id
                ? "border-green-800 text-green-900"
                : "border-transparent text-text-muted hover:text-green-700"
            }`}>
            <tab.icon size={13} style={{ color: activeTab === tab.id ? tab.color : undefined }} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "overview" && (
          <OverviewTab stats={stats} costStats={costStats} performanceStats={performanceStats} />
        )}

        {activeTab === "cost" && costStats && <AICostAnalytics stats={costStats} />}

        {activeTab === "performance" && performanceStats && (
          <AIPerformanceMonitor stats={performanceStats} />
        )}

        {activeTab === "models" && <AIModelSelector onUpdate={updateModelConfig} />}

        {activeTab === "flagged" && <FlaggedConversations sessions={flaggedSessions} />}

        {activeTab === "prompts" && <SystemPromptEditor onSave={updateSystemPrompt} />}

        {activeTab === "limits" && <RateLimitControls onUpdate={updateRateLimits} />}

        {activeTab === "config" && stats && (
          <AIConfigPanel features={stats.features} onToggle={toggleFeature} />
        )}
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ stats, costStats, performanceStats }: any) {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <MetricCard
          icon={MessageSquare}
          label="Total Sessions"
          value={stats?.totalSessions?.toLocaleString() || "0"}
          color="#2e8b57"
          trend={12}
        />
        <MetricCard
          icon={DollarSign}
          label="Monthly Cost"
          value={`$${costStats?.monthlyCost?.toFixed(2) || "0"}`}
          color="#f59e0b"
          sub={`Budget: $${costStats?.budgetLimit || 0}`}
        />
        <MetricCard
          icon={Zap}
          label="Avg Response"
          value={`${performanceStats?.avgResponseTime || 0}ms`}
          color="#3b82f6"
        />
        <MetricCard
          icon={CheckCircle}
          label="Success Rate"
          value={`${performanceStats?.successRate || 0}%`}
          color="#10b981"
        />
        <MetricCard
          icon={Users}
          label="Active Users"
          value={stats?.activeUsers?.toLocaleString() || "0"}
          color="#8b5cf6"
        />
        <MetricCard
          icon={Target}
          label="Avg Rating"
          value={stats?.averageRating?.toFixed(1) || "0"}
          color="#f59e0b"
        />
        <MetricCard
          icon={AlertTriangle}
          label="Flagged"
          value={stats?.flaggedCount || "0"}
          color="#ef4444"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="bg-white rounded-xl border p-5"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <h3 className="font-serif text-base text-green-900 mb-4">Cost by Feature</h3>
          <div className="space-y-3">
            {costStats?.costByFeature?.slice(0, 5).map((item: any) => (
              <div key={item.feature} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center">
                  <Zap size={12} className="text-green-800" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-[12px] text-green-900">{item.feature}</span>
                    <span className="text-[12px] font-bold text-green-900">
                      ${item.cost.toFixed(2)}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-cream overflow-hidden">
                    <div
                      className="h-full rounded-full bg-green-800"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
                <span className="text-[10px] text-text-muted">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="bg-white rounded-xl border p-5"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <h3 className="font-serif text-base text-green-900 mb-4">Top AI Features</h3>
          <div className="space-y-3">
            {stats?.featureUsage?.slice(0, 5).map((feature: any, i: number) => (
              <div key={feature.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-green-900 w-5">{i + 1}</span>
                  <span className="text-[12px] text-green-900">{feature.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-text-muted">
                    {feature.count.toLocaleString()} req
                  </span>
                  <span className="text-[12px] font-bold text-green-900">
                    ${feature.cost?.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div
        className="bg-white rounded-xl border p-5"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <h3 className="font-serif text-base text-green-900 mb-4">Recent AI Activity</h3>
        <div className="space-y-3">
          {stats?.recentActivity?.slice(0, 5).map((activity: any) => (
            <div
              key={activity.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-cream/20 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                <MessageSquare size={12} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-semibold text-green-900">
                    {activity.userName}
                  </span>
                  <span className="text-[10px] text-text-muted">•</span>
                  <span className="text-[10px] text-text-muted">{activity.feature}</span>
                </div>
                <div className="text-[10px] text-text-muted truncate">{activity.preview}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-text-muted">{activity.time}</div>
                <div className="text-[9px] text-green-700 font-mono">
                  ${activity.cost?.toFixed(4)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, color, trend, sub }: any) {
  return (
    <div className="p-3 rounded-xl bg-white border" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center mb-2"
        style={{ background: `${color}15` }}>
        <Icon size={13} style={{ color }} />
      </div>
      <div className="text-base font-bold text-green-900">{value}</div>
      <div className="text-[10px] text-text-muted">{label}</div>
      {trend && (
        <div className="text-[9px] text-green-600 mt-1 flex items-center gap-0.5">
          <TrendingUp size={8} /> +{trend}%
        </div>
      )}
      {sub && <div className="text-[8px] text-text-muted mt-0.5">{sub}</div>}
    </div>
  );
}
