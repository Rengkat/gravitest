"use client";

import { useState } from "react";
import {
  HelpCircle,
  Check,
  AlertCircle,
  FileText,
  TrendingUp,
  Target,
  TrendingDown,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { BANK_STATS } from "@/lib/mock/questionsMock";
import { FORMAT_CONFIG, DIFFICULTY_CONFIG, formatNumber, pct } from "@/utils/config";
import { QuestionFormat } from "@/types/adminQuestions";

export default function BankStatsPanel() {
  const [collapsed, setCollapsed] = useState(false);

  const kpis = [
    {
      icon: HelpCircle,
      label: "Total",
      value: formatNumber(BANK_STATS.total),
      color: "#2e8b57",
      trend: 12,
    },
    {
      icon: Check,
      label: "Active",
      value: formatNumber(BANK_STATS.active),
      color: "#10b981",
      trend: 5,
    },
    {
      icon: AlertCircle,
      label: "Inactive",
      value: formatNumber(BANK_STATS.inactive),
      color: "#f59e0b",
      trend: -3,
    },
    { icon: FileText, label: "Drafts", value: formatNumber(BANK_STATS.draft), color: "#6b7280" },
    {
      icon: TrendingUp,
      label: "Total Usage",
      value: formatNumber(BANK_STATS.totalUsage),
      color: "#6366f1",
      trend: 18,
    },
    {
      icon: Target,
      label: "Avg Quality",
      value: BANK_STATS.avgQualityScore + "%",
      color: "#f97316",
      trend: 2,
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl text-green-900">Question Bank Statistics</h2>
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="flex items-center gap-1 text-[13px] text-green-700 hover:text-green-800 font-medium transition-colors">
          {collapsed ? (
            <>
              <ChevronDown size={15} /> Show stats
            </>
          ) : (
            <>
              <ChevronUp size={15} /> Hide stats
            </>
          )}
        </button>
      </div>

      {!collapsed && (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-5">
            {kpis.map(({ icon: Icon, label, value, color, trend }) => (
              <div
                key={label}
                className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:-translate-y-0.5 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${color}18` }}>
                    <Icon size={18} style={{ color }} strokeWidth={1.8} />
                  </div>
                  {trend !== undefined && (
                    <div
                      className={`flex items-center gap-0.5 text-[11px] font-semibold ${trend >= 0 ? "text-green-600" : "text-red-500"}`}>
                      {trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                      {Math.abs(trend)}%
                    </div>
                  )}
                </div>
                <div className="text-[22px] font-bold text-green-900">{value}</div>
                <div className="text-[12px] text-gray-500 font-medium">{label}</div>
              </div>
            ))}
          </div>

          {/* Format distribution */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            {(
              Object.entries(FORMAT_CONFIG) as [
                QuestionFormat,
                (typeof FORMAT_CONFIG)[QuestionFormat],
              ][]
            ).map(([fmt, cfg]) => {
              const count = BANK_STATS.byFormat[fmt];
              const percentage = pct(count, BANK_STATS.total);
              const Icon = cfg.icon;
              return (
                <div
                  key={fmt}
                  className={`p-4 rounded-2xl bg-white border ${cfg.border} shadow-sm`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center`}>
                      <Icon size={18} style={{ color: cfg.color }} />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-900">{formatNumber(count)}</div>
                      <div className="text-[11px] text-gray-500">{percentage}%</div>
                    </div>
                  </div>
                  <div className="text-[13px] font-semibold text-green-900">{cfg.label}</div>
                  <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${percentage}%`, backgroundColor: cfg.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Difficulty distribution */}
          <div className="grid grid-cols-3 gap-4">
            {(Object.entries(DIFFICULTY_CONFIG) as any[]).map(([level, cfg]) => {
              const count = BANK_STATS.byDifficulty[level as keyof typeof BANK_STATS.byDifficulty];
              const percentage = pct(count, BANK_STATS.total);
              return (
                <div
                  key={level}
                  className={`p-4 rounded-2xl bg-white border ${cfg.border} shadow-sm`}>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${cfg.bg} border ${cfg.border}`}
                      style={{ color: cfg.color }}>
                      {cfg.label}
                    </span>
                    <span className="text-[13px] font-bold text-green-900">{percentage}%</span>
                  </div>
                  <div className="text-2xl font-bold text-green-900 mb-2">
                    {formatNumber(count)}
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${cfg.bar}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
