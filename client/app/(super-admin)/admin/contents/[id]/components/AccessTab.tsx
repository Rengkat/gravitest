"use client";

import { Lock, Globe, Users, Crown, Shield, CheckCircle2, XCircle, Clock, Eye } from "lucide-react";
import type { ContentItem } from "@/types/admin-contents";
import { ACCESS_LEVELS } from "@/lib/constants/contents";

// Simulated access records
const MOCK_ACCESS_LOG = [
  {
    id: "u1",
    user: "Adewale Okonkwo",
    email: "adewale@example.com",
    grantedAt: "2025-05-01",
    reason: "Subscription",
    status: "active",
  },
  {
    id: "u2",
    user: "Chidinma Eze",
    email: "chidinma@example.com",
    grantedAt: "2025-04-22",
    reason: "Purchase",
    status: "active",
  },
  {
    id: "u3",
    user: "Femi Adeyemi",
    email: "femi@example.com",
    grantedAt: "2025-04-15",
    reason: "Gift",
    status: "expired",
  },
  {
    id: "u4",
    user: "Ngozi Fashola",
    email: "ngozi@example.com",
    grantedAt: "2025-03-30",
    reason: "Subscription",
    status: "active",
  },
  {
    id: "u5",
    user: "Ibrahim Kanu",
    email: "ibrahim@example.com",
    grantedAt: "2025-03-18",
    reason: "Purchase",
    status: "active",
  },
];

export function AccessTab({ item }: { item: ContentItem }) {
  const accessCfg = ACCESS_LEVELS[item.accessLevel];
  const AccessIcon = accessCfg.icon;

  return (
    <div className="space-y-5">
      {/* Current access model */}
      <div
        className="rounded-2xl bg-white border p-5"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-4">
          Access Model
        </h2>
        <div className="flex items-start gap-4 flex-wrap">
          <div
            className="flex items-center gap-3 p-3 rounded-xl flex-1 min-w-[160px]"
            style={{ background: accessCfg.bg }}>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${accessCfg.color}20` }}>
              <AccessIcon size={18} style={{ color: accessCfg.color }} />
            </div>
            <div>
              <div className="text-[14px] font-bold" style={{ color: accessCfg.color }}>
                {accessCfg.label}
              </div>
              <div className="text-[11px] text-text-muted">
                {item.isFree
                  ? "All users can access for free"
                  : item.price > 0
                    ? `₦${item.price.toLocaleString()} one-time purchase`
                    : "Subscription required"}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {[
              {
                icon: item.drmProtected ? Shield : Globe,
                label: item.drmProtected ? "DRM Protected" : "No DRM",
                ok: item.drmProtected,
              },
              {
                icon: item.isDownloadable ? CheckCircle2 : XCircle,
                label: item.isDownloadable ? "Downloadable" : "Streaming only",
                ok: item.isDownloadable,
              },
              {
                icon: item.isVerified ? CheckCircle2 : Clock,
                label: item.isVerified ? "Verified content" : "Pending verification",
                ok: item.isVerified,
              },
            ].map(({ icon: Icon, label, ok }) => (
              <div key={label} className="flex items-center gap-2 text-[12px]">
                <Icon size={14} className={ok ? "text-green-600" : "text-text-muted"} />
                <span className={ok ? "text-green-900 font-medium" : "text-text-muted"}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex flex-col gap-2 pl-4 border-l border-gray-100">
            {[
              { label: "Total Accesses", value: (item.views + item.downloads).toLocaleString() },
              { label: "Unique Downloaders", value: item.downloads.toLocaleString() },
              {
                label: "Revenue Generated",
                value: item.revenue > 0 ? `₦${item.revenue.toLocaleString()}` : "—",
              },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                  {label}
                </div>
                <div className="text-[14px] font-bold text-green-900">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Access log */}
      <div
        className="rounded-2xl bg-white border overflow-hidden"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
            Recent Access Log
          </h2>
          <span className="text-[11px] text-text-muted">{MOCK_ACCESS_LOG.length} users</span>
        </div>

        <div className="overflow-x-auto" role="region" aria-label="Access log" tabIndex={0}>
          <table className="w-full text-[12px]">
            <thead>
              <tr
                className="border-b"
                style={{ borderColor: "rgba(30,80,50,0.08)", background: "#f8faf8" }}>
                {["User", "Email", "Granted", "Reason", "Status"].map((h) => (
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
              {MOCK_ACCESS_LOG.map((rec, i) => (
                <tr
                  key={rec.id}
                  className={`hover:bg-cream/30 transition-colors ${i < MOCK_ACCESS_LOG.length - 1 ? "border-b" : ""}`}
                  style={{ borderColor: "rgba(30,80,50,0.06)" }}>
                  <td className="px-4 py-3 font-semibold text-green-900">{rec.user}</td>
                  <td className="px-4 py-3 text-text-muted">{rec.email}</td>
                  <td className="px-4 py-3 text-text-muted whitespace-nowrap">{rec.grantedAt}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700">
                      {rec.reason}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{
                        background: rec.status === "active" ? "#10b98115" : "#ef444415",
                        color: rec.status === "active" ? "#10b981" : "#ef4444",
                      }}>
                      {rec.status}
                    </span>
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
