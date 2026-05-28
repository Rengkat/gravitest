// ─── ENUMS ──────────────────────────────────────────────────
export type AdminNotificationType =
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

export type NotificationPriority = "high" | "medium" | "low";

export type NotificationStatus = "unread" | "read" | "archived";

/**
 * Filter modes — status-based OR priority-based.
 * The FilterBar handles the dual-mode UI.
 */
export type NotificationFilter = "all" | "unread" | "read" | "archived" | "high" | "medium" | "low";

// ─── ENTITY ──────────────────────────────────────────────────
export interface AdminNotification {
  id: string;
  type: AdminNotificationType;
  title: string;
  body: string;
  createdAt: string;
  status: NotificationStatus; // upgraded from boolean `read`
  priority: NotificationPriority;
  actionUrl: string | null;
  metadata: Record<string, unknown> | null;
  resolvedAt?: string; // when an admin resolved/acted on it
  resolvedBy?: string;
}

// ─── COUNTS ──────────────────────────────────────────────────
export interface AdminNotificationCounts {
  total: number;
  unread: number;
  highPriority: number; // unread high-priority
  resolved: number; // read
  archived: number;
}
