"use client";

import {
  ShieldOff,
  ShieldCheck,
  UserX,
  Pencil,
  Crown,
  KeyRound,
  BadgeCheck,
  Trash2,
} from "lucide-react";
import type { User } from "../../types";
import type { AdminActionType } from "../types";

interface ActionDef {
  type: AdminActionType;
  label: string;
  hint: string;
  icon: any;
  variant: "primary" | "warning" | "danger" | "ghost";
}

function buildActions(user: User): ActionDef[] {
  const actions: ActionDef[] = [];

  // ── Status mutation — context-aware ──────────────────────────────────────
  if (user.status === "active") {
    actions.push({
      type: "suspend",
      label: "Suspend Account",
      hint: "Block access immediately. Reversible.",
      icon: ShieldOff,
      variant: "warning",
    });
  }

  if (user.status === "suspended") {
    actions.push({
      type: "unsuspend",
      label: "Lift Suspension",
      hint: "Restore full platform access.",
      icon: ShieldCheck,
      variant: "primary",
    });
  }

  if (user.status === "active" || user.status === "suspended") {
    actions.push({
      type: "deactivate",
      label: "Deactivate Account",
      hint: "Soft-disable — data preserved.",
      icon: UserX,
      variant: "ghost",
    });
  }

  if (user.status === "inactive") {
    actions.push({
      type: "unsuspend",
      label: "Reactivate Account",
      hint: "Restore the user's access.",
      icon: ShieldCheck,
      variant: "primary",
    });
  }

  // ── Always-available actions ──────────────────────────────────────────────
  actions.push(
    {
      type: "edit",
      label: "Edit Profile",
      hint: "Update name, email, role, phone.",
      icon: Pencil,
      variant: "ghost",
    },
    {
      type: "change_tier",
      label: "Change Subscription Tier",
      hint: "Override the user's access plan.",
      icon: Crown,
      variant: "ghost",
    },
    {
      type: "reset_password",
      label: "Reset Password",
      hint: "Generate a temp password or notify.",
      icon: KeyRound,
      variant: "ghost",
    },
  );

  if (user.verificationStatus !== "verified") {
    actions.push({
      type: "verify_email",
      label: "Force Verify Email",
      hint: "Mark email verified without the link.",
      icon: BadgeCheck,
      variant: "ghost",
    });
  }

  // ── Danger — always last ──────────────────────────────────────────────────
  actions.push({
    type: "delete",
    label: "Delete Account",
    hint: "Permanent. Requires email confirmation.",
    icon: Trash2,
    variant: "danger",
  });

  return actions;
}

const VARIANT_CLS: Record<string, string> = {
  primary:
    "w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-green-800 text-white hover:bg-green-700 transition-all text-[13px] font-semibold shadow-sm",
  warning:
    "w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all text-[13px] font-semibold",
  danger:
    "w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-all text-[13px] font-semibold",
  ghost:
    "w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-green-900 hover:bg-cream transition-all text-[13px] font-medium",
};

export function AdminActionsPanel({
  user,
  onAction,
}: {
  user: User;
  onAction: (a: AdminActionType) => void;
}) {
  const actions = buildActions(user);

  return (
    <aside aria-label="Admin Actions">
      <div
        className="rounded-2xl bg-white border p-5 sticky top-6"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-4">
          Admin Actions
        </h2>

        <ul className="space-y-2.5">
          {actions.map((a) => (
            <li key={a.type}>
              <button
                className={VARIANT_CLS[a.variant]}
                onClick={() => onAction(a.type)}
                aria-describedby={`hint-${a.type}`}>
                <a.icon size={14} className="shrink-0" />
                {a.label}
              </button>
              <p id={`hint-${a.type}`} className="text-[10px] text-text-muted mt-0.5 pl-1">
                {a.hint}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
