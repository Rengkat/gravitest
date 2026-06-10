import type { Transaction, TransactionDetails, ActivityLogEntry } from "./types";

// Mock API calls - replace with actual API endpoints
export async function fetchTransactionById(id: string): Promise<TransactionDetails> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock implementation - in production, fetch from your API
  const mockTransaction: TransactionDetails = {
    id,
    reference: `GRAV-2024-${id.slice(-6)}`,
    description: "Student Pro Subscription",
    amount: 25000,
    fee: 375,
    netAmount: 24625,
    status: "paid",
    channel: "card",
    revenueType: "subscription",
    planType: "student_pro",
    userRole: "student",
    userId: "user_12345",
    userName: "John Doe",
    userEmail: "john@example.com",
    date: new Date().toISOString().split("T")[0],
    isFraudulent: false,
    isDisputed: false,
    settlementDate: new Date().toISOString(),
    settlementReference: `STL_${Date.now()}`,
    fraudScore: {
      score: 15,
      factors: ["Normal transaction pattern"],
      recommendation: "No action needed",
    },
    reconciliationStatus: "matched",
    webhookAttempts: [
      {
        id: "wh_1",
        timestamp: new Date().toISOString(),
        status: "success",
        responseCode: 200,
        retryCount: 0,
      },
    ],
  };

  return mockTransaction;
}

export async function fetchRelatedTransactions(transactionId: string): Promise<Transaction[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  // Mock related transactions
  return [];
}

export async function fetchActivityLog(transactionId: string): Promise<ActivityLogEntry[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return [
    {
      id: "1",
      action: "transaction_created",
      user: "System",
      timestamp: new Date().toISOString(),
      details: { status: "initiated" },
      ipAddress: "192.168.1.1",
    },
    {
      id: "2",
      action: "payment_authorized",
      user: "System",
      timestamp: new Date().toISOString(),
      details: { channel: "card", auth_code: "AUTH123" },
    },
  ];
}

export async function processRefundApi(
  transactionId: string,
  data: { amount: number; reason: string },
): Promise<{ success: boolean; refundReference: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return {
    success: true,
    refundReference: `REF_${Date.now()}`,
  };
}

export async function flagTransactionApi(transactionId: string, flagged: boolean): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log(`Transaction ${transactionId} flagged: ${flagged}`);
}

export async function retryWebhookApi(transactionId: string): Promise<{ success: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { success: true };
}

export async function sendReceiptApi(transactionId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  console.log(`Receipt sent for transaction ${transactionId}`);
}

export async function verifyTransactionApi(transactionId: string): Promise<{ verified: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { verified: true };
}
