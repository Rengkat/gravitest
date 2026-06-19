"use client";

import { Pencil, Crown, ShieldOff, ShieldCheck, UserX, Trash2, RotateCcw } from "lucide-react";
import type { SchoolData } from "@/types/schoolsTypes";
import type { SchoolActionType } from "../useSchoolDetail";

interface ActionDef {
  type: SchoolActionType;
  label: string;
  hint: string;
  icon: any;
  variant: "primary" | "warning" | "danger" | "ghost";
}

function buildActions(school: SchoolData): ActionDef[] {
  const actions: ActionDef[] = [];

  // ── Status-aware top actions ───────────────────────────────
  if (school.status === "active") {
    actions.push({
      type: "suspend",
      label: "Suspend School",
      hint: "Block all access immediately. Reversible.",
      icon: ShieldOff,
      variant: "warning",
    });
  }

  if (school.status === "suspended") {
    actions.push({
      type: "reactivate",
      label: "Reactivate School",
      hint: "Restore full platform access.",
      icon: ShieldCheck,
      variant: "primary",
    });
  }

  if (school.status === "pending") {
    actions.push({
      type: "reactivate",
      label: "Approve & Activate",
      hint: "Approve this school and set it active.",
      icon: ShieldCheck,
      variant: "primary",
    });
  }

  if (school.status === "active" || school.status === "suspended") {
    actions.push({
      type: "deactivate",
      label: "Deactivate School",
      hint: "Soft-disable — data preserved.",
      icon: UserX,
      variant: "ghost",
    });
  }

  if (school.status === "inactive") {
    actions.push({
      type: "reactivate",
      label: "Reactivate School",
      hint: "Restore access for this school.",
      icon: RotateCcw,
      variant: "primary",
    });
  }

  // ── Always-available ───────────────────────────────────────
  actions.push(
    {
      type: "edit_info",
      label: "Edit School Info",
      hint: "Update name, contact, address.",
      icon: Pencil,
      variant: "ghost",
    },
    {
      type: "change_plan",
      label: "Change Subscription Plan",
      hint: "Override the school's access plan.",
      icon: Crown,
      variant: "ghost",
    },
  );

  // ── Danger ─────────────────────────────────────────────────
  actions.push({
    type: "delete",
    label: "Delete School",
    hint: "Permanent. Requires name confirmation.",
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
  school,
  onAction,
}: {
  school: SchoolData;
  onAction: (a: SchoolActionType) => void;
}) {
  return (
    <aside aria-label="Admin Actions">
      <div
        className="rounded-2xl bg-white border p-5 sticky top-6"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-4">
          Admin Actions
        </h2>
        <ul className="space-y-2.5">
          {buildActions(school).map((a) => (
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
