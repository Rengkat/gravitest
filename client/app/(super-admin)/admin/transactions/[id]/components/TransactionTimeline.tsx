"use client";

import { CheckCircle, Clock, Send, RefreshCw, AlertCircle } from "lucide-react";
import type { Transaction, WebhookAttempt } from "../types";

interface Props {
  transaction: Transaction;
  webhookAttempts?: WebhookAttempt[];
}

export function TransactionTimeline({ transaction, webhookAttempts = [] }: Props) {
  const events = [
    {
      id: "initiated",
      title: "Transaction Initiated",
      timestamp: transaction.date,
      status: "completed",
      icon: Clock,
      description: "Payment process started",
    },
    {
      id: "authorized",
      title: "Payment Authorized",
      timestamp: transaction.date,
      status: transaction.status === "paid" ? "completed" : "pending",
      icon: CheckCircle,
      description: "Payment authorized by customer",
    },
    {
      id: "settled",
      title: "Settlement",
      timestamp: transaction.settlementDate,
      status: transaction.settlementDate ? "completed" : "pending",
      icon: Send,
      description: transaction.settlementDate
        ? `Settled on ${transaction.settlementDate}`
        : "Awaiting settlement",
    },
    {
      id: "webhook",
      title: "Webhook Delivery",
      timestamp: webhookAttempts[0]?.timestamp,
      status: webhookAttempts.some((w) => w.status === "success") ? "completed" : "failed",
      icon: RefreshCw,
      description:
        webhookAttempts.length > 0
          ? `${webhookAttempts.length} attempt(s) made`
          : "Webhook pending",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <h3 className="font-serif text-lg text-green-900 mb-4">Transaction Timeline</h3>

      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200"></div>

        <div className="space-y-6">
          {events.map((event, index) => {
            const Icon = event.icon;
            const isCompleted = event.status === "completed";

            return (
              <div key={event.id} className="relative flex gap-4">
                <div
                  className={`
                  w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10
                  ${isCompleted ? "bg-green-100" : "bg-gray-100"}
                `}>
                  <Icon size={16} className={isCompleted ? "text-green-600" : "text-gray-400"} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-[14px] font-semibold text-green-900">{event.title}</h4>
                    {event.timestamp && (
                      <span className="text-[11px] text-text-muted">
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-text-muted">{event.description}</p>

                  {event.id === "webhook" && webhookAttempts.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {webhookAttempts.map((attempt, i) => (
                        <div key={attempt.id} className="flex items-center gap-2 text-[11px]">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              attempt.status === "success" ? "bg-green-500" : "bg-red-500"
                            }`}
                          />
                          <span className="text-text-muted">Attempt {i + 1}:</span>
                          <span
                            className={
                              attempt.status === "success" ? "text-green-600" : "text-red-600"
                            }>
                            {attempt.status}
                          </span>
                          <span className="text-text-muted">- {attempt.responseCode}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
