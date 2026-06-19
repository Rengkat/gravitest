export type TransactionStatus = "paid" | "pending" | "failed" | "refunded" | "disputed";
export type PaymentChannel =
  | "card"
  | "bank_transfer"
  | "ussd"
  | "paystack"
  | "flutterwave"
  | "opay"
  | "palmpay";
export type RevenueType = "subscription" | "one_time" | "addon" | "tutor_booking" | "school_plan";
export type PlanType =
  | "free"
  | "student_pro"
  | "student_pro_annual"
  | "school"
  | "enterprise"
  | "none";
export type UserRole = "student" | "tutor" | "school_admin" | "admin";
export type SortField = "date" | "amount" | "netAmount" | "fee" | "status";
export type ViewMode = "transactions" | "subscriptions" | "analytics" | "refunds";

export interface Transaction {
  id: string;
  reference: string;
  paystackReference?: string;
  flutterwaveReference?: string;
  description: string;
  amount: number;
  fee: number;
  netAmount: number;
  status: TransactionStatus;
  channel: PaymentChannel;
  revenueType: RevenueType;
  planType?: PlanType;
  userRole: UserRole;
  userId: string;
  userName: string;
  userEmail: string;
  date: string; // ISO date string
  cardUsed?: string;
  bankName?: string;
  ipAddress?: string;
  location?: string;
  deviceInfo?: string;
  invoiceUrl?: string;

  // Refund fields
  refundStatus?: "none" | "pending" | "completed" | "failed";
  refundAmount?: number;
  refundDate?: string;
  refundReason?: string;
  refundReference?: string;

  // Flag fields
  isFraudulent: boolean;
  isDisputed: boolean;
  fraudReason?: string;
  disputeReason?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  plan: PlanType;
  amount: number;
  totalPaid: number;
  status: "active" | "paused" | "cancelled" | "expired" | "trial";
  billingCycle: "monthly" | "annual" | "one_time";
  startDate: string;
  endDate?: string;
  nextBillingDate?: string;
  autoRenew: boolean;
  failureCount: number;
  paymentMethod?: PaymentChannel;
}

export interface RevenueStats {
  totalRevenue: number;
  netRevenue: number;
  totalFees: number;
  totalRefunds: number;
  monthlyRecurringRevenue: number;
  annualRecurringRevenue: number;
  averageTransactionValue: number;
  activeSubscriptions: number;
  churnRate: number;
  conversionRate: number;
  customerLifetimeValue: number;

  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  pendingTransactions: number;
  refundedTransactions: number;

  revenueByMonth: MonthlyRevenue[];
  revenueByPlan: PlanRevenue[];
  revenueByChannel: ChannelRevenue[];
  revenueByRole: RoleRevenue[];
  customerAcquisition: CustomerAcquisition[];
  topCustomers: TopCustomer[];
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  subscriptions: number;
  oneTime: number;
}

export interface PlanRevenue {
  plan: string;
  revenue: number;
  count: number;
}

export interface ChannelRevenue {
  channel: string;
  revenue: number;
  count: number;
  percentage: number;
}

export interface RoleRevenue {
  role: string;
  revenue: number;
  percentage: number;
}

export interface CustomerAcquisition {
  month: string;
  newCustomers: number;
  churnedCustomers: number;
}

export interface TopCustomer {
  name: string;
  email: string;
  plan: string;
  totalSpent: number;
}

export interface TxFilters {
  status: TransactionStatus | "";
  channel: PaymentChannel | "";
  revenueType: RevenueType | "";
  planType: PlanType | "";
  userRole: UserRole | "";
  dateFrom: string;
  dateTo: string;
  minAmount: string;
  maxAmount: string;
  isFraudulent: "true" | "false" | "";
  isDisputed: "true" | "false" | "";
}
export type SubscriptionStatus = "active" | "paused" | "cancelled" | "expired" | "trial";
