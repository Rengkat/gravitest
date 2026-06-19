"use client";

import Link from "next/link";
import { Eye, RotateCcw, Flag, Copy, BadgeAlert } from "lucide-react";
import type { Transaction } from "../types";
import { TX_STATUS_CONFIG, CHANNEL_CONFIG, REVENUE_TYPE_CONFIG } from "../constants";
import { StatusPill, Badge, fmt } from "./Primitives";

interface Props {
  tx: Transaction;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onRefund: (id: string) => void;
  onFlag: (id: string) => void;
}

export function TransactionRow({ tx, isSelected, onToggleSelect, onRefund, onFlag }: Props) {
  const statusCfg = TX_STATUS_CONFIG[tx.status];
  const channelCfg = CHANNEL_CONFIG[tx.channel];
  const revCfg = REVENUE_TYPE_CONFIG[tx.revenueType];
  const StatusIcon = statusCfg.icon;
  const ChanIcon = channelCfg.icon;

  const copyRef = () => navigator.clipboard?.writeText(tx.reference);

  return (
    <div
      className={`p-4 rounded-2xl bg-white border flex items-center gap-4 hover:bg-cream/20 transition-colors ${isSelected ? "ring-2 ring-green-800/20" : ""} ${tx.isFraudulent ? "border-red-200" : ""}`}
      style={{ borderColor: tx.isFraudulent ? "#fca5a5" : "rgba(30,80,50,0.08)" }}>
      {/* Checkbox */}
      <input
        title="toggle"
        type="checkbox"
        checked={isSelected}
        onChange={() => onToggleSelect(tx.id)}
        className="w-4 h-4 rounded border-gray-300 text-green-800 shrink-0"
      />

      {/* Channel icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: channelCfg.bg }}>
        <ChanIcon size={18} style={{ color: channelCfg.color }} />
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-[14px] font-semibold text-green-900 truncate">
            {tx.description}
          </span>
          <StatusPill label={statusCfg.label} bg={statusCfg.bg} text={statusCfg.text} />
          <Badge label={revCfg.label} color={revCfg.color} bg={`${revCfg.color}15`} size="xs" />
          {tx.isFraudulent && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-100 text-red-600 flex items-center gap-1">
              <BadgeAlert size={9} /> FRAUD
            </span>
          )}
          {tx.isDisputed && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-yellow-100 text-yellow-700">
              DISPUTED
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-[12px] text-text-muted flex-wrap">
          <span className="font-medium text-green-900">{tx.userName}</span>
          <span>·</span>
          <span>{tx.userEmail}</span>
          <span>·</span>
          <span className="font-mono">{tx.reference}</span>
          <button title="copy" onClick={copyRef} className="hover:text-green-700 transition-colors">
            <Copy size={11} />
          </button>
          <span>·</span>
          <span>{tx.date}</span>
        </div>
      </div>

      {/* Amounts */}
      <div className="text-right shrink-0 hidden md:block">
        <div className="text-[15px] font-bold text-green-900">{fmt(tx.amount)}</div>
        <div className="text-[11px] text-text-muted">Fee: {fmt(tx.fee)}</div>
        <div className="text-[11px] font-semibold text-green-700">Net: {fmt(tx.netAmount)}</div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <Link
          href={`/admin/transactions/${tx.id}`}
          className="p-2 rounded-lg hover:bg-green-50 transition-colors"
          title="View details">
          <Eye size={16} className="text-text-muted hover:text-green-600" />
        </Link>
        {tx.status === "paid" && (
          <button
            onClick={() => onRefund(tx.id)}
            className="p-2 rounded-lg hover:bg-amber-50 transition-colors"
            title="Issue refund">
            <RotateCcw size={16} className="text-text-muted hover:text-amber-600" />
          </button>
        )}
        <button
          onClick={() => onFlag(tx.id)}
          className={`p-2 rounded-lg transition-colors ${tx.isFraudulent ? "bg-red-50" : "hover:bg-red-50"}`}
          title={tx.isFraudulent ? "Unflag fraud" : "Flag as fraud"}>
          <Flag
            size={16}
            className={tx.isFraudulent ? "text-red-500" : "text-text-muted hover:text-red-500"}
          />
        </button>
      </div>
    </div>
  );
}
