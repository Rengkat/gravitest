"use client";

import { Search, Filter, X, ArrowUpDown } from "lucide-react";
import type {
  SchoolFilters,
  SchoolType,
  SchoolStatus,
  SubscriptionPlan,
  SortField,
} from "@/types/schoolsTypes";
import {
  SCHOOL_TYPES,
  STATUS_MAP,
  SUBSCRIPTION_PLANS,
  NIGERIAN_STATES,
} from "@/lib/constants/schools";

interface Props {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  filters: SchoolFilters;
  setFilters: (f: SchoolFilters) => void;
  activeFilterCount: number;
  clearFilters: () => void;
  sortField: SortField;
  setSortField: (f: SortField) => void;
  resultCount: number;
  showFilters: boolean;
  setShowFilters: (v: boolean) => void;
}

export function SearchFilterBar({
  searchQuery,
  setSearchQuery,
  filters,
  setFilters,
  activeFilterCount,
  clearFilters,
  sortField,
  setSortField,
  resultCount,
  showFilters,
  setShowFilters,
}: Props) {
  const update = (key: keyof SchoolFilters, value: string) =>
    setFilters({ ...filters, [key]: value });

  return (
    <div
      className="bg-white rounded-2xl border p-4 mb-6"
      style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      {/* Top row */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search schools by name, code, state, city, or email..."
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
              <X size={16} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div
          className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-4"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <FilterSelect
            label="School Type"
            value={filters.type}
            onChange={(v) => update("type", v)}
            options={[
              { value: "", label: "All Types" },
              ...Object.entries(SCHOOL_TYPES).map(([k, c]) => ({ value: k, label: c.label })),
            ]}
          />
          <FilterSelect
            label="Status"
            value={filters.status}
            onChange={(v) => update("status", v)}
            options={[
              { value: "", label: "All Statuses" },
              ...Object.entries(STATUS_MAP).map(([k, c]) => ({ value: k, label: c.label })),
            ]}
          />
          <FilterSelect
            label="State"
            value={filters.state}
            onChange={(v) => update("state", v)}
            options={[
              { value: "", label: "All States" },
              ...NIGERIAN_STATES.map((s) => ({ value: s, label: s })),
            ]}
          />
          <FilterSelect
            label="Plan"
            value={filters.plan}
            onChange={(v) => update("plan", v)}
            options={[
              { value: "", label: "All Plans" },
              ...Object.entries(SUBSCRIPTION_PLANS).map(([k, c]) => ({ value: k, label: c.label })),
            ]}
          />
        </div>
      )}

      {/* Results count + sort */}
      <div className="flex items-center justify-between mt-4">
        <span className="text-[13px] text-text-muted">
          Showing <span className="font-semibold text-green-900">{resultCount}</span> schools
        </span>
        <select
          title="sort"
          value={sortField}
          onChange={(e) => setSortField(e.target.value as SortField)}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-[13px] text-text-muted focus:outline-none">
          <option value="name">Sort by Name</option>
          <option value="students">Sort by Students</option>
          <option value="classes">Sort by Classes</option>
          <option value="performance">Sort by Performance</option>
          <option value="subscription">Sort by Plan</option>
        </select>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-[12px] font-semibold text-green-900 mb-2">{label}</label>
      <select
        title="options"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-500/30">
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
