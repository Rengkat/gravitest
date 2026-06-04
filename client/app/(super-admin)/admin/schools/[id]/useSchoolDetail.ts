"use client";

import { useState, useCallback } from "react";
import type { SchoolData, SchoolClass, SubscriptionPlan, SchoolStatus } from "@/types/schoolsTypes";
import { generateMockSchoolById } from "@/lib/mock/schoolsMockData";

// ─── Tabs ─────────────────────────────────────────────────────────────────────

export type DetailTab = "overview" | "classes" | "admins" | "activity" | "billing";

// ─── Action types — mapped to backend endpoints ───────────────────────────────
// edit_info      → PATCH /schools/:id  (name, contact, address, motto, type)
// change_plan    → PATCH /schools/:id/subscription  { plan }
// suspend        → PATCH /schools/:id/status  { status: 'suspended' }
// reactivate     → PATCH /schools/:id/status  { status: 'active' }
// deactivate     → PATCH /schools/:id/status  { status: 'inactive' }
// delete         → DELETE /schools/:id  (requires name confirmation)
// add_class      → POST /schools/:id/classes
// edit_class     → PATCH /schools/:id/classes/:classId
// delete_class   → DELETE /schools/:id/classes/:classId
// add_admin      → POST /schools/:id/admins
// remove_admin   → DELETE /schools/:id/admins/:adminId

export type SchoolActionType =
  | "edit_info"
  | "change_plan"
  | "suspend"
  | "reactivate"
  | "deactivate"
  | "delete"
  | "add_class"
  | "edit_class"
  | "delete_class"
  | "add_admin"
  | "remove_admin";

export interface EditSchoolFormData {
  name: string;
  type: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  motto: string;
  website: string;
  foundedYear: number;
}

export interface AddClassFormData {
  name: string;
  level: string;
  capacity: number;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
}

export interface AddAdminFormData {
  name: string;
  email: string;
  phone: string;
  role: "admin" | "finance" | "academic";
}

interface UseSchoolDetailReturn {
  school: SchoolData | null;
  loading: boolean;
  actionLoading: boolean;
  activeTab: DetailTab;
  expandedClass: string | null;
  pendingAction: SchoolActionType | null;
  confirmInput: string;
  reasonInput: string;
  editForm: EditSchoolFormData | null;
  addClassForm: AddClassFormData;
  addAdminForm: AddAdminFormData;
  pendingPlan: SubscriptionPlan | null;
  targetClassId: string | null;
  targetAdminId: string | null;

  setActiveTab: (t: DetailTab) => void;
  toggleClass: (id: string) => void;
  initiateAction: (a: SchoolActionType, meta?: { classId?: string; adminId?: string }) => void;
  cancelAction: () => void;
  confirmAction: () => Promise<void>;
  setConfirmInput: (v: string) => void;
  setReasonInput: (v: string) => void;
  setEditForm: (d: EditSchoolFormData) => void;
  setAddClassForm: (d: AddClassFormData) => void;
  setAddAdminForm: (d: AddAdminFormData) => void;
  setPendingPlan: (p: SubscriptionPlan) => void;
}

const BLANK_CLASS: AddClassFormData = {
  name: "", level: "", capacity: 40,
  adminName: "", adminEmail: "", adminPhone: "",
};

const BLANK_ADMIN: AddAdminFormData = {
  name: "", email: "", phone: "", role: "admin",
};

export function useSchoolDetail(schoolId: string): UseSchoolDetailReturn {
  const [school, setSchool] = useState<SchoolData | null>(() =>
    generateMockSchoolById(schoolId)
  );
  const [loading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const [expandedClass, setExpandedClass] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<SchoolActionType | null>(null);
  const [confirmInput, setConfirmInput] = useState("");
  const [reasonInput, setReasonInput] = useState("");
  const [editForm, setEditForm] = useState<EditSchoolFormData | null>(null);
  const [addClassForm, setAddClassForm] = useState<AddClassFormData>(BLANK_CLASS);
  const [addAdminForm, setAddAdminForm] = useState<AddAdminFormData>(BLANK_ADMIN);
  const [pendingPlan, setPendingPlan] = useState<SubscriptionPlan | null>(null);
  const [targetClassId, setTargetClassId] = useState<string | null>(null);
  const [targetAdminId, setTargetAdminId] = useState<string | null>(null);

  const toggleClass = useCallback((id: string) => {
    setExpandedClass((prev) => (prev === id ? null : id));
  }, []);

  const initiateAction = useCallback(
    (action: SchoolActionType, meta?: { classId?: string; adminId?: string }) => {
      setPendingAction(action);
      setConfirmInput("");
      setReasonInput("");
      setTargetClassId(meta?.classId ?? null);
      setTargetAdminId(meta?.adminId ?? null);

      if (action === "edit_info" && school) {
        setEditForm({
          name: school.name,
          type: school.type,
          phone: school.contact.phone,
          email: school.contact.email,
          address: school.location.address,
          city: school.location.city,
          state: school.location.state,
          motto: school.motto ?? "",
          website: school.contact.website ?? "",
          foundedYear: school.foundedYear,
        });
      }
      if (action === "change_plan" && school) {
        setPendingPlan(school.subscription.plan);
      }
      if (action === "add_class") {
        setAddClassForm(BLANK_CLASS);
      }
      if (action === "add_admin") {
        setAddAdminForm(BLANK_ADMIN);
      }
    },
    [school]
  );

  const cancelAction = useCallback(() => {
    setPendingAction(null);
    setConfirmInput("");
    setReasonInput("");
    setEditForm(null);
    setAddClassForm(BLANK_CLASS);
    setAddAdminForm(BLANK_ADMIN);
    setPendingPlan(null);
    setTargetClassId(null);
    setTargetAdminId(null);
  }, []);

  const confirmAction = useCallback(async () => {
    if (!school || !pendingAction) return;
    setActionLoading(true);
    await new Promise((r) => setTimeout(r, 800)); // replace with real API call

    setSchool((prev) => {
      if (!prev) return prev;
      switch (pendingAction) {
        case "suspend":
          return { ...prev, status: "suspended" as SchoolStatus };
        case "reactivate":
          return { ...prev, status: "active" as SchoolStatus };
        case "deactivate":
          return { ...prev, status: "inactive" as SchoolStatus };
        case "delete":
          return { ...prev, status: "inactive" as SchoolStatus };

        case "edit_info":
          if (!editForm) return prev;
          return {
            ...prev,
            name: editForm.name,
            type: editForm.type as SchoolData["type"],
            motto: editForm.motto,
            foundedYear: editForm.foundedYear,
            contact: {
              ...prev.contact,
              phone: editForm.phone,
              email: editForm.email,
              website: editForm.website || undefined,
            },
            location: {
              ...prev.location,
              address: editForm.address,
              city: editForm.city,
              state: editForm.state,
            },
          };

        case "change_plan":
          if (!pendingPlan) return prev;
          return {
            ...prev,
            subscription: { ...prev.subscription, plan: pendingPlan },
          };

        case "add_class": {
          const newClass: SchoolClass = {
            id: `cls_${Date.now()}`,
            name: addClassForm.name,
            level: addClassForm.level,
            totalStudents: 0,
            capacity: addClassForm.capacity,
            subjects: [],
            sessionsCompleted: 0,
            averageScore: 0,
            status: "active",
            classAdmin: {
              id: `ca_${Date.now()}`,
              name: addClassForm.adminName,
              email: addClassForm.adminEmail,
              phone: addClassForm.adminPhone,
            },
            createdAt: new Date().toISOString().split("T")[0],
          };
          return {
            ...prev,
            classes: [...prev.classes, newClass],
            stats: { ...prev.stats, totalClasses: prev.stats.totalClasses + 1 },
          };
        }

        case "delete_class":
          return {
            ...prev,
            classes: prev.classes.filter((c) => c.id !== targetClassId),
            stats: { ...prev.stats, totalClasses: Math.max(0, prev.stats.totalClasses - 1) },
          };

        case "add_admin": {
          const newAdmin = {
            id: `adm_${Date.now()}`,
            name: addAdminForm.name,
            email: addAdminForm.email,
            phone: addAdminForm.phone,
            role: addAdminForm.role,
            lastActive: new Date().toISOString().split("T")[0],
            status: "active" as const,
          };
          return { ...prev, admins: [...prev.admins, newAdmin] };
        }

        case "remove_admin":
          return {
            ...prev,
            admins: prev.admins.filter((a) => a.id !== targetAdminId),
          };

        default:
          return prev;
      }
    });

    setActionLoading(false);
    cancelAction();
  }, [school, pendingAction, editForm, pendingPlan, addClassForm, addAdminForm, targetClassId, targetAdminId, cancelAction]);

  return {
    school, loading, actionLoading, activeTab, expandedClass,
    pendingAction, confirmInput, reasonInput, editForm,
    addClassForm, addAdminForm, pendingPlan, targetClassId, targetAdminId,
    setActiveTab, toggleClass, initiateAction, cancelAction, confirmAction,
    setConfirmInput, setReasonInput, setEditForm,
    setAddClassForm, setAddAdminForm, setPendingPlan,
  };
}
