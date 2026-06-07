"use client";

import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import type { StudentWithUser } from "../types";
import { DeactivationType } from "@/utils/enums";

interface DeactivateStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentWithUser;
  onSuccess: () => void;
}

export function DeactivateStudentModal({
  isOpen,
  onClose,
  student,
  onSuccess,
}: DeactivateStudentModalProps) {
  const [reason, setReason] = useState("");
  const [deactivationType, setDeactivationType] = useState<DeactivationType>(
    DeactivationType.ADMIN_SUSPENSION,
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Replace with actual API call
      await fetch(`/api/school/students/${student.user.id}/deactivate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: deactivationType,
          reason: reason,
          deactivatedBy: "admin", // Replace with actual admin user ID
        }),
      });

      onSuccess();
    } catch (error) {
      console.error("Error deactivating student:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReactivate = async () => {
    setLoading(true);

    try {
      // Replace with actual API call
      await fetch(`/api/school/students/${student.user.id}/reactivate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      onSuccess();
    } catch (error) {
      console.error("Error reactivating student:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (student.user.isActive) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black/50" onClick={onClose} />

          <div className="relative bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <AlertTriangle className="text-yellow-600" size={20} />
                </div>
                <h2 className="text-xl font-semibold text-green-900">Deactivate Student</h2>
              </div>
              <button
                title="close"
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-cream transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to deactivate{" "}
                <strong>
                  {student.user.firstName} {student.user.lastName}
                </strong>
                ? This will prevent them from accessing the platform until reactivated.
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deactivation Type
                </label>
                <select
                  title="deactivation type"
                  value={deactivationType}
                  onChange={(e) => setDeactivationType(e.target.value as DeactivationType)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500">
                  <option value={DeactivationType.ADMIN_SUSPENSION}>Admin Initiated</option>
                  <option value={DeactivationType.SECURITY_LOCK}>Policy Violation</option>
                  <option value={DeactivationType.USER_REQUEST}>Inactivity</option>
                  <option value={DeactivationType.UNVERIFIED_EMAIL}>Other</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason (Optional)
                </label>
                <textarea
                  title="reason"
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Provide a reason for deactivation..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
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
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700 disabled:opacity-50 transition-colors">
                  {loading ? "Processing..." : "Deactivate Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />

        <div className="relative bg-white rounded-2xl w-full max-w-md">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <AlertTriangle className="text-green-600" size={20} />
              </div>
              <h2 className="text-xl font-semibold text-green-900">Reactivate Student</h2>
            </div>

            <p className="text-gray-700 mb-6">
              This account is currently deactivated. Reactivating will restore full access for{" "}
              <strong>
                {student.user.firstName} {student.user.lastName}
              </strong>
              .
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-cream transition-colors">
                Cancel
              </button>
              <button
                onClick={handleReactivate}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-green-800 text-white hover:bg-green-700 disabled:opacity-50 transition-colors">
                {loading ? "Processing..." : "Reactivate Account"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
