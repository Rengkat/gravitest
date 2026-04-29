"use client";

import { useState } from "react";
import { Check, Crown, Zap, Star, X, Loader2 } from "lucide-react";
import { PLANS, formatCurrency } from "@/lib/constants/billing";

interface PlanComparisonProps {
  isOpen: boolean;
  onClose: () => void;
}

const PLAN_ICONS: Record<string, any> = {
  free: ({ size }: any) => <span style={{ fontSize: size }}>🎓</span>,
  pro: Crown,
  annual: Star,
};

const PLAN_GRADIENTS: Record<string, string> = {
  free: "from-gray-400 to-gray-500",
  pro: "from-amber-400 to-orange-500",
  annual: "from-green-500 to-emerald-600",
};

export default function PlanComparison({ isOpen, onClose }: PlanComparisonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUpgrade = async (planId: string) => {
    if (planId === "pro") return; // current plan
    setSelected(planId);
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsProcessing(false);
    setSelected(null);
    // TODO: initiate Paystack payment flow
    alert(`Upgrading to ${planId} plan — Paystack checkout will open here`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div>
            <h2 className="text-[20px] font-black text-gray-900">Choose Your Plan</h2>
            <p className="text-[13px] text-gray-500 mt-0.5">
              You're on Pro Monthly — upgrade to annual and save ₦6,000
            </p>
          </div>
          <button
            title="close"
            onClick={onClose}
            className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Plans grid */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map((plan) => {
            const isCurrentPlan = plan.isCurrent;
            const isLoading = selected === plan.id && isProcessing;
            const PlanIcon = PLAN_ICONS[plan.id];

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl border-2 overflow-hidden transition-all ${
                  isCurrentPlan
                    ? "border-green-500 shadow-lg shadow-green-500/10"
                    : plan.id === "annual"
                      ? "border-emerald-300 hover:border-emerald-500"
                      : "border-gray-200 hover:border-gray-300"
                }`}>
                {/* Badge */}
                {plan.badge && (
                  <div
                    className={`absolute top-0 left-0 right-0 text-center py-1.5 text-[11px] font-black uppercase tracking-wider ${
                      isCurrentPlan ? "bg-green-500 text-white" : "bg-emerald-500 text-white"
                    }`}>
                    {plan.badge}
                  </div>
                )}

                <div className={`p-6 ${plan.badge ? "pt-10" : ""}`}>
                  {/* Icon + name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${PLAN_GRADIENTS[plan.id]} flex items-center justify-center shadow-sm`}>
                      {plan.id === "free" ? (
                        <span className="text-lg">🎓</span>
                      ) : (
                        <PlanIcon size={22} className="text-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-[16px] font-black text-gray-900">{plan.name}</p>
                      <p className="text-[11px] text-gray-400">
                        {plan.price === 0 ? "Always free" : `per ${plan.period}`}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-5">
                    <span className="text-[32px] font-black text-gray-900">
                      {plan.price === 0 ? "Free" : formatCurrency(plan.price)}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-[13px] text-gray-400 ml-1">/{plan.period}</span>
                    )}
                    {plan.id === "annual" && (
                      <p className="text-[12px] text-emerald-600 font-bold mt-0.5">
                        = ₦{(plan.price / 12).toLocaleString()}/month
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-6 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-[13px] text-gray-700">
                        <Check size={14} className="text-green-500 mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isCurrentPlan || isProcessing}
                    className={`w-full py-3 rounded-xl text-[14px] font-bold transition-all flex items-center justify-center gap-2 ${
                      isCurrentPlan
                        ? "bg-green-100 text-green-700 cursor-default border border-green-200"
                        : plan.id === "annual"
                          ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:opacity-90 shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                    }`}>
                    {isLoading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : isCurrentPlan ? (
                      <>
                        <Check size={15} /> Current Plan
                      </>
                    ) : plan.id === "annual" ? (
                      <>
                        <Zap size={15} /> Upgrade Now
                      </>
                    ) : (
                      "Downgrade"
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-8 pb-6 text-center text-[12px] text-gray-400">
          All plans are billed through Paystack. Cancel anytime. Prices shown in NGN.
        </div>
      </div>
    </div>
  );
}
