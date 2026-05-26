"use client";

import { RefreshCw } from "lucide-react";
import { useTutors } from "./useTutors";
import { PageHeader } from "./components/PageHeader";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { SearchFilterBar } from "./components/SearchFilterBar";
import { BulkActionsBar } from "./components/BulkActionsBar";
import { TutorCard } from "./components/TutorCard";
import { TutorListItem } from "./components/TutorListItem";
import { Pagination } from "./components/Primitives";

export default function AdminTutorsPage() {
  const {
    // Data
    tutors,
    stats,
    loading,
    filteredTutors,
    paginatedTutors,
    // View
    viewMode,
    setViewMode,
    categoryFilter,
    setCategoryFilter,
    // Search & filter
    searchQuery,
    setSearchQuery,
    showFilters,
    setShowFilters,
    filters,
    setFilters,
    activeFilterCount,
    clearFilters,
    // Sort
    sortField,
    setSortField,
    // Selection
    selectedTutors,
    toggleSelectTutor,
    clearSelection,
    // Pagination
    currentPage,
    setCurrentPage,
    totalPages,
    // Actions
    bulkAction,
    exportCsv,
  } = useTutors();

  // ─── LOADING ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw size={24} className="animate-spin text-green-800" />
        <span className="ml-3 text-text-muted text-[14px]">Loading tutors…</span>
      </div>
    );
  }

  const inactiveTutorCount = tutors.filter((t) => t.status === "inactive").length;

  return (
    <div className="max-w-7xl mx-auto">
      {/* ─── HEADER ─── */}
      <PageHeader
        stats={stats}
        viewMode={viewMode}
        setViewMode={setViewMode}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        onExport={exportCsv}
        onAddTutor={() => {
          // TODO: wire up AddTutorModal
        }}
      />

      {/* ─── ANALYTICS VIEW ─── */}
      {viewMode === "analytics" && stats && (
        <AnalyticsDashboard stats={stats} inactiveTutorCount={inactiveTutorCount} />
      )}

      {/* ─── GRID / LIST VIEWS ─── */}
      {(viewMode === "grid" || viewMode === "list") && (
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
            sortField={sortField}
            setSortField={setSortField}
            resultCount={filteredTutors.length}
          />

          {selectedTutors.size > 0 && (
            <BulkActionsBar
              count={selectedTutors.size}
              onActivate={() => bulkAction("activate")}
              onSuspend={() => bulkAction("suspend")}
              onVerify={() => bulkAction("verify")}
              onClear={clearSelection}
            />
          )}

          {/* Grid view */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedTutors.map((tutor) => (
                <TutorCard
                  key={tutor.id}
                  tutor={tutor}
                  isSelected={selectedTutors.has(tutor.id)}
                  onSelect={() => toggleSelectTutor(tutor.id)}
                />
              ))}
            </div>
          )}

          {/* List view */}
          {viewMode === "list" && (
            <div className="space-y-3">
              {paginatedTutors.map((tutor) => (
                <TutorListItem
                  key={tutor.id}
                  tutor={tutor}
                  isSelected={selectedTutors.has(tutor.id)}
                  onSelect={() => toggleSelectTutor(tutor.id)}
                />
              ))}
            </div>
          )}

          <Pagination currentPage={currentPage} totalPages={totalPages} onChange={setCurrentPage} />
        </>
      )}
    </div>
  );
}
