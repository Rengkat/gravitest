"use client";

import { useState, useEffect, useMemo } from "react";
import { generateMockTutors, generateTutorStats } from "./mockdata";
import { DEFAULT_FILTERS, SPECIALIZATIONS } from "./constants";
import type {
  Tutor,
  TutorStats,
  TutorFilters,
  TutorStatus,
  VerificationLevel,
  TutorCategory,
  TutorSpecialization,
  SortField,
} from "./types";

export function useTutors() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [stats, setStats] = useState<TutorStats | null>(null);
  const [loading, setLoading] = useState(true);

  // View
  const [viewMode, setViewMode] = useState<"analytics" | "grid" | "list">("analytics");
  const [categoryFilter, setCategoryFilter] = useState<"all" | TutorCategory>("all");

  // Search & filters
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<TutorFilters>(DEFAULT_FILTERS);

  // Sorting
  const [sortField, setSortField] = useState<SortField>("rating");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Selection
  const [selectedTutors, setSelectedTutors] = useState<Set<string>>(new Set());

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // ─── LOAD DATA ───────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const generated = generateMockTutors(55);
      setTutors(generated);
      setStats(generateTutorStats(generated));
      setLoading(false);
    }, 800);
  }, []);

  // ─── FILTERED & SORTED ───────────────────────────────────
  const filteredTutors = useMemo(() => {
    return tutors
      .filter((tutor) => {
        if (categoryFilter !== "all" && tutor.category !== categoryFilter) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          if (
            !tutor.name.toLowerCase().includes(q) &&
            !tutor.email.toLowerCase().includes(q) &&
            !tutor.title.toLowerCase().includes(q) &&
            !tutor.subjects.some((s) => s.toLowerCase().includes(q)) &&
            !tutor.tags.some((t) => t.toLowerCase().includes(q)) &&
            !tutor.state.toLowerCase().includes(q)
          )
            return false;
        }
        if (filters.status && tutor.status !== filters.status) return false;
        if (filters.verification && tutor.verificationLevel !== filters.verification) return false;
        if (
          filters.specialization &&
          !tutor.specialization.includes(filters.specialization as TutorSpecialization)
        )
          return false;
        if (filters.state && tutor.state !== filters.state) return false;
        if (filters.teachingMode && tutor.teachingMode !== filters.teachingMode) return false;
        if (filters.minRating && tutor.rating < parseFloat(filters.minRating)) return false;
        if (filters.minExperience && tutor.experience < parseInt(filters.minExperience))
          return false;
        if (filters.maxExperience && tutor.experience > parseInt(filters.maxExperience))
          return false;
        if (filters.minRate && tutor.hourlyRate < parseInt(filters.minRate)) return false;
        if (filters.maxRate && tutor.hourlyRate > parseInt(filters.maxRate)) return false;
        if (filters.isOnline === "true" && !tutor.isOnline) return false;
        if (filters.isOnline === "false" && tutor.isOnline) return false;
        return true;
      })
      .sort((a, b) => {
        let cmp = 0;
        switch (sortField) {
          case "name":
            cmp = a.name.localeCompare(b.name);
            break;
          case "rating":
            cmp = a.rating - b.rating;
            break;
          case "students":
            cmp = a.totalStudents - b.totalStudents;
            break;
          case "sessions":
            cmp = a.totalSessions - b.totalSessions;
            break;
          case "earnings":
            cmp = a.totalEarnings - b.totalEarnings;
            break;
          case "experience":
            cmp = a.experience - b.experience;
            break;
          case "hourlyRate":
            cmp = a.hourlyRate - b.hourlyRate;
            break;
        }
        return sortDirection === "asc" ? cmp : -cmp;
      });
  }, [tutors, categoryFilter, searchQuery, filters, sortField, sortDirection]);

  const paginatedTutors = filteredTutors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const totalPages = Math.ceil(filteredTutors.length / itemsPerPage);
  const activeFilterCount =
    Object.values(filters).filter((v) => v !== "").length + (categoryFilter !== "all" ? 1 : 0);

  // ─── ACTIONS ─────────────────────────────────────────────
  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setCategoryFilter("all");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const toggleSelectTutor = (id: string) => {
    setSelectedTutors((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAllOnPage = () => {
    if (selectedTutors.size === paginatedTutors.length) {
      setSelectedTutors(new Set());
    } else {
      setSelectedTutors(new Set(paginatedTutors.map((t) => t.id)));
    }
  };

  const clearSelection = () => setSelectedTutors(new Set());

  const bulkAction = (action: "activate" | "suspend" | "verify") => {
    setTutors((prev) =>
      prev.map((t) => {
        if (!selectedTutors.has(t.id)) return t;
        if (action === "activate") return { ...t, status: "active" as TutorStatus };
        if (action === "suspend") return { ...t, status: "suspended" as TutorStatus };
        if (action === "verify")
          return { ...t, verificationLevel: "verified" as VerificationLevel };
        return t;
      }),
    );
    clearSelection();
  };

  const exportCsv = () => {
    const csv = [
      [
        "Name",
        "Email",
        "Category",
        "Specialization",
        "Rating",
        "Students",
        "Sessions",
        "Hourly Rate",
        "Status",
        "State",
        "Total Earnings",
      ].join(","),
      ...filteredTutors.map((t) =>
        [
          t.name,
          t.email,
          t.category,
          t.specialization.map((s) => SPECIALIZATIONS[s]?.label).join("; "),
          t.rating,
          t.totalStudents,
          t.totalSessions,
          t.hourlyRate,
          t.status,
          t.state,
          t.totalEarnings,
        ].join(","),
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tutors_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return {
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
    sortDirection,
    setSortDirection,
    // Selection
    selectedTutors,
    toggleSelectTutor,
    selectAllOnPage,
    clearSelection,
    // Pagination
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    // Actions
    bulkAction,
    exportCsv,
  };
}
