import { DollarSign, TrendingUp, Calendar, Clock } from "lucide-react";
import {
  ComposedChart, Bar, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { EarningsCard, SectionCard } from "./Primitives";
import type { TutorEarnings } from "../types";

interface Props {
  earnings: TutorEarnings;
}

export function EarningsTab({ earnings }: Props) {
  const monthOverMonthTrend =
    earnings.lastMonth > 0
      ? Math.round(((earnings.thisMonth - earnings.lastMonth) / earnings.lastMonth) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <EarningsCard
          icon={DollarSign}
          label="Total Earnings"
          value={`₦${earnings.totalEarnings.toLocaleString()}`}
          color="#2e8b57"
        />
        <EarningsCard
          icon={TrendingUp}
          label="This Month"
          value={`₦${earnings.thisMonth.toLocaleString()}`}
          color="#10b981"
          trend={monthOverMonthTrend}
        />
        <EarningsCard
          icon={Calendar}
          label="Last Month"
          value={`₦${earnings.lastMonth.toLocaleString()}`}
          color="#3b82f6"
        />
        <EarningsCard
          icon={Clock}
          label="Pending Payout"
          value={`₦${earnings.pendingPayout.toLocaleString()}`}
          color="#f59e0b"
        />
      </div>

      {/* Monthly earnings chart */}
      <SectionCard title="Monthly Earnings">
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={earnings.monthlyBreakdown}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,80,50,0.1)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7280" }} />
            <YAxis
              tick={{ fontSize: 11, fill: "#6b7280" }}
              tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip
              contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
              formatter={(value: number) => `₦${value.toLocaleString()}`}
            />
            <Bar dataKey="earnings" name="Earnings" fill="#2e8b57" radius={[4, 4, 0, 0]} />
            <Line type="monotone" dataKey="sessions" name="Sessions" stroke="#f59e0b" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </SectionCard>

      {/* Earnings by subject */}
      <SectionCard title="Earnings by Subject">
        <div className="grid grid-cols-3 gap-4">
          {earnings.earningsBySubject.map((item) => (
            <div key={item.subject} className="p-4 rounded-xl bg-cream/50 text-center">
              <div className="text-lg font-bold text-green-900">₦{item.amount.toLocaleString()}</div>
              <div className="text-[12px] text-text-muted">{item.subject}</div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
