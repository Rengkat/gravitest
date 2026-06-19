// Re-exports from your users module — keep in sync with users/types.ts
export type {
  User,
  UserRole,
  UserStatus,
  SubscriptionTier,
  AccountType,
  StudentProfile,
  TutorProfile,
  SchoolAdminProfile,
} from "../types";

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
  | "account_deactivated"
  | "two_factor_enabled"
  | "password_reset";

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



export type AdminActionType =
  | "suspend"
  | "unsuspend"
  | "deactivate"
  | "delete"
  | "edit"
  | "change_tier"
  | "reset_password"
  | "verify_email";

export interface EditUserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  stateOfResidence: string;
  lga: string;
  role: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
}
