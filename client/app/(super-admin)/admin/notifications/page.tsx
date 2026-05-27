// app/(super-admin)/admin/notifications/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Shield,
  Users,
  School,
  CreditCard,
  AlertTriangle,
  TrendingUp,
  Server,
  Database,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  Archive,
  Check,
  XCircle,
  Clock,
  Activity,
} from "lucide-react";

type AdminNotificationType =
  | "user_signup"
  | "user_report"
  | "payment_dispute"
  | "school_onboarded"
  | "system_alert"
  | "backup_completed"
  | "high_usage_alert"
  | "fraud_alert"
  | "subscription_expiring"
  | "server_status"
  | "database_backup"
  | "new_feature"
  | "admin_action";

interface AdminNotification {
  id: string;
  type: AdminNotificationType;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  priority: "high" | "medium" | "low";
  actionUrl: string | null;
  metadata: Record<string, unknown> | null;
}

const ADMIN_NOTIFICATION_ICONS: Record<
  AdminNotificationType,
  { icon: any; color: string; bg: string; label: string }
> = {
  user_signup: { icon: Users, color: "#2e8b57", bg: "#e8f5e9", label: "User Signup" },
  user_report: { icon: Shield, color: "#f59e0b", bg: "#fed7aa", label: "User Report" },
  payment_dispute: {
    icon: AlertTriangle,
    color: "#ef4444",
    bg: "#fee2e2",
    label: "Payment Dispute",
  },
  school_onboarded: { icon: School, color: "#8b5cf6", bg: "#ede9fe", label: "School Onboarded" },
  system_alert: { icon: AlertTriangle, color: "#ef4444", bg: "#fee2e2", label: "System Alert" },
  backup_completed: { icon: Database, color: "#10b981", bg: "#d1fae5", label: "Backup" },
  high_usage_alert: { icon: TrendingUp, color: "#f59e0b", bg: "#fed7aa", label: "Usage Alert" },
  fraud_alert: { icon: AlertTriangle, color: "#ef4444", bg: "#fee2e2", label: "Fraud Alert" },
  subscription_expiring: {
    icon: CreditCard,
    color: "#f59e0b",
    bg: "#fed7aa",
    label: "Subscription",
  },
  server_status: { icon: Server, color: "#3b82f6", bg: "#dbeafe", label: "Server Status" },
  database_backup: { icon: Database, color: "#10b981", bg: "#d1fae5", label: "Database" },
  new_feature: { icon: Activity, color: "#8b5cf6", bg: "#ede9fe", label: "New Feature" },
  admin_action: { icon: Shield, color: "#6b7280", bg: "#f3f4f6", label: "Admin Action" },
};

// Mock all notifications
const MOCK_NOTIFICATIONS: AdminNotification[] = [
  {
    id: "1",
    type: "user_signup",
    title: "New User Registration",
    body: "Oluwaseun Adebayo just registered as a student.",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    read: false,
    priority: "medium",
    actionUrl: "/admin/users",
    metadata: { userId: "user_123", role: "student" },
  },
  {
    id: "2",
    type: "payment_dispute",
    title: "Payment Dispute Opened",
    body: "User Chioma Eze has disputed a payment of ₦2,500.",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
    priority: "high",
    actionUrl: "/admin/transactions",
    metadata: { transactionId: "tx_456", amount: 2500 },
  },
  {
    id: "3",
    type: "school_onboarded",
    title: "New School Onboarded",
    body: "Lagos Preparatory School has completed onboarding.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: false,
    priority: "medium",
    actionUrl: "/admin/schools",
    metadata: { schoolId: "school_789" },
  },
  {
    id: "4",
    type: "backup_completed",
    title: "Database Backup Completed",
    body: "Daily database backup completed successfully.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    read: true,
    priority: "low",
    actionUrl: "/admin/settings/backup",
    metadata: { size: "2.4GB", duration: "5min" },
  },
  {
    id: "5",
    type: "fraud_alert",
    title: "Fraud Alert Detected",
    body: "Suspicious activity detected on transaction TX-2024-001.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
    priority: "high",
    actionUrl: "/admin/transactions",
    metadata: { transactionId: "tx_001", riskScore: 95 },
  },
  {
    id: "6",
    type: "high_usage_alert",
    title: "High AI Usage Detected",
    body: "AI API usage is 200% above normal. Please investigate.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    read: true,
    priority: "high",
    actionUrl: "/admin/ai-logs",
    metadata: { currentUsage: 12000, normalUsage: 4000 },
  },
  {
    id: "7",
    type: "server_status",
    title: "Server Performance Degraded",
    body: "API response times are above normal thresholds.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    read: false,
    priority: "high",
    actionUrl: "/admin/system",
    metadata: { responseTime: "2.5s", threshold: "1s" },
  },
  {
    id: "8",
    type: "new_feature",
    title: "New Feature Released",
    body: "AI Essay Marking is now available for WAEC students.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    read: false,
    priority: "low",
    actionUrl: "/admin/features",
    metadata: { feature: "ai_essay_marking" },
  },
];

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<AdminNotification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "unread" | "read" | "high" | "medium" | "low">(
    "all",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const unreadCount = notifications.filter((n) => !n.read).length;
  const highCount = notifications.filter((n) => n.priority === "high" && !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    if (filter === "high") return n.priority === "high";
    if (filter === "medium") return n.priority === "medium";
    if (filter === "low") return n.priority === "low";
    return true;
  });

  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id && !n.read ? { ...n, read: true } : n)),
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleArchive = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleArchiveAllRead = () => {
    setNotifications((prev) => prev.filter((n) => !n.read));
  };

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-serif text-3xl text-green-900 mb-1 flex items-center gap-2">
              <Bell size={28} /> Admin Notifications
            </h1>
            <p className="text-text-muted">System alerts, user activities, and platform updates</p>
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-cream transition-all text-[14px] font-medium">
                <Check size={16} /> Mark all as read
              </button>
            )}
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-cream transition-all text-[14px] font-medium">
              <Download size={16} /> Export Log
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div
          className="p-4 rounded-2xl bg-white border text-center"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center justify-center gap-2 mb-1">
            <Bell size={16} className="text-blue-500" />
            <span className="text-[12px] text-gray-500">Total</span>
          </div>
          <div className="text-[24px] font-bold text-blue-600">{notifications.length}</div>
        </div>
        <div
          className="p-4 rounded-2xl bg-white border text-center"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center justify-center gap-2 mb-1">
            <Clock size={16} className="text-orange-500" />
            <span className="text-[12px] text-gray-500">Unread</span>
          </div>
          <div className="text-[24px] font-bold text-orange-600">{unreadCount}</div>
        </div>
        <div
          className="p-4 rounded-2xl bg-white border text-center"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center justify-center gap-2 mb-1">
            <AlertTriangle size={16} className="text-red-500" />
            <span className="text-[12px] text-gray-500">High Priority</span>
          </div>
          <div className="text-[24px] font-bold text-red-600">{highCount}</div>
        </div>
        <div
          className="p-4 rounded-2xl bg-white border text-center"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center justify-center gap-2 mb-1">
            <CheckCircle size={16} className="text-green-500" />
            <span className="text-[12px] text-gray-500">Resolved</span>
          </div>
          <div className="text-[24px] font-bold text-green-600">
            {notifications.filter((n) => n.read).length}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        className="bg-white rounded-2xl border p-4 mb-6"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all ${
              filter === "all"
                ? "bg-green-800 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-green-400"
            }`}>
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all ${
              filter === "unread"
                ? "bg-green-800 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-green-400"
            }`}>
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all ${
              filter === "read"
                ? "bg-green-800 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-green-400"
            }`}>
            Read
          </button>
          <button
            onClick={() => setFilter("high")}
            className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all ${
              filter === "high"
                ? "bg-red-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-red-400"
            }`}>
            High Priority
          </button>
          <button
            onClick={() => setFilter("medium")}
            className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all ${
              filter === "medium"
                ? "bg-orange-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-orange-400"
            }`}>
            Medium Priority
          </button>
          <button
            onClick={() => setFilter("low")}
            className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all ${
              filter === "low"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-green-400"
            }`}>
            Low Priority
          </button>
          <button
            onClick={handleArchiveAllRead}
            className="ml-auto flex items-center gap-1 px-3 py-2 rounded-lg text-[12px] text-gray-500 hover:bg-gray-100 transition">
            <Archive size={14} /> Archive read
          </button>
        </div>
      </div>

      {/* Notifications List */}
      {paginatedNotifications.length === 0 ? (
        <div
          className="text-center py-16 bg-white rounded-2xl border"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <Bell size={48} className="mx-auto mb-3 text-gray-300" />
          <h3 className="text-[18px] font-semibold text-gray-700 mb-1">No notifications</h3>
          <p className="text-[13px] text-gray-400">
            {filter === "all" ? "All caught up!" : `No ${filter} notifications found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {paginatedNotifications.map((notification) => {
            const IconConfig = ADMIN_NOTIFICATION_ICONS[notification.type];
            const Icon = IconConfig?.icon || Bell;
            const isUnread = !notification.read;

            return (
              <div
                key={notification.id}
                className={`p-4 rounded-xl border transition-all ${
                  isUnread
                    ? "bg-green-50 border-green-200"
                    : "bg-white border-gray-100 hover:border-gray-200"
                }`}>
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: IconConfig?.bg || "#f3f4f6" }}>
                    <Icon size={18} style={{ color: IconConfig?.color || "#6b7280" }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <h4
                          className={`text-[14px] font-semibold ${isUnread ? "text-green-900" : "text-gray-800"}`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] text-gray-500 px-2 py-0.5 rounded-full bg-gray-100">
                            {IconConfig?.label}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            {getTimeAgo(notification.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {notification.priority === "high" && (
                          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-semibold animate-pulse">
                            URGENT
                          </span>
                        )}
                        {!isUnread && (
                          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-semibold">
                            Read
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-[13px] text-gray-600 mt-2 leading-relaxed">
                      {notification.body}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-3">
                      {notification.actionUrl && (
                        <Link
                          href={notification.actionUrl}
                          className="text-[12px] font-semibold text-green-600 hover:text-green-700 flex items-center gap-1">
                          View Details →
                        </Link>
                      )}
                      {isUnread && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-[12px] text-gray-500 hover:text-green-600 transition-colors">
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={() => handleArchive(notification.id)}
                        className="text-[12px] text-gray-500 hover:text-red-600 transition-colors">
                        Archive
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            title="current page"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition">
            <ChevronLeft size={16} />
          </button>
          <span className="text-[13px] text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            title="current page"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition">
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
