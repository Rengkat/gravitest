import {
  SavedCard,
  Transaction,
  SubscriptionHistory,
  ContentPurchase,
  UsageSummary,
  PlanOption,
  TransactionStatus,
  PaymentChannel,
  CardBrand,
} from "@/types/billing";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  CreditCard,
  Building,
  Smartphone,
  QrCode,
} from "lucide-react";

// ── Mock data ─────────────────────────────────────────────────────────────

export const MOCK_CARDS: SavedCard[] = [
  {
    id: "1",
    last4: "4242",
    brand: "visa",
    expMonth: 12,
    expYear: 2026,
    isDefault: true,
    holderName: "Adaeze Okonkwo",
  },
  {
    id: "2",
    last4: "5566",
    brand: "mastercard",
    expMonth: 8,
    expYear: 2027,
    isDefault: false,
    holderName: "Adaeze Okonkwo",
  },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    date: "2025-11-15",
    description: "Pro Plan — Monthly Subscription",
    amount: 2500,
    status: "paid",
    paystackReference: "PSTK_47hd8f92k3l",
    cardUsed: "VISA •••• 4242",
    channel: "card",
    invoiceUrl: "#",
  },
  {
    id: "2",
    date: "2025-10-15",
    description: "Pro Plan — Monthly Subscription",
    amount: 2500,
    status: "paid",
    paystackReference: "PSTK_38gd7e81j2k",
    cardUsed: "VISA •••• 4242",
    channel: "card",
    invoiceUrl: "#",
  },
  {
    id: "3",
    date: "2025-09-15",
    description: "Pro Plan — Monthly Subscription",
    amount: 2500,
    status: "paid",
    paystackReference: "PSTK_29fc6d70i1j",
    cardUsed: "VISA •••• 4242",
    channel: "card",
    invoiceUrl: "#",
  },
  {
    id: "4",
    date: "2025-09-10",
    description: "Pro Plan — Monthly Subscription",
    amount: 2500,
    status: "failed",
    paystackReference: "PSTK_10eb5c69h0i",
    cardUsed: "VISA •••• 4242",
    channel: "card",
  },
  {
    id: "5",
    date: "2025-09-01",
    description: "Free → Pro Upgrade",
    amount: 2500,
    status: "paid",
    paystackReference: "PSTK_01da4b58g9h",
    cardUsed: "Mastercard •••• 5566",
    channel: "bank_transfer",
    invoiceUrl: "#",
  },
  {
    id: "6",
    date: "2025-08-20",
    description: "JAMB Past Papers Pack",
    amount: 500,
    status: "paid",
    paystackReference: "PSTK_93cb3a47f8g",
    cardUsed: "VISA •••• 4242",
    channel: "card",
    invoiceUrl: "#",
  },
  {
    id: "7",
    date: "2025-08-10",
    description: "Physics Video Bundle (SS3)",
    amount: 300,
    status: "refunded",
    paystackReference: "PSTK_82ba2936e7f",
    cardUsed: "VISA •••• 4242",
    channel: "card",
    invoiceUrl: "#",
  },
];

export const MOCK_SUBSCRIPTION_HISTORY: SubscriptionHistory[] = [
  {
    id: "1",
    plan: "Pro Monthly",
    period: "Monthly",
    startDate: "2025-09-01",
    endDate: null,
    status: "active",
    amount: 2500,
  },
  {
    id: "2",
    plan: "Free",
    period: "—",
    startDate: "2025-01-15",
    endDate: "2025-09-01",
    status: "cancelled",
    amount: 0,
  },
];

export const MOCK_CONTENT_PURCHASES: ContentPurchase[] = [
  {
    id: "1",
    title: "JAMB 2015–2024 Past Papers Pack",
    type: "past_papers",
    date: "2025-08-20",
    amount: 500,
    downloadUrl: "#",
  },
  {
    id: "2",
    title: "Physics Video Bundle (SS3)",
    type: "video_bundle",
    date: "2025-08-10",
    amount: 300,
    watchUrl: "#",
  },
];

export const MOCK_USAGE: UsageSummary = {
  examSessions: 47,
  questionsAnswered: 1840,
  aiExplanations: 312,
  videoMinutesWatched: 380,
  storageUsedMB: 248,
  storageLimitMB: 500,
  tutorSessionsThisMonth: 3,
  periodStart: "2025-11-15",
  periodEnd: "2025-12-15",
};

export const PLANS: PlanOption[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "forever",
    features: [
      "10 practice questions/day",
      "5 video lessons/month",
      "Basic performance stats",
      "Access to Games",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 2500,
    period: "month",
    badge: "Current Plan",
    isCurrent: true,
    features: [
      "Unlimited practice sessions",
      "All video lessons",
      "Priority tutor booking",
      "AI explanations (unlimited)",
      "Downloadable materials",
      "Advanced analytics",
      "Games & achievements",
    ],
  },
  {
    id: "annual",
    name: "Pro Annual",
    price: 24000,
    period: "year",
    badge: "Save 20%",
    features: [
      "Everything in Pro",
      "2 months free (₦6,000 saved)",
      "Dedicated support",
      "Early access to new features",
      "Offline download mode",
    ],
  },
];

export const CURRENT_PLAN = {
  name: "Pro",
  status: "active" as const,
  billingCycle: "Monthly",
  amount: 2500,
  nextRenewal: "2025-12-15",
  started: "2025-09-01",
  daysRemaining: 14,
};

// ── Status configs ────────────────────────────────────────────────────────

export const TX_STATUS_CONFIG: Record<
  TransactionStatus,
  {
    label: string;
    icon: any;
    textColor: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  paid: {
    label: "Paid",
    icon: CheckCircle,
    textColor: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    textColor: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  refunded: {
    label: "Refunded",
    icon: AlertCircle,
    textColor: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    textColor: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
};

export const CHANNEL_CONFIG: Record<PaymentChannel, { label: string; icon: any }> = {
  card: { label: "Card", icon: CreditCard },
  bank_transfer: { label: "Bank Transfer", icon: Building },
  ussd: { label: "USSD", icon: Smartphone },
  qr: { label: "QR Code", icon: QrCode },
};

export const BRAND_CONFIG: Record<CardBrand, { label: string; bg: string; text: string }> = {
  visa: { label: "VISA", bg: "bg-blue-600", text: "text-white" },
  mastercard: { label: "MC", bg: "bg-orange-500", text: "text-white" },
  verve: { label: "VERVE", bg: "bg-green-600", text: "text-white" },
};

export const CONTENT_TYPE_CONFIG: Record<
  string,
  { label: string; icon: string; iconBg: string; iconText: string }
> = {
  past_papers: {
    label: "Past Papers",
    icon: "📄",
    iconBg: "bg-blue-50",
    iconText: "text-blue-600",
  },
  video_bundle: {
    label: "Video Bundle",
    icon: "🎬",
    iconBg: "bg-purple-50",
    iconText: "text-purple-600",
  },
  ebook: { label: "eBook", icon: "📚", iconBg: "bg-amber-50", iconText: "text-amber-600" },
  practice_set: {
    label: "Practice Set",
    icon: "✏️",
    iconBg: "bg-green-50",
    iconText: "text-green-600",
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────

export function formatDate(d: string): string {
  return new Date(d).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatMinutes(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

/** Generate invoice-text and trigger browser download */
export function downloadInvoice(tx: Transaction): void {
  const lines = [
    "========================================",
    "         Gravitest LEARNING HUB",
    "              TAX INVOICE",
    "========================================",
    "",
    `Invoice ID   : ${tx.paystackReference}`,
    `Issue Date   : ${formatDate(tx.date)}`,
    "",
    "DESCRIPTION",
    "----------------------------------------",
    tx.description,
    "",
    "PAYMENT",
    "----------------------------------------",
    `Method       : ${tx.cardUsed}`,
    `Channel      : ${tx.channel.replace("_", " ").toUpperCase()}`,
    `Amount       : ${formatCurrency(tx.amount)}`,
    `Status       : ${tx.status.toUpperCase()}`,
    "",
    "========================================",
    "   Thank you for learning with Gravitest!",
    "     support@Gravitest.ng | Gravitest.ng  ",
    "========================================",
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `invoice-${tx.paystackReference}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
