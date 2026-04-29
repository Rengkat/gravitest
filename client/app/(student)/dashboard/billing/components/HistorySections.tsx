"use client";

import { Download, Eye, Clock, FileText } from "lucide-react";
import {
  MOCK_SUBSCRIPTION_HISTORY,
  MOCK_CONTENT_PURCHASES,
  CONTENT_TYPE_CONFIG,
  formatDate,
  formatCurrency,
} from "@/lib/constants/billing";

// ── Subscription History ──────────────────────────────────────────────────

const SUB_STATUS_CONFIG = {
  active: { label: "Active", cls: "bg-green-100 text-green-700 border-green-200" },
  cancelled: { label: "Cancelled", cls: "bg-gray-100 text-gray-600 border-gray-200" },
  expired: { label: "Expired", cls: "bg-red-100 text-red-600 border-red-200" },
};

export function SubscriptionHistory() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
          <Clock size={18} className="text-blue-600" />
        </div>
        <div>
          <h3 className="text-[16px] font-bold text-gray-900">Subscription History</h3>
          <p className="text-[12px] text-gray-500">All plan changes over time</p>
        </div>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[19px] top-3 bottom-3 w-px bg-gray-200" />

        <div className="space-y-4">
          {MOCK_SUBSCRIPTION_HISTORY.map((history, idx) => {
            const statusCfg = SUB_STATUS_CONFIG[history.status];
            return (
              <div key={history.id} className="flex gap-4">
                {/* Dot */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 border-2 ${
                    history.status === "active"
                      ? "bg-green-100 border-green-400"
                      : "bg-gray-100 border-gray-300"
                  }`}>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      history.status === "active" ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 flex items-center justify-between pb-4 border-b border-gray-50 last:border-0 last:pb-0 min-w-0">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="text-[14px] font-bold text-gray-800">{history.plan}</p>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusCfg.cls}`}>
                        {statusCfg.label}
                      </span>
                    </div>
                    <p className="text-[12px] text-gray-500">
                      {formatDate(history.startDate)} —{" "}
                      {history.endDate ? formatDate(history.endDate) : "Present"}
                    </p>
                  </div>
                  <p className="text-[14px] font-black text-gray-900 shrink-0 ml-4">
                    {history.amount === 0 ? "Free" : formatCurrency(history.amount) + "/mo"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Content Purchases ─────────────────────────────────────────────────────

export function ContentPurchases() {
  if (MOCK_CONTENT_PURCHASES.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
          <FileText size={18} className="text-purple-600" />
        </div>
        <div>
          <h3 className="text-[16px] font-bold text-gray-900">Content Purchases</h3>
          <p className="text-[12px] text-gray-500">One-time digital content you've bought</p>
        </div>
      </div>

      <div className="space-y-3">
        {MOCK_CONTENT_PURCHASES.map((purchase) => {
          const cfg = CONTENT_TYPE_CONFIG[purchase.type];
          return (
            <div
              key={purchase.id}
              className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-100 rounded-xl hover:bg-white hover:border-gray-200 transition-all">
              {/* Icon — proper circle */}
              <div
                className={`w-11 h-11 rounded-full ${cfg.iconBg} border border-gray-200 flex items-center justify-center shadow-sm text-xl shrink-0`}>
                {cfg.icon}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-gray-800 truncate">{purchase.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[10px] font-bold ${cfg.iconText} uppercase tracking-wide`}>
                    {cfg.label}
                  </span>
                  <span className="text-gray-300">·</span>
                  <span className="text-[12px] text-gray-500">{formatDate(purchase.date)}</span>
                </div>
              </div>

              {/* Price + actions */}
              <div className="flex items-center gap-3 shrink-0">
                <p className="text-[14px] font-black text-gray-900">
                  {formatCurrency(purchase.amount)}
                </p>
                {purchase.downloadUrl && (
                  <a
                    href={purchase.downloadUrl}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-green-600 text-white rounded-xl text-[12px] font-bold hover:bg-green-700 transition-colors shadow-sm">
                    <Download size={13} /> Download
                  </a>
                )}
                {purchase.watchUrl && (
                  <a
                    href={purchase.watchUrl}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 text-white rounded-xl text-[12px] font-bold hover:bg-purple-700 transition-colors shadow-sm">
                    <Eye size={13} /> Watch
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
