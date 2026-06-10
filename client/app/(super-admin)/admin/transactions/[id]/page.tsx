// app/admin/transactions/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MoreVertical, Bell, Shield, FileText } from "lucide-react";
import { useTransactionDetails } from "./useTransactionDetails";
import { TransactionHeader } from "./components/TransactionHeader";
import { TransactionOverview } from "./components/TransactionOverview";
import { PaymentDetailsCard } from "./components/PaymentDetailsCard";
import { CustomerInfoCard } from "./components/CustomerInfoCard";
import { TransactionTimeline } from "./components/TransactionTimeline";
import { RefundPanel } from "./components/RefundPanel";
import { FraudRiskAssessment } from "./components/FraudRiskAssessment";
import { RelatedTransactions } from "./components/RelatedTransactions";
import { ActivityLog } from "./components/ActivityLog";
import { ActionButtons } from "./components/ActionButtons";
import { LoadingSpinner } from "./components/LoadingSpinner";
// import { toast } from "sonner";

export default function TransactionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const transactionId = params.id as string;

  const {
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
  } = useTransactionDetails(transactionId);

  if (loading) {
    return <LoadingSpinner text="Loading transaction details..." />;
  }

  if (!transaction) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="rounded-2xl bg-red-50 border border-red-200 p-8">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Transaction Not Found</h2>
          <p className="text-red-600 mb-4">
            The transaction you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push("/admin/transactions")}
            className="px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-700">
            Back to Transactions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-text-muted hover:text-green-800 transition-colors">
          <ArrowLeft size={20} />
          <span className="text-[14px] font-medium">Back to Transactions</span>
        </button>

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-cream transition-colors">
            <Bell size={18} className="text-text-muted" />
          </button>
          <button className="p-2 rounded-lg hover:bg-cream transition-colors">
            <Shield size={18} className="text-text-muted" />
          </button>
          <button className="p-2 rounded-lg hover:bg-cream transition-colors">
            <FileText size={18} className="text-text-muted" />
          </button>
          <button className="p-2 rounded-lg hover:bg-cream transition-colors">
            <MoreVertical size={18} className="text-text-muted" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <TransactionHeader
            transaction={transaction}
            onVerify={() => verifyTransaction(transaction.id)}
          />

          <TransactionOverview transaction={transaction} />

          <PaymentDetailsCard transaction={transaction} />

          <TransactionTimeline
            transaction={transaction}
            webhookAttempts={transaction.webhookAttempts}
          />

          <RelatedTransactions
            transactions={relatedTransactions}
            currentTransactionId={transaction.id}
          />
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          <ActionButtons
            transaction={transaction}
            processingAction={processingAction}
            onRefund={() => {}} // Will be handled by RefundPanel
            onFlag={() => flagTransaction(transaction.id)}
            onRetryWebhook={() => retryWebhook(transaction.id)}
            onSendReceipt={() => sendReceipt(transaction.id)}
          />

          <CustomerInfoCard transaction={transaction} />

          <FraudRiskAssessment transaction={transaction} />

          <RefundPanel
            transaction={transaction}
            onRefund={processRefund}
            processing={processingAction}
          />

          <ActivityLog entries={activityLog} transactionId={transaction.id} />
        </div>
      </div>
    </div>
  );
}
