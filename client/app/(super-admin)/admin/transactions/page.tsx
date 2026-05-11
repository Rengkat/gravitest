"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  DollarSign,
  Search,
  Filter,
  Download,
  X,
  Check,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Eye,
  CreditCard,
  Building,
  Smartphone,
  QrCode,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Calendar,
  Users,
  School,
  GraduationCap,
  Briefcase,
  Shield,
  RefreshCw,
  FileText,
  FilterX,
  ArrowUpDown,
  Ban,
  BadgeCheck,
  Wallet,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Zap,
  Gift,
  Crown,
  Package,
  BookOpen,
  Video,
  Headphones,
  Monitor,
  Layers,
  Hash,
  Coins,
  Landmark,
  PauseCircle,
  ArrowRightLeft,
  History,
  UserCheck,
  UserX,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

// ─── TYPES ──────────────────────────────────────────────────
type TransactionStatus = "paid" | "failed" | "refunded" | "pending" | "processing" | "cancelled";
type PaymentChannel = "card" | "bank_transfer" | "ussd" | "qr" | "wallet" | "direct_debit";
type PaymentMethod = "visa" | "mastercard" | "verve" | "american_express";
type RevenueType =
  | "subscription"
  | "one_time"
  | "content_purchase"
  | "tutor_booking"
  | "school_license"
  | "enterprise";
type PlanType = "free" | "basic" | "pro" | "premium" | "enterprise" | "annual" | "school_partner";
type BillingCycle = "monthly" | "quarterly" | "annually" | "lifetime";
type RefundStatus = "none" | "requested" | "processing" | "completed" | "rejected";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  fee: number;
  netAmount: number;
  status: TransactionStatus;
  reference: string;
  paystackReference?: string;
  flutterwaveReference?: string;
  cardUsed?: string;
  last4?: string;
  paymentMethod?: PaymentMethod;
  channel: PaymentChannel;
  invoiceUrl?: string;
  receiptUrl?: string;

  // Customer info
  userId: string;
  userName: string;
  userEmail: string;
  userRole: "student" | "tutor" | "school_admin" | "super_admin";

  // Revenue classification
  revenueType: RevenueType;
  planType?: PlanType;
  billingCycle?: BillingCycle;

  // Metadata
  ipAddress?: string;
  location?: string;
  deviceInfo?: string;
  isRecurring: boolean;
  subscriptionId?: string;
  contentId?: string;

  // Refund info
  refundStatus: RefundStatus;
  refundAmount?: number;
  refundDate?: string;
  refundReason?: string;

  // Flags
  isFraudulent: boolean;
  isDisputed: boolean;
  notes?: string;
  tags: string[];
}

interface Subscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  plan: PlanType;
  billingCycle: BillingCycle;
  status: "active" | "cancelled" | "expired" | "paused" | "trial";
  startDate: string;
  endDate?: string;
  nextBillingDate?: string;
  amount: number;
  discountApplied: number;
  totalPaid: number;
  paymentMethod: string;
  autoRenew: boolean;
  failureCount: number;
  lastFailureDate?: string;
  createdAt: string;
}

interface RevenueStats {
  totalRevenue: number;
  netRevenue: number;
  totalFees: number;
  totalRefunds: number;
  monthlyRecurringRevenue: number;
  annualRecurringRevenue: number;
  averageTransactionValue: number;
  customerLifetimeValue: number;

  subscriptionRevenue: number;
  oneTimeRevenue: number;
  contentRevenue: number;
  tutorRevenue: number;
  schoolRevenue: number;
  enterpriseRevenue: number;

  activeSubscriptions: number;
  trialSubscriptions: number;
  cancelledSubscriptions: number;
  churnRate: number;
  conversionRate: number;

  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  pendingTransactions: number;
  refundedTransactions: number;

  revenueByMonth: { month: string; revenue: number; subscriptions: number; oneTime: number }[];
  revenueByPlan: { plan: string; revenue: number; count: number }[];
  revenueByChannel: { channel: string; revenue: number; percentage: number }[];
  revenueByRole: { role: string; revenue: number; count: number }[];
  customerAcquisition: { month: string; newCustomers: number; churnedCustomers: number }[];
  topCustomers: { name: string; email: string; totalSpent: number; plan: string }[];
}

// ─── CONSTANTS ──────────────────────────────────────────────
const TX_STATUS_CONFIG: Record<
  TransactionStatus,
  { label: string; icon: any; bg: string; text: string }
> = {
  paid: { label: "Paid", icon: CheckCircle, bg: "#10b98115", text: "#10b981" },
  failed: { label: "Failed", icon: XCircle, bg: "#ef444415", text: "#ef4444" },
  refunded: { label: "Refunded", icon: RotateCcw, bg: "#f59e0b15", text: "#f59e0b" },
  pending: { label: "Pending", icon: Clock, bg: "#3b82f615", text: "#3b82f6" },
  processing: { label: "Processing", icon: Activity, bg: "#8b5cf615", text: "#8b5cf6" },
  cancelled: { label: "Cancelled", icon: Ban, bg: "#6b728015", text: "#6b7280" },
};

const CHANNEL_CONFIG: Record<PaymentChannel, { label: string; icon: any; color: string }> = {
  card: { label: "Card", icon: CreditCard, color: "#2e8b57" },
  bank_transfer: { label: "Bank Transfer", icon: Building, color: "#3b82f6" },
  ussd: { label: "USSD", icon: Smartphone, color: "#8b5cf6" },
  qr: { label: "QR Code", icon: QrCode, color: "#f59e0b" },
  wallet: { label: "Wallet", icon: Wallet, color: "#14b8a6" },
  direct_debit: { label: "Direct Debit", icon: Landmark, color: "#ef4444" },
};

const PLAN_CONFIG: Record<PlanType, { label: string; color: string; bg: string }> = {
  free: { label: "Free", color: "#6b7280", bg: "#6b728015" },
  basic: { label: "Basic", color: "#3b82f6", bg: "#3b82f615" },
  pro: { label: "Pro", color: "#8b5cf6", bg: "#8b5cf615" },
  premium: { label: "Premium", color: "#f59e0b", bg: "#f59e0b15" },
  enterprise: { label: "Enterprise", color: "#ef4444", bg: "#ef444415" },
  annual: { label: "Annual Pro", color: "#10b981", bg: "#10b98115" },
  school_partner: { label: "School Partner", color: "#6366f1", bg: "#6366f115" },
};

const REVENUE_COLORS = [
  "#2e8b57",
  "#3b82f6",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#14b8a6",
  "#ec4899",
  "#f97316",
];

// ─── MOCK DATA GENERATOR ────────────────────────────────────
function generateMockTransactions(count: number): Transaction[] {
  const statuses: TransactionStatus[] = [
    "paid",
    "paid",
    "paid",
    "paid",
    "failed",
    "refunded",
    "pending",
    "processing",
  ];
  const channels: PaymentChannel[] = ["card", "card", "bank_transfer", "ussd", "qr", "wallet"];
  const revenueTypes: RevenueType[] = [
    "subscription",
    "subscription",
    "content_purchase",
    "tutor_booking",
    "school_license",
  ];
  const plans: PlanType[] = ["basic", "pro", "premium", "enterprise", "annual"];
  const roles: ("student" | "tutor" | "school_admin" | "super_admin")[] = [
    "student",
    "student",
    "tutor",
    "school_admin",
  ];
  const users = [
    { id: "usr_001", name: "Oluwaseun Adebayo", email: "oluwaseun@email.com" },
    { id: "usr_002", name: "Chioma Eze", email: "chioma@email.com" },
    { id: "usr_003", name: "Emeka Nwachukwu", email: "emeka@email.com" },
    { id: "usr_004", name: "Fatima Suleiman", email: "fatima@email.com" },
    { id: "usr_005", name: "Tunde Bakare", email: "tunde@email.com" },
  ];
  const descriptions = [
    "Pro Plan - Monthly Subscription",
    "Basic Plan - Monthly Subscription",
    "Premium Plan - Annual Subscription",
    "JAMB Past Papers Pack",
    "Physics Video Bundle (SS3)",
    "Tutor Booking - Mr. Johnson",
    "School License - Lagos Prep",
    "Enterprise Plan Upgrade",
    "Content Bundle Purchase",
    "Practice Set - Mathematics",
  ];

  return Array.from({ length: count }, (_, i) => {
    const amount = Math.floor(Math.random() * 50000) + 500;
    const fee = Math.round(amount * 0.015);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const isRefunded = status === "refunded";

    return {
      id: `txn_${(i + 1).toString().padStart(6, "0")}`,
      date: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
        .toISOString()
        .split("T")[0],
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      amount,
      fee,
      netAmount: amount - fee,
      status,
      reference: `REF_${Math.random().toString(36).substr(2, 10).toUpperCase()}`,
      paystackReference: `PSTK_${Math.random().toString(36).substr(2, 12)}`,
      cardUsed: "VISA •••• 4242",
      last4: "4242",
      paymentMethod: "visa",
      channel: channels[Math.floor(Math.random() * channels.length)],
      invoiceUrl: "#",
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: roles[Math.floor(Math.random() * roles.length)],
      revenueType: revenueTypes[Math.floor(Math.random() * revenueTypes.length)],
      planType: plans[Math.floor(Math.random() * plans.length)],
      billingCycle: "monthly",
      ipAddress: "192.168.1.1",
      location: "Lagos, Nigeria",
      deviceInfo: "Chrome on Windows",
      isRecurring: Math.random() > 0.5,
      subscriptionId:
        Math.random() > 0.5 ? `sub_${Math.random().toString(36).substr(2, 8)}` : undefined,
      refundStatus: isRefunded ? "completed" : "none",
      refundAmount: isRefunded ? amount : undefined,
      refundDate: isRefunded ? new Date().toISOString().split("T")[0] : undefined,
      isFraudulent: Math.random() > 0.95,
      isDisputed: Math.random() > 0.9,
      tags: [],
    };
  });
}

function generateMockSubscriptions(count: number): Subscription[] {
  const plans: PlanType[] = ["basic", "pro", "premium", "enterprise", "annual"];
  const billingCycles: BillingCycle[] = ["monthly", "monthly", "monthly", "quarterly", "annually"];
  const statuses: Subscription["status"][] = [
    "active",
    "active",
    "active",
    "cancelled",
    "expired",
    "trial",
    "paused",
  ];
  const users = [
    { id: "usr_001", name: "Oluwaseun Adebayo", email: "oluwaseun@email.com", role: "student" },
    { id: "usr_002", name: "Chioma Eze", email: "chioma@email.com", role: "student" },
    { id: "usr_003", name: "Emeka Nwachukwu", email: "emeka@email.com", role: "tutor" },
    {
      id: "usr_004",
      name: "Lagos Preparatory School",
      email: "admin@lagos.edu.ng",
      role: "school_admin",
    },
    { id: "usr_005", name: "Tunde Bakare", email: "tunde@email.com", role: "student" },
  ];

  return Array.from({ length: count }, (_, i) => {
    const plan = plans[Math.floor(Math.random() * plans.length)];
    const planConfig = PLAN_CONFIG[plan];
    const user = users[Math.floor(Math.random() * users.length)];
    const startDate = new Date(
      2024,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1,
    );
    const amounts: Record<PlanType, number> = {
      free: 0,
      basic: 1500,
      pro: 2500,
      premium: 5000,
      enterprise: 15000,
      annual: 24000,
      school_partner: 100000,
    };

    return {
      id: `sub_${(i + 1).toString().padStart(6, "0")}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      plan,
      billingCycle: billingCycles[Math.floor(Math.random() * billingCycles.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      startDate: startDate.toISOString().split("T")[0],
      endDate:
        Math.random() > 0.7
          ? new Date(startDate.getTime() + Math.random() * 365 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0]
          : undefined,
      nextBillingDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      amount: amounts[plan],
      discountApplied: Math.random() > 0.7 ? Math.floor(Math.random() * 500) : 0,
      totalPaid: amounts[plan] * (Math.floor(Math.random() * 12) + 1),
      paymentMethod: "VISA •••• 4242",
      autoRenew: Math.random() > 0.3,
      failureCount: Math.floor(Math.random() * 3),
      lastFailureDate: Math.random() > 0.8 ? new Date().toISOString().split("T")[0] : undefined,
      createdAt: startDate.toISOString().split("T")[0],
    };
  });
}

function generateRevenueStats(): RevenueStats {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return {
    totalRevenue: 48500000,
    netRevenue: 44150000,
    totalFees: 4350000,
    totalRefunds: 2850000,
    monthlyRecurringRevenue: 3200000,
    annualRecurringRevenue: 38400000,
    averageTransactionValue: 3200,
    customerLifetimeValue: 45000,

    subscriptionRevenue: 28500000,
    oneTimeRevenue: 8500000,
    contentRevenue: 6200000,
    tutorRevenue: 3500000,
    schoolRevenue: 1200000,
    enterpriseRevenue: 600000,

    activeSubscriptions: 12450,
    trialSubscriptions: 2340,
    cancelledSubscriptions: 3210,
    churnRate: 3.2,
    conversionRate: 28.5,

    totalTransactions: 15234,
    successfulTransactions: 13450,
    failedTransactions: 890,
    pendingTransactions: 456,
    refundedTransactions: 438,

    revenueByMonth: months.map((month, i) => ({
      month,
      revenue: Math.floor(Math.random() * 2000000 + 3000000),
      subscriptions: Math.floor(Math.random() * 1500000 + 2000000),
      oneTime: Math.floor(Math.random() * 500000 + 500000),
    })),
    revenueByPlan: [
      { plan: "Pro", revenue: 18500000, count: 7400 },
      { plan: "Premium", revenue: 8500000, count: 1700 },
      { plan: "Basic", revenue: 6200000, count: 4100 },
      { plan: "Enterprise", revenue: 4500000, count: 300 },
      { plan: "Annual", revenue: 3800000, count: 150 },
      { plan: "School Partner", revenue: 1200000, count: 10 },
    ],
    revenueByChannel: [
      { channel: "Card", revenue: 28500000, percentage: 58.8 },
      { channel: "Bank Transfer", revenue: 12000000, percentage: 24.7 },
      { channel: "USSD", revenue: 4500000, percentage: 9.3 },
      { channel: "Wallet", revenue: 2500000, percentage: 5.2 },
      { channel: "QR Code", revenue: 1000000, percentage: 2.0 },
    ],
    revenueByRole: [
      { role: "Students", revenue: 32000000, count: 11800 },
      { role: "Tutors", revenue: 8500000, count: 2800 },
      { role: "Schools", revenue: 7200000, count: 450 },
      { role: "Enterprise", revenue: 800000, count: 25 },
    ],
    customerAcquisition: months.map((month, i) => ({
      month,
      newCustomers: Math.floor(Math.random() * 500 + 200),
      churnedCustomers: Math.floor(Math.random() * 100 + 50),
    })),
    topCustomers: [
      {
        name: "Lagos Preparatory School",
        email: "admin@lagos.edu.ng",
        totalSpent: 2500000,
        plan: "Enterprise",
      },
      {
        name: "Abuja International Academy",
        email: "info@abuja.edu.ng",
        totalSpent: 1800000,
        plan: "Enterprise",
      },
      {
        name: "Dr. Adebayo Ola",
        email: "adebayo@email.com",
        totalSpent: 450000,
        plan: "Annual Pro",
      },
      {
        name: "Prof. Chukwuma Eze",
        email: "chukwuma@email.com",
        totalSpent: 380000,
        plan: "Premium",
      },
      { name: "Mrs. Grace Okonkwo", email: "grace@email.com", totalSpent: 320000, plan: "Pro" },
    ],
  };
}

// ─── MAIN COMPONENT ────────────────────────────────────────
export default function AdminPaymentsPage() {
  const [viewMode, setViewMode] = useState<
    "transactions" | "subscriptions" | "analytics" | "refunds"
  >("analytics");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<RevenueStats>(generateRevenueStats());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTxns, setSelectedTxns] = useState<Set<string>>(new Set());
  const [showRefundModal, setShowRefundModal] = useState<string | null>(null);

  // Filters
  const [filters, setFilters] = useState({
    status: "" as TransactionStatus | "",
    channel: "" as PaymentChannel | "",
    revenueType: "" as RevenueType | "",
    planType: "" as PlanType | "",
    userRole: "" as string,
    dateFrom: "",
    dateTo: "",
    minAmount: "",
    maxAmount: "",
  });

  // Sorting
  const [sortField, setSortField] = useState<"date" | "amount" | "status">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Analytics time range
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y" | "all">("1y");

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setTransactions(generateMockTransactions(200));
      setSubscriptions(generateMockSubscriptions(100));
      setLoading(false);
    }, 800);
  }, []);

  // ─── COMPUTED VALUES ─────────────────────────────────────
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((txn) => {
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          if (
            !txn.description.toLowerCase().includes(query) &&
            !txn.userName.toLowerCase().includes(query) &&
            !txn.userEmail.toLowerCase().includes(query) &&
            !txn.reference.toLowerCase().includes(query)
          ) {
            return false;
          }
        }

        if (filters.status && txn.status !== filters.status) return false;
        if (filters.channel && txn.channel !== filters.channel) return false;
        if (filters.revenueType && txn.revenueType !== filters.revenueType) return false;
        if (filters.planType && txn.planType !== filters.planType) return false;
        if (filters.userRole && txn.userRole !== filters.userRole) return false;
        if (filters.dateFrom && txn.date < filters.dateFrom) return false;
        if (filters.dateTo && txn.date > filters.dateTo) return false;
        if (filters.minAmount && txn.amount < parseInt(filters.minAmount)) return false;
        if (filters.maxAmount && txn.amount > parseInt(filters.maxAmount)) return false;

        return true;
      })
      .sort((a, b) => {
        let comparison = 0;
        switch (sortField) {
          case "date":
            comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
            break;
          case "amount":
            comparison = a.amount - b.amount;
            break;
          case "status":
            comparison = a.status.localeCompare(b.status);
            break;
        }
        return sortDirection === "asc" ? comparison : -comparison;
      });
  }, [transactions, searchQuery, filters, sortField, sortDirection]);

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const activeFilterCount = Object.values(filters).filter((v) => v !== "").length;

  const clearFilters = () => {
    setFilters({
      status: "",
      channel: "",
      revenueType: "",
      planType: "",
      userRole: "",
      dateFrom: "",
      dateTo: "",
      minAmount: "",
      maxAmount: "",
    });
    setSearchQuery("");
  };

  const handleExport = () => {
    const csv = [
      [
        "Date",
        "Description",
        "Amount",
        "Fee",
        "Net",
        "Status",
        "Reference",
        "Customer",
        "Email",
        "Channel",
        "Type",
      ].join(","),
      ...filteredTransactions.map((t) =>
        [
          t.date,
          `"${t.description}"`,
          t.amount,
          t.fee,
          t.netAmount,
          t.status,
          t.reference,
          t.userName,
          t.userEmail,
          t.channel,
          t.revenueType,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const handleRefund = (transactionId: string) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === transactionId
          ? {
              ...t,
              status: "refunded" as TransactionStatus,
              refundStatus: "completed" as RefundStatus,
              refundAmount: t.amount,
              refundDate: new Date().toISOString().split("T")[0],
            }
          : t,
      ),
    );
    setShowRefundModal(null);
  };

  // ─── RENDER ──────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-serif text-3xl text-green-900 mb-2">Payments & Revenue</h1>
            <p className="text-text-muted">
              Manage transactions, subscriptions, refunds, and revenue analytics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-cream transition-all text-[14px] font-medium text-text-muted">
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 mt-4">
          {(
            [
              { key: "analytics", label: "Analytics", icon: BarChart3 },
              { key: "transactions", label: "Transactions", icon: ArrowRightLeft },
              { key: "subscriptions", label: "Subscriptions", icon: RefreshCw },
              { key: "refunds", label: "Refunds", icon: RotateCcw },
            ] as const
          ).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setViewMode(key)}
              className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all flex items-center gap-2 ${
                viewMode === key
                  ? "bg-green-800 text-white"
                  : "bg-white border border-gray-200 text-text-muted hover:bg-cream"
              }`}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── ANALYTICS VIEW ─── */}
      {viewMode === "analytics" && (
        <div className="space-y-6">
          {/* Revenue Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            <RevenueCard
              icon={DollarSign}
              label="Total Revenue"
              value={`₦${(stats.totalRevenue / 1000000).toFixed(1)}M`}
              color="#2e8b57"
              trend={12}
            />
            <RevenueCard
              icon={Activity}
              label="Net Revenue"
              value={`₦${(stats.netRevenue / 1000000).toFixed(1)}M`}
              color="#10b981"
              trend={8}
            />
            <RevenueCard
              icon={RefreshCw}
              label="MRR"
              value={`₦${(stats.monthlyRecurringRevenue / 1000000).toFixed(1)}M`}
              color="#3b82f6"
              trend={15}
            />
            <RevenueCard
              icon={Calendar}
              label="ARR"
              value={`₦${(stats.annualRecurringRevenue / 1000000).toFixed(1)}M`}
              color="#8b5cf6"
            />
            <RevenueCard
              icon={Users}
              label="Active Subs"
              value={stats.activeSubscriptions.toLocaleString()}
              color="#f59e0b"
              trend={5}
            />
            <RevenueCard
              icon={RotateCcw}
              label="Refunds"
              value={`₦${(stats.totalRefunds / 1000000).toFixed(1)}M`}
              color="#ef4444"
              trend={-3}
            />
            <RevenueCard
              icon={TrendingDown}
              label="Churn Rate"
              value={`${stats.churnRate}%`}
              color="#f97316"
            />
            <RevenueCard
              icon={Target}
              label="Conversion"
              value={`${stats.conversionRate}%`}
              color="#6366f1"
              trend={2}
            />
          </div>

          {/* Revenue Over Time Chart */}
          <div
            className="p-6 rounded-2xl bg-white border"
            style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-lg text-green-900">Revenue Over Time</h3>
              <div className="flex gap-2">
                {(["7d", "30d", "90d", "1y", "all"] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
                      timeRange === range
                        ? "bg-green-800 text-white"
                        : "bg-gray-100 text-text-muted hover:bg-gray-200"
                    }`}>
                    {range === "7d"
                      ? "7D"
                      : range === "30d"
                        ? "30D"
                        : range === "90d"
                          ? "90D"
                          : range === "1y"
                            ? "1Y"
                            : "All"}
                  </button>
                ))}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={stats.revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,80,50,0.1)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b7280" }} />
                <YAxis
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  tickFormatter={(v) => `₦${(v / 1000000).toFixed(0)}M`}
                />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "1px solid rgba(30,80,50,0.1)" }}
                  formatter={(value: number, name: string) => [`₦${value.toLocaleString()}`, name]}
                />
                <Legend />
                <Bar
                  dataKey="subscriptions"
                  name="Subscriptions"
                  fill="#2e8b57"
                  radius={[4, 4, 0, 0]}
                />
                <Bar dataKey="oneTime" name="One-Time" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Total"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Distribution Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue by Plan */}
            <div
              className="p-6 rounded-2xl bg-white border"
              style={{ borderColor: "rgba(30,80,50,0.08)" }}>
              <h3 className="font-serif text-lg text-green-900 mb-4">Revenue by Plan</h3>
              <ResponsiveContainer width="100%" height={250}>
                <RechartsPieChart>
                  <Pie
                    data={stats.revenueByPlan}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="revenue"
                    nameKey="plan">
                    {stats.revenueByPlan.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={REVENUE_COLORS[index % REVENUE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `₦${value.toLocaleString()}`} />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue by Channel */}
            <div
              className="p-6 rounded-2xl bg-white border"
              style={{ borderColor: "rgba(30,80,50,0.08)" }}>
              <h3 className="font-serif text-lg text-green-900 mb-4">Revenue by Channel</h3>
              <div className="space-y-3">
                {stats.revenueByChannel.map((item) => (
                  <div key={item.channel} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          background:
                            REVENUE_COLORS[
                              stats.revenueByChannel.indexOf(item) % REVENUE_COLORS.length
                            ],
                        }}
                      />
                      <span className="text-[13px] text-green-900">{item.channel}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[13px] font-bold text-green-900">
                        ₦{(item.revenue / 1000000).toFixed(1)}M
                      </span>
                      <span className="text-[12px] text-text-muted">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Acquisition */}
            <div
              className="p-6 rounded-2xl bg-white border"
              style={{ borderColor: "rgba(30,80,50,0.08)" }}>
              <h3 className="font-serif text-lg text-green-900 mb-4">Customer Acquisition</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats.customerAcquisition}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,80,50,0.1)" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#6b7280" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} />
                  <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
                  <Bar dataKey="newCustomers" name="New" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar
                    dataKey="churnedCustomers"
                    name="Churned"
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Customers */}
          <div
            className="p-6 rounded-2xl bg-white border"
            style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <h3 className="font-serif text-lg text-green-900 mb-4">Top Customers</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
                    <th className="text-left py-3 px-4 text-[12px] font-semibold text-text-muted">
                      #
                    </th>
                    <th className="text-left py-3 px-4 text-[12px] font-semibold text-text-muted">
                      Customer
                    </th>
                    <th className="text-left py-3 px-4 text-[12px] font-semibold text-text-muted">
                      Plan
                    </th>
                    <th className="text-right py-3 px-4 text-[12px] font-semibold text-text-muted">
                      Total Spent
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topCustomers.map((customer, index) => (
                    <tr
                      key={customer.email}
                      className="border-b"
                      style={{ borderColor: "rgba(30,80,50,0.05)" }}>
                      <td className="py-3 px-4 text-[13px] font-bold text-green-900">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-[13px] font-semibold text-green-900">
                          {customer.name}
                        </div>
                        <div className="text-[11px] text-text-muted">{customer.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className="px-2 py-1 rounded-full text-[11px] font-semibold"
                          style={{
                            background: PLAN_CONFIG[customer.plan as PlanType]?.bg,
                            color: PLAN_CONFIG[customer.plan as PlanType]?.color,
                          }}>
                          {customer.plan}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-[13px] font-bold text-green-900">
                        ₦{customer.totalSpent.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TRANSACTIONS VIEW ─── */}
      {viewMode === "transactions" && (
        <>
          {/* Search & Filters */}
          <div
            className="bg-white rounded-2xl border p-4 mb-6"
            style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                />
                <input
                  type="text"
                  placeholder="Search by description, customer name, email, or reference..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all text-[14px] font-medium ${
                    showFilters || activeFilterCount > 0
                      ? "bg-green-800 text-white border-green-800"
                      : "bg-white text-text-muted border-gray-200 hover:border-green-800/30"
                  }`}>
                  <Filter size={16} /> Filters
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-gold text-green-900 text-[11px] font-bold flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-all text-[14px] font-medium">
                    <FilterX size={16} /> Clear
                  </button>
                )}
              </div>
            </div>

            {showFilters && (
              <div
                className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-4"
                style={{ borderColor: "rgba(30,80,50,0.08)" }}>
                <FilterSelect
                  label="Status"
                  value={filters.status}
                  onChange={(v) => setFilters((p) => ({ ...p, status: v as TransactionStatus }))}
                  options={[
                    { value: "", label: "All" },
                    ...Object.entries(TX_STATUS_CONFIG).map(([k, v]) => ({
                      value: k,
                      label: v.label,
                    })),
                  ]}
                />
                <FilterSelect
                  label="Channel"
                  value={filters.channel}
                  onChange={(v) => setFilters((p) => ({ ...p, channel: v as PaymentChannel }))}
                  options={[
                    { value: "", label: "All" },
                    ...Object.entries(CHANNEL_CONFIG).map(([k, v]) => ({
                      value: k,
                      label: v.label,
                    })),
                  ]}
                />
                <FilterSelect
                  label="Type"
                  value={filters.revenueType}
                  onChange={(v) => setFilters((p) => ({ ...p, revenueType: v as RevenueType }))}
                  options={[
                    { value: "", label: "All" },
                    { value: "subscription", label: "Subscription" },
                    { value: "one_time", label: "One-Time" },
                    { value: "content_purchase", label: "Content" },
                    { value: "tutor_booking", label: "Tutor" },
                    { value: "school_license", label: "School" },
                  ]}
                />
                <div>
                  <label className="block text-[12px] font-semibold text-green-900 mb-2">
                    Amount Range
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minAmount}
                      onChange={(e) => setFilters((p) => ({ ...p, minAmount: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-[13px]"
                    />
                    <span className="text-text-muted">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxAmount}
                      onChange={(e) => setFilters((p) => ({ ...p, maxAmount: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-[13px]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Transactions Table */}
          <div
            className="bg-white rounded-2xl border overflow-hidden"
            style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    className="bg-cream/50 border-b"
                    style={{ borderColor: "rgba(30,80,50,0.08)" }}>
                    <th className="text-left px-4 py-3 text-[12px] font-semibold text-text-muted uppercase">
                      Date
                    </th>
                    <th className="text-left px-4 py-3 text-[12px] font-semibold text-text-muted uppercase">
                      Description
                    </th>
                    <th className="text-left px-4 py-3 text-[12px] font-semibold text-text-muted uppercase">
                      Customer
                    </th>
                    <th className="text-right px-4 py-3 text-[12px] font-semibold text-text-muted uppercase">
                      Amount
                    </th>
                    <th className="text-right px-4 py-3 text-[12px] font-semibold text-text-muted uppercase">
                      Fee
                    </th>
                    <th className="text-right px-4 py-3 text-[12px] font-semibold text-text-muted uppercase">
                      Net
                    </th>
                    <th className="text-center px-4 py-3 text-[12px] font-semibold text-text-muted uppercase">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-[12px] font-semibold text-text-muted uppercase">
                      Channel
                    </th>
                    <th className="text-center px-4 py-3 text-[12px] font-semibold text-text-muted uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
                  {paginatedTransactions.map((txn) => {
                    const statusConfig = TX_STATUS_CONFIG[txn.status];
                    const channelConfig = CHANNEL_CONFIG[txn.channel];
                    const StatusIcon = statusConfig.icon;
                    const ChannelIcon = channelConfig.icon;

                    return (
                      <tr key={txn.id} className="hover:bg-cream/20 transition-colors">
                        <td className="px-4 py-3 text-[13px] text-green-900 whitespace-nowrap">
                          {txn.date}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-[13px] text-green-900 font-medium">
                            {txn.description}
                          </div>
                          <div className="text-[11px] text-text-muted">{txn.reference}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-[13px] text-green-900">{txn.userName}</div>
                          <div className="text-[11px] text-text-muted">{txn.userEmail}</div>
                        </td>
                        <td className="px-4 py-3 text-right text-[13px] font-bold text-green-900">
                          ₦{txn.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right text-[13px] text-text-muted">
                          ₦{txn.fee.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right text-[13px] font-semibold text-green-900">
                          ₦{txn.netAmount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                            style={{ background: statusConfig.bg, color: statusConfig.text }}>
                            <StatusIcon size={12} /> {statusConfig.label}
                          </span>
                          {txn.refundStatus !== "none" && (
                            <span className="block text-[10px] text-orange-500 mt-0.5">
                              Refunded
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 text-[12px] text-text-muted">
                            <ChannelIcon size={12} style={{ color: channelConfig.color }} />
                            {channelConfig.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              className="p-1.5 rounded-lg hover:bg-green-50 transition-colors"
                              title="View">
                              <Eye size={14} className="text-text-muted" />
                            </button>
                            <button
                              className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                              title="Download Invoice">
                              <FileText size={14} className="text-text-muted" />
                            </button>
                            {txn.status === "paid" && txn.refundStatus === "none" && (
                              <button
                                onClick={() => setShowRefundModal(txn.id)}
                                className="p-1.5 rounded-lg hover:bg-orange-50 transition-colors"
                                title="Refund">
                                <RotateCcw size={14} className="text-orange-500" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div
              className="px-6 py-4 border-t flex items-center justify-between"
              style={{ borderColor: "rgba(30,80,50,0.08)" }}>
              <span className="text-[13px] text-text-muted">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-[13px] disabled:opacity-50">
                  First
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-[13px] disabled:opacity-50">
                  Prev
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-lg text-[13px] font-medium ${page === currentPage ? "bg-green-800 text-white" : "border border-gray-200"}`}>
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-[13px] disabled:opacity-50">
                  Next
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-[13px] disabled:opacity-50">
                  Last
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ─── SUBSCRIPTIONS VIEW ─── */}
      {viewMode === "subscriptions" && (
        <div
          className="bg-white rounded-2xl border overflow-hidden"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-cream/50 border-b" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
                  <th className="text-left px-4 py-3 text-[12px] font-semibold text-text-muted uppercase">
                    Customer
                  </th>
                  <th className="text-left px-4 py-3 text-[12px] font-semibold text-text-muted uppercase">
                    Plan
                  </th>
                  <th className="text-center px-4 py-3 text-[12px] font-semibold text-text-muted uppercase">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-[12px] font-semibold text-text-muted uppercase">
                    Started
                  </th>
                  <th className="text-left px-4 py-3 text-[12px] font-semibold text-text-muted uppercase">
                    Next Billing
                  </th>
                  <th className="text-right px-4 py-3 text-[12px] font-semibold text-text-muted uppercase">
                    Amount
                  </th>
                  <th className="text-right px-4 py-3 text-[12px] font-semibold text-text-muted uppercase">
                    Total Paid
                  </th>
                  <th className="text-center px-4 py-3 text-[12px] font-semibold text-text-muted uppercase">
                    Auto Renew
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
                {subscriptions.map((sub) => {
                  const planConfig = PLAN_CONFIG[sub.plan];
                  return (
                    <tr key={sub.id} className="hover:bg-cream/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="text-[13px] font-semibold text-green-900">
                          {sub.userName}
                        </div>
                        <div className="text-[11px] text-text-muted">{sub.userEmail}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                          style={{ background: planConfig.bg, color: planConfig.color }}>
                          {planConfig.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            sub.status === "active"
                              ? "bg-green-100 text-green-600"
                              : sub.status === "trial"
                                ? "bg-blue-100 text-blue-600"
                                : sub.status === "paused"
                                  ? "bg-yellow-100 text-yellow-600"
                                  : "bg-red-100 text-red-600"
                          }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[13px] text-green-900">{sub.startDate}</td>
                      <td className="px-4 py-3 text-[13px] text-green-900">
                        {sub.nextBillingDate || "—"}
                      </td>
                      <td className="px-4 py-3 text-right text-[13px] font-bold text-green-900">
                        ₦{sub.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-[13px] text-green-900">
                        ₦{sub.totalPaid.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {sub.autoRenew ? (
                          <Check size={16} className="text-green-600 mx-auto" />
                        ) : (
                          <X size={16} className="text-red-400 mx-auto" />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── REFUNDS VIEW ─── */}
      {viewMode === "refunds" && (
        <div
          className="bg-white rounded-2xl border overflow-hidden"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-cream/50 border-b" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
                  <th className="text-left px-4 py-3 text-[12px] font-semibold text-text-muted uppercase">
                    Date
                  </th>
                  <th className="text-left px-4 py-3 text-[12px] font-semibold text-text-muted uppercase">
                    Customer
                  </th>
                  <th className="text-left px-4 py-3 text-[12px] font-semibold text-text-muted uppercase">
                    Description
                  </th>
                  <th className="text-right px-4 py-3 text-[12px] font-semibold text-text-muted uppercase">
                    Amount
                  </th>
                  <th className="text-center px-4 py-3 text-[12px] font-semibold text-text-muted uppercase">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-[12px] font-semibold text-text-muted uppercase">
                    Reason
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
                {transactions
                  .filter((t) => t.refundStatus !== "none")
                  .map((txn) => (
                    <tr key={txn.id} className="hover:bg-cream/20 transition-colors">
                      <td className="px-4 py-3 text-[13px] text-green-900">{txn.refundDate}</td>
                      <td className="px-4 py-3">
                        <div className="text-[13px] text-green-900">{txn.userName}</div>
                        <div className="text-[11px] text-text-muted">{txn.userEmail}</div>
                      </td>
                      <td className="px-4 py-3 text-[13px] text-green-900">{txn.description}</td>
                      <td className="px-4 py-3 text-right text-[13px] font-bold text-red-600">
                        -₦{txn.refundAmount?.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-orange-100 text-orange-600">
                          Refunded
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[13px] text-text-muted">
                        {txn.refundReason || "Customer request"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Refund Confirmation Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="font-serif text-xl text-green-900 mb-4">Process Refund</h3>
            <p className="text-[14px] text-text-muted mb-6">
              Are you sure you want to refund this transaction? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRefundModal(null)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-[14px] font-semibold text-text-muted hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={() => handleRefund(showRefundModal)}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-all text-[14px]">
                Confirm Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── HELPER COMPONENTS ──────────────────────────────────────
function RevenueCard({
  icon: Icon,
  label,
  value,
  color,
  trend,
}: {
  icon: any;
  label: string;
  value: string;
  color: string;
  trend?: number;
}) {
  return (
    <div
      className="p-3 rounded-2xl bg-white border transition-all hover:-translate-y-1"
      style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${color}15` }}>
          <Icon size={14} style={{ color }} />
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 text-[10px] font-semibold ${trend >= 0 ? "text-green-600" : "text-red-500"}`}>
            {trend >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="text-lg font-bold text-green-900">{value}</div>
      <div className="text-[11px] text-text-muted">{label}</div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-[12px] font-semibold text-green-900 mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-500/30">
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
