"use client";

import { useState, useEffect, useMemo } from "react";
import { generateMockBookings, generateBookingStats } from "./mockData";
import { DEFAULT_FILTERS } from "./constants";
import type { Booking, BookingStats, BookingFilters, BookingStatus, BookingType, SortField, ViewMode } from "./types";

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [loading, setLoading] = useState(true);

  // View
  const [viewMode, setViewMode] = useState<ViewMode>("analytics");

  // Search & filters
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<BookingFilters>(DEFAULT_FILTERS);

  // Sort
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Selection
  const [selectedBookings, setSelectedBookings] = useState<Set<string>>(new Set());

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // ─── LOAD ────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const generated = generateMockBookings(85);
      setBookings(generated);
      setStats(generateBookingStats(generated));
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // ─── FILTER + SORT ───────────────────────────────────────
  const filteredBookings = useMemo(() => {
    return bookings
      .filter((b) => {
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          if (
            !b.bookingReference.toLowerCase().includes(q) &&
            !b.studentName.toLowerCase().includes(q) &&
            !b.tutorName.toLowerCase().includes(q) &&
            !b.subject.toLowerCase().includes(q) &&
            !b.topic.toLowerCase().includes(q)
          )
            return false;
        }
        if (filters.status    && b.status   !== filters.status)           return false;
        if (filters.type      && b.type     !== filters.type)             return false;
        if (filters.subject   && b.subject  !== filters.subject)          return false;
        if (filters.tutorId   && b.tutorId  !== filters.tutorId)          return false;
        if (filters.dateFrom  && b.date     <  filters.dateFrom)          return false;
        if (filters.dateTo    && b.date     >  filters.dateTo)            return false;
        if (filters.minAmount && b.totalPaid < parseInt(filters.minAmount)) return false;
        if (filters.maxAmount && b.totalPaid > parseInt(filters.maxAmount)) return false;
        return true;
      })
      .sort((a, b) => {
        let cmp = 0;
        switch (sortField) {
          case "date":     cmp = new Date(a.date).getTime() - new Date(b.date).getTime(); break;
          case "price":    cmp = a.totalPaid  - b.totalPaid;                              break;
          case "duration": cmp = a.duration   - b.duration;                               break;
          case "status":   cmp = a.status.localeCompare(b.status);                        break;
        }
        return sortDirection === "asc" ? cmp : -cmp;
      });
  }, [bookings, searchQuery, filters, sortField, sortDirection]);

  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const totalPages        = Math.ceil(filteredBookings.length / itemsPerPage);
  const activeFilterCount = Object.values(filters).filter((v) => v !== "").length;

  // ─── ACTIONS ─────────────────────────────────────────────
  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const exportCsv = () => {
    const csv = [
      ["Reference","Student","Tutor","Subject","Topic","Date","Time","Duration","Status","Type","Amount","Payment"].join(","),
      ...filteredBookings.map((b) =>
        [b.bookingReference,b.studentName,b.tutorName,b.subject,b.topic,b.date,b.time,b.duration,b.status,b.type,b.totalPaid,b.paymentStatus].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const toggleSelectBooking = (id: string) => {
    setSelectedBookings((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return {
    // Data
    bookings,
    stats,
    loading,
    filteredBookings,
    paginatedBookings,
    // View
    viewMode, setViewMode,
    // Search & filters
    searchQuery, setSearchQuery,
    showFilters, setShowFilters,
    filters, setFilters,
    activeFilterCount,
    clearFilters,
    // Sort
    sortField, setSortField,
    sortDirection, setSortDirection,
    // Selection
    selectedBookings,
    toggleSelectBooking,
    // Pagination
    currentPage, setCurrentPage,
    totalPages,
    itemsPerPage,
    // Actions
    exportCsv,
  };
}
