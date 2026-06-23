"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { Teacher } from "../types";

interface AssignClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher | null;
  onAssign: (
    teacherId: string,
    classData: {
      classId: string;
      className: string;
      classArm: string | null;
      role: "CLASS_ADMIN" | "SUBJECT_TEACHER";
      subjects: string[];
    },
  ) => void;
}

// Mock available classes
const AVAILABLE_CLASSES = [
  { id: "class-001", name: "SS3 Science", arm: "A" },
  { id: "class-002", name: "SS3 Art", arm: "B" },
  { id: "class-003", name: "SS3 Commercial", arm: null },
  { id: "class-004", name: "SS2 Science", arm: "A" },
  { id: "class-005", name: "JSS3", arm: "A" },
];

export function AssignClassModal({ isOpen, onClose, teacher, onAssign }: AssignClassModalProps) {
  const [selectedClassId, setSelectedClassId] = useState("");
  const [role, setRole] = useState<"CLASS_ADMIN" | "SUBJECT_TEACHER">("SUBJECT_TEACHER");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacher || !selectedClassId) return;

    setLoading(true);
    const selectedClass = AVAILABLE_CLASSES.find((c) => c.id === selectedClassId);

    onAssign(teacher.id, {
      classId: selectedClassId,
      className: selectedClass?.name || "",
      classArm: selectedClass?.arm || null,
      role,
      subjects,
    });

    setLoading(false);
    onClose();
  };

  if (!isOpen || !teacher) return null;

  const assignedClassIds = teacher.assignedClasses.map((c) => c.classId);
  const availableClasses = AVAILABLE_CLASSES.filter((c) => !assignedClassIds.includes(c.id));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />

        <div className="relative bg-white rounded-2xl w-full max-w-md">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-green-900">
              Assign Class to {teacher.firstName} {teacher.lastName}
            </h2>
            <button
              title="close"
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-cream transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Class *</label>
              <select
                title="class id"
                required
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500">
                <option value="">Select a class...</option>
                {availableClasses.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} {cls.arm ? `(${cls.arm})` : ""}
                  </option>
                ))}
              </select>
              {availableClasses.length === 0 && (
                <p className="text-sm text-yellow-600 mt-1">
                  This teacher is already assigned to all available classes.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role in Class *
              </label>
              <select
                title="role"
                required
                value={role}
                onChange={(e) => setRole(e.target.value as "CLASS_ADMIN" | "SUBJECT_TEACHER")}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500">
                <option value="CLASS_ADMIN">Class Admin (Full Access)</option>
                <option value="SUBJECT_TEACHER">Subject Teacher (Limited Access)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subjects for this Class
              </label>
              <input
                type="text"
                value={subjects.join(", ")}
                onChange={(e) =>
                  setSubjects(
                    e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  )
                }
                placeholder="Enter subjects separated by commas"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
              />
              <p className="text-xs text-text-muted mt-1">e.g., Mathematics, Physics, Chemistry</p>
            </div>

            {teacher.assignedClasses.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Currently Assigned Classes:
                </p>
                <div className="space-y-1">
                  {teacher.assignedClasses.map((cls, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded-lg bg-cream text-sm">
                      <span>
                        {cls.className} {cls.classArm ? `(${cls.classArm})` : ""}
                        <span className="text-xs text-text-muted ml-2">
                          ({cls.role.replace("_", " ")})
                        </span>
                      </span>
                      <span className="text-xs text-text-muted">{cls.subjects.join(", ")}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-cream transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !selectedClassId || availableClasses.length === 0}
                className="px-4 py-2 rounded-lg bg-green-800 text-white hover:bg-green-700 disabled:opacity-50 transition-colors">
                {loading ? "Assigning..." : "Assign Class"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
