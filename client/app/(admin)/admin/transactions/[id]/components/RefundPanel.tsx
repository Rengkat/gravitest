"use client";

import { useState } from "react";
import { RotateCcw, AlertCircle, CheckCircle } from "lucide-react";
import type { Transaction } from "../../types";
import { fmt } from "../../components/Primitives";
import { REFUND_REASONS } from "../../constants";

interface Props {
  transaction: Transaction;
  onRefund: (amount: number, reason: string) => Promise<void>;
  processing: boolean;
}

export function RefundPanel({ transaction, onRefund, processing }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [reason, setReason] = useState("");
  const [partialRefund, setPartialRefund] = useState(false);

  const canRefund = transaction.status === "paid" && transaction.refundStatus !== "completed";
  const isRefunded = transaction.status === "refunded";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const refundAmount = partialRefund ? parseFloat(amount) : transaction.amount;
    if (refundAmount <= 0 || refundAmount > transaction.amount) return;
    if (!reason) return;

    await onRefund(refundAmount, reason);
    setShowForm(false);
    setAmount(transaction.amount.toString());
    setReason("");
    setPartialRefund(false);
  };

  if (isRefunded) {
    return (
      <div
        className="bg-white rounded-2xl border p-6"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
            <CheckCircle size={20} className="text-green-600" />
          </div>
          <div>
            <h3 className="font-serif text-lg text-green-900">Refunded</h3>
            <p className="text-[12px] text-text-muted">This transaction has been refunded</p>
          </div>
        </div>

        {transaction.refundAmount && (
          <div className="p-3 rounded-xl bg-cream">
            <div className="flex justify-between text-[13px] mb-1">
              <span className="text-text-muted">Refund Amount</span>
              <span className="font-bold text-green-900">{fmt(transaction.refundAmount)}</span>
            </div>
            {transaction.refundReason && (
              <div className="flex justify-between text-[13px]">
                <span className="text-text-muted">Reason</span>
                <span className="text-green-800">{transaction.refundReason}</span>
              </div>
            )}
            {transaction.refundDate && (
              <div className="flex justify-between text-[13px] mt-1">
                <span className="text-text-muted">Date</span>
                <span>{transaction.refundDate}</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  if (!canRefund) return null;

  if (!showForm) {
    return (
      <div
        className="bg-white rounded-2xl border p-6"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg text-green-900">Refund Transaction</h3>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-[13px] font-semibold">
            <RotateCcw size={14} />
            Issue Refund
          </button>
        </div>

        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
          <div className="flex items-start gap-2">
            <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="text-[12px] text-amber-800">
              Refunds are irreversible and will be processed to the original payment method. The
              customer will be notified via email.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <h3 className="font-serif text-lg text-green-900 mb-4">Issue Refund</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              checked={partialRefund}
              onChange={(e) => setPartialRefund(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-[13px] font-medium text-green-900">Partial Refund</span>
          </label>
        </div>

        {partialRefund && (
          <div>
            <label className="block text-[12px] font-semibold text-green-900 mb-2">
              Refund Amount (₦)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              max={transaction.amount}
              min={1}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/30"
            />
            <div className="text-[11px] text-text-muted mt-1">Max: {fmt(transaction.amount)}</div>
          </div>
        )}

        <div>
          <label className="block text-[12px] font-semibold text-green-900 mb-2">
            Refund Reason *
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/30">
            <option value="">Select a reason...</option>
            {REFUND_REASONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-[13px] font-semibold text-text-muted hover:bg-gray-50">
            Cancel
          </button>
          <button
            type="submit"
            disabled={
              processing ||
              (!partialRefund && false) ||
              (partialRefund && (!amount || parseFloat(amount) <= 0))
            }
            className="flex-1 px-4 py-2 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 disabled:opacity-50 text-[13px]">
            {processing ? "Processing..." : "Confirm Refund"}
          </button>
        </div>
      </form>
    </div>
  );
}
