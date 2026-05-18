// constants/index.ts (or app/admin/transactions/constants.ts)
import {
  CreditCard,
  Building2,
  Smartphone,
  Banknote,
  TrendingUp,
  Calendar,
  Users,
  Target,
  CheckCircle,
  XCircle,
  Clock,
  RotateCcw,
  AlertTriangle,
  FileText,
  Video,
  BookOpen,
  Crown,
  Zap,
  School,
  Star,
  DollarSign,
  Activity,
} from "lucide-react";

import type {
  TransactionStatus,
  PaymentChannel,
  RevenueType,
  PlanType,
  SubscriptionStatus,
  UserRole,
} from "./types";

/* ─────────────────────────────────────────────────────────
   TRANSACTION STATUS CONFIG
───────────────────────────────────────────────────────── */
export const TX_STATUS_CONFIG: Record<
  TransactionStatus,
  { label: string; color: string; text: string; bg: string; icon: any }
> = {
  paid: {
    label: "Paid",
    color: "#10b981",
    text: "#10b981",
    bg: "#d1fae5",
    icon: CheckCircle,
  },
  pending: {
    label: "Pending",
    color: "#f59e0b",
    text: "#f59e0b",
    bg: "#fed7aa",
    icon: Clock,
  },
  failed: {
    label: "Failed",
    color: "#ef4444",
    text: "#ef4444",
    bg: "#fee2e2",
    icon: XCircle,
  },
  refunded: {
    label: "Refunded",
    color: "#6b7280",
    text: "#6b7280",
    bg: "#f3f4f6",
    icon: RotateCcw,
  },
  disputed: {
    label: "Disputed",
    color: "#8b5cf6",
    text: "#8b5cf6",
    bg: "#ede9fe",
    icon: AlertTriangle,
  },
};

/* ─────────────────────────────────────────────────────────
   PAYMENT CHANNEL CONFIG
───────────────────────────────────────────────────────── */
export const CHANNEL_CONFIG: Record<
  PaymentChannel,
  { label: string; color: string; bg: string; icon: any }
> = {
  card: {
    label: "Card",
    color: "#2e8b57",
    bg: "#e8f5e9",
    icon: CreditCard,
  },
  bank_transfer: {
    label: "Bank Transfer",
    color: "#3b82f6",
    bg: "#dbeafe",
    icon: Building2,
  },
  ussd: {
    label: "USSD",
    color: "#f59e0b",
    bg: "#fed7aa",
    icon: Smartphone,
  },
  paystack: {
    label: "Paystack",
    color: "#14b8a6",
    bg: "#ccfbf1",
    icon: CreditCard,
  },
  flutterwave: {
    label: "Flutterwave",
    color: "#ec4899",
    bg: "#fce7f3",
    icon: Banknote,
  },
  opay: {
    label: "Opay",
    color: "#06b6d4",
    bg: "#cffafe",
    icon: Smartphone,
  },
  palmpay: {
    label: "Palmpay",
    color: "#8b5cf6",
    bg: "#ede9fe",
    icon: CreditCard,
  },
};

/* ─────────────────────────────────────────────────────────
   REVENUE TYPE CONFIG
───────────────────────────────────────────────────────── */
export const REVENUE_TYPE_CONFIG: Record<RevenueType, { label: string; color: string; icon: any }> =
  {
    subscription: {
      label: "Subscription",
      color: "#2e8b57",
      icon: TrendingUp,
    },
    one_time: {
      label: "One-time",
      color: "#f59e0b",
      icon: FileText,
    },
    addon: {
      label: "Add-on",
      color: "#8b5cf6",
      icon: Star,
    },
    tutor_booking: {
      label: "Tutor Booking",
      color: "#ec4899",
      icon: Video,
    },
    school_plan: {
      label: "School Plan",
      color: "#06b6d4",
      icon: School,
    },
  };

/* ─────────────────────────────────────────────────────────
   PLAN CONFIG
───────────────────────────────────────────────────────── */
export const PLAN_CONFIG: Record<
  PlanType,
  { label: string; color: string; bg: string; icon: any; price?: number }
> = {
  free: {
    label: "Free",
    color: "#6b7280",
    bg: "#f3f4f6",
    icon: Star,
    price: 0,
  },
  student_pro: {
    label: "Student Pro",
    color: "#f5c842",
    bg: "#fef3c7",
    icon: Zap,
    price: 2500,
  },
  student_pro_annual: {
    label: "Student Pro (Annual)",
    color: "#f5c842",
    bg: "#fef3c7",
    icon: Crown,
    price: 20000,
  },
  school: {
    label: "School",
    color: "#2e8b57",
    bg: "#e8f5e9",
    icon: School,
    price: 15000,
  },
  enterprise: {
    label: "Enterprise",
    color: "#8b5cf6",
    bg: "#ede9fe",
    icon: Building2,
    price: 50000,
  },
  none: {
    label: "None",
    color: "#6b7280",
    bg: "#f3f4f6",
    icon: XCircle,
    price: 0,
  },
};

/* ─────────────────────────────────────────────────────────
   SUBSCRIPTION STATUS CONFIG
───────────────────────────────────────────────────────── */
export const SUB_STATUS_CONFIG: Record<
  SubscriptionStatus,
  { label: string; text: string; bg: string }
> = {
  active: {
    label: "Active",
    text: "#10b981",
    bg: "#d1fae5",
  },
  paused: {
    label: "Paused",
    text: "#f59e0b",
    bg: "#fed7aa",
  },
  cancelled: {
    label: "Cancelled",
    text: "#ef4444",
    bg: "#fee2e2",
  },
  expired: {
    label: "Expired",
    text: "#6b7280",
    bg: "#f3f4f6",
  },
  trial: {
    label: "Trial",
    text: "#3b82f6",
    bg: "#dbeafe",
  },
};

/* ─────────────────────────────────────────────────────────
   USER ROLE CONFIG
───────────────────────────────────────────────────────── */
export const USER_ROLE_CONFIG: Record<
  UserRole,
  { label: string; color: string; bg: string; icon: any }
> = {
  student: {
    label: "Student",
    color: "#2e8b57",
    bg: "#e8f5e9",
    icon: Users,
  },
  tutor: {
    label: "Tutor",
    color: "#8b5cf6",
    bg: "#ede9fe",
    icon: Video,
  },
  school_admin: {
    label: "School Admin",
    color: "#f59e0b",
    bg: "#fed7aa",
    icon: School,
  },
  admin: {
    label: "Admin",
    color: "#ef4444",
    bg: "#fee2e2",
    icon: Activity,
  },
};

/* ─────────────────────────────────────────────────────────
   CHART COLORS
───────────────────────────────────────────────────────── */
export const CHART_COLORS = [
  "#2e8b57", // Green
  "#f5c842", // Gold
  "#3b82f6", // Blue
  "#ef4444", // Red
  "#8b5cf6", // Purple
  "#f59e0b", // Orange
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#10b981", // Emerald
  "#6366f1", // Indigo
];

/* ─────────────────────────────────────────────────────────
   DATE RANGE PRESETS
───────────────────────────────────────────────────────── */
export const DATE_RANGE_PRESETS = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 Days", value: "last7" },
  { label: "Last 30 Days", value: "last30" },
  { label: "This Month", value: "thisMonth" },
  { label: "Last Month", value: "lastMonth" },
  { label: "This Quarter", value: "thisQuarter" },
  { label: "Last Quarter", value: "lastQuarter" },
  { label: "This Year", value: "thisYear" },
  { label: "Last Year", value: "lastYear" },
];

/* ─────────────────────────────────────────────────────────
   REFUND REASONS
───────────────────────────────────────────────────────── */
export const REFUND_REASONS = [
  { value: "customer_request", label: "Customer Request" },
  { value: "duplicate_charge", label: "Duplicate Charge" },
  { value: "service_not_delivered", label: "Service Not Delivered" },
  { value: "card_dispute", label: "Card Dispute" },
  { value: "admin_correction", label: "Admin Correction" },
  { value: "fraudulent", label: "Fraudulent Transaction" },
  { value: "technical_error", label: "Technical Error" },
];

/* ─────────────────────────────────────────────────────────
   SORT OPTIONS
───────────────────────────────────────────────────────── */
export const SORT_OPTIONS = [
  { value: "date_desc", label: "Newest First" },
  { value: "date_asc", label: "Oldest First" },
  { value: "amount_desc", label: "Highest Amount" },
  { value: "amount_asc", label: "Lowest Amount" },
  { value: "netAmount_desc", label: "Highest Net" },
  { value: "netAmount_asc", label: "Lowest Net" },
  { value: "fee_desc", label: "Highest Fee" },
  { value: "fee_asc", label: "Lowest Fee" },
];

/* ─────────────────────────────────────────────────────────
   TRANSACTION SUMMARY STATS
───────────────────────────────────────────────────────── */
export const TRANSACTION_SUMMARY_STATS = [
  { key: "revenue", icon: DollarSign, label: "Revenue", color: "#2e8b57" },
  { key: "net", icon: TrendingUp, label: "Net Revenue", color: "#10b981" },
  { key: "fees", icon: Activity, label: "Fees", color: "#f59e0b" },
  { key: "refunds", icon: RotateCcw, label: "Refunds", color: "#ef4444" },
  { key: "failed", icon: XCircle, label: "Failed", color: "#6b7280" },
  { key: "disputed", icon: AlertTriangle, label: "Disputed", color: "#8b5cf6" },
];

/* ─────────────────────────────────────────────────────────
   EXPORT FORMATS
───────────────────────────────────────────────────────── */
export const EXPORT_FORMATS = [
  { value: "csv", label: "CSV" },
  { value: "excel", label: "Excel (.xlsx)" },
  { value: "pdf", label: "PDF Report" },
];

/* ─────────────────────────────────────────────────────────
   PAGINATION DEFAULTS
───────────────────────────────────────────────────────── */
export const PAGINATION_DEFAULTS = {
  itemsPerPage: 25,
  itemsPerPageOptions: [10, 25, 50, 100],
};

/* ─────────────────────────────────────────────────────────
   NOTIFICATION MESSAGES
───────────────────────────────────────────────────────── */
export const NOTIFICATION_MESSAGES = {
  refundSuccess: "Refund processed successfully",
  refundFailed: "Failed to process refund",
  flagSuccess: "Transaction flagged successfully",
  flagRemoved: "Flag removed successfully",
  exportSuccess: "Export completed successfully",
  exportFailed: "Failed to export data",
  bulkRefundSuccess: "Bulk refund initiated",
  bulkRefundFailed: "Bulk refund failed",
  noSelection: "Please select at least one transaction",
};

/* ─────────────────────────────────────────────────────────
   FILTER PRESETS
───────────────────────────────────────────────────────── */
export const FILTER_PRESETS = [
  { label: "All Transactions", filters: {} },
  { label: "Successful Only", filters: { status: "paid" } },
  { label: "Pending", filters: { status: "pending" } },
  { label: "Failed", filters: { status: "failed" } },
  { label: "Refunded", filters: { status: "refunded" } },
  { label: "Fraudulent", filters: { isFraudulent: "true" } },
  { label: "Disputed", filters: { isDisputed: "true" } },
  { label: "This Month", filters: { dateRange: "thisMonth" } },
  { label: "Subscriptions Only", filters: { revenueType: "subscription" } },
  { label: "School Plans", filters: { planType: "school" } },
];
