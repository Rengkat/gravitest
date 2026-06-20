"use client";

import { useState } from "react";
import { Clock, Zap, Users, Save, RefreshCw, AlertTriangle } from "lucide-react";
import type { RateLimitConfig } from "../types";

interface Props {
  onUpdate: (configs: RateLimitConfig[]) => void;
}

const DEFAULT_LIMITS: RateLimitConfig[] = [
  {
    tier: "free",
    requestsPerDay: 20,
    requestsPerHour: 5,
    tokensPerMinute: 1000,
    concurrentSessions: 1,
  },
  {
    tier: "basic",
    requestsPerDay: 100,
    requestsPerHour: 20,
    tokensPerMinute: 5000,
    concurrentSessions: 2,
  },
  {
    tier: "pro",
    requestsPerDay: 500,
    requestsPerHour: 100,
    tokensPerMinute: 20000,
    concurrentSessions: 5,
  },
  {
    tier: "enterprise",
    requestsPerDay: 5000,
    requestsPerHour: 1000,
    tokensPerMinute: 100000,
    concurrentSessions: 20,
  },
];

export function RateLimitControls({ onUpdate }: Props) {
  const [limits, setLimits] = useState(DEFAULT_LIMITS);
  const [saving, setSaving] = useState(false);

  const handleUpdate = (tier: string, field: keyof RateLimitConfig, value: number) => {
    setLimits((prev) => prev.map((l) => (l.tier === tier ? { ...l, [field]: value } : l)));
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onUpdate(limits);
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
        <AlertTriangle size={20} className="text-amber-600 shrink-0" />
        <div>
          <div className="text-[13px] font-semibold text-amber-800">Rate Limits Active</div>
          <div className="text-[12px] text-amber-700 mt-1">
            Lower limits for free tier help manage costs. Adjust limits carefully to balance user
            experience and budget.
          </div>
        </div>
      </div>

      {/* Current Usage Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div
          className="p-4 rounded-2xl bg-white border"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-green-800" />
            <span className="text-[11px] text-text-muted">Current RPS</span>
          </div>
          <div className="text-2xl font-bold text-green-900">24</div>
          <div className="text-[10px] text-text-muted">Requests per second (peak)</div>
        </div>
        <div
          className="p-4 rounded-2xl bg-white border"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Users size={14} className="text-green-800" />
            <span className="text-[11px] text-text-muted">Active Sessions</span>
          </div>
          <div className="text-2xl font-bold text-green-900">342</div>
          <div className="text-[10px] text-text-muted">Concurrent AI sessions</div>
        </div>
        <div
          className="p-4 rounded-2xl bg-white border"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Clock size={14} className="text-green-800" />
            <span className="text-[11px] text-text-muted">Rate Limit Hits</span>
          </div>
          <div className="text-2xl font-bold text-red-600">127</div>
          <div className="text-[10px] text-text-muted">Last 24 hours</div>
        </div>
        <div
          className="p-4 rounded-2xl bg-white border"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-green-800" />
            <span className="text-[11px] text-text-muted">Token Usage (min)</span>
          </div>
          <div className="text-2xl font-bold text-green-900">8.2K</div>
          <div className="text-[10px] text-text-muted">Average tokens per minute</div>
        </div>
      </div>

      {/* Rate Limit Table */}
      <div
        className="bg-white rounded-2xl border overflow-hidden"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <div
          className="px-6 py-4 bg-cream/30 border-b"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <h3 className="font-serif text-lg text-green-900">Rate Limits by Tier</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
                <th className="text-left px-6 py-3 text-[11px] font-semibold text-text-muted uppercase">
                  Tier
                </th>
                <th className="text-right px-6 py-3 text-[11px] font-semibold text-text-muted uppercase">
                  Requests/Day
                </th>
                <th className="text-right px-6 py-3 text-[11px] font-semibold text-text-muted uppercase">
                  Requests/Hour
                </th>
                <th className="text-right px-6 py-3 text-[11px] font-semibold text-text-muted uppercase">
                  Tokens/Min
                </th>
                <th className="text-right px-6 py-3 text-[11px] font-semibold text-text-muted uppercase">
                  Concurrent Sessions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
              {limits.map((limit) => (
                <tr key={limit.tier} className="hover:bg-cream/20">
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-lg text-[11px] font-semibold ${
                        limit.tier === "free"
                          ? "bg-gray-100 text-gray-600"
                          : limit.tier === "basic"
                            ? "bg-blue-100 text-blue-600"
                            : limit.tier === "pro"
                              ? "bg-green-100 text-green-600"
                              : "bg-purple-100 text-purple-600"
                      }`}>
                      {limit.tier.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <input
                      title="Requests per Day"
                      type="number"
                      value={limit.requestsPerDay}
                      onChange={(e) =>
                        handleUpdate(limit.tier, "requestsPerDay", parseInt(e.target.value))
                      }
                      className="w-32 px-3 py-1.5 rounded-lg border border-gray-200 text-right text-[13px] focus:outline-none focus:ring-2 focus:ring-green-500/30"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      title="Requests per Hour"
                      type="number"
                      value={limit.requestsPerHour}
                      onChange={(e) =>
                        handleUpdate(limit.tier, "requestsPerHour", parseInt(e.target.value))
                      }
                      className="w-32 px-3 py-1.5 rounded-lg border border-gray-200 text-right text-[13px] focus:outline-none focus:ring-2 focus:ring-green-500/30"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      title="Tokens per Minute"
                      type="number"
                      value={limit.tokensPerMinute}
                      onChange={(e) =>
                        handleUpdate(limit.tier, "tokensPerMinute", parseInt(e.target.value))
                      }
                      className="w-32 px-3 py-1.5 rounded-lg border border-gray-200 text-right text-[13px] focus:outline-none focus:ring-2 focus:ring-green-500/30"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      title="Concurrent Sessions"
                      type="number"
                      value={limit.concurrentSessions}
                      onChange={(e) =>
                        handleUpdate(limit.tier, "concurrentSessions", parseInt(e.target.value))
                      }
                      className="w-32 px-3 py-1.5 rounded-lg border border-gray-200 text-right text-[13px] focus:outline-none focus:ring-2 focus:ring-green-500/30"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-time Monitoring */}
      <div
        className="bg-white rounded-2xl border p-6"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <h3 className="font-serif text-lg text-green-900 mb-4">Real-time Rate Limit Monitoring</h3>
        <div className="space-y-3">
          {limits.map((limit) => {
            const usagePercentage = Math.random() * 100; // Mock usage
            return (
              <div key={limit.tier}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-semibold text-green-900">
                    {limit.tier.toUpperCase()}
                  </span>
                  <span className="text-[11px] text-text-muted">
                    {usagePercentage.toFixed(0)}% of limit
                  </span>
                </div>
                <div className="h-2 rounded-full bg-cream overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      usagePercentage > 80
                        ? "bg-red-500"
                        : usagePercentage > 50
                          ? "bg-amber-500"
                          : "bg-green-500"
                    }`}
                    style={{ width: `${usagePercentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          title="Save Changes"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-800 text-white font-semibold hover:bg-green-700 transition-all disabled:opacity-50">
          {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
