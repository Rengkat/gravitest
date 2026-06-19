"use client";

import { X, AlertTriangle, Info, School } from "lucide-react";
import type { SchoolData, SubscriptionPlan, SchoolType } from "@/types/schoolsTypes";
import {
  SUBSCRIPTION_PLANS,
  NIGERIAN_STATES,
  SCHOOL_TYPES,
  PLAN_LIMITS,
} from "@/lib/constants/schools";
import type {
  SchoolActionType,
  EditSchoolFormData,
  AddClassFormData,
  AddAdminFormData,
} from "../useSchoolDetail";

// ─── Shared primitives ────────────────────────────────────────────────────────

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[12px] font-semibold text-green-900 mb-1">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all text-green-900";

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

// ─── Modal shell ──────────────────────────────────────────────────────────────

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
        <div className="space-y-4">{children}</div>
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
            className={`flex-1 py-3 rounded-xl font-semibold transition-all text-[14px] disabled:opacity-50 ${danger ? "bg-red-600 text-white hover:bg-red-700" : "bg-green-800 text-white hover:bg-green-700"}`}>
            {loading ? "Processing…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main dispatcher ──────────────────────────────────────────────────────────

interface ActionModalProps {
  actionType: SchoolActionType;
  school: SchoolData;
  confirmInput: string;
  reasonInput: string;
  editForm: EditSchoolFormData | null;
  addClassForm: AddClassFormData;
  addAdminForm: AddAdminFormData;
  pendingPlan: SubscriptionPlan | null;
  loading: boolean;
  onConfirmInputChange: (v: string) => void;
  onReasonInputChange: (v: string) => void;
  onEditFormChange: (d: EditSchoolFormData) => void;
  onAddClassFormChange: (d: AddClassFormData) => void;
  onAddAdminFormChange: (d: AddAdminFormData) => void;
  onPlanChange: (p: SubscriptionPlan) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ActionModal({
  actionType,
  school,
  confirmInput,
  reasonInput,
  editForm,
  addClassForm,
  addAdminForm,
  pendingPlan,
  loading,
  onConfirmInputChange,
  onReasonInputChange,
  onEditFormChange,
  onAddClassFormChange,
  onAddAdminFormChange,
  onPlanChange,
  onConfirm,
  onCancel,
}: ActionModalProps) {
  // ── Suspend ────────────────────────────────────────────────────────────────
  if (actionType === "suspend") {
    return (
      <Modal
        title="Suspend School"
        onClose={onCancel}
        loading={loading}
        onConfirm={onConfirm}
        confirmLabel="Suspend"
        confirmDisabled={false}
        danger>
        <AlertBox variant="warning">
          All students, teachers, and admins at <strong>{school.name}</strong> will immediately lose
          access to Gravitas. You can reactivate at any time.
        </AlertBox>
        <div>
          <Label>Reason for suspension (optional)</Label>
          <textarea
            className={`${inputCls} resize-none`}
            rows={3}
            value={reasonInput}
            onChange={(e) => onReasonInputChange(e.target.value)}
            placeholder="e.g., Payment overdue, policy violation…"
          />
          <p className="text-[11px] text-text-muted mt-1">
            Stored in the audit log and visible to admins.
          </p>
        </div>
      </Modal>
    );
  }

  // ── Reactivate ────────────────────────────────────────────────────────────
  if (actionType === "reactivate") {
    const isPending = school.status === "pending";
    return (
      <Modal
        title={isPending ? "Approve & Activate School" : "Reactivate School"}
        onClose={onCancel}
        loading={loading}
        onConfirm={onConfirm}
        confirmLabel={isPending ? "Approve" : "Reactivate"}
        confirmDisabled={false}>
        <AlertBox variant="info">
          <strong>{school.name}</strong> will{" "}
          {isPending
            ? "be approved and become fully active on Gravitas."
            : "regain full access. All students and admins will be able to log in again."}
        </AlertBox>
      </Modal>
    );
  }

  // ── Deactivate ────────────────────────────────────────────────────────────
  if (actionType === "deactivate") {
    return (
      <Modal
        title="Deactivate School"
        onClose={onCancel}
        loading={loading}
        onConfirm={onConfirm}
        confirmLabel="Deactivate"
        confirmDisabled={false}
        danger>
        <AlertBox variant="warning">
          This will soft-disable <strong>{school.name}</strong>. All data is preserved and the
          school can be reactivated later.
        </AlertBox>
        <div>
          <Label>Reason (optional)</Label>
          <textarea
            className={`${inputCls} resize-none`}
            rows={3}
            value={reasonInput}
            onChange={(e) => onReasonInputChange(e.target.value)}
            placeholder="e.g., School closed for the term…"
          />
        </div>
      </Modal>
    );
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  if (actionType === "delete") {
    return (
      <Modal
        title="Delete School"
        onClose={onCancel}
        loading={loading}
        onConfirm={onConfirm}
        confirmLabel="Permanently Delete"
        confirmDisabled={confirmInput !== school.name}
        danger>
        <AlertBox variant="danger">
          This is <strong>permanent and irreversible.</strong> All classes, students, admins, and
          data for <strong>{school.name}</strong> will be erased.
        </AlertBox>
        <div>
          <Label required>Type the school name to confirm</Label>
          <input
            type="text"
            className={inputCls}
            value={confirmInput}
            onChange={(e) => onConfirmInputChange(e.target.value)}
            placeholder={school.name}
            autoComplete="off"
            aria-describedby="delete-hint"
          />
          <p id="delete-hint" className="text-[11px] text-text-muted font-mono mt-1">
            {school.name}
          </p>
        </div>
      </Modal>
    );
  }

  // ── Edit Info ─────────────────────────────────────────────────────────────
  if (actionType === "edit_info" && editForm) {
    const set = <K extends keyof EditSchoolFormData>(k: K, v: EditSchoolFormData[K]) =>
      onEditFormChange({ ...editForm, [k]: v });

    return (
      <Modal
        title="Edit School Info"
        onClose={onCancel}
        loading={loading}
        onConfirm={onConfirm}
        confirmLabel="Save Changes"
        confirmDisabled={!editForm.name.trim()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label required>School Name</Label>
            <input
              type="text"
              className={inputCls}
              value={editForm.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g., Lagos Preparatory School"
            />
          </div>
          <div>
            <Label>School Type</Label>
            <select
              title="type"
              className={inputCls}
              value={editForm.type}
              onChange={(e) => set("type", e.target.value as SchoolType)}>
              {Object.entries(SCHOOL_TYPES).map(([k, c]) => (
                <option key={k} value={k}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Founded Year</Label>
            <input
              title="foundedYear"
              type="number"
              className={inputCls}
              value={editForm.foundedYear}
              onChange={(e) => set("foundedYear", parseInt(e.target.value) || editForm.foundedYear)}
            />
          </div>
          <div>
            <Label>Phone</Label>
            <input
              type="tel"
              className={inputCls}
              value={editForm.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+234..."
            />
          </div>
          <div>
            <Label>Email</Label>
            <input
              type="email"
              className={inputCls}
              value={editForm.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="info@school.edu.ng"
            />
          </div>
          <div>
            <Label>State</Label>
            <select
              title="state"
              className={inputCls}
              value={editForm.state}
              onChange={(e) => set("state", e.target.value)}>
              <option value="">Select State</option>
              {NIGERIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>City</Label>
            <input
              type="text"
              className={inputCls}
              value={editForm.city}
              onChange={(e) => set("city", e.target.value)}
              placeholder="e.g., Ikeja"
            />
          </div>
          <div className="md:col-span-2">
            <Label>Address</Label>
            <input
              title="address"
              type="text"
              className={inputCls}
              value={editForm.address}
              onChange={(e) => set("address", e.target.value)}
            />
          </div>
          <div>
            <Label>Motto</Label>
            <input
              type="text"
              className={inputCls}
              value={editForm.motto}
              onChange={(e) => set("motto", e.target.value)}
              placeholder="e.g., Knowledge is Power"
            />
          </div>
          <div>
            <Label>Website</Label>
            <input
              type="url"
              className={inputCls}
              value={editForm.website}
              onChange={(e) => set("website", e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>
      </Modal>
    );
  }

  // ── Change Plan ───────────────────────────────────────────────────────────
  if (actionType === "change_plan" && pendingPlan !== null) {
    return (
      <Modal
        title="Change Subscription Plan"
        onClose={onCancel}
        loading={loading}
        onConfirm={onConfirm}
        confirmLabel="Change Plan"
        confirmDisabled={pendingPlan === school.subscription.plan}>
        <p className="text-[12px] text-text-muted">
          Current plan:{" "}
          <strong className="text-green-900 capitalize">{school.subscription.plan}</strong>
        </p>
        <div className="space-y-2">
          {(Object.keys(SUBSCRIPTION_PLANS) as SubscriptionPlan[]).map((plan) => {
            const cfg = SUBSCRIPTION_PLANS[plan];
            const limits = PLAN_LIMITS[plan];
            // const Icon = cfg.icon;
            const selected = pendingPlan === plan;
            return (
              <label
                key={plan}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${selected ? "border-green-800 bg-green-50" : "border-gray-200 hover:border-green-800/30"}`}>
                <input
                  type="radio"
                  name="plan"
                  value={plan}
                  checked={selected}
                  onChange={() => onPlanChange(plan)}
                  className="sr-only"
                />
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: cfg.bg }}>
                  {/* //will change later when we have distinct icons for each plan */}
                  <School size={14} style={{ color: cfg.color }} />
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-green-900">{cfg.label}</div>
                  <div className="text-[11px] text-text-muted">
                    {cfg.price} · {limits.maxStudents.toLocaleString()} students ·{" "}
                    {limits.maxClasses} classes
                  </div>
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

  // ── Add Class ─────────────────────────────────────────────────────────────
  if (actionType === "add_class") {
    const set = <K extends keyof AddClassFormData>(k: K, v: AddClassFormData[K]) =>
      onAddClassFormChange({ ...addClassForm, [k]: v });
    return (
      <Modal
        title="Add New Class"
        onClose={onCancel}
        loading={loading}
        onConfirm={onConfirm}
        confirmLabel="Add Class"
        confirmDisabled={!addClassForm.name.trim() || !addClassForm.level.trim()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label required>Class Name</Label>
            <input
              type="text"
              className={inputCls}
              value={addClassForm.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g., SS2 Science"
            />
          </div>
          <div>
            <Label required>Level</Label>
            <input
              type="text"
              className={inputCls}
              value={addClassForm.level}
              onChange={(e) => set("level", e.target.value)}
              placeholder="e.g., SS2, JSS1"
            />
          </div>
          <div>
            <Label>Capacity</Label>
            <input
              title="capacity"
              type="number"
              className={inputCls}
              value={addClassForm.capacity}
              onChange={(e) => set("capacity", parseInt(e.target.value) || 40)}
              min={1}
            />
          </div>
        </div>

        <div className="pt-2 border-t" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-3">
            Class Admin
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label>Admin Name</Label>
              <input
                type="text"
                className={inputCls}
                value={addClassForm.adminName}
                onChange={(e) => set("adminName", e.target.value)}
                placeholder="e.g., Mr. Adewale Obi"
              />
            </div>
            <div>
              <Label>Admin Email</Label>
              <input
                type="email"
                className={inputCls}
                value={addClassForm.adminEmail}
                onChange={(e) => set("adminEmail", e.target.value)}
                placeholder="teacher@school.edu.ng"
              />
            </div>
            <div>
              <Label>Admin Phone</Label>
              <input
                type="tel"
                className={inputCls}
                value={addClassForm.adminPhone}
                onChange={(e) => set("adminPhone", e.target.value)}
                placeholder="+234..."
              />
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  // ── Delete Class ──────────────────────────────────────────────────────────
  if (actionType === "delete_class") {
    return (
      <Modal
        title="Remove Class"
        onClose={onCancel}
        loading={loading}
        onConfirm={onConfirm}
        confirmLabel="Remove Class"
        confirmDisabled={false}
        danger>
        <AlertBox variant="danger">
          This class will be permanently removed from <strong>{school.name}</strong>. All associated
          student enrolments and subject data will be lost.
        </AlertBox>
      </Modal>
    );
  }

  // ── Add Admin ─────────────────────────────────────────────────────────────
  if (actionType === "add_admin") {
    const set = <K extends keyof AddAdminFormData>(k: K, v: AddAdminFormData[K]) =>
      onAddAdminFormChange({ ...addAdminForm, [k]: v });
    return (
      <Modal
        title="Add School Admin"
        onClose={onCancel}
        loading={loading}
        onConfirm={onConfirm}
        confirmLabel="Add Admin"
        confirmDisabled={!addAdminForm.name.trim() || !addAdminForm.email.trim()}>
        <div className="space-y-4">
          <div>
            <Label required>Full Name</Label>
            <input
              type="text"
              className={inputCls}
              value={addAdminForm.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g., Mrs. Funke Adeyemi"
            />
          </div>
          <div>
            <Label required>Email Address</Label>
            <input
              type="email"
              className={inputCls}
              value={addAdminForm.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="admin@school.edu.ng"
            />
          </div>
          <div>
            <Label>Phone Number</Label>
            <input
              type="tel"
              className={inputCls}
              value={addAdminForm.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+234..."
            />
          </div>
          <div>
            <Label>Admin Role</Label>
            <div className="grid grid-cols-3 gap-2">
              {(["admin", "finance", "academic"] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => set("role", role)}
                  className={`p-2.5 rounded-xl border-2 text-[12px] font-semibold capitalize transition-all ${addAdminForm.role === role ? "border-green-800 bg-green-50 text-green-900" : "border-gray-200 text-text-muted hover:border-green-800/30"}`}>
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  // ── Remove Admin ──────────────────────────────────────────────────────────
  if (actionType === "remove_admin") {
    return (
      <Modal
        title="Remove Admin"
        onClose={onCancel}
        loading={loading}
        onConfirm={onConfirm}
        confirmLabel="Remove Admin"
        confirmDisabled={false}
        danger>
        <AlertBox variant="warning">
          This admin will be removed from <strong>{school.name}</strong> and will lose access to the
          school's management panel.
        </AlertBox>
      </Modal>
    );
  }

  return null;
}
