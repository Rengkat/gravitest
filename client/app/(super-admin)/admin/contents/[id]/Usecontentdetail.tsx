"use client";

import { useState, useCallback } from "react";
import type { ContentItem } from "@/types/admin-contents";
import { generateMockContent } from "@/lib/mock/contents";

// ─── Action types — mapped to backend endpoints ───────────────────────────────
// publish      → PATCH /library/:id/publish
// unpublish    → PATCH /library/:id/unpublish
// feature      → PATCH /library/:id  { isFeatured: true }
// unfeature    → PATCH /library/:id  { isFeatured: false }
// edit         → PATCH /library/:id  (full form)
// delete       → DELETE /library/:id (soft-delete: isActive = false)
// change_access → PATCH /library/:id  { accessLevel, price }

export type AdminAction =
  | "publish"
  | "unpublish"
  | "feature"
  | "unfeature"
  | "edit"
  | "delete"
  | "change_access";

export type DetailTab = "preview" | "analytics" | "access" | "activity";

export interface EditForm {
  title: string;
  description: string;
  author: string;
  subject: string;
  examTarget: string;
  audience: string;
  tags: string;
  isDownloadable: boolean;
  drmProtected: boolean;
}

export interface AccessForm {
  accessLevel: string;
  price: string;
}

interface UseContentDetailReturn {
  item: ContentItem | null;
  loading: boolean;
  actionLoading: boolean;
  activeTab: DetailTab;
  pendingAction: AdminAction | null;
  confirmInput: string;
  editForm: EditForm | null;
  accessForm: AccessForm;

  setActiveTab: (t: DetailTab) => void;
  initiateAction: (a: AdminAction) => void;
  cancelAction: () => void;
  confirmAction: () => Promise<void>;
  setConfirmInput: (v: string) => void;
  setEditForm: (d: EditForm) => void;
  setAccessForm: (d: AccessForm) => void;
}

export function useContentDetail(contentId: string): UseContentDetailReturn {
  const [item, setItem] = useState<ContentItem | null>(() => {
    // Find from mock list, fall back to first item
    const all = generateMockContent(50);
    return all.find((c) => c.id === contentId) ?? all[0] ?? null;
  });
  const [loading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<DetailTab>("preview");
  const [pendingAction, setPendingAction] = useState<AdminAction | null>(null);
  const [confirmInput, setConfirmInput] = useState("");
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [accessForm, setAccessForm] = useState<AccessForm>({ accessLevel: "free", price: "" });

  const initiateAction = useCallback(
    (action: AdminAction) => {
      setPendingAction(action);
      setConfirmInput("");
      if (action === "edit" && item) {
        setEditForm({
          title: item.title,
          description: item.description,
          author: item.author,
          subject: item.subject,
          examTarget: item.examTarget,
          audience: item.audience,
          tags: item.tags.join(", "),
          isDownloadable: item.isDownloadable,
          drmProtected: item.drmProtected,
        });
      }
      if (action === "change_access" && item) {
        setAccessForm({
          accessLevel: item.accessLevel,
          price: item.price > 0 ? String(item.price) : "",
        });
      }
    },
    [item],
  );

  const cancelAction = useCallback(() => {
    setPendingAction(null);
    setConfirmInput("");
    setEditForm(null);
  }, []);

  const confirmAction = useCallback(async () => {
    if (!item || !pendingAction) return;
    setActionLoading(true);
    await new Promise((r) => setTimeout(r, 700)); // replace with real API call

    setItem((prev) => {
      if (!prev) return prev;
      switch (pendingAction) {
        case "publish":
          return { ...prev, status: "published" as ContentItem["status"] };
        case "unpublish":
          return { ...prev, status: "draft" as ContentItem["status"] };
        case "feature":
          return { ...prev, isFeatured: true };
        case "unfeature":
          return { ...prev, isFeatured: false };
        case "delete":
          return { ...prev, status: "archived" as ContentItem["status"] };
        case "edit":
          if (!editForm) return prev;
          return {
            ...prev,
            title: editForm.title,
            description: editForm.description,
            author: editForm.author,
            subject: editForm.subject as ContentItem["subject"],
            examTarget: editForm.examTarget as ContentItem["examTarget"],
            audience: editForm.audience as ContentItem["audience"],
            tags: editForm.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
            isDownloadable: editForm.isDownloadable,
            drmProtected: editForm.drmProtected,
            dateUpdated: new Date().toISOString().split("T")[0],
          };
        case "change_access": {
          const price = parseFloat(accessForm.price) || 0;
          return {
            ...prev,
            accessLevel: accessForm.accessLevel as ContentItem["accessLevel"],
            price,
            isFree: accessForm.accessLevel === "free" || price === 0,
          };
        }
        default:
          return prev;
      }
    });

    setActionLoading(false);
    cancelAction();
  }, [item, pendingAction, editForm, accessForm, cancelAction]);

  return {
    item,
    loading,
    actionLoading,
    activeTab,
    pendingAction,
    confirmInput,
    editForm,
    accessForm,
    setActiveTab,
    initiateAction,
    cancelAction,
    confirmAction,
    setConfirmInput,
    setEditForm,
    setAccessForm,
  };
}
