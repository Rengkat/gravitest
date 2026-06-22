"use client";

import { useState, useEffect } from "react";
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
  UserCheck,
  DollarSign,
  Activity,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
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

interface RecentNotification {
  id: string;
  type: AdminNotificationType;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  priority: "high" | "medium" | "low";
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

const ADMIN_NOTIFICATION_ICONS: Record<
  AdminNotificationType,
  { icon: any; color: string; bg: string }
> = {
  user_signup: { icon: Users, color: "#2e8b57", bg: "#e8f5e9" },
  user_report: { icon: Shield, color: "#f59e0b", bg: "#fed7aa" },
  payment_dispute: { icon: AlertTriangle, color: "#ef4444", bg: "#fee2e2" },
  school_onboarded: { icon: School, color: "#8b5cf6", bg: "#ede9fe" },
  system_alert: { icon: AlertTriangle, color: "#ef4444", bg: "#fee2e2" },
  backup_completed: { icon: Database, color: "#10b981", bg: "#d1fae5" },
  high_usage_alert: { icon: TrendingUp, color: "#f59e0b", bg: "#fed7aa" },
  fraud_alert: { icon: AlertTriangle, color: "#ef4444", bg: "#fee2e2" },
  subscription_expiring: { icon: CreditCard, color: "#f59e0b", bg: "#fed7aa" },
  server_status: { icon: Server, color: "#3b82f6", bg: "#dbeafe" },
  database_backup: { icon: Database, color: "#10b981", bg: "#d1fae5" },
  new_feature: { icon: Activity, color: "#8b5cf6", bg: "#ede9fe" },
  admin_action: { icon: Shield, color: "#6b7280", bg: "#f3f4f6" },
};

// Mock recent notifications for admin
const MOCK_RECENT_NOTIFICATIONS: RecentNotification[] = [
  {
    id: "1",
    type: "user_signup",
    title: "New User Registration",
    body: "Oluwaseun Adebayo just registered as a student.",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    read: false,
    priority: "medium",
    actionUrl: "/admin/users",
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
  },
  {
    id: "5",
    type: "fraud_alert",
    title: "⚠️ Fraud Alert Detected",
    body: "Suspicious activity detected on transaction TX-2024-001.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
    priority: "high",
    actionUrl: "/admin/transactions",
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
  },
];

type AdminNotificationsProps = {
  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
};

const AdminNotifications = ({
  notificationsOpen,
  setNotificationsOpen,
}: AdminNotificationsProps) => {
  const [notifications, setNotifications] =
    useState<RecentNotification[]>(MOCK_RECENT_NOTIFICATIONS);
  const [unreadCount, setUnreadCount] = useState(0);
  const [highPriorityCount, setHighPriorityCount] = useState(0);

  useEffect(() => {
    setUnreadCount(notifications.filter((n) => !n.read).length);
    setHighPriorityCount(notifications.filter((n) => n.priority === "high" && !n.read).length);
  }, [notifications]);

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id && !n.read ? { ...n, read: true } : n)),
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notification: RecentNotification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
    setNotificationsOpen(false);
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "high":
        return { borderColor: "#ef4444", bg: "#fee2e2", text: "#dc2626" };
      case "medium":
        return { borderColor: "#f59e0b", bg: "#fed7aa", text: "#d97706" };
      default:
        return { borderColor: "#10b981", bg: "#d1fae5", text: "#059669" };
    }
  };

  return (
    <div className="relative">
      <button
        title="admin notifications"
        onClick={() => setNotificationsOpen(!notificationsOpen)}
        className="p-2 rounded-lg hover:bg-cream transition-colors relative">
        <Bell size={18} className="text-text-muted" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {notificationsOpen && (
        <div
          className="absolute right-[-5rem] md:right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border z-50 overflow-hidden"
          style={{ borderColor: "rgba(30,80,50,0.1)" }}>
          {/* Header */}
          <div
            className="px-4 py-3 border-b flex items-center justify-between"
            style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-green-600" />
              <span className="text-[14px] font-semibold text-green-900">Admin Alerts</span>
              {highPriorityCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold animate-pulse">
                  {highPriorityCount} urgent
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-[11px] text-green-600 hover:text-green-700 font-medium">
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[420px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell size={32} className="mx-auto mb-2 text-gray-300" />
                <p className="text-[13px] text-text-muted">No admin alerts</p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
                {notifications.map((notification) => {
                  const IconConfig = ADMIN_NOTIFICATION_ICONS[notification.type];
                  const Icon = IconConfig?.icon || Bell;
                  const isUnread = !notification.read;
                  const priorityStyles = getPriorityStyles(notification.priority);

                  return (
                    <Link
                      key={notification.id}
                      href={notification.actionUrl || "#"}
                      onClick={() => handleNotificationClick(notification)}
                      className={`block p-4 hover:bg-cream transition-colors relative ${
                        isUnread ? "bg-green-50/30" : ""
                      }`}>
                      <div className="flex gap-3">
                        {/* Icon with priority indicator */}
                        <div className="relative">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: IconConfig?.bg || "#f3f4f6" }}>
                            <Icon size={14} style={{ color: IconConfig?.color || "#6b7280" }} />
                          </div>
                          {notification.priority === "high" && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={`text-[12px] font-semibold ${isUnread ? "text-green-900" : "text-gray-700"}`}>
                              {notification.title}
                            </p>
                            <span className="text-[10px] text-gray-400 shrink-0">
                              {getTimeAgo(notification.createdAt)}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">
                            {notification.body}
                          </p>

                          {/* Priority badge */}
                          {notification.priority === "high" && (
                            <div className="mt-1.5">
                              <span
                                className="text-[9px] font-semibold px-1.5 py-0.5 rounded"
                                style={{
                                  background: priorityStyles.bg,
                                  color: priorityStyles.text,
                                }}>
                                Urgent
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Unread indicator */}
                        {isUnread && (
                          <div className="w-1.5 h-1.5 rounded-full bg-green-600 shrink-0 mt-1" />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer - View All Link */}
          <div
            className="px-4 py-3 border-t bg-gray-50"
            style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <Link
              href="/admin/notifications"
              onClick={() => setNotificationsOpen(false)}
              className="flex items-center justify-center gap-1 text-[12px] font-semibold text-green-600 hover:text-green-700 transition-colors">
              View all admin notifications
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
