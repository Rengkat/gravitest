"use client";

import { useState } from "react";
import { Check, X, UserCheck, UserX, Trash2, Download, ShieldOff } from "lucide-react";
import type { UserStatus, UserRole, AccountType, SubscriptionTier } from "../types";
import { ROLE_CONFIG, SUBSCRIPTION_CONFIG } from "../constants";

// ─── BULK ACTIONS BAR ────────────────────────────────────────
interface BulkProps {
  count: number;
  onActivate: () => void;
  onSuspend: () => void;
  onDeactivate: () => void;
  onDelete: () => void;
  onExport: () => void;
  onClear: () => void;
}

export function BulkActionsBar({
  count,
  onActivate,
  onSuspend,
  onDeactivate,
  onDelete,
  onExport,
  onClear,
}: BulkProps) {
  return (
    <div className="mb-4 p-4 rounded-2xl bg-green-800 text-white flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-3">
        <Check size={18} />
        <span className="text-[14px] font-semibold">
          {count} user{count > 1 ? "s" : ""} selected
        </span>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <BulkBtn Icon={UserCheck} label="Activate" onClick={onActivate} />
        <BulkBtn Icon={ShieldOff} label="Suspend" onClick={onSuspend} />
        <BulkBtn Icon={UserX} label="Deactivate" onClick={onDeactivate} />
        <BulkBtn Icon={Download} label="Export" onClick={onExport} />
        <BulkBtn Icon={Trash2} label="Delete" onClick={onDelete} danger />
        <button
          onClick={onClear}
          className="ml-2 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-[13px] font-medium">
          <X size={14} /> Clear
        </button>
      </div>
    </div>
  );
}

function BulkBtn({
  Icon,
  label,
  onClick,
  danger = false,
}: {
  Icon: any;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-[13px] font-medium ${
        danger ? "bg-red-500/30 hover:bg-red-500/50" : "bg-white/10 hover:bg-white/20"
      }`}>
      <Icon size={14} />
      {label}
    </button>
  );
}

// ─── ADD USER MODAL ──────────────────────────────────────────
interface AddUserProps {
  onClose: () => void;
  onAdd: (user: any) => void;
}

export function AddUserModal({ onClose, onAdd }: AddUserProps) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "student" as UserRole,
    accountType: "individual" as AccountType,
    subscriptionTier: "free" as SubscriptionTier,
    schoolName: "",
    subjects: "",
  });

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    if (!form.firstName || !form.email) return;
    const now = new Date().toISOString().split("T")[0];
    onAdd({
      id: `usr_${Date.now()}`,
      ...form,
      status: "pending" as UserStatus,
      joinDate: now,
      lastActive: now,
      totalLogins: 0,
      deviceCount: 0,
      subscriptionStatus: "trial",
      totalSpent: 0,
      verificationStatus: "pending",
      twoFactorEnabled: false,
      referralCount: 0,
      tags: [],
      studentProfile:
        form.role === "student"
          ? {
              examTargets: [],
              subjectsEnrolled: form.subjects ? form.subjects.split(",").map((s) => s.trim()) : [],
              xpPoints: 0,
              streak: 0,
              averageScore: 0,
              sessionsCompleted: 0,
              totalStudyHours: 0,
              schoolName: form.schoolName || undefined,
            }
          : undefined,
      tutorProfile:
        form.role === "tutor"
          ? {
              subjects: form.subjects ? form.subjects.split(",").map((s) => s.trim()) : [],
              qualifications: [],
              yearsOfExperience: 0,
              rating: 0,
              ratingCount: 0,
              totalSessionsConducted: 0,
              totalStudentsTaught: 0,
              isVerified: false,
              availabilityStatus: "available",
            }
          : undefined,
      schoolAdminProfile:
        form.role === "school_admin"
          ? {
              schoolId: `sch_${Date.now()}`,
              schoolName: form.schoolName,
              schoolType: "private",
              adminRole: "admin",
              managedClasses: [],
              managedStudentCount: 0,
              managedTeacherCount: 0,
              subscriptionManaged: form.subscriptionTier,
            }
          : undefined,
    });
    onClose();
  };

  const inputCls =
    "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all";

  const showSchool =
    (form.role === "student" && form.accountType === "school_based") ||
    form.role === "school_admin";
  const showSubjects = form.role === "student" || form.role === "tutor";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-xl text-green-900">Add New User</h3>
          <button
            title="close"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>First Name *</Label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                placeholder="e.g., Adebayo"
                className={inputCls}
              />
            </div>
            <div>
              <Label>Last Name *</Label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => set("lastName", e.target.value)}
                placeholder="e.g., Okonkwo"
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <Label>Email *</Label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="user@example.com"
              className={inputCls}
            />
          </div>

          <div>
            <Label>Phone</Label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+234..."
              className={inputCls}
            />
          </div>

          {/* Role selector */}
          <div>
            <Label>Role *</Label>
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
                      form.role === role
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

          {/* Account type — only for students */}
          {form.role === "student" && (
            <div>
              <Label>Account Type</Label>
              <div className="grid grid-cols-2 gap-2">
                {(["individual", "school_based"] as AccountType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => set("accountType", t)}
                    className={`p-3 rounded-xl border-2 text-[12px] font-semibold transition-all capitalize ${
                      form.accountType === t
                        ? "border-green-800 bg-green-50 text-green-900"
                        : "border-gray-200 text-text-muted"
                    }`}>
                    {t.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* School name */}
          {showSchool && (
            <div>
              <Label>School Name {form.role === "school_admin" ? "*" : ""}</Label>
              <input
                type="text"
                value={form.schoolName}
                onChange={(e) => set("schoolName", e.target.value)}
                placeholder="e.g., Lagos Preparatory School"
                className={inputCls}
              />
            </div>
          )}

          {/* Subjects */}
          {showSubjects && (
            <div>
              <Label>Subjects (comma-separated)</Label>
              <input
                type="text"
                value={form.subjects}
                onChange={(e) => set("subjects", e.target.value)}
                placeholder="e.g., Mathematics, Physics, Chemistry"
                className={inputCls}
              />
            </div>
          )}

          <div>
            <Label>Subscription Plan</Label>
            <select
              title="subscribtion"
              value={form.subscriptionTier}
              onChange={(e) => set("subscriptionTier", e.target.value as SubscriptionTier)}
              className={inputCls}>
              {Object.entries(SUBSCRIPTION_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label} — {v.price}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-[14px] font-semibold text-text-muted hover:bg-gray-50 transition-all">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!form.firstName || !form.email}
            className="flex-1 py-3 rounded-xl bg-green-800 text-white font-semibold hover:bg-green-700 transition-all text-[14px] disabled:opacity-50">
            Add User
          </button>
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[12px] font-semibold text-green-900 mb-1.5">{children}</label>
  );
}
