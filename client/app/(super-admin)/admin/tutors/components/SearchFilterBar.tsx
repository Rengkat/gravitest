import { Search, Filter, FilterX } from "lucide-react";
import { STATUS_CONFIG, VERIFICATION_CONFIG, NIGERIAN_STATES } from "../constants";
import { FilterSelect } from "./Primitives";
import type { TutorFilters, TutorStatus, VerificationLevel, TeachingMode, SortField } from "../types";

interface Props {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  filters: TutorFilters;
  setFilters: React.Dispatch<React.SetStateAction<TutorFilters>>;
  activeFilterCount: number;
  clearFilters: () => void;
  showFilters: boolean;
  setShowFilters: (v: boolean) => void;
  sortField: SortField;
  setSortField: (v: SortField) => void;
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
  sortField,
  setSortField,
  resultCount,
}: Props) {
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
            placeholder="Search by name, email, subject, state or tags…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
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

          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as SortField)}
            className="px-3 py-3 rounded-xl border border-gray-200 text-[13px] text-text-muted focus:outline-none focus:ring-2 focus:ring-green-500/30">
            <option value="rating">Sort by Rating</option>
            <option value="name">Sort by Name</option>
            <option value="students">Sort by Students</option>
            <option value="sessions">Sort by Sessions</option>
            <option value="earnings">Sort by Earnings</option>
            <option value="experience">Sort by Experience</option>
            <option value="hourlyRate">Sort by Rate</option>
          </select>
        </div>
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div
          className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <FilterSelect
            label="Status"
            value={filters.status}
            onChange={(v) => setFilters((p) => ({ ...p, status: v as TutorStatus }))}
            options={[
              { value: "", label: "All Status" },
              ...Object.entries(STATUS_CONFIG).map(([k, v]) => ({ value: k, label: v.label })),
            ]}
          />
          <FilterSelect
            label="Verification"
            value={filters.verification}
            onChange={(v) => setFilters((p) => ({ ...p, verification: v as VerificationLevel }))}
            options={[
              { value: "", label: "All" },
              ...Object.entries(VERIFICATION_CONFIG).map(([k, v]) => ({ value: k, label: v.label })),
            ]}
          />
          <FilterSelect
            label="State"
            value={filters.state}
            onChange={(v) => setFilters((p) => ({ ...p, state: v }))}
            options={[
              { value: "", label: "All States" },
              ...NIGERIAN_STATES.map((s) => ({ value: s, label: s })),
            ]}
          />
          <FilterSelect
            label="Teaching Mode"
            value={filters.teachingMode}
            onChange={(v) => setFilters((p) => ({ ...p, teachingMode: v as TeachingMode }))}
            options={[
              { value: "",          label: "All"       },
              { value: "online",    label: "Online"    },
              { value: "in_person", label: "In-Person" },
              { value: "both",      label: "Both"      },
            ]}
          />
          <div>
            <label className="block text-[12px] font-semibold text-green-900 mb-2">Hourly Rate (₦)</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                placeholder="Min"
                value={filters.minRate}
                onChange={(e) => setFilters((p) => ({ ...p, minRate: e.target.value }))}
                className="w-full px-2 py-2 rounded-lg border border-gray-200 text-[12px] focus:outline-none focus:ring-2 focus:ring-green-500/30"
              />
              <span className="text-text-muted text-[12px]">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxRate}
                onChange={(e) => setFilters((p) => ({ ...p, maxRate: e.target.value }))}
                className="w-full px-2 py-2 rounded-lg border border-gray-200 text-[12px] focus:outline-none focus:ring-2 focus:ring-green-500/30"
              />
            </div>
          </div>
        </div>
      )}

      {/* Result count */}
      <div className="mt-3 text-[12px] text-text-muted">
        Showing <span className="font-semibold text-green-900">{resultCount}</span> tutors
      </div>
    </div>
  );
}
