export type CardBrand = "visa" | "mastercard" | "verve";
export type TransactionStatus = "paid" | "failed" | "refunded" | "pending";
export type PaymentChannel = "card" | "bank_transfer" | "ussd" | "qr";
export type ContentPurchaseType = "past_papers" | "video_bundle" | "ebook" | "practice_set";
export type SubscriptionStatus = "active" | "cancelled" | "expired";
export type PlanTier = "free" | "pro" | "annual";

export interface SavedCard {
  id: string;
  last4: string;
  brand: CardBrand;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
  holderName?: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: TransactionStatus;
  paystackReference: string;
  cardUsed: string;
  channel: PaymentChannel;
  invoiceUrl?: string;
}

export interface SubscriptionHistory {
  id: string;
  plan: string;
  period: string;
  startDate: string;
  endDate: string | null;
  status: SubscriptionStatus;
  amount: number;
}

export interface ContentPurchase {
  id: string;
  title: string;
  type: ContentPurchaseType;
  date: string;
  amount: number;
  downloadUrl?: string;
  watchUrl?: string;
}

export interface UsageSummary {
  examSessions: number;
  questionsAnswered: number;
  aiExplanations: number;
  videoMinutesWatched: number;
  storageUsedMB: number;
  storageLimitMB: number;
  tutorSessionsThisMonth: number;
  periodStart: string;
  periodEnd: string;
}

export interface PlanOption {
  id: PlanTier;
  name: string;
  price: number;
  period: string;
  badge?: string;
  features: string[];
  isCurrent?: boolean;
}
