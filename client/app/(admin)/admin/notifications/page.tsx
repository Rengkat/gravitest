"use client";

import Link from "next/link";
import { Bell, Download, Check, Settings } from "lucide-react";
import { StatsBar } from "./components/StatsBar";
import { FilterBar } from "./components/FilterBar";
import { AdminNotificationCard } from "./components/AdminNotificationCard";
import { EmptyState, Pagination } from "./components/EmptyAndPagination";
import { useAdminNotifications } from "./useAdminNotifications";

const ITEMS_PER_PAGE = 15;

export default function AdminNotificationsPage() {
  const {
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
  } = useAdminNotifications();

  return (
    <div className="max-w-5xl mx-auto">
      {/* ─── HEADER ─── */}
      <div className="mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-serif text-3xl text-green-900 mb-1 flex items-center gap-3">
              <div className="relative">
                <Bell size={28} />
                {counts.unread > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {counts.unread > 99 ? "99+" : counts.unread}
                  </span>
                )}
              </div>
              Admin Notifications
            </h1>
            <p className="text-text-muted text-[14px]">
              System alerts, user activity, security events and platform updates.
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            {counts.unread > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-cream transition-all text-[14px] font-medium text-text-muted">
                <Check size={16} /> Mark all read
              </button>
            )}
            <button
              onClick={exportLog}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-cream transition-all text-[14px] font-medium text-text-muted">
              <Download size={16} /> Export Log
            </button>
            <Link
              href="/admin/settings/notifications"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-800 text-white hover:bg-green-700 transition-all text-[14px] font-medium shadow-sm">
              <Settings size={16} /> Settings
            </Link>
          </div>
        </div>
      </div>

      {/* ─── STATS (clickable quick-filters) ─── */}
      <StatsBar counts={counts} activeFilter={filter} onFilterChange={changeFilter} />

      {/* ─── FILTER BAR ─── */}
      <FilterBar
        filter={filter}
        typeFilter={typeFilter}
        unreadCount={counts.unread}
        readCount={counts.resolved}
        archivedCount={counts.archived}
        onFilterChange={changeFilter}
        onTypeFilterChange={changeTypeFilter}
        onMarkAllRead={markAllAsRead}
        onArchiveAllRead={archiveAllRead}
        onDeleteArchived={deleteArchived}
      />

      {/* ─── NOTIFICATION LIST ─── */}
      {paginated.length === 0 ? (
        <EmptyState filter={filter} hasTypeFilter={typeFilter !== "all"} />
      ) : (
        <div className="space-y-3">
          {paginated.map((notification) => (
            <AdminNotificationCard
              key={notification.id}
              notification={notification}
              onMarkRead={markAsRead}
              onArchive={archive}
            />
          ))}
        </div>
      )}

      {/* ─── PAGINATION ─── */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filtered.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onChange={setCurrentPage}
      />
    </div>
  );
}
