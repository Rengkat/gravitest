"use client";

import { useState } from "react";
import { School, Download, Plus, Layers, Building2, BarChart3, RefreshCw } from "lucide-react";
import { useSchools } from "./useSchools";
import { SearchFilterBar } from "./components/SearchFilterBar";
import { SchoolListRow } from "./components/SchoolListRow";
import { SchoolGridCard } from "./components/SchoolGridCard";
import { AnalyticsView } from "./components/AnalyticsView";
import { Pagination } from "./components/Pagination";
import { AddSchoolModal } from "./components/AddSchoolModal";

type ViewMode = "list" | "grid" | "analytics";

export default function AdminSchoolsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [showFilters, setShowFilters] = useState(false);
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [showAddClass, setShowAddClass] = useState<string | null>(null);

  const {
    loading,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    activeFilterCount,
    clearFilters,
    sortField,
    setSortField,
    currentPage,
    setCurrentPage,
    paginatedSchools,
    totalPages,
    filteredSchools,
    selectedSchools,
    toggleSelectSchool,
    expandedSchool,
    toggleSchoolExpand,
    expandedClass,
    toggleClassExpand,
    aggregateStats,
    addSchool,
    handleExport,
  } = useSchools();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw size={24} className="animate-spin text-green-800" />
        <span className="ml-3 text-text-muted text-[14px]">Loading schools…</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* ─── PAGE HEADER ─── */}
      <div className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-serif text-3xl text-green-900 mb-2">School Management</h1>
            <p className="text-text-muted">
              Manage all registered schools, their classes, students, and subscriptions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-cream transition-all text-[14px] font-medium text-text-muted">
              <Download size={16} />
              Export
            </button>
            <button
              onClick={() => setShowAddSchool(true)}
              className="flex items-center gap-2 px-5 py-3 bg-green-800 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-xl font-semibold text-sm">
              <Plus size={18} />
              Add School
            </button>
          </div>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-2 mt-4">
          {(
            [
              { mode: "list", Icon: Layers, label: "List View" },
              { mode: "grid", Icon: Building2, label: "Grid View" },
              { mode: "analytics", Icon: BarChart3, label: "Analytics" },
            ] as { mode: ViewMode; Icon: any; label: string }[]
          ).map(({ mode, Icon, label }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all flex items-center gap-2 ${
                viewMode === mode
                  ? "bg-green-800 text-white"
                  : "bg-white border border-gray-200 text-text-muted hover:bg-cream"
              }`}>
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── ANALYTICS VIEW ─── */}
      {viewMode === "analytics" && <AnalyticsView stats={aggregateStats} />}

      {/* ─── LIST / GRID VIEW ─── */}
      {(viewMode === "list" || viewMode === "grid") && (
        <>
          <SearchFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filters={filters}
            setFilters={setFilters}
            activeFilterCount={activeFilterCount}
            clearFilters={clearFilters}
            sortField={sortField}
            setSortField={setSortField}
            resultCount={filteredSchools.length}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />

          {/* List view */}
          {viewMode === "list" && (
            <div className="space-y-4">
              {paginatedSchools.map((school) => (
                <SchoolListRow
                  key={school.id}
                  school={school}
                  isExpanded={expandedSchool === school.id}
                  expandedClass={expandedClass}
                  isSelected={selectedSchools.has(school.id)}
                  onToggleExpand={() => toggleSchoolExpand(school.id)}
                  onToggleClass={toggleClassExpand}
                  onToggleSelect={toggleSelectSchool}
                  onAddClass={(id) => setShowAddClass(id)}
                />
              ))}
            </div>
          )}

          {/* Grid view */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedSchools.map((school) => (
                <SchoolGridCard key={school.id} school={school} />
              ))}
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* ─── MODALS ─── */}
      {showAddSchool && (
        <AddSchoolModal
          onClose={() => setShowAddSchool(false)}
          onAdd={(school) => {
            addSchool(school);
            setShowAddSchool(false);
          }}
        />
      )}
    </div>
  );
}
