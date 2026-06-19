"use client";

import { CreditCard, Building2, Smartphone, Banknote, CheckCircle, XCircle } from "lucide-react";
import type { Transaction } from "../../types";
import { CHANNEL_CONFIG } from "../../constants";
import { fmt } from "../../components/Primitives";

interface Props {
  transaction: Transaction;
}

export function PaymentDetailsCard({ transaction }: Props) {
  const channelCfg = CHANNEL_CONFIG[transaction.channel];
  const ChannelIcon = channelCfg.icon;

  return (
    <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <h3 className="font-serif text-lg text-green-900 mb-4">Payment Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <div className="text-[12px] text-text-muted mb-1">Payment Method</div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-cream/50">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: channelCfg.bg }}>
                <ChannelIcon size={20} style={{ color: channelCfg.color }} />
              </div>
              <div>
                <div className="font-semibold text-green-900">{channelCfg.label}</div>
                <div className="text-[11px] text-text-muted">{transaction.channel}</div>
              </div>
            </div>
          </div>

          {transaction.cardUsed && (
            <div>
              <div className="text-[12px] text-text-muted mb-1">Card Details</div>
              <div className="p-3 rounded-xl bg-gray-50">
                <div className="flex items-center gap-2">
                  <CreditCard size={16} className="text-gray-600" />
                  <span className="font-mono text-[14px] font-semibold">
                    {transaction.cardUsed}
                  </span>
                </div>
              </div>
            </div>
          )}

          {transaction.bankName && (
            <div>
              <div className="text-[12px] text-text-muted mb-1">Bank</div>
              <div className="p-3 rounded-xl bg-gray-50">
                <div className="flex items-center gap-2">
                  <Building2 size={16} className="text-gray-600" />
                  <span className="font-semibold">{transaction.bankName}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-[12px] text-text-muted mb-1">Authorization Status</div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50">
              <CheckCircle size={16} className="text-green-600" />
              <span className="text-[13px] font-semibold text-green-700">Authorized</span>
            </div>
          </div>

          {transaction?.settlementReference && (
            <div>
              <div className="text-[12px] text-text-muted mb-1">Settlement Reference</div>
              <div className="p-3 rounded-xl bg-gray-50">
                <code className="text-[12px] font-mono">{transaction?.settlementReference}</code>
              </div>
            </div>
          )}

          {transaction?.settlementDate && (
            <div>
              <div className="text-[12px] text-text-muted mb-1">Settlement Date</div>
              <div className="p-3 rounded-xl bg-gray-50">
                <span className="text-[13px]">{transaction?.settlementDate}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
