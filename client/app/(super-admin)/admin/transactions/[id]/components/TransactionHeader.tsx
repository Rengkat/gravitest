"use client";

import { Copy, CheckCircle, XCircle, Clock, AlertTriangle, RefreshCw } from "lucide-react";
import type { Transaction } from "../../types";
import { TX_STATUS_CONFIG } from "../../constants";
import { fmt } from "../../components/Primitives";

interface Props {
  transaction: Transaction;
  onVerify: () => void;
}

export function TransactionHeader({ transaction, onVerify }: Props) {
  const statusCfg = TX_STATUS_CONFIG[transaction.status];
  const StatusIcon = statusCfg.icon;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-serif text-2xl text-green-900">Transaction Details</h1>
            <div className="flex items-center gap-2">
              <span
                className="px-3 py-1 rounded-full text-[12px] font-semibold flex items-center gap-1.5"
                style={{ background: statusCfg.bg, color: statusCfg.text }}>
                <StatusIcon size={12} />
                {statusCfg.label}
              </span>
              {transaction.isFraudulent && (
                <span className="px-3 py-1 rounded-full text-[12px] font-bold bg-red-100 text-red-600 flex items-center gap-1.5">
                  <AlertTriangle size={12} />
                  Flagged
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 text-[13px]">
            <div className="flex items-center gap-1.5">
              <span className="text-text-muted">Reference:</span>
              <code className="font-mono text-green-800">{transaction.reference}</code>
              <button
                onClick={() => copyToClipboard(transaction.reference)}
                className="text-text-muted hover:text-green-700">
                <Copy size={12} />
              </button>
            </div>

            {transaction.paystackReference && (
              <div className="flex items-center gap-1.5">
                <span className="text-text-muted">Paystack Ref:</span>
                <code className="font-mono text-green-800">{transaction.paystackReference}</code>
                <button
                  onClick={() => copyToClipboard(transaction.paystackReference!)}
                  className="text-text-muted hover:text-green-700">
                  <Copy size={12} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onVerify}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-[13px] font-medium text-text-muted hover:bg-cream transition-colors">
            <RefreshCw size={14} />
            Verify
          </button>
        </div>
      </div>
    </div>
  );
}
