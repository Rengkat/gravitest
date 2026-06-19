"use client";

import { Search, Filter, FilterX } from "lucide-react";
import type {
  TxFilters,
  TransactionStatus,
  PaymentChannel,
  RevenueType,
  PlanType,
  SortField,
} from "../types";
import { TX_STATUS_CONFIG, CHANNEL_CONFIG, REVENUE_TYPE_CONFIG, PLAN_CONFIG } from "../constants";
import { FilterSelect } from "./Primitives";

interface Props {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  filters: TxFilters;
  setFilter: <K extends keyof TxFilters>(k: K, v: TxFilters[K]) => void;
  activeFilterCount: number;
  clearFilters: () => void;
  sortField: SortField;
  setSortField: (f: SortField) => void;
  sortDirection: "asc" | "desc";
  setSortDirection: (d: "asc" | "desc") => void;
  resultCount: number;
  showFilters: boolean;
  setShowFilters: (v: boolean) => void;
}

export function SearchFilterBar({
  searchQuery,
  setSearchQuery,
  filters,
  setFilter,
  activeFilterCount,
  clearFilters,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  resultCount,
  showFilters,
  setShowFilters,
}: Props) {
  return (
    <div
      className="bg-white rounded-2xl border p-4 mb-6"
      style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name, email, reference, or description…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all text-[14px] font-medium ${
              showFilters || activeFilterCount > 0
                ? "bg-green-800 text-white border-green-800"
                : "bg-white text-text-muted border-gray-200 hover:border-green-800/30"
            }`}>
            <Filter size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-yellow-400 text-green-900 text-[11px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-all text-[14px] font-medium">
              <FilterX size={16} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Status quick-chips */}
      <div className="flex items-center gap-2 mt-4 flex-wrap">
        <button
          onClick={() => setFilter("status", "")}
          className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${filters.status === "" ? "bg-green-800 text-white" : "bg-cream text-text-muted hover:bg-gray-100"}`}>
          All
        </button>
        {(
          Object.entries(TX_STATUS_CONFIG) as [
            TransactionStatus,
            (typeof TX_STATUS_CONFIG)[TransactionStatus],
          ][]
        ).map(([s, cfg]) => {
          const Icon = cfg.icon;
          return (
            <button
              key={s}
              onClick={() => setFilter("status", s)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${filters.status === s ? "text-white" : "text-text-muted hover:bg-gray-100"}`}
              style={filters.status === s ? { background: cfg.text } : { background: cfg.bg }}>
              <Icon size={12} style={{ color: filters.status === s ? "#fff" : cfg.text }} />
              {cfg.label}
            </button>
          );
        })}
      </div>

      {showFilters && (
        <div
          className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-4"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <FilterSelect
            label="Channel"
            value={filters.channel}
            onChange={(v) => setFilter("channel", v as PaymentChannel)}
            options={[
              { value: "", label: "All Channels" },
              ...Object.entries(CHANNEL_CONFIG).map(([k, c]) => ({ value: k, label: c.label })),
            ]}
          />
          <FilterSelect
            label="Revenue Type"
            value={filters.revenueType}
            onChange={(v) => setFilter("revenueType", v as RevenueType)}
            options={[
              { value: "", label: "All Types" },
              ...Object.entries(REVENUE_TYPE_CONFIG).map(([k, c]) => ({
                value: k,
                label: c.label,
              })),
            ]}
          />
          <FilterSelect
            label="Plan"
            value={filters.planType}
            onChange={(v) => setFilter("planType", v as PlanType)}
            options={[
              { value: "", label: "All Plans" },
              ...Object.entries(PLAN_CONFIG).map(([k, c]) => ({ value: k, label: c.label })),
            ]}
          />
          <FilterSelect
            label="User Role"
            value={filters.userRole}
            onChange={(v) => setFilter("userRole", v)}
            options={[
              { value: "", label: "All Roles" },
              { value: "student", label: "Student" },
              { value: "tutor", label: "Tutor" },
              { value: "school_admin", label: "School Admin" },
            ]}
          />
          <div>
            <label className="block text-[12px] font-semibold text-green-900 mb-2">Date From</label>
            <input
              title="date form"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilter("dateFrom", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-500/30"
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-green-900 mb-2">Date To</label>
            <input
              title="date to"
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilter("dateTo", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-500/30"
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-green-900 mb-2">
              Min Amount (₦)
            </label>
            <input
              type="number"
              value={filters.minAmount}
              onChange={(e) => setFilter("minAmount", e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-500/30"
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-green-900 mb-2">
              Max Amount (₦)
            </label>
            <input
              type="number"
              value={filters.maxAmount}
              onChange={(e) => setFilter("maxAmount", e.target.value)}
              placeholder="Any"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-500/30"
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-4">
        <span className="text-[13px] text-text-muted">
          Showing{" "}
          <span className="font-semibold text-green-900">{resultCount.toLocaleString()}</span>{" "}
          transactions
        </span>
        <div className="flex items-center gap-2">
          <select
            title="sort filed"
            value={sortField}
            onChange={(e) => setSortField(e.target.value as SortField)}
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-[13px] text-text-muted focus:outline-none">
            <option value="date">Sort: Date</option>
            <option value="amount">Sort: Amount</option>
            <option value="netAmount">Sort: Net Amount</option>
            <option value="fee">Sort: Fee</option>
            <option value="status">Sort: Status</option>
          </select>
          <button
            onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-[13px] text-text-muted hover:bg-cream">
            {sortDirection === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>
    </div>
  );
}
