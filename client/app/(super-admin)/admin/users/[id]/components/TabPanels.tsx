"use client";

import type { ActivityLogEntry, PaymentRecord } from "../types";

// ─── Activity ─────────────────────────────────────────────────────────────────

const ACTION_META: Record<string, { emoji: string; color: string }> = {
  login: { emoji: "🔑", color: "#3b82f6" },
  logout: { emoji: "👋", color: "#6b7280" },
  quiz_completed: { emoji: "📝", color: "#10b981" },
  subscription_upgraded: { emoji: "⬆️", color: "#8b5cf6" },
  subscription_cancelled: { emoji: "❌", color: "#ef4444" },
  password_changed: { emoji: "🔒", color: "#f59e0b" },
  profile_updated: { emoji: "✏️", color: "#3b82f6" },
  content_accessed: { emoji: "📖", color: "#0284c7" },
  payment_made: { emoji: "💳", color: "#10b981" },
  payment_failed: { emoji: "⚠️", color: "#ef4444" },
  account_suspended: { emoji: "⛔", color: "#ef4444" },
  account_activated: { emoji: "✅", color: "#10b981" },
  lesson_created: { emoji: "📚", color: "#8b5cf6" },
  school_linked: { emoji: "🏫", color: "#f59e0b" },
  two_factor_enabled: { emoji: "🛡️", color: "#2e8b57" },
};

function fmtTs(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }),
    time: d.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" }),
  };
}

export function ActivityTab({ entries }: { entries: ActivityLogEntry[] }) {
  return (
    <div className="rounded-2xl bg-white border p-5" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <h2 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-4">
        Recent Activity
      </h2>

      {entries.length === 0 ? (
        <p className="text-[13px] text-text-muted text-center py-8">No activity recorded yet.</p>
      ) : (
        <ol className="space-y-0" aria-label="Activity log">
          {entries.map((entry, i) => {
            const meta = ACTION_META[entry.action] ?? { emoji: "🔔", color: "#6b7280" };
            const { date, time } = fmtTs(entry.timestamp);
            const isLast = i === entries.length - 1;

            return (
              <li key={entry.id} className="flex gap-3">
                {/* Timeline spine */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[14px] shrink-0 border-2 border-white shadow-sm"
                    style={{ background: `${meta.color}15` }}
                    aria-hidden="true">
                    {meta.emoji}
                  </div>
                  {!isLast && <div className="w-px flex-1 bg-gray-100 my-1" />}
                </div>

                {/* Content */}
                <div className={`pb-4 flex-1 min-w-0 ${isLast ? "" : ""}`}>
                  <p className="text-[13px] font-medium text-green-900 leading-snug mb-0.5">
                    {entry.description}
                  </p>
                  <div className="flex flex-wrap gap-2 text-[11px] text-text-muted">
                    <time dateTime={entry.timestamp}>
                      {date} · {time}
                    </time>
                    {entry.ipAddress && (
                      <span className="font-mono bg-gray-50 px-1.5 py-0.5 rounded text-[10px]">
                        {entry.ipAddress}
                      </span>
                    )}
                    {entry.device && (
                      <span className="bg-gray-50 px-1.5 py-0.5 rounded text-[10px]">
                        {entry.device}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

// ─── Payments ─────────────────────────────────────────────────────────────────

const PAY_STATUS: Record<string, { label: string; color: string; bg: string }> = {
  successful: { label: "Successful", color: "#10b981", bg: "#10b98115" },
  failed: { label: "Failed", color: "#ef4444", bg: "#ef444415" },
  pending: { label: "Pending", color: "#f59e0b", bg: "#f59e0b15" },
  refunded: { label: "Refunded", color: "#6b7280", bg: "#6b728015" },
};

const CHANNEL_COLORS: Record<string, string> = {
  Paystack: "#00c3f7",
  Flutterwave: "#f5a623",
  Bank: "#6b7280",
  USSD: "#8b5cf6",
};

export function PaymentsTab({ payments }: { payments: PaymentRecord[] }) {
  const totalPaid = payments
    .filter((p) => p.status === "successful")
    .reduce((s, p) => s + p.amount, 0);

  return (
    <div className="rounded-2xl bg-white border p-5" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
          Payment History
        </h2>
        <span className="text-[12px] text-text-muted">
          Total paid: <strong className="text-green-900">₦{totalPaid.toLocaleString()}</strong>
        </span>
      </div>

      {payments.length === 0 ? (
        <p className="text-[13px] text-text-muted text-center py-8">No payment records found.</p>
      ) : (
        <div
          className="overflow-x-auto rounded-xl border"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}
          role="region"
          aria-label="Payments table"
          tabIndex={0}>
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
                const st = PAY_STATUS[p.status];
                const chColor = CHANNEL_COLORS[p.channel] ?? "#6b7280";
                const d = new Date(p.date);
                const dateStr = d.toLocaleDateString("en-NG", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });
                const isLast = i === payments.length - 1;

                return (
                  <tr
                    key={p.id}
                    className={`hover:bg-cream/30 transition-colors ${isLast ? "" : "border-b"}`}
                    style={{ borderColor: "rgba(30,80,50,0.06)" }}>
                    <td className="px-4 py-3 text-text-muted whitespace-nowrap">
                      <time dateTime={p.date}>{dateStr}</time>
                    </td>
                    <td className="px-4 py-3 font-medium text-green-900 whitespace-nowrap">
                      {p.plan}
                    </td>
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
      )}
    </div>
  );
}
