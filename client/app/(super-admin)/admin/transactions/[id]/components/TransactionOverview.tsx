"use client";

import { DollarSign, TrendingUp, TrendingDown, Calendar, Hash } from "lucide-react";
import type { Transaction } from "../../types";
import { fmt } from "../../components/Primitives";

interface Props {
  transaction: Transaction;
}

export function TransactionOverview({ transaction }: Props) {
  return (
    <div className="bg-gradient-to-r from-green-900 to-green-800 rounded-2xl p-6 text-white">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <div className="text-[13px] text-white/70 mb-1">Total Amount</div>
          <div className="text-3xl font-bold">{fmt(transaction.amount)}</div>
          <div className="text-[11px] text-white/50 mt-1">Gross revenue</div>
        </div>

        <div>
          <div className="text-[13px] text-white/70 mb-1">Net Amount</div>
          <div className="text-2xl font-semibold">{fmt(transaction.netAmount)}</div>
          <div className="text-[11px] text-white/50 mt-1">After {fmt(transaction.fee)} fee</div>
        </div>

        <div>
          <div className="text-[13px] text-white/70 mb-1">Fee Amount</div>
          <div className="flex items-center gap-2">
            <TrendingDown size={16} className="text-amber-300" />
            <span className="text-2xl font-semibold">{fmt(transaction.fee)}</span>
          </div>
          <div className="text-[11px] text-white/50 mt-1">
            {((transaction.fee / transaction.amount) * 100).toFixed(2)}% of transaction
          </div>
        </div>

        <div>
          <div className="text-[13px] text-white/70 mb-1">Transaction Date</div>
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span className="text-lg font-semibold">{transaction.date}</span>
          </div>
          <div className="text-[11px] text-white/50 mt-1">
            {new Date(transaction.date).toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/20 flex justify-between text-[12px]">
        <div>
          <span className="text-white/70">Revenue Type:</span>
          <span className="ml-2 font-semibold capitalize">{transaction.revenueType}</span>
        </div>
        {transaction.planType && (
          <div>
            <span className="text-white/70">Plan:</span>
            <span className="ml-2 font-semibold capitalize">{transaction.planType}</span>
          </div>
        )}
        <div>
          <span className="text-white/70">Channel:</span>
          <span className="ml-2 font-semibold">{transaction.channel}</span>
        </div>
      </div>
    </div>
  );
}
