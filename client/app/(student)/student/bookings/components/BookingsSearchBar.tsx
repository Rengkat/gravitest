"use client";

import { Search, X } from "lucide-react";
import { BookingFilters, BookingStatus, BookingType } from "@/types/bookings";

interface BookingsSearchBarProps {
  filters: BookingFilters;
  onSearchChange: (q: string) => void;
  onStatusChange: (s: BookingStatus | "all") => void;
  onTypeChange: (t: BookingType | "all") => void;
}

export default function BookingsSearchBar({
  filters,
  onSearchChange,
  onStatusChange,
  onTypeChange,
}: BookingsSearchBarProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by tutor, subject or topic..."
            value={filters.searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-[14px]"
          />
          {filters.searchQuery && (
            <button
              title="on search"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={15} />
            </button>
          )}
        </div>

        {/* Status filter */}
        <select
          title="filter"
          value={filters.status}
          onChange={(e) => onStatusChange(e.target.value as BookingStatus | "all")}
          className="px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-[14px] bg-white">
          <option value="all">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="rescheduled">Rescheduled</option>
        </select>

        {/* Type filter */}
        <select
          title="filter"
          value={filters.type}
          onChange={(e) => onTypeChange(e.target.value as BookingType | "all")}
          className="px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-[14px] bg-white">
          <option value="all">All Types</option>
          <option value="online">Online (Book)</option>
          <option value="physical">In-Person (Hire)</option>
        </select>
      </div>
    </div>
  );
}
