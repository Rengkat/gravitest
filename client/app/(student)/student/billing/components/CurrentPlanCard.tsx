"use client";

import { useState } from "react";
import { Crown, Zap, X, Loader2, AlertTriangle, ArrowUpRight } from "lucide-react";
import { CURRENT_PLAN, formatDate, formatCurrency } from "@/lib/constants/billing";

interface CurrentPlanCardProps {
  onUpgrade: () => void;
}

export default function CurrentPlanCard({ onUpgrade }: CurrentPlanCardProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [reason, setReason] = useState("");

  const handleCancel = async () => {
    setIsCancelling(true);
    await new Promise((r) => setTimeout(r, 1400));
    setIsCancelling(false);
    setShowCancelModal(false);
    // TODO: call cancellation API
    alert("Subscription cancellation requested. You'll keep Pro access until Dec 15, 2025.");
  };

  const renewalPct = Math.max(0, Math.min(100, (CURRENT_PLAN.daysRemaining / 30) * 100));

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-green-500 to-emerald-400" />

        <div className="p-6">
          {/* Plan name row */}
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shrink-0">
                <Crown size={22} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-[20px] font-black text-gray-900">Pro Plan</h2>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Active
                  </span>
                </div>
                <p className="text-[13px] text-gray-500 mt-0.5">
                  Monthly · Billed automatically via Paystack
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[24px] font-black text-green-700">
                {formatCurrency(CURRENT_PLAN.amount)}
              </p>
              <p className="text-[12px] text-gray-400">per month</p>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            {[
              { label: "Plan Started", value: formatDate(CURRENT_PLAN.started) },
              { label: "Next Renewal", value: formatDate(CURRENT_PLAN.nextRenewal) },
              { label: "Billing Cycle", value: CURRENT_PLAN.billingCycle },
              { label: "Days Remaining", value: `${CURRENT_PLAN.daysRemaining} days` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  {label}
                </p>
                <p className="text-[14px] font-bold text-gray-800">{value}</p>
              </div>
            ))}
          </div>

          {/* Renewal progress bar */}
          <div className="mb-5">
            <div className="flex justify-between text-[11px] text-gray-400 mb-1.5">
              <span>Billing period</span>
              <span>{CURRENT_PLAN.daysRemaining} days until next charge</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all"
                style={{ width: `${100 - renewalPct}%` }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onUpgrade}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl text-[14px] font-bold hover:bg-green-700 transition-colors shadow-sm">
              <Zap size={15} className="fill-white" />
              Upgrade to Annual — Save 20%
              <ArrowUpRight size={14} />
            </button>
            <button className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-[14px] font-semibold hover:bg-gray-50 transition-colors">
              Change Plan
            </button>
            <button
              onClick={() => setShowCancelModal(true)}
              className="px-5 py-2.5 border border-red-200 text-red-600 rounded-xl text-[14px] font-semibold hover:bg-red-50 transition-colors">
              Cancel Subscription
            </button>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <AlertTriangle size={18} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-gray-900">Cancel Subscription</h3>
                  <p className="text-[12px] text-gray-500">
                    Your Pro access ends {formatDate(CURRENT_PLAN.nextRenewal)}
                  </p>
                </div>
              </div>
              <button
                title="cancel show model"
                onClick={() => setShowCancelModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* What you'll lose */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-[13px] font-bold text-amber-800 mb-2">You'll lose access to:</p>
                <ul className="space-y-1.5">
                  {[
                    "Unlimited practice sessions",
                    "All video lessons",
                    "Priority tutor booking",
                    "AI explanations",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-[12px] text-amber-700">
                      <X size={12} className="text-amber-500 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-[12px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                  Reason for cancelling (optional)
                </label>
                <select
                  title="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:border-red-300 bg-white">
                  <option value="">Select a reason</option>
                  <option value="too_expensive">Too expensive</option>
                  <option value="not_using">Not using it enough</option>
                  <option value="missing_features">Missing features I need</option>
                  <option value="switching">Switching to another platform</option>
                  <option value="exams_done">Finished my exams</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <p className="text-[12px] text-gray-500">
                Your Pro access continues until{" "}
                <span className="font-semibold">{formatDate(CURRENT_PLAN.nextRenewal)}</span>. No
                further charges will be made.
              </p>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-[14px] font-bold hover:bg-green-700">
                Keep My Pro Plan
              </button>
              <button
                onClick={handleCancel}
                disabled={isCancelling}
                className="flex-[1] py-2.5 border border-red-200 text-red-600 rounded-xl text-[14px] font-semibold hover:bg-red-50 disabled:opacity-50 flex items-center justify-center gap-2">
                {isCancelling ? <Loader2 size={14} className="animate-spin" /> : null}
                Cancel Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
