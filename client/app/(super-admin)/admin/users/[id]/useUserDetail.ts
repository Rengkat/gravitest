"use client";

import { useState, useCallback } from "react";
import type { User, UserStatus, SubscriptionTier } from "../types";
import type { ActivityLogEntry, PaymentRecord, AdminActionType, EditUserFormData } from "./types";
import { mockUserById, mockActivityLog, mockPayments } from "./mockData";

export type DetailTab = "overview" | "activity" | "payments";

export interface ResetPasswordFormData {
  newPassword: string;
  notifyUser: boolean;
}

interface UseUserDetailReturn {
  user: User | null;
  activityLog: ActivityLogEntry[];
  payments: PaymentRecord[];
  loading: boolean;
  actionLoading: boolean;
  activeTab: DetailTab;
  pendingAction: AdminActionType | null;
  confirmInput: string; // used for delete email confirmation
  reasonInput: string; // used for suspend / deactivate reason
  editForm: EditUserFormData | null;
  pendingTier: SubscriptionTier | null;
  resetForm: ResetPasswordFormData;
  setActiveTab: (t: DetailTab) => void;
  initiateAction: (a: AdminActionType) => void;
  cancelAction: () => void;
  confirmAction: () => Promise<void>;
  setConfirmInput: (v: string) => void;
  setReasonInput: (v: string) => void;
  setEditForm: (d: EditUserFormData) => void;
  setPendingTier: (t: SubscriptionTier) => void;
  setResetForm: (d: ResetPasswordFormData) => void;
}

export function useUserDetail(userId: string): UseUserDetailReturn {
  const [user, setUser] = useState<User | null>(() => mockUserById(userId));
  const [activityLog] = useState<ActivityLogEntry[]>(mockActivityLog);
  const [payments] = useState<PaymentRecord[]>(mockPayments);
  const [loading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const [pendingAction, setPendingAction] = useState<AdminActionType | null>(null);
  const [confirmInput, setConfirmInput] = useState("");
  const [reasonInput, setReasonInput] = useState("");
  const [editForm, setEditForm] = useState<EditUserFormData | null>(null);
  const [pendingTier, setPendingTier] = useState<SubscriptionTier | null>(null);
  const [resetForm, setResetForm] = useState<ResetPasswordFormData>({
    newPassword: "",
    notifyUser: true,
  });

  const initiateAction = useCallback(
    (action: AdminActionType) => {
      setPendingAction(action);
      setConfirmInput("");
      setReasonInput("");

      if (action === "edit" && user) {
        setEditForm({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phone ?? "",
          stateOfResidence: user.lastLocation?.split(",")[0]?.trim() ?? "",
          lga: "",
          role: user.role,
          isEmailVerified: user.verificationStatus === "verified",
          isPhoneVerified: false,
          isActive: user.status === "active",
        });
      }

      if (action === "change_tier" && user) {
        setPendingTier(user.subscriptionTier);
      }

      if (action === "reset_password") {
        setResetForm({ newPassword: "", notifyUser: true });
      }
    },
    [user],
  );

  const cancelAction = useCallback(() => {
    setPendingAction(null);
    setConfirmInput("");
    setReasonInput("");
    setEditForm(null);
    setPendingTier(null);
  }, []);

  const confirmAction = useCallback(async () => {
    if (!user || !pendingAction) return;
    setActionLoading(true);

    // ── Replace with real API calls ──────────────────────────────────────
    // suspend:        POST /users/:id/deactivate { type: 'admin_suspension', reason }
    // unsuspend:      PATCH /users/:id { isActive: true }
    // deactivate:     POST /users/:id/deactivate { type: 'self', reason }
    // delete:         DELETE /users/:id  (or soft-delete endpoint)
    // edit:           PATCH /users/:id   (adminUpdateUser)
    // change_tier:    PATCH /users/:id   { subscriptionTier: pendingTier }
    // reset_password: POST /users/:id/reset-password  { newPassword?, notifyUser }
    // verify_email:   PATCH /users/:id   { isEmailVerified: true }
    // ─────────────────────────────────────────────────────────────────────

    await new Promise((r) => setTimeout(r, 800));

    setUser((prev) => {
      if (!prev) return prev;
      switch (pendingAction) {
        case "suspend":
          return { ...prev, status: "suspended" as UserStatus };
        case "unsuspend":
          return { ...prev, status: "active" as UserStatus };
        case "deactivate":
          return { ...prev, status: "inactive" as UserStatus };
        case "delete":
          return { ...prev, status: "deactivated" as UserStatus };
        case "verify_email":
          return { ...prev, verificationStatus: "verified" as const };
        case "change_tier":
          return pendingTier ? { ...prev, subscriptionTier: pendingTier } : prev;
        case "edit":
          return editForm
            ? {
                ...prev,
                firstName: editForm.firstName,
                lastName: editForm.lastName,
                email: editForm.email,
                phone: editForm.phoneNumber,
                role: editForm.role as User["role"],
                isActive: editForm.isActive,
              }
            : prev;
        default:
          return prev;
      }
    });

    setActionLoading(false);
    setPendingAction(null);
    setConfirmInput("");
    setReasonInput("");
    setEditForm(null);
    setPendingTier(null);
  }, [user, pendingAction, editForm, pendingTier]);

  return {
    user,
    activityLog,
    payments,
    loading,
    actionLoading,
    activeTab,
    pendingAction,
    confirmInput,
    reasonInput,
    editForm,
    pendingTier,
    resetForm,
    setActiveTab,
    initiateAction,
    cancelAction,
    confirmAction,
    setConfirmInput,
    setReasonInput,
    setEditForm,
    setPendingTier,
    setResetForm,
  };
}
