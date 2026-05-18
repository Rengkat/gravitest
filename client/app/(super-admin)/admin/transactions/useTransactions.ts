"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type {
  Transaction,
  Subscription,
  RevenueStats,
  TxFilters,
  SortField,
  TransactionStatus,
} from "./types";
import {
  fetchTransactions,
  fetchSubscriptions,
  fetchRevenueStats,
  processRefund,
  flagTransaction,
  buildExportCsv,
  downloadCsv,
} from "./api";

const ITEMS_PER_PAGE = 25;

const DEFAULT_FILTERS: TxFilters = {
  status: "",
  channel: "",
  revenueType: "",
  planType: "",
  userRole: "",
  dateFrom: "",
  dateTo: "",
  minAmount: "",
  maxAmount: "",
  isFraudulent: "",
  isDisputed: "",
};

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [revenueStats, setRevenueStats] = useState<RevenueStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<TxFilters>(DEFAULT_FILTERS);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Load all data in parallel
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setStatsLoading(true);

    Promise.all([fetchTransactions(), fetchSubscriptions(), fetchRevenueStats()]).then(
      ([txRes, subRes, statsRes]) => {
        if (cancelled) return;
        setTransactions(txRes.data);
        setSubscriptions(subRes.data);
        setRevenueStats(statsRes.data);
        setLoading(false);
        setStatsLoading(false);
      },
    );

    return () => {
      cancelled = true;
    };
  }, []);

  // ─── FILTERING + SORTING ─────────────────────────────────
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          if (
            !t.userName.toLowerCase().includes(q) &&
            !t.userEmail.toLowerCase().includes(q) &&
            !t.reference.toLowerCase().includes(q) &&
            !t.description.toLowerCase().includes(q) &&
            !(t.paystackReference ?? "").toLowerCase().includes(q)
          )
            return false;
        }
        if (filters.status && t.status !== filters.status) return false;
        if (filters.channel && t.channel !== filters.channel) return false;
        if (filters.revenueType && t.revenueType !== filters.revenueType) return false;
        if (filters.planType && t.planType !== filters.planType) return false;
        if (filters.userRole && t.userRole !== filters.userRole) return false;
        if (filters.dateFrom && t.date < filters.dateFrom) return false;
        if (filters.dateTo && t.date > filters.dateTo) return false;
        if (filters.minAmount && t.amount < parseFloat(filters.minAmount)) return false;
        if (filters.maxAmount && t.amount > parseFloat(filters.maxAmount)) return false;
        if (filters.isFraudulent === "true" && !t.isFraudulent) return false;
        if (filters.isFraudulent === "false" && t.isFraudulent) return false;
        if (filters.isDisputed === "true" && !t.isDisputed) return false;
        return true;
      })
      .sort((a, b) => {
        let cmp = 0;
        switch (sortField) {
          case "date":
            cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
            break;
          case "amount":
            cmp = a.amount - b.amount;
            break;
          case "netAmount":
            cmp = a.netAmount - b.netAmount;
            break;
          case "fee":
            cmp = a.fee - b.fee;
            break;
          case "status":
            cmp = a.status.localeCompare(b.status);
            break;
        }
        return sortDirection === "asc" ? cmp : -cmp;
      });
  }, [transactions, searchQuery, filters, sortField, sortDirection]);

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  // Quick totals from filtered set
  const filteredTotals = useMemo(
    () => ({
      revenue: filteredTransactions
        .filter((t) => t.status === "paid")
        .reduce((s, t) => s + t.amount, 0),
      fees: filteredTransactions.filter((t) => t.status === "paid").reduce((s, t) => s + t.fee, 0),
      net: filteredTransactions
        .filter((t) => t.status === "paid")
        .reduce((s, t) => s + t.netAmount, 0),
      refunds: filteredTransactions
        .filter((t) => t.status === "refunded")
        .reduce((s, t) => s + t.amount, 0),
      failed: filteredTransactions.filter((t) => t.status === "failed").length,
      disputed: filteredTransactions.filter((t) => t.isDisputed).length,
    }),
    [filteredTransactions],
  );

  // ─── ASYNC HANDLERS ──────────────────────────────────────
  const handleRefund = useCallback(async (txId: string, amount?: number, reason?: string) => {
    const res = await processRefund({
      transactionId: txId,
      amount,
      reason: reason ?? "Admin initiated",
    });
    if (res.data.success) {
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === txId
            ? {
                ...t,
                status: "refunded",
                refundStatus: "completed",
                refundAmount: amount ?? t.amount,
                refundDate: new Date().toISOString().split("T")[0],
              }
            : t,
        ),
      );
    }
    return res.data;
  }, []);

  const handleFlagFraud = useCallback(
    async (txId: string) => {
      const tx = transactions.find((t) => t.id === txId);
      if (!tx) return;
      await flagTransaction(txId, !tx.isFraudulent);
      setTransactions((prev) =>
        prev.map((t) => (t.id === txId ? { ...t, isFraudulent: !t.isFraudulent } : t)),
      );
    },
    [transactions],
  );

  // ─── SELECTION ───────────────────────────────────────────
  const toggleSelect = (id: string) =>
    setSelectedIds((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const selectAll = () => setSelectedIds(new Set(paginatedTransactions.map((t) => t.id)));
  const clearSelection = () => setSelectedIds(new Set());

  // ─── EXPORT ──────────────────────────────────────────────
  const exportFiltered = () => {
    const csv = buildExportCsv(filteredTransactions);
    downloadCsv(csv, `transactions_${new Date().toISOString().split("T")[0]}.csv`);
  };

  const exportSelected = () => {
    const subset = transactions.filter((t) => selectedIds.has(t.id));
    const csv = buildExportCsv(subset);
    downloadCsv(csv, `transactions_selected_${new Date().toISOString().split("T")[0]}.csv`);
  };

  // ─── FILTER HELPERS ──────────────────────────────────────
  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery("");
    setCurrentPage(1);
  };
  const setFilter = <K extends keyof TxFilters>(key: K, value: TxFilters[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  return {
    transactions,
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
  };
}
