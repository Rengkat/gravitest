"use client";

import Link from "next/link";
import { ArrowRight, DollarSign } from "lucide-react";
import type { Transaction } from "../../types";
import { fmt } from "../../components/Primitives";

interface Props {
  transactions: Transaction[];
  currentTransactionId: string;
}

export function RelatedTransactions({ transactions, currentTransactionId }: Props) {
  if (transactions.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <h3 className="font-serif text-lg text-green-900 mb-4">Related Transactions</h3>

      <div className="space-y-3">
        {transactions.map((tx) => (
          <Link
            key={tx.id}
            href={`/admin/transactions/${tx.id}`}
            className="block p-4 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-cream/20 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <code className="text-[11px] font-mono text-text-muted">{tx.reference}</code>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-semibold ${
                      tx.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                    {tx.status}
                  </span>
                </div>
                <div className="text-[13px] font-semibold text-green-900">{fmt(tx.amount)}</div>
                <div className="text-[11px] text-text-muted">{tx.date}</div>
              </div>
              <ArrowRight size={16} className="text-text-muted" />
            </div>
          </Link>
        ))}
      </div>

      {transactions.length > 3 && (
        <Link
          href={`/admin/transactions?userId=${transactions[0].userId}`}
          className="block text-center mt-4 text-[13px] text-green-700 hover:underline">
          View all customer transactions →
        </Link>
      )}
    </div>
  );
}
