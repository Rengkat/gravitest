"use client";

import {
  ShieldOff,
  ShieldCheck,
  Trash2,
  KeyRound,
  Pencil,
  Crown,
  BadgeCheck,
  Lock,
  UserX,
} from "lucide-react";
import type { User } from "../../types";
import type { AdminActionType } from "../types";

interface ActionDef {
  type: AdminActionType;
  label: string;
  description: string;
  icon: any;
  className: string;
}

function getActions(user: User): ActionDef[] {
  const actions: ActionDef[] = [];

  // Primary mutating action depends on status
  if (user.status === "active") {
    actions.push({
      type: "suspend",
      label: "Suspend Account",
      description: "Block access immediately. Reversible.",
      icon: ShieldOff,
      className:
        "w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all text-[13px] font-semibold",
    });
  }

  if (user.status === "suspended" || user.status === "deactivated") {
    actions.push({
      type: "activate",
      label: "Reactivate Account",
      description: "Restore full platform access.",
      icon: ShieldCheck,
      className:
        "w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-green-800 text-white hover:bg-green-700 transition-all text-[13px] font-semibold shadow-sm",
    });
  }

  if (user.status === "active" || user.status === "suspended") {
    actions.push({
      type: "deactivate",
      label: "Deactivate Account",
      description: "Soft-disable — keeps data intact.",
      icon: UserX,
      className:
        "w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-text-muted hover:bg-cream transition-all text-[13px] font-medium",
    });
  }

  actions.push(
    {
      type: "edit",
      label: "Edit Profile",
      description: "Update name, email, phone.",
      icon: Pencil,
      className:
        "w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-green-900 hover:bg-cream transition-all text-[13px] font-medium",
    },
    {
      type: "change_tier",
      label: "Change Subscription Tier",
      description: "Override the user's access tier.",
      icon: Crown,
      className:
        "w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-green-900 hover:bg-cream transition-all text-[13px] font-medium",
    },
    {
      type: "reset_password",
      label: "Send Password Reset",
      description: "Email a reset link to the user.",
      icon: KeyRound,
      className:
        "w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-green-900 hover:bg-cream transition-all text-[13px] font-medium",
    },
  );

  if (!user.twoFactorEnabled) {
    actions.push({
      type: "toggle_2fa",
      label: "Force Enable 2FA",
      description: "Enable two-factor auth for this account.",
      icon: Lock,
      className:
        "w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-green-900 hover:bg-cream transition-all text-[13px] font-medium",
    });
  }

  if (user.verificationStatus !== "verified") {
    actions.push({
      type: "verify_email",
      label: "Force Verify Email",
      description: "Mark email as verified without the link.",
      icon: BadgeCheck,
      className:
        "w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-green-900 hover:bg-cream transition-all text-[13px] font-medium",
    });
  }

  // Danger last
  actions.push({
    type: "delete",
    label: "Delete Account",
    description: "Permanent. Requires email confirmation.",
    icon: Trash2,
    className:
      "w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-all text-[13px] font-semibold",
  });

  return actions;
}

export function AdminActionsPanel({
  user,
  onAction,
}: {
  user: User;
  onAction: (a: AdminActionType) => void;
}) {
  const actions = getActions(user);

  return (
    <aside aria-label="Admin Actions">
      <div
        className="rounded-2xl bg-white border p-5 sticky top-6"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-4">
          Admin Actions
        </h2>

        <ul className="space-y-2">
          {actions.map((a) => (
            <li key={a.type}>
              <button
                className={a.className}
                onClick={() => onAction(a.type)}
                aria-describedby={`desc-${a.type}`}>
                <a.icon size={14} className="shrink-0" />
                {a.label}
              </button>
              <p id={`desc-${a.type}`} className="text-[10px] text-text-muted mt-0.5 px-1">
                {a.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
