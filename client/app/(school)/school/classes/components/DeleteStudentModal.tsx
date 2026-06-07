"use client";

import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import type { StudentWithUser } from "../types";

interface DeleteStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentWithUser;
  onSuccess: () => void;
}

function DeleteStudentModal({ isOpen, onClose, student, onSuccess }: DeleteStudentModalProps) {
  const [confirmText, setConfirmText] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmText !== "DELETE") return;

    setLoading(true);

    try {
      // Replace with actual API call
      await fetch(`/api/school/students/${student.user.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: reason,
          deletedBy: "admin", // Replace with actual admin user ID
        }),
      });

      onSuccess();
    } catch (error) {
      console.error("Error deleting student:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />

        <div className="relative bg-white rounded-2xl w-full max-w-md">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="text-red-600" size={20} />
              </div>
              <h2 className="text-xl font-semibold text-green-900">Delete Student</h2>
            </div>
            <button
              title="close"
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-cream transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="bg-red-50 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm">
                <strong>Warning:</strong> This action cannot be undone. This will permanently delete
                the student's account and all associated data including study history, exam results,
                and achievements.
              </p>
            </div>

            <p className="text-gray-700 mb-4">
              You are about to delete{" "}
              <strong>
                {student.user.firstName} {student.user.lastName}
              </strong>
              's account.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Deletion
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please provide a reason for deleting this account..."
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type <strong className="text-red-600">DELETE</strong> to confirm
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-cream transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || confirmText !== "DELETE"}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                {loading ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default DeleteStudentModal;
