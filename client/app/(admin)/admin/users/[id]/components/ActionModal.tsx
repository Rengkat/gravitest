"use client";

import { X, AlertTriangle, Info } from "lucide-react";
import type { User, SubscriptionTier } from "../../types";
import type { AdminActionType, EditUserFormData } from "../types";
import type { ResetPasswordFormData } from "../useUserDetail";
import { SUBSCRIPTION_CONFIG, ROLE_CONFIG } from "../../constants";
import type { UserRole } from "../../types";

// ─── Shared sub-components ────────────────────────────────────────────────────

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[12px] font-semibold text-green-900 mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

const inputCls =
  "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all text-green-900";

// ─── Modal shell — matches AddUserModal pattern ───────────────────────────────

function Modal({
  title,
  onClose,
  loading,
  children,
  onConfirm,
  confirmLabel,
  confirmDisabled,
  danger = false,
}: {
  title: string;
  onClose: () => void;
  loading: boolean;
  children: React.ReactNode;
  onConfirm: () => void;
  confirmLabel: string;
  confirmDisabled: boolean;
  danger?: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.5)" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 id="modal-title" className="font-serif text-xl text-green-900">
            {title}
          </h3>
          <button
            title="close"
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-text-muted">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4">{children}</div>

        {/* Footer */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-[14px] font-semibold text-text-muted hover:bg-gray-50 transition-all">
            Cancel
          </button>
          <button
            title="confirm"
            onClick={onConfirm}
            disabled={confirmDisabled || loading}
            aria-busy={loading}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all text-[14px] disabled:opacity-50 ${
              danger
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-green-800 text-white hover:bg-green-700"
            }`}>
            {loading ? "Processing…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Alert box ────────────────────────────────────────────────────────────────

function AlertBox({
  children,
  variant = "info",
}: {
  children: React.ReactNode;
  variant?: "info" | "warning" | "danger";
}) {
  const styles = {
    info: { cls: "bg-blue-50 border-blue-100 text-blue-800", Icon: Info },
    warning: { cls: "bg-amber-50 border-amber-100 text-amber-800", Icon: AlertTriangle },
    danger: { cls: "bg-red-50 border-red-100 text-red-700", Icon: AlertTriangle },
  }[variant];

  return (
    <div className={`rounded-xl border p-4 flex gap-3 text-[13px] leading-relaxed ${styles.cls}`}>
      <styles.Icon size={16} className="shrink-0 mt-0.5" />
      <div>{children}</div>
    </div>
  );
}

// ─── Main modal dispatcher ────────────────────────────────────────────────────

interface ActionModalProps {
  actionType: AdminActionType;
  user: User;
  confirmInput: string;
  reasonInput: string;
  editForm: EditUserFormData | null;
  pendingTier: SubscriptionTier | null;
  resetForm: ResetPasswordFormData;
  loading: boolean;
  onConfirmInputChange: (v: string) => void;
  onReasonInputChange: (v: string) => void;
  onEditFormChange: (d: EditUserFormData) => void;
  onTierChange: (t: SubscriptionTier) => void;
  onResetFormChange: (d: ResetPasswordFormData) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const TITLES: Record<AdminActionType, string> = {
  suspend: "Suspend Account",
  unsuspend: "Lift Suspension",
  deactivate: "Deactivate Account",
  delete: "Delete Account",
  edit: "Edit Profile",
  change_tier: "Change Subscription Tier",
  reset_password: "Reset Password",
  verify_email: "Force Verify Email",
};

export function ActionModal({
  actionType,
  user,
  confirmInput,
  reasonInput,
  editForm,
  pendingTier,
  resetForm,
  loading,
  onConfirmInputChange,
  onReasonInputChange,
  onEditFormChange,
  onTierChange,
  onResetFormChange,
  onConfirm,
  onCancel,
}: ActionModalProps) {
  const fullName = `${user.firstName} ${user.lastName}`;

  // ── Suspend ────────────────────────────────────────────────────────────────
  if (actionType === "suspend") {
    return (
      <Modal
        title={TITLES.suspend}
        onClose={onCancel}
        loading={loading}
        onConfirm={onConfirm}
        confirmLabel="Suspend"
        confirmDisabled={false}
        danger>
        <AlertBox variant="warning">
          <strong>{fullName}</strong> will immediately lose access to Gravitas. You can lift this
          suspension at any time.
        </AlertBox>
        <div>
          <Label>Reason for suspension (optional)</Label>
          <textarea
            className={`${inputCls} resize-none`}
            rows={3}
            value={reasonInput}
            onChange={(e) => onReasonInputChange(e.target.value)}
            placeholder="e.g. Violation of platform terms, unpaid subscription…"
          />
          <p className="text-[11px] text-text-muted mt-1">
            This reason is stored in the audit log and visible to other admins.
          </p>
        </div>
      </Modal>
    );
  }

  // ── Unsuspend / Reactivate ────────────────────────────────────────────────
  if (actionType === "unsuspend") {
    return (
      <Modal
        title={TITLES.unsuspend}
        onClose={onCancel}
        loading={loading}
        onConfirm={onConfirm}
        confirmLabel="Reactivate"
        confirmDisabled={false}>
        <AlertBox variant="info">
          <strong>{fullName}</strong> will regain full access to their Gravitas account, including
          all content and features on their plan.
        </AlertBox>
      </Modal>
    );
  }

  // ── Deactivate ────────────────────────────────────────────────────────────
  if (actionType === "deactivate") {
    return (
      <Modal
        title={TITLES.deactivate}
        onClose={onCancel}
        loading={loading}
        onConfirm={onConfirm}
        confirmLabel="Deactivate"
        confirmDisabled={false}
        danger>
        <AlertBox variant="warning">
          This will soft-disable <strong>{fullName}</strong>'s account. All data is preserved and
          the account can be reactivated later.
        </AlertBox>
        <div>
          <Label>Reason (optional)</Label>
          <textarea
            className={`${inputCls} resize-none`}
            rows={3}
            value={reasonInput}
            onChange={(e) => onReasonInputChange(e.target.value)}
            placeholder="e.g. User requested deactivation, duplicate account…"
          />
        </div>
      </Modal>
    );
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  if (actionType === "delete") {
    return (
      <Modal
        title={TITLES.delete}
        onClose={onCancel}
        loading={loading}
        onConfirm={onConfirm}
        confirmLabel="Permanently Delete"
        confirmDisabled={confirmInput !== user.email}
        danger>
        <AlertBox variant="danger">
          This is <strong>permanent and irreversible.</strong> All data, quiz history, payments, and
          progress for <strong>{fullName}</strong> will be erased.
        </AlertBox>
        <div>
          <Label required>Type the user's email to confirm</Label>
          <input
            type="email"
            className={inputCls}
            value={confirmInput}
            onChange={(e) => onConfirmInputChange(e.target.value)}
            placeholder={user.email}
            autoComplete="off"
            aria-describedby="delete-hint"
          />
          <p id="delete-hint" className="text-[11px] text-text-muted font-mono mt-1">
            {user.email}
          </p>
        </div>
      </Modal>
    );
  }

  // ── Edit Profile ──────────────────────────────────────────────────────────
  if (actionType === "edit" && editForm) {
    const set = <K extends keyof EditUserFormData>(k: K, v: EditUserFormData[K]) =>
      onEditFormChange({ ...editForm, [k]: v });

    return (
      <Modal
        title={TITLES.edit}
        onClose={onCancel}
        loading={loading}
        onConfirm={onConfirm}
        confirmLabel="Save Changes"
        confirmDisabled={!editForm.firstName.trim() || !editForm.email.trim()}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label required>First Name</Label>
            <input
              type="text"
              className={inputCls}
              value={editForm.firstName}
              onChange={(e) => set("firstName", e.target.value)}
              placeholder="e.g., Adebayo"
            />
          </div>
          <div>
            <Label required>Last Name</Label>
            <input
              type="text"
              className={inputCls}
              value={editForm.lastName}
              onChange={(e) => set("lastName", e.target.value)}
              placeholder="e.g., Okonkwo"
            />
          </div>
        </div>

        <div>
          <Label required>Email Address</Label>
          <input
            title="email"
            type="email"
            className={inputCls}
            value={editForm.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </div>

        <div>
          <Label>Phone Number</Label>
          <input
            type="tel"
            className={inputCls}
            value={editForm.phoneNumber}
            onChange={(e) => set("phoneNumber", e.target.value)}
            placeholder="+234..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>State of Residence</Label>
            <input
              type="text"
              className={inputCls}
              value={editForm.stateOfResidence}
              onChange={(e) => set("stateOfResidence", e.target.value)}
              placeholder="e.g., Lagos"
            />
          </div>
          <div>
            <Label>LGA</Label>
            <input
              type="text"
              className={inputCls}
              value={editForm.lga}
              onChange={(e) => set("lga", e.target.value)}
              placeholder="e.g., Ikeja"
            />
          </div>
        </div>

        {/* Role picker — matches AddUserModal grid */}
        <div>
          <Label>Role</Label>
          <div className="grid grid-cols-2 gap-2">
            {(["student", "tutor", "school_admin", "super_admin"] as UserRole[]).map((role) => {
              const cfg = ROLE_CONFIG[role];
              const Icon = cfg.icon;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => set("role", role)}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left ${
                    editForm.role === role
                      ? "border-green-800 bg-green-50"
                      : "border-gray-200 hover:border-green-800/30"
                  }`}>
                  <Icon size={16} style={{ color: cfg.color }} />
                  <span className="text-[12px] font-semibold text-green-900">{cfg.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Toggle flags */}
        <div className="flex flex-wrap gap-4 pt-1">
          {(
            [
              { key: "isEmailVerified" as const, label: "Email Verified" },
              { key: "isPhoneVerified" as const, label: "Phone Verified" },
              { key: "isActive" as const, label: "Account Active" },
            ] as { key: keyof EditUserFormData; label: string }[]
          ).map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
              <div
                className={`w-9 h-5 rounded-full transition-colors relative ${
                  editForm[key] ? "bg-green-800" : "bg-gray-200"
                }`}
                onClick={() => set(key, !editForm[key] as any)}
                role="switch"
                aria-checked={!!editForm[key]}
                tabIndex={0}
                onKeyDown={(e) => e.key === " " && set(key, !editForm[key] as any)}>
                <div
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    editForm[key] ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </div>
              <span className="text-[12px] font-medium text-green-900">{label}</span>
            </label>
          ))}
        </div>
      </Modal>
    );
  }

  // ── Change Tier ───────────────────────────────────────────────────────────
  if (actionType === "change_tier" && pendingTier !== null) {
    return (
      <Modal
        title={TITLES.change_tier}
        onClose={onCancel}
        loading={loading}
        onConfirm={onConfirm}
        confirmLabel="Change Tier"
        confirmDisabled={pendingTier === user.subscriptionTier}>
        <p className="text-[12px] text-text-muted">
          Current tier:{" "}
          <strong className="text-green-900 capitalize">{user.subscriptionTier}</strong>
        </p>
        <div className="space-y-2">
          {(Object.keys(SUBSCRIPTION_CONFIG) as SubscriptionTier[]).map((tier) => {
            const cfg = SUBSCRIPTION_CONFIG[tier];
            const Icon = cfg.icon;
            const selected = pendingTier === tier;
            return (
              <label
                key={tier}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  selected
                    ? "border-green-800 bg-green-50"
                    : "border-gray-200 hover:border-green-800/30"
                }`}>
                <input
                  type="radio"
                  name="tier"
                  value={tier}
                  checked={selected}
                  onChange={() => onTierChange(tier)}
                  className="sr-only"
                />
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: cfg.bg }}>
                  <Icon size={14} style={{ color: cfg.color }} />
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-green-900">{cfg.label}</div>
                  <div className="text-[11px] text-text-muted">{cfg.price}</div>
                </div>
                {selected && (
                  <div className="w-4 h-4 rounded-full bg-green-800 flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                )}
              </label>
            );
          })}
        </div>
      </Modal>
    );
  }

  // ── Reset Password ────────────────────────────────────────────────────────
  if (actionType === "reset_password") {
    return (
      <Modal
        title={TITLES.reset_password}
        onClose={onCancel}
        loading={loading}
        onConfirm={onConfirm}
        confirmLabel="Reset Password"
        confirmDisabled={false}>
        <AlertBox variant="info">
          Leave the password field blank to auto-generate a secure temporary password. The generated
          password will only be shown once.
        </AlertBox>
        <div>
          <Label>New Password (optional)</Label>
          <input
            type="text"
            className={inputCls}
            value={resetForm.newPassword}
            onChange={(e) => onResetFormChange({ ...resetForm, newPassword: e.target.value })}
            placeholder="Leave blank to auto-generate"
            autoComplete="new-password"
          />
        </div>
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div
            className={`w-9 h-5 rounded-full transition-colors relative ${
              resetForm.notifyUser ? "bg-green-800" : "bg-gray-200"
            }`}
            onClick={() => onResetFormChange({ ...resetForm, notifyUser: !resetForm.notifyUser })}
            role="switch"
            aria-checked={resetForm.notifyUser}
            tabIndex={0}
            onKeyDown={(e) =>
              e.key === " " &&
              onResetFormChange({ ...resetForm, notifyUser: !resetForm.notifyUser })
            }>
            <div
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                resetForm.notifyUser ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </div>
          <div>
            <span className="text-[13px] font-semibold text-green-900">Notify user via email</span>
            <p className="text-[11px] text-text-muted">
              {resetForm.notifyUser
                ? "User will receive a reset link at " + user.email
                : "Password shown to you only — user not notified"}
            </p>
          </div>
        </label>
      </Modal>
    );
  }

  // ── Verify Email ──────────────────────────────────────────────────────────
  if (actionType === "verify_email") {
    return (
      <Modal
        title={TITLES.verify_email}
        onClose={onCancel}
        loading={loading}
        onConfirm={onConfirm}
        confirmLabel="Verify Email"
        confirmDisabled={false}>
        <AlertBox variant="info">
          <strong>{user.email}</strong> will be marked as verified without the user needing to click
          the confirmation link.
        </AlertBox>
      </Modal>
    );
  }

  return null;
}
