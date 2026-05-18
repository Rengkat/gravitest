"use client";

import { useState } from "react";
import { Search, PauseCircle, XCircle, RefreshCw } from "lucide-react";
import type { Subscription } from "../types";
import { PLAN_CONFIG, SUB_STATUS_CONFIG } from "../constants";
import { Card, fmt, Pagination } from "./Primitives";
import { cancelSubscription, pauseSubscription } from "../api";

const PER_PAGE = 20;

export function SubscriptionsTable({ subscriptions }: { subscriptions: Subscription[] }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState(subscriptions);
  const [loading, setLoading] = useState<string | null>(null);

  const filtered = items.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return s.userName.toLowerCase().includes(q) || s.userEmail.toLowerCase().includes(q);
  });

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const handleCancel = async (id: string) => {
    setLoading(id);
    await cancelSubscription(id);
    setItems((prev) => prev.map((s) => (s.id === id ? { ...s, status: "cancelled" } : s)));
    setLoading(null);
  };

  const handlePause = async (id: string) => {
    setLoading(id);
    await pauseSubscription(id);
    setItems((prev) => prev.map((s) => (s.id === id ? { ...s, status: "paused" } : s)));
    setLoading(null);
  };

  return (
    <div className="space-y-4">
      <div className="relative mb-2">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/30"
        />
      </div>

      {paginated.map((sub) => {
        const planCfg = PLAN_CONFIG[sub.plan];
        const statusCfg = SUB_STATUS_CONFIG[sub.status];
        const PlanIcon = planCfg.icon;
        const isLoading = loading === sub.id;

        return (
          <Card key={sub.id} className="p-4 flex items-center gap-4">
            {/* Plan icon */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: planCfg.bg }}>
              <PlanIcon size={18} style={{ color: planCfg.color }} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[14px] font-semibold text-green-900 truncate">
                  {sub.userName}
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{ background: planCfg.bg, color: planCfg.color }}>
                  {planCfg.label}
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{ background: statusCfg.bg, color: statusCfg.text }}>
                  {statusCfg.label}
                </span>
                {!sub.autoRenew && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-gray-100 text-gray-500">
                    No Auto-Renew
                  </span>
                )}
                {sub.failureCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-100 text-red-600">
                    {sub.failureCount} failure{sub.failureCount > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-[12px] text-text-muted flex-wrap">
                <span>{sub.userEmail}</span>
                <span>·</span>
                <span className="capitalize">{sub.billingCycle}</span>
                <span>·</span>
                <span>Started {sub.startDate}</span>
                {sub.nextBillingDate && (
                  <>
                    <span>·</span>
                    <span>Next: {sub.nextBillingDate}</span>
                  </>
                )}
              </div>
            </div>

            {/* Amount */}
            <div className="text-right shrink-0 hidden md:block">
              <div className="text-[15px] font-bold text-green-900">{fmt(sub.amount)}</div>
              <div className="text-[11px] text-text-muted">{sub.billingCycle}</div>
              <div className="text-[11px] text-green-700 font-semibold">
                Total: {fmt(sub.totalPaid)}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              {sub.status === "active" && (
                <>
                  <button
                    onClick={() => handlePause(sub.id)}
                    disabled={isLoading}
                    className="p-2 rounded-lg hover:bg-amber-50 transition-colors"
                    title="Pause">
                    {isLoading ? (
                      <RefreshCw size={15} className="animate-spin text-text-muted" />
                    ) : (
                      <PauseCircle size={15} className="text-text-muted hover:text-amber-600" />
                    )}
                  </button>
                  <button
                    onClick={() => handleCancel(sub.id)}
                    disabled={isLoading}
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="Cancel">
                    <XCircle size={15} className="text-text-muted hover:text-red-500" />
                  </button>
                </>
              )}
            </div>
          </Card>
        );
      })}

      <Pagination currentPage={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
