"use client";

import { Lock, Crown, CreditCard, ArrowRight, Zap } from "lucide-react";
import type { LibraryContent } from "../types";
import type { AccessReason } from "../types";
import { TIER_CONFIG, formatPrice } from "../constants";

interface Props {
  content: LibraryContent;
  reason: AccessReason;
  inline?: boolean; // smaller compact version for audio
}

export function PaywallOverlay({ content, reason, inline = false }: Props) {
  const isExpired = reason === "expired";

  // Determine CTA
  const isPaid = !!content.priceKobo;
  const isTierGated = !!content.requiredTier;
  const tierCfg = content.requiredTier ? TIER_CONFIG[content.requiredTier] : null;
  const TierIcon = tierCfg?.icon ?? Crown;

  if (inline) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 px-4 text-center">
        <div className="w-10 h-10 rounded-full bg-green-800 flex items-center justify-center">
          <Lock size={18} className="text-white" />
        </div>
        <p className="text-[13px] font-semibold text-green-900">
          {isExpired ? "Your access has expired" : "Preview ended"}
        </p>
        <button className="px-4 py-2 rounded-xl bg-green-800 text-white text-[12px] font-semibold hover:bg-green-700 transition-all">
          {isPaid ? `Buy for ${formatPrice(content.priceKobo!)}` : "Upgrade Plan"}
        </button>
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20"
      style={{ background: "rgba(15,23,42,0.9)", backdropFilter: "blur(8px)" }}>
      <div className="w-16 h-16 rounded-full bg-green-800/30 border border-green-700/30 flex items-center justify-center mb-4">
        <Lock size={28} className="text-green-400" />
      </div>

      <h3 className="text-white text-[20px] font-bold mb-2">
        {isExpired ? "Your access has expired" : "Preview ended"}
      </h3>

      <p className="text-gray-400 text-[13px] mb-6 max-w-xs leading-relaxed">
        {isExpired
          ? "Renew your access to continue from where you left off."
          : isTierGated
            ? `This content requires a ${tierCfg?.label} plan or higher. Upgrade to unlock unlimited access to all ${tierCfg?.label} content.`
            : `Purchase this content once to get lifetime access.`}
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        {isPaid && (
          <button className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-green-700 text-white font-semibold text-[14px] hover:bg-green-600 transition-all">
            <CreditCard size={16} />
            Buy — {formatPrice(content.priceKobo!)}
          </button>
        )}
        {isTierGated && (
          <button
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-[14px] hover:opacity-90 transition-all"
            style={{ background: tierCfg?.color, color: "#fff" }}>
            <TierIcon size={16} />
            Upgrade to {tierCfg?.label}
          </button>
        )}
        {!isPaid && !isTierGated && (
          <button className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-green-700 text-white font-semibold text-[14px] hover:bg-green-600 transition-all">
            <Zap size={16} />
            Subscribe to Unlock
          </button>
        )}
        <button className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-white/20 text-white/80 text-[13px] hover:bg-white/10 transition-all whitespace-nowrap">
          View Plans <ArrowRight size={13} />
        </button>
      </div>

      {/* Preview note */}
      <p className="text-gray-500 text-[11px] mt-4">
        {content.contentType === "video" || content.contentType === "audio"
          ? `You watched the free preview (${formatPrice(0)} · ${content.previewSeconds ?? 90}s)`
          : `You read ${content.previewPages ?? 2} preview pages`}
      </p>
    </div>
  );
}
