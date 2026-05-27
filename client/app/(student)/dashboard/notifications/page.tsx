// app/dashboard/notifications/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  MessageSquare,
  Video,
  CreditCard,
  Trophy,
  Zap,
  Flame,
  BookOpen,
  AlertTriangle,
  TrendingUp,
  Mail,
  Smartphone,
  Globe,
  Filter,
  Check,
  Archive,
  Trash2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

// Types based on your entity
type NotificationChannel = "in_app" | "email" | "sms" | "push" | "whatsapp";
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
type NotificationStatus = "unread" | "read" | "archived";

interface Notification {
  id: string;
  type: NotificationType;
  channel: NotificationChannel;
  status: NotificationStatus;
  title: string;
  body: string;
  actionUrl: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  readAt: string | null;
}

// Mock data - replace with API call
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "exam_reminder",
    channel: "in_app",
    status: "unread",
    title: "JAMB Exam in 30 Days!",
    body: "Your JAMB UTME exam is scheduled for March 15th. Start your intensive preparation now!",
    actionUrl: "/dashboard/practice",
    metadata: { examType: "jamb", daysLeft: 30 },
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    readAt: null,
  },
  {
    id: "2",
    type: "streak_alert",
    channel: "in_app",
    status: "unread",
    title: "🔥 7-Day Streak Achieved!",
    body: "Congratulations! You've maintained a 7-day study streak. Keep the momentum going!",
    actionUrl: "/dashboard",
    metadata: { streakDays: 7 },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    readAt: null,
  },
  {
    id: "3",
    type: "payment_success",
    channel: "in_app",
    status: "read",
    title: "Payment Successful",
    body: "Your Student Pro subscription payment of ₦2,500 was successful. Your plan is now active.",
    actionUrl: "/dashboard/settings/billing",
    metadata: { amount: 2500, plan: "student_pro" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    readAt: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
  },
  {
    id: "4",
    type: "achievement_unlocked",
    channel: "in_app",
    status: "read",
    title: "🏆 Achievement Unlocked: Quiz Master",
    body: "You've successfully answered 100 questions correctly! You've earned the 'Quiz Master' badge.",
    actionUrl: "/dashboard/achievements",
    metadata: { achievement: "Quiz Master", xpEarned: 50 },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    readAt: new Date(Date.now() - 1000 * 60 * 60 * 47).toISOString(),
  },
  {
    id: "5",
    type: "tutor_booking",
    channel: "in_app",
    status: "unread",
    title: "Tutor Session Confirmed",
    body: "Your session with Dr. Adeola Williams has been confirmed for Tomorrow at 4:00 PM.",
    actionUrl: "/dashboard/bookings",
    metadata: { tutorName: "Dr. Adeola Williams", sessionTime: "2024-01-20T16:00:00" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    readAt: null,
  },
  {
    id: "6",
    type: "weekly_report",
    channel: "email",
    status: "read",
    title: "Your Weekly Performance Report",
    body: "You studied 8.5 hours this week, completed 3 practice tests, and improved your average score by 5%.",
    actionUrl: "/dashboard/reports",
    metadata: { weekEnding: "2024-01-14", hoursStudied: 8.5, improvement: 5 },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    readAt: new Date(Date.now() - 1000 * 60 * 60 * 71).toISOString(),
  },
  {
    id: "7",
    type: "leaderboard_update",
    channel: "in_app",
    status: "unread",
    title: "New Leaderboard Rank!",
    body: "You've climbed to #128 on the national leaderboard. You're in the top 5%!",
    actionUrl: "/dashboard/leaderboard",
    metadata: { rank: 128, percentile: 95 },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(), // 10 hours ago
    readAt: null,
  },
  {
    id: "8",
    type: "new_content",
    channel: "in_app",
    status: "read",
    title: "New Practice Questions Available",
    body: "50 new Physics past questions have been added to the question bank.",
    actionUrl: "/dashboard/practice",
    metadata: { subject: "Physics", count: 50 },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
    readAt: new Date(Date.now() - 1000 * 60 * 60 * 95).toISOString(),
  },
];

const NOTIFICATION_ICONS: Record<NotificationType, { icon: any; color: string; bg: string }> = {
  exam_reminder: { icon: Calendar, color: "#f59e0b", bg: "#fed7aa" },
  streak_alert: { icon: Flame, color: "#f97316", bg: "#fed7aa" },
  new_message: { icon: MessageSquare, color: "#3b82f6", bg: "#dbeafe" },
  tutor_booking: { icon: Video, color: "#8b5cf6", bg: "#ede9fe" },
  session_start: { icon: Video, color: "#10b981", bg: "#d1fae5" },
  session_complete: { icon: CheckCircle, color: "#10b981", bg: "#d1fae5" },
  payment_success: { icon: CreditCard, color: "#10b981", bg: "#d1fae5" },
  payment_failed: { icon: XCircle, color: "#ef4444", bg: "#fee2e2" },
  subscription_expiring: { icon: AlertTriangle, color: "#f59e0b", bg: "#fed7aa" },
  result_published: { icon: Trophy, color: "#8b5cf6", bg: "#ede9fe" },
  new_content: { icon: BookOpen, color: "#2e8b57", bg: "#e8f5e9" },
  achievement_unlocked: { icon: Trophy, color: "#f5c842", bg: "#fef3c7" },
  leaderboard_update: { icon: TrendingUp, color: "#6366f1", bg: "#e0e7ff" },
  account_alert: { icon: AlertTriangle, color: "#ef4444", bg: "#fee2e2" },
  weekly_report: { icon: BarChart3, color: "#2e8b57", bg: "#e8f5e9" },
  system: { icon: Bell, color: "#6b7280", bg: "#f3f4f6" },
};

const CHANNEL_ICONS: Record<NotificationChannel, { icon: any; label: string }> = {
  in_app: { icon: Bell, label: "In-App" },
  email: { icon: Mail, label: "Email" },
  sms: { icon: Smartphone, label: "SMS" },
  push: { icon: Globe, label: "Push" },
  whatsapp: { icon: MessageSquare, label: "WhatsApp" },
};

function NotificationCard({
  notification,
  onMarkRead,
  onArchive,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onArchive: (id: string) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const IconConfig = NOTIFICATION_ICONS[notification.type];
  const Icon = IconConfig?.icon || Bell;
  const ChannelIcon = CHANNEL_ICONS[notification.channel]?.icon || Bell;
  const isUnread = notification.status === "unread";

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
    return new Date(date).toLocaleDateString();
  };
  return (
    <div
      className={`relative p-4 rounded-xl border transition-all duration-200 ${
        isUnread ? "bg-green-50 border-green-200" : "bg-white border-gray-100 hover:border-gray-200"
      } ${isHovered ? "shadow-md" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: IconConfig?.bg || "#f3f4f6" }}>
          <Icon size={18} style={{ color: IconConfig?.color || "#6b7280" }} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <h4
              className={`text-[14px] font-semibold ${isUnread ? "text-green-900" : "text-gray-800"}`}>
              {notification.title}
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400 flex items-center gap-1">
                <ChannelIcon size={10} />
                {CHANNEL_ICONS[notification.channel]?.label}
              </span>
              <span className="text-[11px] text-gray-400">
                {getTimeAgo(notification.createdAt)}
              </span>
            </div>
          </div>
          <p className="text-[13px] text-gray-600 mt-1 leading-relaxed">{notification.body}</p>

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
                onClick={() => onMarkRead(notification.id)}
                className="text-[12px] text-gray-500 hover:text-green-600 transition-colors">
                Mark as read
              </button>
            )}
            <button
              onClick={() => onArchive(notification.id)}
              className="text-[12px] text-gray-500 hover:text-gray-700 transition-colors">
              Archive
            </button>
          </div>
        </div>

        {/* Unread dot */}
        {isUnread && <div className="w-2 h-2 rounded-full bg-green-600 shrink-0 mt-2" />}
      </div>
    </div>
  );
}

function FilterButton({
  active,
  count,
  onClick,
  children,
}: {
  active: boolean;
  count?: number;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all ${
        active
          ? "bg-green-800 text-white"
          : "bg-white text-gray-600 border border-gray-200 hover:border-green-400 hover:text-green-700"
      }`}>
      {children}
      {count !== undefined && count > 0 && (
        <span
          className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${active ? "bg-white/20" : "bg-gray-100"}`}>
          {count}
        </span>
      )}
    </button>
  );
}

// Import BarChart3 for weekly report icon
import { BarChart3 } from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "unread" | "read" | "archived">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<NotificationChannel | "all">("all");
  const itemsPerPage = 10;

  // Stats
  const unreadCount = notifications.filter((n) => n.status === "unread").length;
  const readCount = notifications.filter((n) => n.status === "read").length;
  const archivedCount = notifications.filter((n) => n.status === "archived").length;

  // Filter notifications
  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return n.status === "unread";
    if (filter === "read") return n.status === "read";
    if (filter === "archived") return n.status === "archived";
    if (selectedChannel !== "all") return n.channel === selectedChannel;
    return n.status !== "archived";
  });

  // Pagination
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id && n.status === "unread"
          ? { ...n, status: "read", readAt: new Date().toISOString() }
          : n,
      ),
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.status === "unread" ? { ...n, status: "read", readAt: new Date().toISOString() } : n,
      ),
    );
  };

  const handleArchive = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id && n.status !== "archived" ? { ...n, status: "archived" } : n)),
    );
  };

  const handleArchiveAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => (n.status === "read" ? { ...n, status: "archived" } : n)),
    );
  };

  const handleDeleteAll = () => {
    setNotifications((prev) => prev.filter((n) => n.status !== "read"));
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-serif text-3xl text-green-900 mb-1 flex items-center gap-2">
              <Bell size={28} /> Notifications
            </h1>
            <p className="text-text-muted">
              Stay updated with your activity and platform announcements
            </p>
          </div>
          <Link
            href="/dashboard/settings/notifications"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-cream transition-all text-[14px] font-medium">
            <Settings size={16} /> Notification Settings
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div
          className="p-4 rounded-2xl bg-white border text-center"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center justify-center gap-2 mb-1">
            <Bell size={16} className="text-blue-500" />
            <span className="text-[12px] text-gray-500">Unread</span>
          </div>
          <div className="text-[24px] font-bold text-blue-600">{unreadCount}</div>
        </div>
        <div
          className="p-4 rounded-2xl bg-white border text-center"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center justify-center gap-2 mb-1">
            <CheckCircle size={16} className="text-green-500" />
            <span className="text-[12px] text-gray-500">Read</span>
          </div>
          <div className="text-[24px] font-bold text-green-600">{readCount}</div>
        </div>
        <div
          className="p-4 rounded-2xl bg-white border text-center"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center justify-center gap-2 mb-1">
            <Archive size={16} className="text-gray-500" />
            <span className="text-[12px] text-gray-500">Archived</span>
          </div>
          <div className="text-[24px] font-bold text-gray-600">{archivedCount}</div>
        </div>
      </div>

      {/* Actions Bar */}
      <div
        className="bg-white rounded-2xl border p-4 mb-6"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex gap-2 flex-wrap">
            <FilterButton
              active={filter === "all"}
              onClick={() => {
                setFilter("all");
                setCurrentPage(1);
              }}>
              All
            </FilterButton>
            <FilterButton
              active={filter === "unread"}
              count={unreadCount}
              onClick={() => {
                setFilter("unread");
                setCurrentPage(1);
              }}>
              Unread
            </FilterButton>
            <FilterButton
              active={filter === "read"}
              count={readCount}
              onClick={() => {
                setFilter("read");
                setCurrentPage(1);
              }}>
              Read
            </FilterButton>
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-green-700 hover:bg-green-50 transition-colors">
                <Check size={14} /> Mark all as read
              </button>
            )}
            {readCount > 0 && (
              <button
                onClick={handleArchiveAllRead}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                <Archive size={14} /> Archive all read
              </button>
            )}
          </div>
        </div>

        {/* Channel Filter */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
          <span className="text-[11px] text-gray-400 mr-2">Filter by channel:</span>
          <button
            onClick={() => setSelectedChannel("all")}
            className={`text-[11px] px-2 py-1 rounded-md transition ${
              selectedChannel === "all"
                ? "bg-green-100 text-green-800"
                : "text-gray-500 hover:bg-gray-100"
            }`}>
            All
          </button>
          {(["in_app", "email", "sms", "push", "whatsapp"] as NotificationChannel[]).map(
            (channel) => {
              const { icon: Icon, label } = CHANNEL_ICONS[channel] ?? {};
              return (
                <button
                  key={channel}
                  onClick={() => setSelectedChannel(channel)}
                  className={`text-[11px] px-2 py-1 rounded-md transition flex items-center gap-1 ${
                    selectedChannel === channel
                      ? "bg-green-100 text-green-800"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}>
                  {Icon && <Icon size={10} />}
                  {label}
                </button>
              );
            },
          )}
        </div>
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={32} className="animate-spin text-green-600" />
        </div>
      ) : paginatedNotifications.length === 0 ? (
        <div
          className="text-center py-16 bg-white rounded-2xl border"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <Bell size={48} className="mx-auto mb-3 text-gray-300" />
          <h3 className="text-[18px] font-semibold text-gray-700 mb-1">No notifications</h3>
          <p className="text-[13px] text-gray-400">
            {filter === "all"
              ? "You're all caught up! New notifications will appear here."
              : `No ${filter} notifications found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {paginatedNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkRead={handleMarkAsRead}
              onArchive={handleArchive}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition">
            <ChevronLeft size={16} />
          </button>
          <span className="text-[13px] text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
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
