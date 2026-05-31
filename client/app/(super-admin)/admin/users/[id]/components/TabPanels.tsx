"use client";

import {
  LogIn,
  LogOut,
  ClipboardCheck,
  ArrowUpCircle,
  XCircle,
  KeyRound,
  UserCog,
  BookOpen,
  CreditCard,
  AlertCircle,
  ShieldOff,
  ShieldCheck,
  UserX,
  Shield,
  RotateCcw,
  Monitor,
  Wifi,
} from "lucide-react";
import type { ActivityLogEntry, PaymentRecord } from "../types";

// ─── Activity icons map ───────────────────────────────────────────────────────

const ACTION_META: Record<string, { icon: any; color: string }> = {
  login: { icon: LogIn, color: "#3b82f6" },
  logout: { icon: LogOut, color: "#6b7280" },
  quiz_completed: { icon: ClipboardCheck, color: "#10b981" },
  subscription_upgraded: { icon: ArrowUpCircle, color: "#8b5cf6" },
  subscription_cancelled: { icon: XCircle, color: "#ef4444" },
  password_changed: { icon: KeyRound, color: "#f59e0b" },
  password_reset: { icon: RotateCcw, color: "#f59e0b" },
  profile_updated: { icon: UserCog, color: "#3b82f6" },
  content_accessed: { icon: BookOpen, color: "#0284c7" },
  payment_made: { icon: CreditCard, color: "#10b981" },
  payment_failed: { icon: AlertCircle, color: "#ef4444" },
  account_suspended: { icon: ShieldOff, color: "#ef4444" },
  account_activated: { icon: ShieldCheck, color: "#10b981" },
  account_deactivated: { icon: UserX, color: "#6b7280" },
  two_factor_enabled: { icon: Shield, color: "#2e8b57" },
};

const DEFAULT_ACTIVITY_META = { icon: AlertCircle, color: "#6b7280" };

function fmt(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }),
    time: d.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" }),
  };
}

// ─── Activity Tab ─────────────────────────────────────────────────────────────

export function ActivityTab({ entries }: { entries: ActivityLogEntry[] }) {
  return (
    <div className="rounded-2xl bg-white border p-5" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <h2 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-5">
        Recent Activity
      </h2>

      {entries.length === 0 ? (
        <p className="text-[13px] text-text-muted text-center py-8">No activity recorded yet.</p>
      ) : (
        <ol aria-label="Activity log">
          {entries.map((entry, i) => {
            const meta = ACTION_META[entry.action] ?? DEFAULT_ACTIVITY_META;
            const Icon = meta.icon;
            const { date, time } = fmt(entry.timestamp);
            const isLast = i === entries.length - 1;

            return (
              <li key={entry.id} className="flex gap-3">
                {/* Spine */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm"
                    style={{ background: `${meta.color}15` }}>
                    <Icon size={14} style={{ color: meta.color }} />
                  </div>
                  {!isLast && <div className="w-px flex-1 bg-gray-100 my-1" />}
                </div>

                {/* Content */}
                <div className="pb-4 flex-1 min-w-0 pt-1">
                  <p className="text-[13px] font-medium text-green-900 leading-snug mb-1">
                    {entry.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-text-muted">
                    <time dateTime={entry.timestamp}>
                      {date} · {time}
                    </time>
                    {entry.ipAddress && (
                      <span className="inline-flex items-center gap-1 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded font-mono text-[10px]">
                        <Wifi size={9} />
                        {entry.ipAddress}
                      </span>
                    )}
                    {entry.device && (
                      <span className="inline-flex items-center gap-1 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded text-[10px]">
                        <Monitor size={9} />
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

// ─── Payments Tab ─────────────────────────────────────────────────────────────

const PAY_STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
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
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
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
                const st = PAY_STATUS_CFG[p.status];
                const chColor = CHANNEL_COLORS[p.channel] ?? "#6b7280";
                const { date } = fmt(p.date);
                const isLast = i === payments.length - 1;

                return (
                  <tr
                    key={p.id}
                    className={`hover:bg-cream/30 transition-colors ${isLast ? "" : "border-b"}`}
                    style={{ borderColor: "rgba(30,80,50,0.06)" }}>
                    <td className="px-4 py-3 text-text-muted whitespace-nowrap">
                      <time dateTime={p.date}>{date}</time>
                    </td>
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
      )}
    </div>
  );
}
