"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type { AICostStats } from "../types";

interface Props {
  stats: AICostStats;
}

const COLORS = ["#2e8b57", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#10b981"];

export function AICostAnalytics({ stats }: Props) {
  const [timeframe, setTimeframe] = useState<"week" | "month" | "quarter">("month");

  const projectedVsActual = [
    { day: "Week 1", actual: 45, projected: 50, budget: 60 },
    { day: "Week 2", actual: 52, projected: 55, budget: 60 },
    { day: "Week 3", actual: 48, projected: 55, budget: 60 },
    { day: "Week 4", actual: 58, projected: 60, budget: 60 },
  ];

  const budgetUtilization = (stats.monthlyCost / stats.budgetLimit) * 100;

  return (
    <div className="space-y-6">
      {/* Budget Alert */}
      {budgetUtilization > 80 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-amber-600" />
            <div>
              <div className="text-[14px] font-semibold text-amber-800">Budget Alert</div>
              <div className="text-[12px] text-amber-700">
                You've used {budgetUtilization.toFixed(1)}% of your monthly budget ($
                {stats.monthlyCost.toFixed(2)} / ${stats.budgetLimit})
              </div>
            </div>
          </div>
          <button className="px-4 py-2 rounded-lg bg-amber-100 text-amber-700 text-[13px] font-semibold hover:bg-amber-200">
            Adjust Budget
          </button>
        </div>
      )}

      {/* Daily Cost Trend */}
      <div
        className="bg-white rounded-2xl border p-6"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-lg text-green-900">Daily Cost Trend</h3>
          <div className="flex gap-2">
            {(["week", "month", "quarter"] as const).map((tf) => (
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
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={stats.dailyCost}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,80,50,0.1)" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6b7280" }} />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 11, fill: "#6b7280" }}
              tickFormatter={(v) => `$${v}`}
            />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#6b7280" }} />
            <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
            <Area
              type="monotone"
              dataKey="cost"
              name="Cost ($)"
              stroke="#f59e0b"
              fill="#f59e0b"
              fillOpacity={0.1}
              yAxisId="left"
            />
            <Line
              type="monotone"
              dataKey="tokens"
              name="Tokens (K)"
              stroke="#2e8b57"
              strokeWidth={2}
              yAxisId="right"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost by Model - Pie Chart */}
        <div
          className="bg-white rounded-2xl border p-6"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <h3 className="font-serif text-lg text-green-900 mb-4">Cost Distribution by Model</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.costByModel}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="cost"
                nameKey="model"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}>
                {stats.costByModel?.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2 text-[12px]">
            {stats.costByModel?.map((model, i) => (
              <div key={model.model} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: COLORS[i % COLORS.length] }}
                />
                <span>{model.model}</span>
                <span className="ml-auto font-semibold">${model.cost.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Projected vs Actual */}
        <div
          className="bg-white rounded-2xl border p-6"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <h3 className="font-serif text-lg text-green-900 mb-4">Budget Tracking</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectedVsActual}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,80,50,0.1)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6b7280" }} />
              <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} tickFormatter={(v) => `$${v}`} />
              <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
              <Bar dataKey="actual" name="Actual Spend" fill="#2e8b57" radius={[4, 4, 0, 0]} />
              <Bar dataKey="projected" name="Projected" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar
                dataKey="budget"
                name="Budget"
                fill="#6b7280"
                radius={[4, 4, 0, 0]}
                opacity={0.3}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Users by Cost */}
      <div
        className="bg-white rounded-2xl border p-6"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <h3 className="font-serif text-lg text-green-900 mb-4">Top Spenders</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
                <th className="text-left py-3 px-4 text-[11px] font-semibold text-text-muted uppercase">
                  User
                </th>
                <th className="text-right py-3 px-4 text-[11px] font-semibold text-text-muted uppercase">
                  Requests
                </th>
                <th className="text-right py-3 px-4 text-[11px] font-semibold text-text-muted uppercase">
                  Tokens
                </th>
                <th className="text-right py-3 px-4 text-[11px] font-semibold text-text-muted uppercase">
                  Cost
                </th>
                <th className="text-center py-3 px-4 text-[11px] font-semibold text-text-muted uppercase">
                  % of Total
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.costByUser?.slice(0, 10).map((user) => (
                <tr
                  key={user.userId}
                  className="border-b hover:bg-cream/20"
                  style={{ borderColor: "rgba(30,80,50,0.05)" }}>
                  <td className="py-3 px-4">
                    <div className="text-[13px] font-semibold text-green-900">{user.userName}</div>
                    <div className="text-[10px] text-text-muted">{user.userId}</div>
                  </td>
                  <td className="py-3 px-4 text-right text-[13px] text-green-900">
                    {user.requests.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-[13px] text-green-900">
                    {(user.tokens / 1000).toFixed(0)}K
                  </td>
                  <td className="py-3 px-4 text-right text-[13px] font-bold text-green-900">
                    ${user.cost.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-cream overflow-hidden">
                        <div
                          className="h-full rounded-full bg-green-800"
                          style={{
                            width: `${(user.cost / (stats.costByUser?.[0]?.cost || 1)) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-text-muted w-10">
                        {(
                          (user.cost / (stats.costByUser?.reduce((s, u) => s + u.cost, 0) || 1)) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
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
