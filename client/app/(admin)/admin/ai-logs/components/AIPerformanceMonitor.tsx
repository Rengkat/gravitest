"use client";

import { useState } from "react";
import {
  Activity,
  Clock,
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Gauge,
  Cpu,
  Wifi,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Bar,
} from "recharts";

interface Props {
  stats: {
    avgResponseTime: number;
    p95ResponseTime: number;
    successRate: number;
    errorRate: number;
    rateLimitHits: number;
    cacheHitRate: number;
    tokensPerSecond: number;
    concurrentSessions: number;
  };
}

const mockTimeSeriesData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  responseTime: Math.floor(Math.random() * 400 + 300),
  successRate: 95 + Math.random() * 5,
  requests: Math.floor(Math.random() * 200 + 50),
  tokens: Math.floor(Math.random() * 50000 + 20000),
}));

export function AIPerformanceMonitor({ stats }: Props) {
  const [timeframe, setTimeframe] = useState<"hour" | "day" | "week">("day");

  const getStatusColor = (value: number, type: "time" | "rate") => {
    if (type === "time") {
      if (value < 500) return "text-green-600";
      if (value < 1000) return "text-amber-600";
      return "text-red-600";
    }
    if (type === "rate") {
      if (value >= 98) return "text-green-600";
      if (value >= 95) return "text-amber-600";
      return "text-red-600";
    }
    return "text-gray-600";
  };

  return (
    <div className="space-y-6">
      {/* Real-time Status Banner */}
      <div className="p-4 rounded-xl bg-green-50 border border-green-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <Activity size={20} className="text-green-600" />
          </div>
          <div>
            <div className="text-[14px] font-semibold text-green-900">System Performance</div>
            <div className="text-[12px] text-green-700">All systems operational</div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[12px]">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-text-muted">Live</span>
          </div>
          <div className="flex items-center gap-1">
            <RefreshCw size={12} className="text-text-muted" />
            <span className="text-text-muted">Updated just now</span>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <MetricCard
          icon={Clock}
          label="Avg Response"
          value={`${stats.avgResponseTime}ms`}
          color="#3b82f6"
          trend={-8}
        />
        <MetricCard
          icon={Gauge}
          label="P95 Response"
          value={`${stats.p95ResponseTime}ms`}
          color="#8b5cf6"
          trend={-5}
        />
        <MetricCard
          icon={CheckCircle}
          label="Success Rate"
          value={`${stats.successRate}%`}
          color="#10b981"
          trend={+2}
        />
        <MetricCard
          icon={AlertTriangle}
          label="Error Rate"
          value={`${stats.errorRate}%`}
          color="#ef4444"
          trend={-1}
        />
        <MetricCard
          icon={Zap}
          label="Cache Hit"
          value={`${stats.cacheHitRate}%`}
          color="#f59e0b"
          trend={+5}
        />
        <MetricCard
          icon={Cpu}
          label="Tokens/sec"
          value={stats.tokensPerSecond.toLocaleString()}
          color="#2e8b57"
          trend={+12}
        />
      </div>

      {/* Response Time Chart */}
      <div
        className="bg-white rounded-2xl border p-6"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-lg text-green-900">Response Time Trend</h3>
          <div className="flex gap-2">
            {(["hour", "day", "week"] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
                  timeframe === tf
                    ? "bg-green-800 text-white"
                    : "bg-gray-100 text-text-muted hover:bg-gray-200"
                }`}>
                {tf.charAt(0).toUpperCase() + tf.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={mockTimeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,80,50,0.1)" />
            <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#6b7280" }} />
            <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#6b7280" }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#6b7280" }} />
            <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="responseTime"
              name="Response Time (ms)"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.1}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="requests"
              name="Requests"
              stroke="#2e8b57"
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Success Rate by Hour */}
        <div
          className="bg-white rounded-2xl border p-6"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <h3 className="font-serif text-lg text-green-900 mb-4">Success Rate by Hour</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={mockTimeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,80,50,0.1)" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#6b7280" }} />
              <YAxis domain={[90, 100]} tick={{ fontSize: 10, fill: "#6b7280" }} />
              <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
              <Line
                type="monotone"
                dataKey="successRate"
                name="Success Rate (%)"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Rate Limit Hits */}
        <div
          className="bg-white rounded-2xl border p-6"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <h3 className="font-serif text-lg text-green-900 mb-4">Rate Limit Incidents</h3>
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl font-bold text-red-600">
              {stats.rateLimitHits.toLocaleString()}
            </div>
            <div className="text-[12px] text-text-muted">Last 24 hours</div>
          </div>
          <div className="h-2 rounded-full bg-cream overflow-hidden">
            <div
              className="h-full rounded-full bg-red-500"
              style={{ width: `${Math.min(100, (stats.rateLimitHits / 500) * 100)}%` }}
            />
          </div>
          <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200">
            <div className="flex items-start gap-2">
              <AlertTriangle size={14} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-[12px] font-semibold text-amber-800">Recommendation</div>
                <div className="text-[11px] text-amber-700">
                  Consider increasing rate limits for Pro tier users to reduce incidents
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Token Throughput */}
      <div
        className="bg-white rounded-2xl border p-6"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <h3 className="font-serif text-lg text-green-900 mb-4">Token Throughput</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={mockTimeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,80,50,0.1)" />
            <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#6b7280" }} />
            <YAxis
              tick={{ fontSize: 10, fill: "#6b7280" }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
            <Area
              type="monotone"
              dataKey="tokens"
              name="Tokens"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.1}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-[11px] text-text-muted">Peak Throughput</div>
            <div className="text-lg font-bold text-green-900">
              {(stats.tokensPerSecond * 1.5).toFixed(0)}
            </div>
            <div className="text-[10px] text-green-600">tokens/sec</div>
          </div>
          <div>
            <div className="text-[11px] text-text-muted">Daily Average</div>
            <div className="text-lg font-bold text-green-900">{stats.tokensPerSecond}</div>
            <div className="text-[10px] text-green-600">tokens/sec</div>
          </div>
          <div>
            <div className="text-[11px] text-text-muted">Concurrent</div>
            <div className="text-lg font-bold text-green-900">{stats.concurrentSessions}</div>
            <div className="text-[10px] text-green-600">active sessions</div>
          </div>
        </div>
      </div>

      {/* Latency Distribution */}
      <div
        className="bg-white rounded-2xl border p-6"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <h3 className="font-serif text-lg text-green-900 mb-4">Latency Distribution</h3>
        <div className="space-y-3">
          {[
            { range: "< 200ms", count: 2345, color: "#10b981" },
            { range: "200-500ms", count: 5678, color: "#3b82f6" },
            { range: "500ms-1s", count: 1234, color: "#f59e0b" },
            { range: "1-2s", count: 456, color: "#ef4444" },
            { range: "> 2s", count: 89, color: "#8b5cf6" },
          ].map((item) => {
            const maxCount = 5678;
            return (
              <div key={item.range}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] text-green-900">{item.range}</span>
                  <span className="text-[11px] text-text-muted">
                    {item.count.toLocaleString()} requests
                  </span>
                </div>
                <div className="h-2 rounded-full bg-cream overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(item.count / maxCount) * 100}%`, background: item.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, color, trend }: any) {
  return (
    <div className="p-3 rounded-2xl bg-white border" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-6 h-6 rounded-lg flex items-center justify-center"
          style={{ background: `${color}15` }}>
          <Icon size={12} style={{ color }} />
        </div>
        {trend && (
          <div
            className={`text-[9px] font-semibold flex items-center gap-0.5 ${trend >= 0 ? "text-green-600" : "text-red-500"}`}>
            {trend >= 0 ? <TrendingUp size={8} /> : <TrendingDown size={8} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="text-base font-bold text-green-900">{value}</div>
      <div className="text-[10px] text-text-muted">{label}</div>
    </div>
  );
}
