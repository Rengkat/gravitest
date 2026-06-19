"use client";

import { User, Mail, Briefcase, MapPin, Globe, Smartphone } from "lucide-react";
import type { Transaction } from "../../types";
import { USER_ROLE_CONFIG } from "../../constants";

interface Props {
  transaction: Transaction;
}

export function CustomerInfoCard({ transaction }: Props) {
  const roleCfg = USER_ROLE_CONFIG[transaction.userRole];
  const RoleIcon = roleCfg.icon;

  return (
    <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <h3 className="font-serif text-lg text-green-900 mb-4">Customer Information</h3>

      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-full bg-cream/50">
          {/* <div className="w-12 h-12 rounded-full bg-green-800 text-white flex items-center justify-center font-bold text-lg">
            {transaction.userName.charAt(0)}
          </div> */}
          <div className="flex-1">
            <div className="font-semibold text-green-900">{transaction.userName}</div>
            <div className="text-[12px] text-text-muted">{transaction.userEmail}</div>
          </div>
          <div
            className="px-2 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1"
            style={{ background: roleCfg.bg, color: roleCfg.color }}>
            <RoleIcon size={10} />
            {roleCfg.label}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-[13px]">
          <div className="flex items-center gap-2">
            <User size={14} className="text-text-muted" />
            <span>ID: {transaction.userId}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-text-muted" />
            <a href={`mailto:${transaction.userEmail}`} className="text-green-700 hover:underline">
              Send Email
            </a>
          </div>
          {transaction.location && (
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-text-muted" />
              <span>{transaction.location}</span>
            </div>
          )}
          {transaction.ipAddress && (
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-text-muted" />
              <span className="font-mono text-[12px]">{transaction.ipAddress}</span>
            </div>
          )}
          {transaction.deviceInfo && (
            <div className="flex items-center gap-2 col-span-2">
              <Smartphone size={14} className="text-text-muted" />
              <span className="text-[12px]">{transaction.deviceInfo}</span>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-gray-100">
          <div className="flex justify-between text-[12px]">
            <span className="text-text-muted">Customer since</span>
            <span className="font-semibold text-green-900">2024</span>
          </div>
          <div className="flex justify-between text-[12px] mt-1">
            <span className="text-text-muted">Total spent</span>
            <span className="font-semibold text-green-900">₦--</span>
          </div>
        </div>
      </div>
    </div>
  );
}
