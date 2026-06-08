"use client";

import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import type { SchoolClass } from "../types";

interface DeleteClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  classItem: SchoolClass;
  onSuccess: () => void;
}

export function DeleteClassModal({ isOpen, onClose, classItem, onSuccess }: DeleteClassModalProps) {
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmText !== "DELETE") return;

    setLoading(true);

    try {
      // Replace with actual API call
      // await fetch(`/api/schools/classes/${classItem.id}`, {
      //   method: 'DELETE',
      // });

      // Mock delete
      await new Promise((resolve) => setTimeout(resolve, 500));

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error deleting class:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const hasStudents = classItem.totalStudents > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />

        <div className="relative bg-white rounded-2xl w-full max-w-md">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-green-900">Delete Class</h2>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-cream transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {hasStudents ? (
              <div className="bg-red-50 rounded-lg p-4 mb-6">
                <p className="text-red-800 text-sm font-medium mb-2">
                  Cannot delete class with enrolled students
                </p>
                <p className="text-red-700 text-sm">
                  This class currently has {classItem.totalStudents} student(s) enrolled. Please
                  remove all students from the class before deleting it.
                </p>
              </div>
            ) : (
              <>
                <div className="bg-red-50 rounded-lg p-4 mb-6">
                  <p className="text-red-800 text-sm">
                    <strong>Warning:</strong> This action cannot be undone. This will permanently
                    delete the class "
                    <strong>
                      {classItem.name}
                      {classItem.arm ? ` (${classItem.arm})` : ""}
                    </strong>
                    " and all associated data including exams and student enrollments.
                  </p>
                </div>

                <p className="text-gray-700 mb-4">
                  Class Code:{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded">{classItem.classCode}</code>
                </p>

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
              </>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-cream transition-colors">
                Cancel
              </button>
              {!hasStudents && (
                <button
                  type="submit"
                  disabled={loading || confirmText !== "DELETE"}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  {loading ? "Deleting..." : "Permanently Delete"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
