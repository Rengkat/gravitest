"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  CheckCircle,
  Archive,
  Trash2,
  RotateCcw,
  Calendar,
  Clock,
  MoreVertical,
  Copy,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import { NOTIFICATION_TYPE_CONFIG, CHANNEL_CONFIG } from "../constants";
import type { Notification } from "../types";

// Mock function to fetch notification - replace with actual API call
const fetchNotification = async (id: string): Promise<Notification | null> => {
  // Mock data - replace with actual API call
  const mockNotifications: Record<string, Notification> = {
    "notif-001": {
      id: "notif-001",
      type: "result_published",
      channel: "in_app",
      title: "New Student Enrolled",
      body: "Adebayo Ogunlesi has been enrolled in SS3 Science class. Please review their academic profile.",
      status: "unread",
      actionUrl: "/school/students/user-001",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      readAt: null,
      metadata: {
        studentId: "user-001",
        className: "SS3 Science",
        enrollmentDate: new Date().toISOString(),
      },
    },
    "notif-002": {
      id: "notif-002",
      type: "result_published",
      channel: "email",
      title: "Exam Results Available",
      body: "The Mathematics Mid-Term Assessment results for SS3 Science are now available. 35 students participated with an average score of 78.5%.",
      status: "read",
      actionUrl: "/school/exams/exam-001/results",
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
      readAt: null,

      metadata: {
        examId: "exam-001",
        className: "SS3 Science",
        averageScore: 78.5,
        totalStudents: 35,
      },
    },
    "notif-003": {
      id: "notif-003",
      type: "achievement_unlocked",
      channel: "in_app",
      title: "Class Schedule Updated",
      body: "The timetable for SS3 Science has been updated. Please check the new schedule for changes to Physics and Chemistry periods.",
      status: "unread",
      actionUrl: "/school/classes/class-001/timetable",
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      readAt: null,
      metadata: {
        classId: "class-001",
        changes: ["Physics moved to Monday", "Chemistry moved to Wednesday"],
      },
    },
    "notif-004": {
      id: "notif-004",
      type: "achievement_unlocked",
      channel: "email",
      title: "Upcoming Exam Reminder",
      body: "Reminder: Physics End of Term Exam is scheduled for June 20, 2026. Please ensure all students are prepared.",
      status: "archived",
      actionUrl: "/school/classes/class-001/exams/exam-002",
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      readAt: null,
      metadata: {
        examId: "exam-002",
        examDate: "2026-06-20",
        subject: "Physics",
      },
    },
    "notif-005": {
      id: "notif-005",
      type: "system",
      channel: "email",
      title: "System Maintenance",
      body: "The platform will undergo scheduled maintenance on June 25, 2026 from 2:00 AM to 4:00 AM WAT. Service may be unavailable during this period.",
      status: "unread",
      actionUrl: "/dashboard/system-status",
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      readAt: null,
      metadata: {
        maintenanceWindow: "2026-06-25T02:00:00Z",
        duration: "2 hours",
        impact: "All services",
      },
    },
  };

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockNotifications[id] || null;
};

export default function NotificationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const notificationId = params.id as string;

  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadNotification();
  }, [notificationId]);

  const loadNotification = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotification(notificationId);
      if (data) {
        setNotification(data);
        // Mark as read when viewing
        if (data.status === "unread") {
          await markAsRead(data.id);
        }
      } else {
        setError("Notification not found");
      }
    } catch (err) {
      setError("Failed to load notification");
      console.error("Error loading notification:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      // Replace with actual API call
      // await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
      setNotification((prev) => (prev ? { ...prev, status: "read" } : null));
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const markAsUnread = async () => {
    if (!notification) return;
    try {
      // Replace with actual API call
      // await fetch(`/api/notifications/${notification.id}/unread`, { method: 'POST' });
      setNotification((prev) => (prev ? { ...prev, status: "unread" } : null));
    } catch (error) {
      console.error("Error marking as unread:", error);
    }
  };

  const archiveNotification = async () => {
    if (!notification) return;
    try {
      // Replace with actual API call
      // await fetch(`/api/notifications/${notification.id}/archive`, { method: 'POST' });
      setNotification((prev) => (prev ? { ...prev, status: "archived" } : null));
      // Show success message
    } catch (error) {
      console.error("Error archiving notification:", error);
    }
  };

  const unarchiveNotification = async () => {
    if (!notification) return;
    try {
      // Replace with actual API call
      // await fetch(`/api/notifications/${notification.id}/unarchive`, { method: 'POST' });
      setNotification((prev) => (prev ? { ...prev, status: "read" } : null));
    } catch (error) {
      console.error("Error unarchiving notification:", error);
    }
  };

  const deleteNotification = async () => {
    if (!notification) return;
    try {
      // Replace with actual API call
      // await fetch(`/api/notifications/${notification.id}`, { method: 'DELETE' });
      setShowDeleteConfirm(false);
      router.push("/dashboard/notifications");
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    // Show toast notification
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "EEEE, MMMM d, yyyy");
  };

  const formatTime = (dateStr: string) => {
    return format(new Date(dateStr), "h:mm a");
  };

  const timeAgo = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return format(new Date(dateStr), "MMM d, yyyy");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={40} className="animate-spin text-green-600" />
      </div>
    );
  }

  if (error || !notification) {
    return (
      <div className="max-w-3xl mx-auto">
        <div
          className="text-center py-16 bg-white rounded-2xl border"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <AlertTriangle size={48} className="mx-auto text-yellow-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Notification Not Found</h3>
          <p className="text-text-muted mb-6">
            {error || "The notification you are looking for does not exist."}
          </p>
          <Link
            href="/dashboard/notifications"
            className="px-4 py-2 rounded-lg bg-green-800 text-white hover:bg-green-700 transition-colors">
            Back to Notifications
          </Link>
        </div>
      </div>
    );
  }

  const typeCfg = NOTIFICATION_TYPE_CONFIG[notification.type];
  const channelCfg = CHANNEL_CONFIG[notification.channel];
  const Icon = typeCfg?.icon || Bell;
  const ChanIcon = channelCfg?.icon || Bell;
  const isUnread = notification.status === "unread";
  const isArchived = notification.status === "archived";

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/dashboard/notifications"
          className="inline-flex items-center gap-2 text-text-muted hover:text-green-900 transition-colors">
          <ArrowLeft size={18} /> Back to Notifications
        </Link>
      </div>

      {/* Notification Detail Card */}
      <div
        className={`bg-white rounded-2xl border overflow-hidden ${
          isUnread ? "border-green-200 shadow-sm" : "border-gray-100"
        }`}>
        {/* Header */}
        <div
          className={`p-6 border-b ${
            isUnread ? "bg-green-50/60 border-green-200" : "bg-white border-gray-100"
          }`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: typeCfg?.bg || "#f3f4f6" }}>
                <Icon size={22} style={{ color: typeCfg?.color || "#6b7280" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <h1 className="text-xl font-semibold text-gray-900">{notification.title}</h1>
                  {isUnread && (
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-600 text-white">
                      New
                    </span>
                  )}
                  {isArchived && (
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-400 text-white">
                      Archived
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ background: `${channelCfg?.color}15`, color: channelCfg?.color }}>
                    <ChanIcon size={10} className="inline mr-1" />
                    {channelCfg?.label}
                  </span>
                  <span className="text-xs text-text-muted" style={{ color: typeCfg?.color }}>
                    {typeCfg?.label}
                  </span>
                  <span className="text-xs text-text-muted">•</span>
                  <span className="text-xs text-text-muted">{timeAgo(notification.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Actions Menu */}
            <div className="relative">
              <button
                title="actions menu"
                onClick={() => setShowActionsMenu(!showActionsMenu)}
                className="p-2 rounded-lg hover:bg-cream transition-colors">
                <MoreVertical size={18} className="text-text-muted" />
              </button>
              {showActionsMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
                  {isUnread && (
                    <button
                      onClick={() => {
                        markAsUnread();
                        setShowActionsMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-cream transition-colors">
                      <CheckCircle size={14} /> Mark as Read
                    </button>
                  )}
                  {!isUnread && !isArchived && (
                    <button
                      onClick={() => {
                        markAsUnread();
                        setShowActionsMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-cream transition-colors">
                      <RotateCcw size={14} /> Mark as Unread
                    </button>
                  )}
                  {!isArchived ? (
                    <button
                      onClick={() => {
                        archiveNotification();
                        setShowActionsMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-cream transition-colors">
                      <Archive size={14} /> Archive
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        unarchiveNotification();
                        setShowActionsMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-cream transition-colors">
                      <RotateCcw size={14} /> Restore
                    </button>
                  )}
                  <button
                    onClick={() => {
                      copyLink();
                      setShowActionsMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-cream transition-colors">
                    <Copy size={14} /> Copy Link
                  </button>
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(true);
                      setShowActionsMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Notification Body */}
          <div className="mb-6">
            <h2 className="text-sm font-medium text-text-muted mb-3">Message</h2>
            <div className="p-4 rounded-xl bg-cream/50">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {notification.body}
              </p>
            </div>
          </div>

          {/* Metadata */}
          {notification.metadata && Object.keys(notification.metadata).length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-medium text-text-muted mb-3">Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(notification.metadata).map(([key, value]) => (
                  <div key={key} className="p-3 rounded-lg bg-gray-50">
                    <p className="text-xs text-text-muted capitalize mb-1">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {typeof value === "object" ? JSON.stringify(value) : String(value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timestamp Info */}
          <div className="mb-6 p-4 rounded-xl bg-cream/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-text-muted" />
                <div>
                  <p className="text-xs text-text-muted">Created</p>
                  <p className="text-sm font-medium text-gray-800">
                    {formatDate(notification.createdAt)} at {formatTime(notification.createdAt)}
                  </p>
                </div>
              </div>
              {notification.updatedAt && (
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-text-muted" />
                  <div>
                    <p className="text-xs text-text-muted">Last Updated</p>
                    <p className="text-sm font-medium text-gray-800">
                      {formatDate(notification.updatedAt)} at {formatTime(notification.updatedAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            {notification.actionUrl && (
              <Link
                href={notification.actionUrl}
                className="px-4 py-2 rounded-lg bg-green-800 text-white hover:bg-green-700 transition-colors">
                View Related Content →
              </Link>
            )}
            {isUnread && (
              <button
                onClick={() => markAsRead(notification.id)}
                className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-cream transition-colors">
                Mark as Read
              </button>
            )}
            {!isArchived ? (
              <button
                onClick={archiveNotification}
                className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-cream transition-colors">
                <Archive size={14} className="inline mr-1" />
                Archive
              </button>
            ) : (
              <button
                onClick={unarchiveNotification}
                className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-cream transition-colors">
                <RotateCcw size={14} className="inline mr-1" />
                Restore
              </button>
            )}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors ml-auto">
              <Trash2 size={14} className="inline mr-1" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setShowDeleteConfirm(false)}
            />

            <div className="relative bg-white rounded-2xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertTriangle size={20} className="text-red-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Delete Notification</h2>
                </div>

                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete this notification? This action cannot be undone.
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-cream transition-colors">
                    Cancel
                  </button>
                  <button
                    onClick={deleteNotification}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
