"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  /** Supports a short paragraph; pass a fragment if you need bold bits. */
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Visually marks the confirm button as destructive (red) vs. neutral (green). */
  variant?: "danger" | "default";
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await onConfirm();
    } finally {
      setSubmitting(false);
    }
  };

  const isDanger = variant === "danger";

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black/50" onClick={submitting ? undefined : onCancel} />

        <div className="relative bg-white rounded-2xl w-full max-w-sm p-6">
          <button
            type="button"
            title="Close"
            onClick={onCancel}
            disabled={submitting}
            className="absolute top-4 right-4 p-1 rounded-lg hover:bg-cream transition-colors disabled:opacity-50">
            <X size={18} />
          </button>

          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
              isDanger ? "bg-red-100" : "bg-green-100"
            }`}>
            <AlertTriangle size={22} className={isDanger ? "text-red-600" : "text-green-700"} />
          </div>

          <h2 className="text-lg font-semibold text-green-900 mb-2">{title}</h2>
          <div className="text-sm text-text-muted mb-6">{message}</div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-cream disabled:opacity-50 transition-colors">
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={submitting}
              className={`px-4 py-2 rounded-lg text-white disabled:opacity-50 transition-colors ${
                isDanger ? "bg-red-600 hover:bg-red-700" : "bg-green-800 hover:bg-green-700"
              }`}>
              {submitting ? "Please wait..." : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
