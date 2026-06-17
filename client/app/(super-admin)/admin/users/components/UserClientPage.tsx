"use client";

import { useState } from "react";
import {
  Users,
  Plus,
  Download,
  LayoutGrid,
  List,
  BarChart3,
  RefreshCw,
  GraduationCap,
  BookOpen,
  School,
  UserCheck,
  DollarSign,
  Star,
} from "lucide-react";
import { useUsers } from "../useUsers";
import { SearchFilterBar } from "./SearchFilterBar";
import { UserTableRow } from "./UserTableRow";
import { UserGridCard } from "./UserGridCard";
import { AnalyticsDashboard } from "./AnalyticsDashboard";
import { BulkActionsBar, AddUserModal } from "./BulkActions";
import { MiniStatCard, Pagination } from "./Primitives";

type ViewMode = "table" | "grid" | "analytics";

export default function AdminUsersPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [showFilters, setShowFilters] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);

  const {
    users,
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
    paginatedUsers,
    totalPages,
    filteredUsers,
    selectedUsers,
    toggleSelect,
    clearSelection,
    selectAll,
    updateUserStatus,
    deleteUser,
    bulkUpdateStatus,
    bulkDelete,
    exportCsv,
  } = useUsers();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw size={24} className="animate-spin text-green-800" />
        <span className="ml-3 text-text-muted text-[14px]">Loading users…</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* ─── PAGE HEADER ─── */}
      <div className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-serif text-3xl text-green-900 mb-2">User Management</h1>
            <p className="text-text-muted">
              Manage all students, tutors, school admins and super admins on the platform.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => exportCsv(filteredUsers)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-cream transition-all text-[14px] font-medium text-text-muted">
              <Download size={16} />
              Export
            </button>
            <button
              onClick={() => setShowAddUser(true)}
              className="flex items-center gap-2 px-5 py-3 bg-green-800 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-xl font-semibold text-sm">
              <Plus size={18} />
              Add User
            </button>
          </div>
        </div>

        {/* View toggles */}
        <div className="flex items-center gap-2 mt-4">
          {(
            [
              { mode: "table", Icon: List, label: "List" },
              { mode: "grid", Icon: LayoutGrid, label: "Grid" },
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
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── ANALYTICS ─── */}
      {viewMode === "analytics" && stats && <AnalyticsDashboard stats={stats} />}

      {/* ─── LIST / GRID ─── */}
      {(viewMode === "table" || viewMode === "grid") && (
        <>
          {/* Quick stat bar — always visible above filters */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
            <MiniStatCard
              icon={Users}
              label="Total"
              value={(stats?.total ?? 0).toLocaleString()}
              color="#2e8b57"
            />
            <MiniStatCard
              icon={GraduationCap}
              label="Students"
              value={(stats?.byRole.students ?? 0).toLocaleString()}
              color="#0284c7"
            />
            <MiniStatCard
              icon={BookOpen}
              label="Tutors"
              value={(stats?.byRole.tutors ?? 0).toLocaleString()}
              color="#8b5cf6"
            />
            <MiniStatCard
              icon={School}
              label="School Admins"
              value={(stats?.byRole.schoolAdmins ?? 0).toLocaleString()}
              color="#f59e0b"
            />
            <MiniStatCard
              icon={UserCheck}
              label="Active"
              value={(stats?.active ?? 0).toLocaleString()}
              color="#10b981"
            />
            <MiniStatCard
              icon={Star}
              label="Tutor Rating"
              value={`${stats?.tutorAvgRating ?? 0} ★`}
              color="#f59e0b"
            />
            <MiniStatCard
              icon={DollarSign}
              label="Revenue"
              value={`₦${((stats?.totalRevenue ?? 0) / 1000000).toFixed(1)}M`}
              color="#8b5cf6"
            />
            <MiniStatCard
              icon={Users}
              label="New / Month"
              value={(stats?.newThisMonth ?? 0).toLocaleString()}
              color="#3b82f6"
            />
          </div>

          <SearchFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filters={filters}
            setFilters={setFilters}
            activeFilterCount={activeFilterCount}
            clearFilters={clearFilters}
            sortField={sortField}
            setSortField={setSortField}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            resultCount={filteredUsers.length}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />

          {/* Select-all bar — only in table mode */}
          {viewMode === "table" && filteredUsers.length > 0 && (
            <div className="flex items-center gap-3 mb-3 text-[13px] text-text-muted">
              <input
                title="pagination"
                type="checkbox"
                checked={selectedUsers.size === paginatedUsers.length && paginatedUsers.length > 0}
                onChange={() =>
                  selectedUsers.size === paginatedUsers.length ? clearSelection() : selectAll()
                }
                className="w-4 h-4 rounded border-gray-300 text-green-800"
              />
              <span>
                {selectedUsers.size > 0
                  ? `${selectedUsers.size} selected`
                  : `Select all on this page`}
              </span>
            </div>
          )}

          {/* Bulk actions */}
          {selectedUsers.size > 0 && (
            <BulkActionsBar
              count={selectedUsers.size}
              onActivate={() => bulkUpdateStatus("active")}
              onSuspend={() => bulkUpdateStatus("suspended")}
              onDeactivate={() => bulkUpdateStatus("deactivated")}
              onDelete={bulkDelete}
              onExport={() => exportCsv(users.filter((u) => selectedUsers.has(u.id)))}
              onClear={clearSelection}
            />
          )}

          {/* Table view */}
          {viewMode === "table" && (
            <div className="space-y-3">
              {paginatedUsers.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  isSelected={selectedUsers.has(user.id)}
                  onToggleSelect={toggleSelect}
                  onDelete={deleteUser}
                  onStatusChange={updateUserStatus}
                />
              ))}
            </div>
          )}

          {/* Grid view */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedUsers.map((user) => (
                <UserGridCard
                  key={user.id}
                  user={user}
                  onDelete={deleteUser}
                  onStatusChange={updateUserStatus}
                />
              ))}
            </div>
          )}

          <Pagination currentPage={currentPage} totalPages={totalPages} onChange={setCurrentPage} />
        </>
      )}

      {/* ─── MODALS ─── */}
      {showAddUser && (
        <AddUserModal
          onClose={() => setShowAddUser(false)}
          onAdd={(user) => {
            setShowAddUser(false);
          }}
        />
      )}
    </div>
  );
}
