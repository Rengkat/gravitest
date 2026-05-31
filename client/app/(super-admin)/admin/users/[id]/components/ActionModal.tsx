"use client";

import { X } from "lucide-react";
import type { User, SubscriptionTier } from "../../types";
import type { AdminActionType, EditUserFormData } from "../types";
import { SUBSCRIPTION_CONFIG } from "../../constants";

// ─── Modal shell ──────────────────────────────────────────────────────────────

function Modal({
  title,
  onClose,
  loading,
  children,
  footer,
}: {
  title: string;
  onClose: () => void;
  loading: boolean;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.45)", backdropFilter: "blur(3px)" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title">
      <div
        className="w-full max-w-lg rounded-2xl bg-white border shadow-2xl flex flex-col max-h-[90vh]"
        style={{ borderColor: "rgba(30,80,50,0.1)" }}>
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <h2 id="modal-title" className="text-[15px] font-bold text-green-900">
            {title}
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-text-muted transition-colors"
            aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>

        {/* Footer */}
        <div
          className="px-6 py-4 border-t flex justify-end gap-3"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          {footer}
        </div>
      </div>
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2 rounded-xl border border-gray-200 text-[13px] text-green-900 focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-all";

// ─── Main export ──────────────────────────────────────────────────────────────

interface ActionModalProps {
  actionType: AdminActionType;
  user: User;
  confirmInput: string;
  editForm: EditUserFormData | null;
  pendingTier: SubscriptionTier | null;
  loading: boolean;
  onConfirmInputChange: (v: string) => void;
  onEditFormChange: (d: EditUserFormData) => void;
  onTierChange: (t: SubscriptionTier) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const TITLES: Partial<Record<AdminActionType, string>> = {
  suspend: "Suspend Account",
  activate: "Reactivate Account",
  deactivate: "Deactivate Account",
  delete: "Delete Account",
  reset_password: "Send Password Reset",
  edit: "Edit Profile",
  change_tier: "Change Subscription Tier",
  verify_email: "Force Verify Email",
  toggle_2fa: "Toggle Two-Factor Auth",
};

export function ActionModal({
  actionType,
  user,
  confirmInput,
  editForm,
  pendingTier,
  loading,
  onConfirmInputChange,
  onEditFormChange,
  onTierChange,
  onConfirm,
  onCancel,
}: ActionModalProps) {
  const title = TITLES[actionType] ?? actionType;
  const isDanger = actionType === "delete";
  const isEdit = actionType === "edit";
  const isTier = actionType === "change_tier";

  // Determine if confirm button should be enabled
  const canConfirm = (() => {
    if (loading) return false;
    if (isDanger) return confirmInput === user.email;
    if (isEdit) return !!editForm?.firstName.trim() && !!editForm?.email.trim();
    return true;
  })();

  const confirmBtnCls = isDanger
    ? "px-5 py-2 rounded-xl bg-red-600 text-white text-[13px] font-semibold hover:bg-red-700 transition-all disabled:opacity-40"
    : "px-5 py-2 rounded-xl bg-green-800 text-white text-[13px] font-semibold hover:bg-green-700 transition-all disabled:opacity-40";

  return (
    <Modal
      title={title}
      onClose={onCancel}
      loading={loading}
      footer={
        <>
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2 rounded-xl border border-gray-200 text-[13px] font-medium text-text-muted hover:bg-cream transition-all">
            Cancel
          </button>
          <button
            title="confirm"
            onClick={onConfirm}
            disabled={!canConfirm}
            aria-busy={loading}
            className={confirmBtnCls}>
            {loading ? "Processing…" : "Confirm"}
          </button>
        </>
      }>
      {/* ── Simple confirm (no extra inputs) ── */}
      {!isEdit && !isTier && !isDanger && (
        <p className="text-[13px] text-text-muted leading-relaxed">
          {actionType === "suspend" &&
            `${user.firstName} will immediately lose access to Gravitas. You can reactivate them at any time.`}
          {actionType === "activate" &&
            `${user.firstName}'s account will be restored. They will regain full platform access.`}
          {actionType === "deactivate" &&
            `The account will be soft-disabled. All data is preserved and can be reactivated later.`}
          {actionType === "reset_password" &&
            `A password reset link will be sent to ${user.email}.`}
          {actionType === "verify_email" &&
            `${user.email} will be marked as verified without the user clicking the verification link.`}
          {actionType === "toggle_2fa" &&
            `Two-factor authentication will be ${user.twoFactorEnabled ? "disabled" : "enabled"} for this account.`}
        </p>
      )}

      {/* ── Delete — requires email ── */}
      {isDanger && (
        <div className="space-y-4">
          <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-[13px] text-red-700 leading-relaxed">
            ⚠️ This is <strong>permanent</strong>. All data, quiz history, payments, and progress
            for{" "}
            <strong>
              {user.firstName} {user.lastName}
            </strong>{" "}
            will be erased and cannot be recovered.
          </div>
          <Field id="confirm-email" label="Type the user's email to confirm">
            <input
              id="confirm-email"
              type="email"
              className={inputCls}
              value={confirmInput}
              onChange={(e) => onConfirmInputChange(e.target.value)}
              placeholder={user.email}
              autoComplete="off"
              aria-describedby="confirm-email-hint"
            />
            <span id="confirm-email-hint" className="text-[11px] text-text-muted font-mono">
              {user.email}
            </span>
          </Field>
        </div>
      )}

      {/* ── Edit form ── */}
      {isEdit && editForm && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field id="edit-fname" label="First Name">
              <input
                title="edit"
                id="edit-fname"
                type="text"
                className={inputCls}
                value={editForm.firstName}
                onChange={(e) => onEditFormChange({ ...editForm, firstName: e.target.value })}
              />
            </Field>
            <Field id="edit-lname" label="Last Name">
              <input
                title="edit"
                id="edit-lname"
                type="text"
                className={inputCls}
                value={editForm.lastName}
                onChange={(e) => onEditFormChange({ ...editForm, lastName: e.target.value })}
              />
            </Field>
          </div>
          <Field id="edit-email" label="Email Address">
            <input
              title="edit"
              id="edit-email"
              type="email"
              className={inputCls}
              value={editForm.email}
              onChange={(e) => onEditFormChange({ ...editForm, email: e.target.value })}
            />
          </Field>
          <Field id="edit-phone" label="Phone Number">
            <input
              title="edit"
              id="edit-phone"
              type="tel"
              className={inputCls}
              value={editForm.phone}
              onChange={(e) => onEditFormChange({ ...editForm, phone: e.target.value })}
            />
          </Field>
          <Field id="edit-notes" label="Admin Notes">
            <textarea
              id="edit-notes"
              rows={3}
              className={`${inputCls} resize-none`}
              value={editForm.notes}
              onChange={(e) => onEditFormChange({ ...editForm, notes: e.target.value })}
              placeholder="Internal notes visible to admins only…"
            />
          </Field>
        </div>
      )}

      {/* ── Tier picker ── */}
      {isTier && pendingTier !== null && (
        <div className="space-y-3">
          <p className="text-[12px] text-text-muted">
            Current tier:{" "}
            <strong className="text-green-900 capitalize">{user.subscriptionTier}</strong>
          </p>
          <fieldset className="space-y-2">
            <legend className="text-[11px] font-semibold uppercase tracking-wide text-text-muted mb-2">
              Select New Tier
            </legend>
            {(Object.keys(SUBSCRIPTION_CONFIG) as SubscriptionTier[]).map((tier) => {
              const cfg = SUBSCRIPTION_CONFIG[tier];
              const Icon = cfg.icon;
              const selected = pendingTier === tier;
              return (
                <label
                  key={tier}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    selected ? "border-green-700 bg-green-50" : "border-gray-200 hover:bg-cream/50"
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
                    <div className="w-4 h-4 rounded-full bg-green-800 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                  )}
                </label>
              );
            })}
          </fieldset>
        </div>
      )}
    </Modal>
  );
}
