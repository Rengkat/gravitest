// ─── Activity Log ─────────────────────────────────────────────────────────────

export type ActivityAction =
  | "login"
  | "logout"
  | "quiz_completed"
  | "subscription_upgraded"
  | "subscription_cancelled"
  | "password_changed"
  | "profile_updated"
  | "content_accessed"
  | "payment_made"
  | "payment_failed"
  | "account_suspended"
  | "account_activated"
  | "lesson_created"
  | "school_linked"
  | "two_factor_enabled";

export interface ActivityLogEntry {
  id: string;
  action: ActivityAction;
  description: string;
  timestamp: string;
  ipAddress?: string;
  device?: string;
}

// ─── Payments ─────────────────────────────────────────────────────────────────

export type PaymentStatus = "successful" | "failed" | "pending" | "refunded";

export interface PaymentRecord {
  id: string;
  amount: number;
  plan: string;
  status: PaymentStatus;
  channel: string;
  reference: string;
  date: string;
}

// ─── Admin Actions ────────────────────────────────────────────────────────────

export type AdminActionType =
  | "suspend"
  | "activate"
  | "deactivate"
  | "delete"
  | "reset_password"
  | "edit"
  | "change_tier"
  | "verify_email"
  | "toggle_2fa";

export interface EditUserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state: string;
  notes: string;
}
