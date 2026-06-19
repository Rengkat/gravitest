"use client";

import { useState, useEffect, useMemo } from "react";
import type {
  ContentItem,
  ContentStats,
  ContentFilters,
  SortField,
  ContentType,
} from "@/types/admin-contents";
import { generateMockContent, generateMockStats } from "@/lib/mock/contents";

const ITEMS_PER_PAGE = 20;

const DEFAULT_FILTERS: ContentFilters = {
  type: "",
  accessLevel: "",
  subject: "",
  audience: "",
  examTarget: "",
  status: "",
  isFeatured: "",
  isFree: "",
  minRating: "",
  dateFrom: "",
  dateTo: "",
};

export function useContent() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [stats, setStats] = useState<ContentStats | null>(null);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<ContentFilters>(DEFAULT_FILTERS);
  const [sortField, setSortField] = useState<SortField>("dateAdded");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Load data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const generated = generateMockContent(200);
      setItems(generated);
      setStats(generateMockStats(generated));
      setLoading(false);
    }, 800);
  }, []);

  // ─── FILTERING + SORTING ──────────────────────────────────
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          if (
            !item.title.toLowerCase().includes(q) &&
            !item.description.toLowerCase().includes(q) &&
            !item.author.toLowerCase().includes(q) &&
            !item.tags.some((t) => t.toLowerCase().includes(q))
          )
            return false;
        }
        if (filters.type && item.type !== filters.type) return false;
        if (filters.accessLevel && item.accessLevel !== filters.accessLevel) return false;
        if (filters.subject && item.subject !== filters.subject) return false;
        if (filters.audience && item.audience !== filters.audience) return false;
        if (filters.examTarget && item.examTarget !== filters.examTarget) return false;
        if (filters.status && item.status !== filters.status) return false;
        if (filters.isFeatured === "true" && !item.isFeatured) return false;
        if (filters.isFree === "true" && !item.isFree) return false;
        if (filters.isFree === "false" && item.isFree) return false;
        if (filters.minRating && item.rating < parseFloat(filters.minRating)) return false;
        if (filters.dateFrom && item.dateAdded < filters.dateFrom) return false;
        if (filters.dateTo && item.dateAdded > filters.dateTo) return false;
        return true;
      })
      .sort((a, b) => {
        let cmp = 0;
        switch (sortField) {
          case "title":
            cmp = a.title.localeCompare(b.title);
            break;
          case "views":
            cmp = a.views - b.views;
            break;
          case "downloads":
            cmp = a.downloads - b.downloads;
            break;
          case "rating":
            cmp = a.rating - b.rating;
            break;
          case "revenue":
            cmp = a.revenue - b.revenue;
            break;
          case "dateAdded":
            cmp = new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
            break;
        }
        return sortDirection === "asc" ? cmp : -cmp;
      });
  }, [items, searchQuery, filters, sortField, sortDirection]);

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const activeFilterCount = Object.values(filters).filter((v) => v !== "").length;

  // ─── HANDLERS ────────────────────────────────────────────
  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const clearSelection = () => setSelectedItems(new Set());

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setSelectedItems((prev) => {
      const n = new Set(prev);
      n.delete(id);
      return n;
    });
  };

  const deleteSelected = () => {
    setItems((prev) => prev.filter((i) => !selectedItems.has(i.id)));
    clearSelection();
  };

  const addItem = (item: ContentItem) => {
    setItems((prev) => [item, ...prev]);
    // Rebuild stats lazily — just increment totals
    setStats((prev) =>
      prev
        ? {
            ...prev,
            totalItems: prev.totalItems + 1,
            byType: { ...prev.byType, [item.type]: (prev.byType[item.type] || 0) + 1 },
            byStatus: { ...prev.byStatus, [item.status]: prev.byStatus[item.status] + 1 },
          }
        : prev,
    );
  };

  const toggleFeatured = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, isFeatured: !i.isFeatured } : i)));
  };

  const updateStatus = (id: string, status: ContentItem["status"]) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  const exportCsv = (exportItems: ContentItem[]) => {
    const headers = [
      "ID",
      "Title",
      "Type",
      "Audience",
      "Exam",
      "Subject",
      "Access",
      "Price",
      "Views",
      "Downloads",
      "Rating",
      "Revenue",
      "Status",
      "Date Added",
    ];
    const rows = exportItems.map((i) => [
      i.id,
      i.title,
      i.type,
      i.audience,
      i.examLabel,
      i.subject,
      i.accessLevel,
      i.price,
      i.views,
      i.downloads,
      i.rating,
      i.revenue,
      i.status,
      i.dateAdded,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `content_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return {
    items,
    stats,
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
    paginatedItems,
    totalPages,
    filteredItems,
    selectedItems,
    toggleSelect,
    clearSelection,
    addItem,
    deleteItem,
    deleteSelected,
    toggleFeatured,
    updateStatus,
    exportCsv,
  };
}
