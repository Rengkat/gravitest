"use client";

import { useState, useCallback } from "react";
import type { User, UserStatus, SubscriptionTier } from "../../types";
import type {
  ActivityLogEntry,
  PaymentRecord,
  AdminActionType,
  EditUserFormData,
} from "./types";
import { mockUserById, mockActivityLog, mockPayments } from "./mockData";

export type DetailTab = "overview" | "activity" | "payments";

interface UseUserDetailReturn {
  user: User | null;
  activityLog: ActivityLogEntry[];
  payments: PaymentRecord[];
  loading: boolean;
  actionLoading: boolean;
  activeTab: DetailTab;
  pendingAction: AdminActionType | null;
  confirmInput: string;
  editForm: EditUserFormData | null;
  pendingTier: SubscriptionTier | null;
  setActiveTab: (t: DetailTab) => void;
  initiateAction: (a: AdminActionType) => void;
  cancelAction: () => void;
  confirmAction: () => Promise<void>;
  setConfirmInput: (v: string) => void;
  setEditForm: (d: EditUserFormData) => void;
  setPendingTier: (t: SubscriptionTier) => void;
}

export function useUserDetail(userId: string): UseUserDetailReturn {
  const [user, setUser] = useState<User | null>(() => mockUserById(userId));
  const [activityLog] = useState<ActivityLogEntry[]>(() => mockActivityLog());
  const [payments] = useState<PaymentRecord[]>(() => mockPayments());
  const [loading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const [pendingAction, setPendingAction] = useState<AdminActionType | null>(null);
  const [confirmInput, setConfirmInput] = useState("");
  const [editForm, setEditForm] = useState<EditUserFormData | null>(null);
  const [pendingTier, setPendingTier] = useState<SubscriptionTier | null>(null);

  const initiateAction = useCallback(
    (action: AdminActionType) => {
      setPendingAction(action);
      setConfirmInput("");
      if (action === "edit" && user) {
        setEditForm({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          state: user.lastLocation?.split(",")[0] ?? "",
          notes: user.notes ?? "",
        });
      }
      if (action === "change_tier" && user) {
        setPendingTier(user.subscriptionTier);
      }
    },
    [user]
  );

  const cancelAction = useCallback(() => {
    setPendingAction(null);
    setConfirmInput("");
    setEditForm(null);
    setPendingTier(null);
  }, []);

  const confirmAction = useCallback(async () => {
    if (!user || !pendingAction) return;
    setActionLoading(true);
    await new Promise((r) => setTimeout(r, 800)); // replace with real API call

    setUser((prev) => {
      if (!prev) return prev;
      switch (pendingAction) {
        case "suspend":    return { ...prev, status: "suspended" as UserStatus };
        case "activate":   return { ...prev, status: "active" as UserStatus };
        case "deactivate": return { ...prev, status: "deactivated" as UserStatus };
        case "delete":     return { ...prev, status: "deactivated" as UserStatus }; // soft-delete
        case "verify_email": return { ...prev, verificationStatus: "verified" as const };
        case "toggle_2fa": return { ...prev, twoFactorEnabled: !prev.twoFactorEnabled };
        case "change_tier":
          return pendingTier ? { ...prev, subscriptionTier: pendingTier } : prev;
        case "edit":
          return editForm
            ? { ...prev, firstName: editForm.firstName, lastName: editForm.lastName,
                email: editForm.email, phone: editForm.phone, notes: editForm.notes }
            : prev;
        default: return prev;
      }
    });

    setActionLoading(false);
    setPendingAction(null);
    setConfirmInput("");
    setEditForm(null);
    setPendingTier(null);
  }, [user, pendingAction, editForm, pendingTier]);

  return {
    user, activityLog, payments, loading, actionLoading,
    activeTab, pendingAction, confirmInput, editForm, pendingTier,
    setActiveTab, initiateAction, cancelAction, confirmAction,
    setConfirmInput, setEditForm, setPendingTier,
  };
}
