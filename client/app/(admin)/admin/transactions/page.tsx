"use client";

import { useState } from "react";
import {
  DollarSign,
  RotateCcw,
  CreditCard,
  TrendingUp,
  Download,
  RefreshCw,
  BarChart3,
  List,
  Layers,
  Receipt,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { useTransactions } from "./useTransactions";
import { SearchFilterBar } from "./components/SearchFilterBar";
import { TransactionRow } from "./components/TransactionRow";
import { TransactionDetailModal } from "./components/TransactionDetailModal";
import { SubscriptionsTable } from "./components/SubscriptionsTable";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { BulkActionsBar } from "./components/BulkActionsBar";
import { MiniStatCard, Pagination, fmt } from "./components/Primitives";
import type { Transaction, ViewMode } from "./types";

export default function AdminTransactionsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("transactions");
  const [showFilters, setShowFilters] = useState(false);
  const [detailTx, setDetailTx] = useState<Transaction | null>(null);

  const {
    subscriptions,
    revenueStats,
    loading,
    statsLoading,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    setFilter,
    activeFilterCount,
    clearFilters,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    currentPage,
    setCurrentPage,
    paginatedTransactions,
    totalPages,
    filteredTransactions,
    filteredTotals,
    selectedIds,
    toggleSelect,
    selectAll,
    clearSelection,
    handleRefund,
    handleFlagFraud,
    exportFiltered,
    exportSelected,
  } = useTransactions();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw size={24} className="animate-spin text-green-800" />
        <span className="ml-3 text-text-muted text-[14px]">Loading transactions…</span>
      </div>
    );
  }

  const VIEW_TABS: { mode: ViewMode; Icon: any; label: string }[] = [
    { mode: "transactions", Icon: List, label: "Transactions" },
    { mode: "subscriptions", Icon: Layers, label: "Subscriptions" },
    { mode: "analytics", Icon: BarChart3, label: "Analytics" },
    { mode: "refunds", Icon: RotateCcw, label: "Refunds" },
  ];

  const refundedTxs = filteredTransactions.filter((t) => t.status === "refunded");

  return (
    <div className="max-w-7xl mx-auto">
      {/* ─── PAGE HEADER ─── */}
      <div className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-serif text-3xl text-green-900 mb-2">Transaction Management</h1>
            <p className="text-text-muted">
              Monitor payments, subscriptions, refunds and revenue analytics.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={exportFiltered}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-cream transition-all text-[14px] font-medium text-text-muted">
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>

        {/* View tabs */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          {VIEW_TABS.map(({ mode, Icon, label }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all flex items-center gap-2 ${
                viewMode === mode
                  ? "bg-green-800 text-white"
                  : "bg-white border border-gray-200 text-text-muted hover:bg-cream"
              }`}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── ANALYTICS ─── */}
      {viewMode === "analytics" && revenueStats && <AnalyticsDashboard stats={revenueStats} />}

      {/* ─── SUBSCRIPTIONS ─── */}
      {viewMode === "subscriptions" && <SubscriptionsTable subscriptions={subscriptions} />}

      {/* ─── REFUNDS TAB ─── */}
      {viewMode === "refunds" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <MiniStatCard
              icon={RotateCcw}
              label="Total Refunds"
              value={fmt(filteredTotals.refunds)}
              color="#f59e0b"
            />
            <MiniStatCard
              icon={Receipt}
              label="Refund Count"
              value={refundedTxs.length}
              color="#ef4444"
            />
            <MiniStatCard
              icon={AlertTriangle}
              label="Disputed"
              value={filteredTotals.disputed}
              color="#8b5cf6"
            />
            <MiniStatCard
              icon={CheckCircle}
              label="Refund Rate"
              value={`${filteredTransactions.length > 0 ? ((refundedTxs.length / filteredTransactions.length) * 100).toFixed(1) : 0}%`}
              color="#3b82f6"
            />
          </div>
          {refundedTxs.map((tx) => (
            <TransactionRow
              key={tx.id}
              tx={tx}
              isSelected={selectedIds.has(tx.id)}
              onToggleSelect={toggleSelect}
              onRefund={() => setDetailTx(tx)}
              onFlag={handleFlagFraud}
            />
          ))}
          {refundedTxs.length === 0 && (
            <div className="text-center py-16 text-text-muted text-[14px]">
              No refunded transactions found.
            </div>
          )}
        </div>
      )}

      {/* ─── TRANSACTIONS LIST ─── */}
      {viewMode === "transactions" && (
        <>
          {/* Filtered totals bar */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            <MiniStatCard
              icon={DollarSign}
              label="Revenue"
              value={`₦${(filteredTotals.revenue / 1000000).toFixed(2)}M`}
              color="#2e8b57"
            />
            <MiniStatCard
              icon={TrendingUp}
              label="Net"
              value={`₦${(filteredTotals.net / 1000000).toFixed(2)}M`}
              color="#10b981"
            />
            <MiniStatCard
              icon={CreditCard}
              label="Fees"
              value={fmt(filteredTotals.fees)}
              color="#f59e0b"
            />
            <MiniStatCard
              icon={RotateCcw}
              label="Refunds"
              value={fmt(filteredTotals.refunds)}
              color="#ef4444"
            />
            <MiniStatCard
              icon={XCircle}
              label="Failed"
              value={filteredTotals.failed}
              color="#6b7280"
            />
            <MiniStatCard
              icon={AlertTriangle}
              label="Disputed"
              value={filteredTotals.disputed}
              color="#8b5cf6"
            />
          </div>

          <SearchFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filters={filters}
            setFilter={setFilter}
            activeFilterCount={activeFilterCount}
            clearFilters={clearFilters}
            sortField={sortField}
            setSortField={setSortField}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            resultCount={filteredTransactions.length}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />

          {/* Select-all row */}
          {paginatedTransactions.length > 0 && (
            <div className="flex items-center gap-3 mb-3 text-[13px] text-text-muted">
              <input
                title="transaction"
                type="checkbox"
                checked={
                  selectedIds.size === paginatedTransactions.length &&
                  paginatedTransactions.length > 0
                }
                onChange={() =>
                  selectedIds.size === paginatedTransactions.length ? clearSelection() : selectAll()
                }
                className="w-4 h-4 rounded border-gray-300 text-green-800"
              />
              <span>
                {selectedIds.size > 0 ? `${selectedIds.size} selected` : "Select all on this page"}
              </span>
            </div>
          )}

          {selectedIds.size > 0 && (
            <BulkActionsBar
              count={selectedIds.size}
              onRefundAll={clearSelection}
              onExport={exportSelected}
              onFlagAll={clearSelection}
              onClear={clearSelection}
            />
          )}

          <div className="space-y-3">
            {paginatedTransactions.map((tx) => (
              <TransactionRow
                key={tx.id}
                tx={tx}
                isSelected={selectedIds.has(tx.id)}
                onToggleSelect={toggleSelect}
                onRefund={() => setDetailTx(tx)}
                onFlag={handleFlagFraud}
              />
            ))}
          </div>

          {paginatedTransactions.length === 0 && (
            <div className="text-center py-16 text-text-muted text-[14px]">
              No transactions match your filters.
            </div>
          )}

          <Pagination currentPage={currentPage} totalPages={totalPages} onChange={setCurrentPage} />
        </>
      )}

      {/* ─── DETAIL MODAL ─── */}
      {detailTx && (
        <TransactionDetailModal
          tx={detailTx}
          onClose={() => setDetailTx(null)}
          onRefund={handleRefund}
          onFlag={handleFlagFraud}
        />
      )}
    </div>
  );
}
