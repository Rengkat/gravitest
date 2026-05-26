"use client";

import { useBookings }          from "./useBookings";
import { PageHeader }           from "./components/PageHeader";
import { AnalyticsDashboard }   from "./components/AnalyticsDashboard";
import { SearchFilterBar }      from "./components/SearchFilterBar";
import { BookingsTable }        from "./components/BookingsTable";
import { CalendarView }         from "./components/CalendarView";

export default function AdminBookingsPage() {
  const {
    bookings,
    stats,
    loading,
    filteredBookings,
    paginatedBookings,
    viewMode, setViewMode,
    searchQuery, setSearchQuery,
    showFilters, setShowFilters,
    filters, setFilters,
    activeFilterCount,
    clearFilters,
    currentPage, setCurrentPage,
    totalPages,
    exportCsv,
  } = useBookings();

  // ─── LOADING SKELETON ──────────────────────────────────────
  if (loading || !stats) {
    return (
      <div className="max-w-7xl mx-auto animate-pulse space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* ─── HEADER ─── */}
      <PageHeader
        totalBookings={stats.totalBookings}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onExport={exportCsv}
      />

      {/* ─── ANALYTICS VIEW ─── */}
      {viewMode === "analytics" && <AnalyticsDashboard stats={stats} />}

      {/* ─── LIST VIEW ─── */}
      {viewMode === "list" && (
        <>
          <SearchFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filters={filters}
            setFilters={setFilters}
            activeFilterCount={activeFilterCount}
            clearFilters={clearFilters}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            resultCount={filteredBookings.length}
          />
          <BookingsTable
            bookings={paginatedBookings}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* ─── CALENDAR VIEW ─── */}
      {viewMode === "calendar" && (
        <CalendarView bookings={bookings} year={2025} month={2} />
      )}
    </div>
  );
}
