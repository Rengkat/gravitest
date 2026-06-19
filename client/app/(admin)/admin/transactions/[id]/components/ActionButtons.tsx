"use client";

import {
  RotateCcw,
  Flag,
  RefreshCw,
  Mail,
  Download,
  Printer,
  Share2,
  AlertTriangle,
} from "lucide-react";
import type { Transaction } from "../../types";

interface Props {
  transaction: Transaction;
  processingAction: boolean;
  onRefund: () => void;
  onFlag: () => void;
  onRetryWebhook: () => void;
  onSendReceipt: () => void;
}

export function ActionButtons({
  transaction,
  processingAction,
  onRefund,
  onFlag,
  onRetryWebhook,
  onSendReceipt,
}: Props) {
  const canRefund = transaction.status === "paid" && transaction.refundStatus !== "completed";

  return (
    <div className="bg-white rounded-2xl border p-4" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <div className="grid grid-cols-2 gap-2">
        {canRefund && (
          <button
            onClick={onRefund}
            disabled={processingAction}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 transition-colors text-[13px] font-semibold disabled:opacity-50">
            <RotateCcw size={14} />
            Refund
          </button>
        )}

        <button
          onClick={onFlag}
          disabled={processingAction}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border transition-colors text-[13px] font-semibold ${
            transaction.isFraudulent
              ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
              : "border-gray-200 text-text-muted hover:bg-red-50"
          }`}>
          <Flag size={14} />
          {transaction.isFraudulent ? "Unflag" : "Flag Fraud"}
        </button>

        <button
          onClick={onRetryWebhook}
          disabled={processingAction}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-text-muted hover:bg-cream transition-colors text-[13px] font-semibold">
          {/* <RefreshCw size={14} /> */}
          Retry Webhook
        </button>

        <button
          onClick={onSendReceipt}
          disabled={processingAction}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-text-muted hover:bg-cream transition-colors text-[13px] font-semibold">
          {/* <Mail size={14} /> */}
          Send Receipt
        </button>

        <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-text-muted hover:bg-cream transition-colors text-[13px] font-semibold">
          {/* <Download size={14} /> */}
          Download PDF
        </button>

        <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-text-muted hover:bg-cream transition-colors text-[13px] font-semibold">
          <Printer size={14} />
          Print
        </button>
      </div>
    </div>
  );
}
