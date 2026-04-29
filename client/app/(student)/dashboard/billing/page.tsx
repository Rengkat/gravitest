"use client";

import { useState } from "react";
import CurrentPlanCard from "./components/CurrentPlanCard";
import PlanComparison from "./components/PlanComparison";
import UsageStats from "./components/UsageStats";
import PaymentMethods from "./components/PaymentMethods";
import TransactionHistory from "./components/TransactionHistory";
import { SubscriptionHistory, ContentPurchases } from "./components/HistorySections";
import InvoicesSection from "./components/InvoicesSection";

export default function BillingPage() {
  const [showPlanModal, setShowPlanModal] = useState(false);

  return (
    /* Lives inside the dashboard layout */
    <div className="max-w-5xl mx-auto">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-[24px] font-black text-gray-900">Billing & Subscription</h1>
        <p className="text-[13px] text-gray-500 mt-1">
          Manage your plan, payment methods, transactions, and invoices
        </p>
      </div>

      <div className="space-y-6">
        {/* Current plan */}
        <CurrentPlanCard onUpgrade={() => setShowPlanModal(true)} />

        {/* Usage this billing period */}
        <UsageStats />

        {/* Payment methods */}
        <PaymentMethods />

        {/* Transaction history */}
        <TransactionHistory />

        {/* Subscription timeline */}
        <SubscriptionHistory />

        {/* Content purchases */}
        <ContentPurchases />

        {/* Invoices */}
        <InvoicesSection />
      </div>

      {/* Plan comparison modal */}
      <PlanComparison isOpen={showPlanModal} onClose={() => setShowPlanModal(false)} />
    </div>
  );
}
