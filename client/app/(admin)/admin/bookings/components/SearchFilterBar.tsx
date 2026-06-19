import { Search, Filter, FilterX } from "lucide-react";
import { BOOKING_STATUS_CONFIG } from "../constants";
import { FilterSelect } from "./Primitives";
import type { BookingFilters, BookingStatus, BookingType } from "../types";

interface Props {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  filters: BookingFilters;
  setFilters: React.Dispatch<React.SetStateAction<BookingFilters>>;
  activeFilterCount: number;
  clearFilters: () => void;
  showFilters: boolean;
  setShowFilters: (v: boolean) => void;
  resultCount: number;
}

export function SearchFilterBar({
  searchQuery,
  setSearchQuery,
  filters,
  setFilters,
  activeFilterCount,
  clearFilters,
  showFilters,
  setShowFilters,
  resultCount,
}: Props) {
  return (
    <div
      className="bg-white rounded-2xl border p-4 mb-6"
      style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search input */}
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by reference, student, tutor, subject…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all"
          />
        </div>

        {/* Filter toggle + clear */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all text-[14px] font-medium ${
              showFilters || activeFilterCount > 0
                ? "bg-green-800 text-white border-green-800"
                : "bg-white text-text-muted border-gray-200 hover:border-green-800/30"
            }`}>
            <Filter size={16} /> Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-gold text-green-900 text-[11px] font-bold flex items-center justify-center">
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

      {/* Expanded filter panel */}
      {showFilters && (
        <div
          className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-4"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <FilterSelect
            label="Status"
            value={filters.status}
            onChange={(v) => setFilters((p) => ({ ...p, status: v as BookingStatus }))}
            options={[
              { value: "", label: "All" },
              ...Object.entries(BOOKING_STATUS_CONFIG).map(([k, v]) => ({ value: k, label: v.label })),
            ]}
          />
          <FilterSelect
            label="Type"
            value={filters.type}
            onChange={(v) => setFilters((p) => ({ ...p, type: v as BookingType }))}
            options={[
              { value: "",         label: "All"      },
              { value: "online",   label: "Online"   },
              { value: "physical", label: "Physical" },
            ]}
          />
          <div>
            <label className="block text-[12px] font-semibold text-green-900 mb-2">
              Date Range
            </label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters((p) => ({ ...p, dateFrom: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-[12px] focus:outline-none focus:ring-2 focus:ring-green-500/30"
              />
              <span className="text-text-muted text-[12px]">–</span>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters((p) => ({ ...p, dateTo: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-[12px] focus:outline-none focus:ring-2 focus:ring-green-500/30"
              />
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-green-900 mb-2">
              Amount (₦)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minAmount}
                onChange={(e) => setFilters((p) => ({ ...p, minAmount: e.target.value }))}
                className="w-full px-2 py-2 rounded-lg border border-gray-200 text-[12px] focus:outline-none focus:ring-2 focus:ring-green-500/30"
              />
              <span className="text-text-muted text-[12px]">–</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxAmount}
                onChange={(e) => setFilters((p) => ({ ...p, maxAmount: e.target.value }))}
                className="w-full px-2 py-2 rounded-lg border border-gray-200 text-[12px] focus:outline-none focus:ring-2 focus:ring-green-500/30"
              />
            </div>
          </div>
        </div>
      )}

      <div className="mt-3 text-[12px] text-text-muted">
        Showing <span className="font-semibold text-green-900">{resultCount}</span> bookings
      </div>
    </div>
  );
}
