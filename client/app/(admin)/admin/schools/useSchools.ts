"use client";

import { useState, useEffect, useMemo } from "react";
import type { SchoolData, SchoolFilters, SortField } from "@/types/schoolsTypes";
import { generateMockSchools } from "@/lib/mock/schoolsMockData";

const ITEMS_PER_PAGE = 12;

const DEFAULT_FILTERS: SchoolFilters = {
  type: "",
  status: "",
  state: "",
  plan: "",
  minStudents: "",
  maxStudents: "",
  foundedFrom: "",
  foundedTo: "",
};

export function useSchools() {
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SchoolFilters>(DEFAULT_FILTERS);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSchools, setSelectedSchools] = useState<Set<string>>(new Set());
  const [expandedSchool, setExpandedSchool] = useState<string | null>(null);
  const [expandedClass, setExpandedClass] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setSchools(generateMockSchools(50));
      setLoading(false);
    }, 1000);
  }, []);

  // ─── FILTERING + SORTING ──────────────────────────────────
  const filteredSchools = useMemo(() => {
    return schools
      .filter((s) => {
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          if (
            !s.name.toLowerCase().includes(q) &&
            !s.code.toLowerCase().includes(q) &&
            !s.location.state.toLowerCase().includes(q) &&
            !s.location.city.toLowerCase().includes(q) &&
            !s.contact.email.toLowerCase().includes(q)
          )
            return false;
        }
        if (filters.type && s.type !== filters.type) return false;
        if (filters.status && s.status !== filters.status) return false;
        if (filters.state && s.location.state !== filters.state) return false;
        if (filters.plan && s.subscription.plan !== filters.plan) return false;
        if (filters.minStudents && s.stats.totalStudents < parseInt(filters.minStudents))
          return false;
        if (filters.maxStudents && s.stats.totalStudents > parseInt(filters.maxStudents))
          return false;
        if (filters.foundedFrom && s.foundedYear < parseInt(filters.foundedFrom)) return false;
        if (filters.foundedTo && s.foundedYear > parseInt(filters.foundedTo)) return false;
        return true;
      })
      .sort((a, b) => {
        let cmp = 0;
        switch (sortField) {
          case "name":
            cmp = a.name.localeCompare(b.name);
            break;
          case "students":
            cmp = a.stats.totalStudents - b.stats.totalStudents;
            break;
          case "classes":
            cmp = a.stats.totalClasses - b.stats.totalClasses;
            break;
          case "performance":
            cmp = a.stats.averagePerformance - b.stats.averagePerformance;
            break;
          case "subscription":
            cmp = a.subscription.plan.localeCompare(b.subscription.plan);
            break;
        }
        return sortDirection === "asc" ? cmp : -cmp;
      });
  }, [schools, searchQuery, filters, sortField, sortDirection]);

  const paginatedSchools = filteredSchools.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  const totalPages = Math.ceil(filteredSchools.length / ITEMS_PER_PAGE);
  const activeFilterCount = Object.values(filters).filter((v) => v !== "").length;

  // ─── AGGREGATE STATS ─────────────────────────────────────
  const aggregateStats = useMemo(
    () => ({
      totalSchools: schools.length,
      totalStudents: schools.reduce((s, sc) => s + sc.stats.totalStudents, 0),
      totalClasses: schools.reduce((s, sc) => s + sc.stats.totalClasses, 0),
      activeSchools: schools.filter((s) => s.status === "active").length,
      privateSchools: schools.filter((s) => s.type === "private").length,
      publicSchools: schools.filter((s) => s.type === "public").length,
      internationalSchools: schools.filter((s) => s.type === "international").length,
      totalRevenue: schools.reduce((s, sc) => s + sc.stats.totalSpent, 0),
      averagePerformance: schools.length
        ? Math.round(schools.reduce((s, sc) => s + sc.stats.averagePerformance, 0) / schools.length)
        : 0,
      byState: schools.reduce(
        (acc, s) => {
          acc[s.location.state] = (acc[s.location.state] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ),
      byPlan: schools.reduce(
        (acc, s) => {
          acc[s.subscription.plan] = (acc[s.subscription.plan] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ),
    }),
    [schools],
  );

  // ─── HANDLERS ────────────────────────────────────────────
  const toggleSchoolExpand = (id: string) => {
    setExpandedSchool((prev) => (prev === id ? null : id));
    setExpandedClass(null);
  };

  const toggleClassExpand = (id: string) => {
    setExpandedClass((prev) => (prev === id ? null : id));
  };

  const toggleSelectSchool = (id: string) => {
    setSelectedSchools((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery("");
  };

  const addSchool = (school: SchoolData) => {
    setSchools((prev) => [school, ...prev]);
  };

  const handleExport = () => {
    const csv = [
      [
        "Name",
        "Code",
        "Type",
        "Status",
        "State",
        "City",
        "Students",
        "Classes",
        "Plan",
        "Performance",
      ].join(","),
      ...filteredSchools.map((s) =>
        [
          s.name,
          s.code,
          s.type,
          s.status,
          s.location.state,
          s.location.city,
          s.stats.totalStudents,
          s.stats.totalClasses,
          s.subscription.plan,
          s.stats.averagePerformance,
        ].join(","),
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `schools_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return {
    schools,
    loading,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    activeFilterCount,
    clearFilters,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
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
  };
}
