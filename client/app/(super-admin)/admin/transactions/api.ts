import { CHANNEL_CONFIG } from "@/lib/constants/billing";
import type {
  Transaction,
  Subscription,
  RevenueStats,
  TransactionStatus,
  PaymentChannel,
  RevenueType,
  PlanType,
} from "./types";

// Mock data generators
const generateMockTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const statuses: TransactionStatus[] = ["paid", "pending", "failed", "refunded", "disputed"];
  const channels: PaymentChannel[] = [
    "card",
    "bank_transfer",
    "ussd",
    "paystack",
    "flutterwave",
    "opay",
    "palmpay",
  ];
  const revenueTypes: RevenueType[] = [
    "subscription",
    "one_time",
    "addon",
    "tutor_booking",
    "school_plan",
  ];
  const names = [
    "John Doe",
    "Jane Smith",
    "Michael Okafor",
    "Chioma Eze",
    "Emeka Nwosu",
    "Aisha Bello",
    "Oluwaseun Adebayo",
  ];
  const emails = [
    "john@example.com",
    "jane@example.com",
    "michael@gravitas.ng",
    "chioma@gravitas.ng",
    "emeka@gravitas.ng",
    "aisha@gravitas.ng",
    "seun@gravitas.ng",
  ];

  for (let i = 0; i < 250; i++) {
    const amount = Math.floor(Math.random() * 100000) + 2500;
    const fee = Math.floor(amount * 0.015);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const date = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);

    transactions.push({
      id: `tx_${i + 1000}`,
      reference: `GRAV-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(i + 1000).padStart(6, "0")}`,
      paystackReference: `pay_${Math.random().toString(36).substring(2, 10)}`,
      description: `${revenueTypes[Math.floor(Math.random() * revenueTypes.length)]} payment`,
      amount,
      fee,
      netAmount: amount - fee,
      status,
      channel: channels[Math.floor(Math.random() * channels.length)],
      revenueType: revenueTypes[Math.floor(Math.random() * revenueTypes.length)],
      userRole: Math.random() > 0.8 ? "school_admin" : Math.random() > 0.9 ? "tutor" : "student",
      userId: `user_${Math.floor(Math.random() * 1000)}`,
      userName: names[Math.floor(Math.random() * names.length)],
      userEmail: emails[Math.floor(Math.random() * emails.length)],
      date: date.toISOString().split("T")[0],
      cardUsed: Math.random() > 0.7 ? `**** ${Math.floor(Math.random() * 9000 + 1000)}` : undefined,
      bankName: Math.random() > 0.8 ? "GTBank" : undefined,
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      location: ["Lagos", "Abuja", "Port Harcourt", "Kano", "Ibadan"][
        Math.floor(Math.random() * 5)
      ],
      deviceInfo: Math.random() > 0.5 ? "Chrome/Windows" : "Safari/iOS",
      invoiceUrl:
        Math.random() > 0.7
          ? `https://paystack.com/invoice/${Math.random().toString(36).substring(2)}`
          : undefined,
      isFraudulent: Math.random() < 0.03,
      isDisputed: Math.random() < 0.02,
      refundStatus: status === "refunded" ? "completed" : "none",
      refundAmount: status === "refunded" ? amount : undefined,
      refundDate:
        status === "refunded"
          ? new Date(date.getTime() + 86400000).toISOString().split("T")[0]
          : undefined,
    });
  }

  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const generateMockSubscriptions = (): Subscription[] => {
  const subscriptions: Subscription[] = [];
  const plans: PlanType[] = ["student_pro", "student_pro_annual", "school", "enterprise"];
  const names = ["John Doe", "Jane Smith", "Michael Okafor", "Chioma Eze", "Emeka Nwosu"];
  const emails = [
    "john@example.com",
    "jane@example.com",
    "michael@gravitas.ng",
    "chioma@gravitas.ng",
    "emeka@gravitas.ng",
  ];

  for (let i = 0; i < 50; i++) {
    const plan = plans[Math.floor(Math.random() * plans.length)];
    const amount =
      plan === "student_pro"
        ? 2500
        : plan === "student_pro_annual"
          ? 20000
          : plan === "school"
            ? 15000
            : 50000;
    const startDate = new Date(
      2024,
      Math.floor(Math.random() * 8),
      Math.floor(Math.random() * 28) + 1,
    );

    subscriptions.push({
      id: `sub_${i + 100}`,
      userId: `user_${Math.floor(Math.random() * 1000)}`,
      userName: names[Math.floor(Math.random() * names.length)],
      userEmail: emails[Math.floor(Math.random() * emails.length)],
      plan,
      amount,
      totalPaid: amount * (Math.floor(Math.random() * 6) + 1),
      status: Math.random() > 0.7 ? "cancelled" : Math.random() > 0.8 ? "paused" : "active",
      billingCycle: plan === "student_pro_annual" ? "annual" : "monthly",
      startDate: startDate.toISOString().split("T")[0],
      nextBillingDate: new Date(
        startDate.getTime() + (plan === "student_pro_annual" ? 365 : 30) * 86400000,
      )
        .toISOString()
        .split("T")[0],
      autoRenew: Math.random() > 0.2,
      failureCount: Math.floor(Math.random() * 3),
      paymentMethod: ["card", "bank_transfer", "paystack"][
        Math.floor(Math.random() * 3)
      ] as PaymentChannel,
    });
  }

  return subscriptions;
};

// API functions
export async function fetchTransactions(): Promise<{ data: Transaction[] }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { data: generateMockTransactions() };
}

export async function fetchSubscriptions(): Promise<{ data: Subscription[] }> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { data: generateMockSubscriptions() };
}

export async function fetchRevenueStats(): Promise<{ data: RevenueStats }> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const transactions = generateMockTransactions();
  const paidTransactions = transactions.filter((t) => t.status === "paid");
  const totalRevenue = paidTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalFees = paidTransactions.reduce((sum, t) => sum + t.fee, 0);

  // Monthly revenue aggregation
  const revenueByMonth = Array.from({ length: 12 }, (_, i) => {
    const monthTransactions = transactions.filter((t) => new Date(t.date).getMonth() === i);
    const monthlyRevenue = monthTransactions.reduce(
      (sum, t) => sum + (t.status === "paid" ? t.amount : 0),
      0,
    );
    const subscriptions = monthTransactions
      .filter((t) => t.revenueType === "subscription" && t.status === "paid")
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][
        i
      ],
      revenue: monthlyRevenue,
      subscriptions,
      oneTime: monthlyRevenue - subscriptions,
    };
  });

  // Revenue by plan
  const revenueByPlan = [
    { plan: "Student Pro", revenue: totalRevenue * 0.45, count: 1200 },
    { plan: "School", revenue: totalRevenue * 0.3, count: 80 },
    { plan: "Enterprise", revenue: totalRevenue * 0.15, count: 15 },
    { plan: "Add-ons", revenue: totalRevenue * 0.1, count: 500 },
  ];

  // Revenue by channel
  const revenueByChannel = Object.entries(CHANNEL_CONFIG).map(([channel]) => ({
    channel,
    revenue: paidTransactions
      .filter((t) => t.channel === channel)
      .reduce((sum, t) => sum + t.amount, 0),
    count: paidTransactions.filter((t) => t.channel === channel).length,
    percentage:
      (paidTransactions.filter((t) => t.channel === channel).reduce((sum, t) => sum + t.amount, 0) /
        totalRevenue) *
      100,
  }));

  // Revenue by role
  const revenueByRole = [
    { role: "Student", revenue: totalRevenue * 0.65, percentage: 65 },
    { role: "School Admin", revenue: totalRevenue * 0.25, percentage: 25 },
    { role: "Tutor", revenue: totalRevenue * 0.1, percentage: 10 },
  ];

  return {
    data: {
      totalRevenue,
      netRevenue: totalRevenue - totalFees,
      totalFees,
      totalRefunds: transactions
        .filter((t) => t.status === "refunded")
        .reduce((sum, t) => sum + t.amount, 0),
      monthlyRecurringRevenue: 12500000,
      annualRecurringRevenue: 150000000,
      averageTransactionValue: totalRevenue / paidTransactions.length,
      activeSubscriptions: 2450,
      churnRate: 4.2,
      conversionRate: 18.5,
      customerLifetimeValue: 85000,
      totalTransactions: transactions.length,
      successfulTransactions: paidTransactions.length,
      failedTransactions: transactions.filter((t) => t.status === "failed").length,
      pendingTransactions: transactions.filter((t) => t.status === "pending").length,
      refundedTransactions: transactions.filter((t) => t.status === "refunded").length,
      revenueByMonth,
      revenueByPlan,
      revenueByChannel,
      revenueByRole,
      customerAcquisition: revenueByMonth.map((m, i) => ({
        month: m.month,
        newCustomers: Math.floor(Math.random() * 200) + 50,
        churnedCustomers: Math.floor(Math.random() * 30) + 10,
      })),
      topCustomers: [
        {
          name: "Oluwaseun Adebayo",
          email: "seun@gravitas.ng",
          plan: "Student Pro",
          totalSpent: 1250000,
        },
        { name: "Chioma Eze", email: "chioma@gravitas.ng", plan: "School", totalSpent: 950000 },
        {
          name: "Michael Okafor",
          email: "michael@gravitas.ng",
          plan: "Enterprise",
          totalSpent: 750000,
        },
        {
          name: "Aisha Bello",
          email: "aisha@gravitas.ng",
          plan: "Student Pro",
          totalSpent: 450000,
        },
        {
          name: "Emeka Nwosu",
          email: "emeka@gravitas.ng",
          plan: "Student Pro",
          totalSpent: 380000,
        },
      ],
    },
  };
}

export async function processRefund(data: {
  transactionId: string;
  amount?: number;
  reason: string;
}): Promise<{ data: { success: boolean; refundReference: string } }> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return {
    data: {
      success: true,
      refundReference: `ref_${Math.random().toString(36).substring(2, 10)}`,
    },
  };
}

export async function flagTransaction(transactionId: string, flagged: boolean): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log(`Transaction ${transactionId} flagged: ${flagged}`);
}

export async function cancelSubscription(subscriptionId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  console.log(`Subscription ${subscriptionId} cancelled`);
}

export async function pauseSubscription(subscriptionId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  console.log(`Subscription ${subscriptionId} paused`);
}

// CSV Export utilities
export function buildExportCsv(transactions: Transaction[]): string {
  const headers = [
    "ID",
    "Reference",
    "Description",
    "Amount (₦)",
    "Fee (₦)",
    "Net (₦)",
    "Status",
    "Channel",
    "Revenue Type",
    "User",
    "Email",
    "Date",
    "Fraudulent",
    "Disputed",
  ];

  const rows = transactions.map((t) => [
    t.id,
    t.reference,
    t.description,
    t.amount,
    t.fee,
    t.netAmount,
    t.status,
    t.channel,
    t.revenueType,
    t.userName,
    t.userEmail,
    t.date,
    t.isFraudulent ? "Yes" : "No",
    t.isDisputed ? "Yes" : "No",
  ]);

  return [headers, ...rows].map((row) => row.join(",")).join("\n");
}

export function downloadCsv(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
