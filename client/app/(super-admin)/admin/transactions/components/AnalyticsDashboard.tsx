"use client";

import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  RefreshCw,
  CreditCard,
  RotateCcw,
  Activity,
  Target,
  Crown,
} from "lucide-react";
import type { RevenueStats } from "../types";
import { CHANNEL_CONFIG, PLAN_CONFIG, CHART_COLORS } from "../constants";
import { MiniStatCard, Card, fmt } from "./Primitives";

export function AnalyticsDashboard({ stats }: { stats: RevenueStats }) {
  const maxMonthRev = Math.max(...stats.revenueByMonth.map((m) => m.revenue));

  return (
    <div className="space-y-6">
      {/* ── Headline KPIs ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <MiniStatCard
          icon={DollarSign}
          label="Total Revenue"
          value={`₦${(stats.totalRevenue / 1000000).toFixed(1)}M`}
          color="#2e8b57"
          trend={12}
        />
        <MiniStatCard
          icon={TrendingUp}
          label="Net Revenue"
          value={`₦${(stats.netRevenue / 1000000).toFixed(1)}M`}
          color="#10b981"
          trend={10}
        />
        <MiniStatCard
          icon={TrendingDown}
          label="Total Fees"
          value={`₦${(stats.totalFees / 1000000).toFixed(1)}M`}
          color="#f59e0b"
        />
        <MiniStatCard
          icon={RotateCcw}
          label="Refunds"
          value={`₦${(stats.totalRefunds / 1000000).toFixed(1)}M`}
          color="#ef4444"
          trend={-3}
        />
        <MiniStatCard
          icon={Activity}
          label="MRR"
          value={`₦${(stats.monthlyRecurringRevenue / 1000000).toFixed(1)}M`}
          color="#3b82f6"
          trend={8}
        />
        <MiniStatCard
          icon={Crown}
          label="ARR"
          value={`₦${(stats.annualRecurringRevenue / 1000000).toFixed(0)}M`}
          color="#8b5cf6"
        />
        <MiniStatCard
          icon={Target}
          label="Avg Txn Value"
          value={fmt(stats.averageTransactionValue)}
          color="#14b8a6"
        />
        <MiniStatCard
          icon={Users}
          label="Active Subs"
          value={stats.activeSubscriptions.toLocaleString()}
          color="#f97316"
          trend={5}
        />
      </div>

      {/* ── Row 1: monthly revenue + by plan ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly revenue bars */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="font-serif text-lg text-green-900 mb-4">Monthly Revenue (2024)</h3>
          <div className="h-48 flex items-end gap-1.5 mb-2">
            {stats.revenueByMonth.map((m, i) => {
              const pct = (m.revenue / maxMonthRev) * 100;
              const subPct = (m.subscriptions / m.revenue) * pct;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-[9px] font-semibold text-green-900 opacity-0 group-hover:opacity-100 transition-opacity">
                    ₦{(m.revenue / 1000000).toFixed(1)}M
                  </span>
                  <div
                    className="w-full flex flex-col justify-end rounded-t-md overflow-hidden"
                    style={{ height: `${Math.max(pct, 3)}%` }}>
                    <div
                      className="w-full"
                      style={{ height: `${(m.oneTime / m.revenue) * 100}%`, background: "#3b82f6" }}
                    />
                    <div className="w-full flex-1" style={{ background: "#2e8b57" }} />
                  </div>
                  <span className="text-[9px] text-text-muted">{m.month}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-green-800 inline-block" />
              Subscriptions
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-blue-500 inline-block" />
              One-Time
            </span>
          </div>

          {/* Subscription health row */}
          <div
            className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t"
            style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <div className="text-center">
              <div className="text-lg font-bold text-green-900">{stats.churnRate}%</div>
              <div className="text-[11px] text-text-muted">Churn Rate</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-900">{stats.conversionRate}%</div>
              <div className="text-[11px] text-text-muted">Conversion Rate</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-900">
                {fmt(stats.customerLifetimeValue)}
              </div>
              <div className="text-[11px] text-text-muted">Avg LTV</div>
            </div>
          </div>
        </Card>

        {/* Revenue by plan */}
        <Card className="p-6">
          <h3 className="font-serif text-lg text-green-900 mb-4">Revenue by Plan</h3>
          <div className="space-y-3">
            {stats.revenueByPlan.map((rp, i) => {
              const pct = ((rp.revenue / stats.totalRevenue) * 100).toFixed(1);
              const color = CHART_COLORS[i % CHART_COLORS.length];
              return (
                <div key={rp.plan} className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-0.5">
                      <span className="text-[12px] font-semibold text-green-900 truncate">
                        {rp.plan}
                      </span>
                      <span className="text-[12px] font-bold text-green-900 ml-2">
                        ₦{(rp.revenue / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-cream overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: color }}
                      />
                    </div>
                  </div>
                  <span className="text-[10px] text-text-muted w-8 text-right">{pct}%</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* ── Row 2: Channel distribution + transaction counts + top customers ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Channel breakdown */}
        <Card className="p-6">
          <h3 className="font-serif text-lg text-green-900 mb-4">Revenue by Channel</h3>
          <div className="space-y-3">
            {stats.revenueByChannel.map((rc) => {
              const ch = Object.entries(CHANNEL_CONFIG).find(
                ([k]) => k.replace("_", " ").toLowerCase() === rc.channel.toLowerCase(),
              );
              const color = ch?.[1].color ?? "#6b7280";
              const Icon = ch?.[1].icon ?? CreditCard;
              return (
                <div key={rc.channel} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${color}15` }}>
                    <Icon size={14} style={{ color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-0.5">
                      <span className="text-[12px] font-semibold text-green-900">{rc.channel}</span>
                      <span className="text-[12px] font-bold text-green-900">
                        ₦{(rc.revenue / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-cream overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${rc.percentage}%`, background: color }}
                      />
                    </div>
                  </div>
                  <span className="text-[10px] text-text-muted w-10 text-right">
                    {rc.percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Transaction counts */}
        <Card className="p-6">
          <h3 className="font-serif text-lg text-green-900 mb-4">Transaction Summary</h3>
          <div className="space-y-3">
            {[
              { label: "Successful", count: stats.successfulTransactions, color: "#10b981" },
              { label: "Failed", count: stats.failedTransactions, color: "#ef4444" },
              { label: "Pending", count: stats.pendingTransactions, color: "#3b82f6" },
              { label: "Refunded", count: stats.refundedTransactions, color: "#f59e0b" },
            ].map((r) => {
              const pct = ((r.count / stats.totalTransactions) * 100).toFixed(1);
              return (
                <div key={r.label} className="flex items-center gap-3">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: r.color }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between mb-0.5">
                      <span className="text-[12px] font-semibold text-green-900">{r.label}</span>
                      <span className="text-[12px] font-bold text-green-900">
                        {r.count.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-cream overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: r.color }}
                      />
                    </div>
                  </div>
                  <span className="text-[10px] text-text-muted w-8 text-right">{pct}%</span>
                </div>
              );
            })}
          </div>

          <div
            className="mt-4 pt-4 border-t text-center"
            style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <div className="text-2xl font-bold text-green-900">
              {stats.totalTransactions.toLocaleString()}
            </div>
            <div className="text-[11px] text-text-muted">Total Transactions</div>
          </div>
        </Card>

        {/* Top customers */}
        <Card className="p-6">
          <h3 className="font-serif text-lg text-green-900 mb-4">Top Customers</h3>
          <div className="space-y-3">
            {stats.topCustomers.map((c, i) => (
              <div key={c.email} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-green-800 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-green-900 truncate">{c.name}</div>
                  <div className="text-[11px] text-text-muted">{c.plan}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[13px] font-bold text-green-900">
                    ₦{(c.totalSpent / 1000000).toFixed(1)}M
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Row 3: Revenue by role + customer acquisition ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-serif text-lg text-green-900 mb-4">Revenue by User Role</h3>
          <div className="space-y-4">
            {stats.revenueByRole.map((r, i) => {
              const pct = ((r.revenue / stats.totalRevenue) * 100).toFixed(1);
              const color = CHART_COLORS[i % CHART_COLORS.length];
              return (
                <div key={r.role} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: color }} />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-[13px] font-semibold text-green-900">{r.role}</span>
                      <span className="text-[13px] font-bold text-green-900">
                        ₦{(r.revenue / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-cream overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: color }}
                      />
                    </div>
                  </div>
                  <span className="text-[11px] text-text-muted w-10 text-right">{pct}%</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-serif text-lg text-green-900 mb-4">Customer Acquisition vs Churn</h3>
          <div className="h-40 flex items-end gap-1.5">
            {stats.customerAcquisition.map((m, i) => {
              const maxNew = Math.max(...stats.customerAcquisition.map((x) => x.newCustomers));
              const newPct = (m.newCustomers / maxNew) * 100;
              const churnPct = (m.churnedCustomers / maxNew) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-0.5 group">
                  <div className="w-full flex flex-col gap-0.5 items-center">
                    <div
                      className="w-3/4 rounded-t-sm"
                      style={{ height: `${Math.max(newPct * 1.2, 2)}px`, background: "#2e8b57" }}
                    />
                    <div
                      className="w-3/4 rounded-b-sm"
                      style={{
                        height: `${Math.max(churnPct * 1.2, 2)}px`,
                        background: "#ef4444",
                        opacity: 0.7,
                      }}
                    />
                  </div>
                  <span className="text-[9px] text-text-muted">{m.month}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 text-[11px] mt-2">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-green-800 inline-block" />
              New customers
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-red-400 inline-block" />
              Churned
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
