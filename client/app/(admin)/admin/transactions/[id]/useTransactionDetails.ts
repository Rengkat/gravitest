"use client";

import { useState, useEffect, useCallback } from "react";
// import { toast } from "sonner";
import type { Transaction, TransactionDetails, ActivityLogEntry } from "../types";
import {
  fetchTransactionById,
  fetchRelatedTransactions,
  fetchActivityLog,
  processRefundApi,
  flagTransactionApi,
  retryWebhookApi,
  sendReceiptApi,
  verifyTransactionApi,
} from "./api";

export function useTransactionDetails(transactionId: string) {
  const [transaction, setTransaction] = useState<TransactionDetails | null>(null);
  const [relatedTransactions, setRelatedTransactions] = useState<Transaction[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingAction, setProcessingAction] = useState(false);

  // Load all data
  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        setLoading(true);
        const [txData, relatedData, logData] = await Promise.all([
          fetchTransactionById(transactionId),
          fetchRelatedTransactions(transactionId),
          fetchActivityLog(transactionId),
        ]);

        if (!cancelled) {
          setTransaction(txData);
          setRelatedTransactions(relatedData);
          setActivityLog(logData);
        }
      } catch (error) {
        console.error("Failed to load transaction details:", error);
        // toast.error("Failed to load transaction details");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadData();
    return () => {
      cancelled = true;
    };
  }, [transactionId]);

  // Process refund
  const processRefund = useCallback(
    async (amount: number, reason: string) => {
      setProcessingAction(true);
      try {
        const result = await processRefundApi(transactionId, { amount, reason });
        if (result.success) {
          setTransaction((prev) =>
            prev
              ? {
                  ...prev,
                  status: "refunded",
                  refundStatus: "completed",
                  refundAmount: amount,
                  refundDate: new Date().toISOString(),
                  refundReason: reason,
                }
              : null,
          );
          // toast.success(`Refund of ₦${amount.toLocaleString()} processed successfully`);
          // Add to activity log
          setActivityLog((prev) => [
            {
              id: crypto.randomUUID(),
              action: "refund_processed",
              user: "Admin",
              timestamp: new Date().toISOString(),
              details: { amount, reason },
            },
            ...prev,
          ]);
        }
        return result;
      } catch (error) {
        // toast.error("Failed to process refund");
        throw error;
      } finally {
        setProcessingAction(false);
      }
    },
    [transactionId],
  );

  // Flag transaction
  const flagTransaction = useCallback(
    async (flagged: boolean) => {
      setProcessingAction(true);
      try {
        await flagTransactionApi(transactionId, flagged);
        setTransaction((prev) =>
          prev
            ? {
                ...prev,
                isFraudulent: flagged,
                fraudReason: flagged ? "Manual flag by admin" : undefined,
              }
            : null,
        );
        // toast.success(flagged ? "Transaction flagged for review" : "Flag removed");

        setActivityLog((prev) => [
          {
            id: crypto.randomUUID(),
            action: flagged ? "fraud_flag_added" : "fraud_flag_removed",
            user: "Admin",
            timestamp: new Date().toISOString(),
            details: {},
          },
          ...prev,
        ]);
      } catch (error) {
        // toast.error("Failed to update flag status");
      } finally {
        setProcessingAction(false);
      }
    },
    [transactionId],
  );

  // Retry webhook
  const retryWebhook = useCallback(async () => {
    setProcessingAction(true);
    try {
      const result = await retryWebhookApi(transactionId);
      if (result.success) {
        // toast.success("Webhook retry queued successfully");
        // Refresh webhook attempts
        const updatedTx = await fetchTransactionById(transactionId);
        setTransaction(updatedTx);
      }
    } catch (error) {
      // toast.error("Failed to retry webhook");
    } finally {
      setProcessingAction(false);
    }
  }, [transactionId]);

  // Send receipt
  const sendReceipt = useCallback(async () => {
    setProcessingAction(true);
    try {
      await sendReceiptApi(transactionId);
      // toast.success("Receipt sent to customer email");

      setActivityLog((prev) => [
        {
          id: crypto.randomUUID(),
          action: "receipt_sent",
          user: "Admin",
          timestamp: new Date().toISOString(),
          details: { email: transaction?.userEmail },
        },
        ...prev,
      ]);
    } catch (error) {
      // toast.error("Failed to send receipt");
    } finally {
      setProcessingAction(false);
    }
  }, [transactionId, transaction?.userEmail]);

  // Verify transaction
  const verifyTransaction = useCallback(async () => {
    setProcessingAction(true);
    try {
      const result = await verifyTransactionApi(transactionId);
      if (result.verified) {
        // toast.success("Transaction verified successfully");
        const updatedTx = await fetchTransactionById(transactionId);
        setTransaction(updatedTx);
      } else {
        // toast.warning("Transaction verification failed");
      }
    } catch (error) {
      // toast.error("Failed to verify transaction");
    } finally {
      setProcessingAction(false);
    }
  }, [transactionId]);

  return {
    transaction,
    relatedTransactions,
    activityLog,
    loading,
    processingAction,
    processRefund,
    flagTransaction,
    retryWebhook,
    sendReceipt,
    verifyTransaction,
  };
}
