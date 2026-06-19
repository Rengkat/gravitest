"use client";

import { CreditCard, TrendingUp } from "lucide-react";
import type { SchoolData } from "@/types/schoolsTypes";

interface PaymentRecord {
  id: string;
  amount: number;
  plan: string;
  status: "successful" | "failed" | "pending" | "refunded";
  channel: string;
  reference: string;
  date: string;
}

const STATUS_CFG = {
  successful: { label: "Successful", color: "#10b981", bg: "#10b98115" },
  failed: { label: "Failed", color: "#ef4444", bg: "#ef444415" },
  pending: { label: "Pending", color: "#f59e0b", bg: "#f59e0b15" },
  refunded: { label: "Refunded", color: "#6b7280", bg: "#6b728015" },
};

const CHANNEL_COLORS: Record<string, string> = {
  Paystack: "#00c3f7",
  Flutterwave: "#f5a623",
  Bank: "#6b7280",
  Transfer: "#8b5cf6",
};

function mockPayments(): PaymentRecord[] {
  return [
    {
      id: "bp1",
      amount: 180_000,
      plan: "Enterprise Annual",
      status: "successful",
      channel: "Paystack",
      reference: "PSK-20250527-EN001",
      date: "2025-05-27T10:00:00Z",
    },
    {
      id: "bp2",
      amount: 180_000,
      plan: "Enterprise Annual",
      status: "successful",
      channel: "Paystack",
      reference: "PSK-20240527-EN001",
      date: "2024-05-27T10:00:00Z",
    },
    {
      id: "bp3",
      amount: 60_000,
      plan: "Professional Quarterly",
      status: "successful",
      channel: "Bank",
      reference: "BNK-20240227-PR002",
      date: "2024-02-27T09:00:00Z",
    },
    {
      id: "bp4",
      amount: 60_000,
      plan: "Professional Quarterly",
      status: "failed",
      channel: "Flutterwave",
      reference: "FLW-20231127-PR003",
      date: "2023-11-27T08:30:00Z",
    },
    {
      id: "bp5",
      amount: 60_000,
      plan: "Professional Quarterly",
      status: "successful",
      channel: "Paystack",
      reference: "PSK-20230827-PR004",
      date: "2023-08-27T10:00:00Z",
    },
  ];
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function BillingTab({ school }: { school: SchoolData }) {
  const payments = mockPayments();
  const totalPaid = payments
    .filter((p) => p.status === "successful")
    .reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          {
            label: "Total Paid",
            value: `₦${totalPaid.toLocaleString()}`,
            color: "#10b981",
            icon: CreditCard,
          },
          {
            label: "Total Spent",
            value: `₦${school.stats.totalSpent.toLocaleString()}`,
            color: "#3b82f6",
            icon: TrendingUp,
          },
          {
            label: "Payments Made",
            value: payments.filter((p) => p.status === "successful").length,
            color: "#8b5cf6",
            icon: CreditCard,
          },
        ].map(({ label, value, color, icon: Icon }) => (
          <div
            key={label}
            className="p-4 rounded-2xl bg-white border flex items-center gap-3"
            style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${color}15` }}>
              <Icon size={16} style={{ color }} />
            </div>
            <div>
              <div className="text-[15px] font-bold text-green-900">{value}</div>
              <div className="text-[10px] text-text-muted">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div
        className="rounded-2xl bg-white border overflow-hidden"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
            Payment History
          </h2>
          <span className="text-[12px] text-text-muted">
            Total paid: <strong className="text-green-900">₦{totalPaid.toLocaleString()}</strong>
          </span>
        </div>

        <div className="overflow-x-auto" role="region" aria-label="Billing table" tabIndex={0}>
          <table className="w-full text-[12px]">
            <thead>
              <tr
                className="border-b"
                style={{ borderColor: "rgba(30,80,50,0.08)", background: "#f8faf8" }}>
                {["Date", "Plan", "Amount", "Channel", "Reference", "Status"].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-text-muted whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map((p, i) => {
                const st = STATUS_CFG[p.status];
                const chColor = CHANNEL_COLORS[p.channel] ?? "#6b7280";
                const isLast = i === payments.length - 1;
                return (
                  <tr
                    key={p.id}
                    className={`hover:bg-cream/30 transition-colors ${!isLast ? "border-b" : ""}`}
                    style={{ borderColor: "rgba(30,80,50,0.06)" }}>
                    <td className="px-4 py-3 text-text-muted whitespace-nowrap">{fmt(p.date)}</td>
                    <td className="px-4 py-3 font-medium text-green-900">{p.plan}</td>
                    <td className="px-4 py-3 font-bold text-green-900 whitespace-nowrap">
                      ₦{p.amount.toLocaleString()}
                    </td>
                    <td
                      className="px-4 py-3 font-semibold whitespace-nowrap"
                      style={{ color: chColor }}>
                      {p.channel}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-text-muted whitespace-nowrap">
                      {p.reference}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap"
                        style={{ color: st.color, background: st.bg }}>
                        {st.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
