"use client";

import { useState, useEffect, useMemo } from "react";
import type { User, UserStats, UserFilters, SortField, UserRole, UserStatus } from "./types";
import { generateMockUsers, generateMockStats } from "./mockData";

const ITEMS_PER_PAGE = 20;

const DEFAULT_FILTERS: UserFilters = {
  role: "", status: "", accountType: "", subscriptionTier: "",
  subscriptionStatus: "", verificationStatus: "", school: "",
  dateFrom: "", dateTo: "", minSessions: "", maxSessions: "",
};

export function useUsers() {
  const [users, setUsers]   = useState<User[]>([]);
  const [stats, setStats]   = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery]     = useState("");
  const [filters, setFilters]             = useState<UserFilters>(DEFAULT_FILTERS);
  const [sortField, setSortField]         = useState<SortField>("joinDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage]     = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const generated = generateMockUsers(250);
      setUsers(generated);
      setStats(generateMockStats(generated) as UserStats);
      setLoading(false);
    }, 800);
  }, []);

  // ─── FILTERING + SORTING ──────────────────────────────────
  const filteredUsers = useMemo(() => {
    return users
      .filter((u) => {
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
          if (
            !fullName.includes(q) &&
            !u.email.toLowerCase().includes(q) &&
            !u.phone.includes(q) &&
            !u.id.toLowerCase().includes(q) &&
            !(u.schoolAdminProfile?.schoolName ?? "").toLowerCase().includes(q) &&
            !(u.studentProfile?.schoolName ?? "").toLowerCase().includes(q)
          ) return false;
        }
        if (filters.role && u.role !== filters.role) return false;
        if (filters.status && u.status !== filters.status) return false;
        if (filters.accountType && u.accountType !== filters.accountType) return false;
        if (filters.subscriptionTier && u.subscriptionTier !== filters.subscriptionTier) return false;
        if (filters.subscriptionStatus && u.subscriptionStatus !== filters.subscriptionStatus) return false;
        if (filters.verificationStatus && u.verificationStatus !== filters.verificationStatus) return false;
        if (filters.school) {
          const schoolName =
            u.studentProfile?.schoolName ?? u.schoolAdminProfile?.schoolName ?? "";
          if (!schoolName.toLowerCase().includes(filters.school.toLowerCase())) return false;
        }
        if (filters.dateFrom && u.joinDate < filters.dateFrom) return false;
        if (filters.dateTo   && u.joinDate > filters.dateTo)   return false;
        if (filters.minSessions) {
          const sessions = u.studentProfile?.sessionsCompleted ?? u.tutorProfile?.totalSessionsConducted ?? 0;
          if (sessions < parseInt(filters.minSessions)) return false;
        }
        if (filters.maxSessions) {
          const sessions = u.studentProfile?.sessionsCompleted ?? u.tutorProfile?.totalSessionsConducted ?? 0;
          if (sessions > parseInt(filters.maxSessions)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        let cmp = 0;
        switch (sortField) {
          case "name":
            cmp = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
            break;
          case "role":        cmp = a.role.localeCompare(b.role); break;
          case "status":      cmp = a.status.localeCompare(b.status); break;
          case "joinDate":    cmp = new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime(); break;
          case "lastActive":  cmp = new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime(); break;
          case "totalSpent":  cmp = a.totalSpent - b.totalSpent; break;
          case "sessionsCompleted": {
            const sA = a.studentProfile?.sessionsCompleted ?? a.tutorProfile?.totalSessionsConducted ?? 0;
            const sB = b.studentProfile?.sessionsCompleted ?? b.tutorProfile?.totalSessionsConducted ?? 0;
            cmp = sA - sB;
            break;
          }
        }
        return sortDirection === "asc" ? cmp : -cmp;
      });
  }, [users, searchQuery, filters, sortField, sortDirection]);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const activeFilterCount = Object.values(filters).filter((v) => v !== "").length;

  // ─── HANDLERS ────────────────────────────────────────────
  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const toggleSelect = (id: string) => {
    setSelectedUsers((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const clearSelection = () => setSelectedUsers(new Set());

  const selectAll = () =>
    setSelectedUsers(new Set(paginatedUsers.map((u) => u.id)));

  const updateUserStatus = (id: string, status: UserStatus) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status } : u));
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setSelectedUsers((prev) => { const n = new Set(prev); n.delete(id); return n; });
  };

  const bulkUpdateStatus = (status: UserStatus) => {
    setUsers((prev) =>
      prev.map((u) => selectedUsers.has(u.id) ? { ...u, status } : u)
    );
    clearSelection();
  };

  const bulkDelete = () => {
    setUsers((prev) => prev.filter((u) => !selectedUsers.has(u.id)));
    clearSelection();
  };

  const exportCsv = (exportUsers: User[]) => {
    const headers = [
      "ID","Name","Email","Phone","Role","Status","Account Type",
      "Subscription","Joined","Last Active","Total Spent","Verification",
    ];
    const rows = exportUsers.map((u) => [
      u.id,
      `${u.firstName} ${u.lastName}`,
      u.email, u.phone, u.role, u.status, u.accountType,
      u.subscriptionTier, u.joinDate, u.lastActive,
      u.totalSpent, u.verificationStatus,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return {
    users, stats, loading,
    searchQuery, setSearchQuery,
    filters, setFilters, activeFilterCount, clearFilters,
    sortField, setSortField, sortDirection, setSortDirection,
    currentPage, setCurrentPage, paginatedUsers, totalPages, filteredUsers,
    selectedUsers, toggleSelect, clearSelection, selectAll,
    updateUserStatus, deleteUser, bulkUpdateStatus, bulkDelete, exportCsv,
  };
}
