"use client";

import { useState, useMemo, useCallback } from "react";
import type {
  AdminNotification,
  AdminNotificationCounts,
  NotificationFilter,
  NotificationStatus,
} from "./types";
import { MOCK_ADMIN_NOTIFICATIONS } from "./constants";

const ITEMS_PER_PAGE = 15;

export function useAdminNotifications() {
  const [notifications, setNotifications] = useState<AdminNotification[]>(MOCK_ADMIN_NOTIFICATIONS);
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // ─── COUNTS ──────────────────────────────────────────────
  const counts: AdminNotificationCounts = useMemo(
    () => ({
      total: notifications.length,
      unread: notifications.filter((n) => n.status === "unread").length,
      highPriority: notifications.filter((n) => n.priority === "high" && n.status === "unread")
        .length,
      resolved: notifications.filter((n) => n.status === "read").length,
      archived: notifications.filter((n) => n.status === "archived").length,
    }),
    [notifications],
  );

  // ─── FILTERED LIST ────────────────────────────────────────
  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      // Status / priority filter
      if (filter === "unread" && n.status !== "unread") return false;
      if (filter === "read" && n.status !== "read") return false;
      if (filter === "archived" && n.status !== "archived") return false;
      if (filter === "high" && n.priority !== "high") return false;
      if (filter === "medium" && n.priority !== "medium") return false;
      if (filter === "low" && n.priority !== "low") return false;
      // Hide archived from "all" view
      if (filter === "all" && n.status === "archived") return false;

      // Type filter
      if (typeFilter !== "all" && n.type !== typeFilter) return false;

      return true;
    });
  }, [notifications, filter, typeFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // ─── HANDLERS ────────────────────────────────────────────
  const changeFilter = (f: NotificationFilter) => {
    setFilter(f);
    setCurrentPage(1);
  };

  const changeTypeFilter = (t: string) => {
    setTypeFilter(t);
    setCurrentPage(1);
  };

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id && n.status === "unread" ? { ...n, status: "read" as NotificationStatus } : n,
      ),
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((n) => (n.status === "unread" ? { ...n, status: "read" as NotificationStatus } : n)),
    );
  }, []);

  const archive = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "archived" as NotificationStatus } : n)),
    );
  }, []);

  const archiveAllRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.status === "read" ? { ...n, status: "archived" as NotificationStatus } : n,
      ),
    );
  }, []);

  const deleteArchived = useCallback(() => {
    setNotifications((prev) => prev.filter((n) => n.status !== "archived"));
  }, []);

  const exportLog = useCallback(() => {
    const headers = ["ID", "Type", "Title", "Priority", "Status", "Created At", "Action URL"];
    const rows = notifications.map((n) => [
      n.id,
      n.type,
      `"${n.title}"`,
      n.priority,
      n.status,
      n.createdAt,
      n.actionUrl ?? "",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `admin_notifications_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [notifications]);

  return {
    notifications,
    paginated,
    filtered,
    counts,
    filter,
    changeFilter,
    typeFilter,
    changeTypeFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    markAsRead,
    markAllAsRead,
    archive,
    archiveAllRead,
    deleteArchived,
    exportLog,
  };
}
