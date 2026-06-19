"use client";

import { Shield, AlertTriangle, CheckCircle, Activity } from "lucide-react";
import type { Transaction } from "../../types";

interface Props {
  transaction: Transaction;
}

export function FraudRiskAssessment({ transaction }: Props) {
  // Calculate risk score based on various factors
  const riskFactors = [];
  let riskScore = 0;

  if (transaction.isFraudulent) {
    riskScore += 60;
    riskFactors.push("Marked as fraudulent by admin");
  }

  if (transaction.isDisputed) {
    riskScore += 40;
    riskFactors.push("Customer dispute filed");
  }

  if (transaction.amount > 100000) {
    riskScore += 15;
    riskFactors.push("High transaction amount");
  }

  if (transaction.channel === "ussd") {
    riskScore += 5;
    riskFactors.push("USSD channel has higher risk profile");
  }

  riskScore = Math.min(riskScore, 100);

  const getRiskLevel = (score: number) => {
    if (score >= 70) return { level: "High", color: "text-red-600", bg: "bg-red-50" };
    if (score >= 40) return { level: "Medium", color: "text-amber-600", bg: "bg-amber-50" };
    return { level: "Low", color: "text-green-600", bg: "bg-green-50" };
  };

  const riskLevel = getRiskLevel(riskScore);

  return (
    <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
          <Shield size={20} className="text-purple-600" />
        </div>
        <h3 className="font-serif text-lg text-green-900">Fraud Risk Assessment</h3>
      </div>

      <div className={`p-4 rounded-xl ${riskLevel.bg} mb-4`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-semibold">Risk Score</span>
          <span className={`text-2xl font-bold ${riskLevel.color}`}>{riskScore}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${riskScore}%`,
              background: riskScore >= 70 ? "#ef4444" : riskScore >= 40 ? "#f59e0b" : "#10b981",
            }}
          />
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Activity size={12} className={riskLevel.color} />
          <span className={`text-[12px] font-semibold ${riskLevel.color}`}>
            {riskLevel.level} Risk
          </span>
        </div>
      </div>

      {riskFactors.length > 0 && (
        <div className="space-y-2">
          <div className="text-[12px] font-semibold text-green-900 mb-2">Risk Factors</div>
          {riskFactors.map((factor, i) => (
            <div key={i} className="flex items-center gap-2 text-[12px] text-text-muted">
              <AlertTriangle size={10} className="text-amber-500" />
              <span>{factor}</span>
            </div>
          ))}
        </div>
      )}

      {riskScore < 30 && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50">
          <CheckCircle size={14} className="text-green-600" />
          <span className="text-[12px] text-green-700">
            No significant risk indicators detected
          </span>
        </div>
      )}

      {riskScore >= 70 && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50">
          <AlertTriangle size={14} className="text-red-600 shrink-0 mt-0.5" />
          <div className="text-[12px] text-red-700">
            This transaction requires immediate review. Consider contacting the customer for
            verification.
          </div>
        </div>
      )}
    </div>
  );
}
