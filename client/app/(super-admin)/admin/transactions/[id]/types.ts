import { Transaction } from "../types";

export interface TransactionDetails extends Transaction {
  metadata?: {
    browser?: string;
    os?: string;
    device?: string;
    referrer?: string;
  };
  fraudScore?: {
    score: number;
    factors: string[];
    recommendation: string;
  };
  reconciliationStatus?: "matched" | "unmatched" | "pending";
  settlementDate?: string;
  settlementReference?: string;
  webhookAttempts?: WebhookAttempt[];
}

export interface WebhookAttempt {
  id: string;
  timestamp: string;
  status: "success" | "failed" | "retrying";
  responseCode: number;
  responseBody?: string;
  retryCount: number;
}

export interface ActivityLogEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: Record<string, any>;
  ipAddress?: string;
}

export interface RefundRequest {
  amount: number;
  reason: string;
  metadata?: Record<string, any>;
}
