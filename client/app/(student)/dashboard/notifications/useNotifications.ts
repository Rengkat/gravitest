"use client";

import { useState, useMemo } from "react";
import type {
  Notification, NotificationFilter, NotificationChannel,
  NotificationCounts, NotificationStatus,
} from "./types";
import { MOCK_NOTIFICATIONS } from "./constants";

const ITEMS_PER_PAGE = 10;

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter]               = useState<NotificationFilter>("all");
  const [channelFilter, setChannelFilter] = useState<NotificationChannel | "all">("all");
  const [currentPage, setCurrentPage]     = useState(1);
  const [isLoading, setIsLoading]         = useState(false);

  // ─── COUNTS ──────────────────────────────────────────────
  const counts: NotificationCounts = useMemo(() => ({
    unread:   notifications.filter((n) => n.status === "unread").length,
    read:     notifications.filter((n) => n.status === "read").length,
    archived: notifications.filter((n) => n.status === "archived").length,
    total:    notifications.length,
  }), [notifications]);

  // ─── FILTERED SET ────────────────────────────────────────
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      // Status filter
      if (filter === "unread"   && n.status !== "unread")   return false;
      if (filter === "read"     && n.status !== "read")     return false;
      if (filter === "archived" && n.status !== "archived") return false;
      // Hide archived from "all" tab
      if (filter === "all" && n.status === "archived") return false;

      // Channel filter
      if (channelFilter !== "all" && n.channel !== channelFilter) return false;

      return true;
    });
  }, [notifications, filter, channelFilter]);

  const totalPages          = Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE);
  const paginatedItems      = filteredNotifications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // ─── HANDLERS ────────────────────────────────────────────
  const changeFilter = (f: NotificationFilter) => {
    setFilter(f);
    setCurrentPage(1);
  };

  const changeChannel = (c: NotificationChannel | "all") => {
    setChannelFilter(c);
    setCurrentPage(1);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id && n.status === "unread"
          ? { ...n, status: "read" as NotificationStatus, readAt: new Date().toISOString() }
          : n,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.status === "unread"
          ? { ...n, status: "read" as NotificationStatus, readAt: new Date().toISOString() }
          : n,
      ),
    );
  };

  const archive = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, status: "archived" as NotificationStatus } : n,
      ),
    );
  };

  const archiveAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.status === "read" ? { ...n, status: "archived" as NotificationStatus } : n,
      ),
    );
  };

  const deleteArchived = () => {
    setNotifications((prev) => prev.filter((n) => n.status !== "archived"));
  };

  const unarchive = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, status: "read" as NotificationStatus } : n,
      ),
    );
  };

  return {
    notifications,
    paginatedItems,
    filteredNotifications,
    counts,
    filter, changeFilter,
    channelFilter, changeChannel,
    currentPage, setCurrentPage,
    totalPages,
    isLoading,
    markAsRead, markAllAsRead,
    archive, archiveAllRead,
    deleteArchived, unarchive,
  };
}
