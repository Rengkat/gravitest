// components/Notifications.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle,
  Calendar,
  Flame,
  Video,
  CreditCard,
  Trophy,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";

type NotificationType =
  | "exam_reminder"
  | "streak_alert"
  | "new_message"
  | "tutor_booking"
  | "session_start"
  | "session_complete"
  | "payment_success"
  | "payment_failed"
  | "subscription_expiring"
  | "result_published"
  | "new_content"
  | "achievement_unlocked"
  | "leaderboard_update"
  | "account_alert"
  | "weekly_report"
  | "system";

interface RecentNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  actionUrl?: string;
}

const NOTIFICATION_ICONS: Record<NotificationType, { icon: any; color: string; bg: string }> = {
  exam_reminder: { icon: Calendar, color: "#f59e0b", bg: "#fed7aa" },
  streak_alert: { icon: Flame, color: "#f97316", bg: "#fed7aa" },
  new_message: { icon: CheckCircle, color: "#3b82f6", bg: "#dbeafe" },
  tutor_booking: { icon: Video, color: "#8b5cf6", bg: "#ede9fe" },
  session_start: { icon: Video, color: "#10b981", bg: "#d1fae5" },
  session_complete: { icon: CheckCircle, color: "#10b981", bg: "#d1fae5" },
  payment_success: { icon: CreditCard, color: "#10b981", bg: "#d1fae5" },
  payment_failed: { icon: AlertTriangle, color: "#ef4444", bg: "#fee2e2" },
  subscription_expiring: { icon: AlertTriangle, color: "#f59e0b", bg: "#fed7aa" },
  result_published: { icon: Trophy, color: "#8b5cf6", bg: "#ede9fe" },
  new_content: { icon: BookOpen, color: "#2e8b57", bg: "#e8f5e9" },
  achievement_unlocked: { icon: Trophy, color: "#f5c842", bg: "#fef3c7" },
  leaderboard_update: { icon: TrendingUp, color: "#6366f1", bg: "#e0e7ff" },
  account_alert: { icon: AlertTriangle, color: "#ef4444", bg: "#fee2e2" },
  weekly_report: { icon: TrendingUp, color: "#2e8b57", bg: "#e8f5e9" },
  system: { icon: Bell, color: "#6b7280", bg: "#f3f4f6" },
};

// Mock recent notifications - replace with API call
const MOCK_RECENT_NOTIFICATIONS: RecentNotification[] = [
  {
    id: "1",
    type: "exam_reminder",
    title: "JAMB Exam in 30 Days!",
    body: "Your JAMB UTME exam is scheduled for March 15th.",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
    actionUrl: "/dashboard/practice",
  },
  {
    id: "2",
    type: "streak_alert",
    title: "🔥 7-Day Streak!",
    body: "You've maintained a 7-day study streak!",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: false,
    actionUrl: "/dashboard",
  },
  {
    id: "3",
    type: "achievement_unlocked",
    title: "Quiz Master Badge",
    body: "You've answered 100 questions correctly!",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
    actionUrl: "/dashboard/achievements",
  },
  {
    id: "4",
    type: "payment_success",
    title: "Payment Successful",
    body: "Your Student Pro subscription is now active.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    read: true,
    actionUrl: "/dashboard/settings/billing",
  },
];

type NotificationsProps = {
  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
};

const Notifications = ({ notificationsOpen, setNotificationsOpen }: NotificationsProps) => {
  const [notifications, setNotifications] =
    useState<RecentNotification[]>(MOCK_RECENT_NOTIFICATIONS);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setUnreadCount(notifications.filter((n) => !n.read).length);
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

  return (
    <div className="relative">
      <button
        title="notification"
        onClick={() => setNotificationsOpen(!notificationsOpen)}
        className="p-2 rounded-lg hover:bg-cream transition-colors relative">
        <Bell size={18} className="text-text-muted" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        )}
      </button>

      {notificationsOpen && (
        <div
          className="absolute right-[-6rem] md:right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border z-50 overflow-hidden"
          style={{ borderColor: "rgba(30,80,50,0.1)" }}>
          {/* Header */}
          <div
            className="px-4 py-3 border-b flex items-center justify-between"
            style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-green-600" />
              <span className="text-[14px] font-semibold text-green-900">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold">
                  {unreadCount} new
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
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell size={32} className="mx-auto mb-2 text-gray-300" />
                <p className="text-[13px] text-text-muted">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
                {notifications.map((notification) => {
                  const IconConfig = NOTIFICATION_ICONS[notification.type];
                  const Icon = IconConfig?.icon || Bell;
                  const isUnread = !notification.read;

                  return (
                    <Link
                      key={notification.id}
                      href={notification.actionUrl || "#"}
                      onClick={() => handleNotificationClick(notification)}
                      className={`block p-4 hover:bg-cream transition-colors ${isUnread ? "bg-green-50/30" : ""}`}>
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: IconConfig?.bg || "#f3f4f6" }}>
                          <Icon size={14} style={{ color: IconConfig?.color || "#6b7280" }} />
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
              href="/dashboard/notifications"
              onClick={() => setNotificationsOpen(false)}
              className="flex items-center justify-center gap-1 text-[12px] font-semibold text-green-600 hover:text-green-700 transition-colors">
              View all notifications
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
