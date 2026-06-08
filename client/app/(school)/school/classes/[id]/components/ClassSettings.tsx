"use client";

import { useState } from "react";
import { Save, Key, Power, Trash2, AlertTriangle } from "lucide-react";
import type { ClassWithDetails, UpdateClassDto } from "../types";

interface ClassSettingsProps {
  classData: ClassWithDetails;
  onClassUpdate: (updatedClass: ClassWithDetails) => void;
}

export function ClassSettings({ classData, onClassUpdate }: ClassSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showRotatePinModal, setShowRotatePinModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState<UpdateClassDto>({
    name: classData.name,
    arm: classData.arm,
    year: classData.year,
    description: classData.description,
    defaultExamDurationMinutes: classData.defaultExamDurationMinutes,
    defaultQuestionCount: classData.defaultQuestionCount,
  });

  const handleChange = (field: keyof UpdateClassDto, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      const updatedClass = { ...classData, ...formData };
      await new Promise((resolve) => setTimeout(resolve, 500));
      onClassUpdate(updatedClass);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating class:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    const updatedClass = { ...classData, isActive: !classData.isActive };
    onClassUpdate(updatedClass);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <div
        className="p-6 rounded-2xl bg-white border"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-green-900">General Settings</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-lg bg-green-800 text-white hover:bg-green-700 transition-colors text-sm">
              Edit Settings
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-cream transition-colors text-sm">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-800 text-white hover:bg-green-700 disabled:opacity-50 transition-colors text-sm">
                <Save size={14} />
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Arm/Section</label>
                <input
                  type="text"
                  value={formData.arm || ""}
                  onChange={(e) => handleChange("arm", e.target.value || null)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Academic Year
                </label>
                <input
                  type="number"
                  value={formData.year || ""}
                  onChange={(e) =>
                    handleChange("year", e.target.value ? parseInt(e.target.value) : null)
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Exam Duration (min)
                </label>
                <input
                  type="number"
                  value={formData.defaultExamDurationMinutes}
                  onChange={(e) =>
                    handleChange("defaultExamDurationMinutes", parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Questions per Exam
                </label>
                <input
                  type="number"
                  value={formData.defaultQuestionCount}
                  onChange={(e) => handleChange("defaultQuestionCount", parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={formData.description || ""}
                onChange={(e) => handleChange("description", e.target.value || null)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-muted">Class Name</p>
                <p className="font-medium">{classData.name}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">Arm/Section</p>
                <p className="font-medium">{classData.arm || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">Academic Year</p>
                <p className="font-medium">{classData.year || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">Default Exam Duration</p>
                <p className="font-medium">{classData.defaultExamDurationMinutes} minutes</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">Default Questions per Exam</p>
                <p className="font-medium">{classData.defaultQuestionCount} questions</p>
              </div>
            </div>
            {classData.description && (
              <div>
                <p className="text-sm text-text-muted">Description</p>
                <p className="text-gray-700">{classData.description}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Security Settings */}
      <div
        className="p-6 rounded-2xl bg-white border"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <h2 className="text-lg font-semibold text-green-900 mb-4">Security Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-cream">
            <div className="flex items-center gap-3">
              <Key size={18} className="text-yellow-600" />
              <div>
                <p className="font-medium text-sm">Class Access PIN</p>
                <p className="text-xs text-text-muted">
                  Last changed:{" "}
                  {classData.pinLastChangedAt ? formatDate(classData.pinLastChangedAt) : "Never"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowRotatePinModal(true)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-white transition-colors text-sm">
              Rotate PIN
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-cream">
            <div className="flex items-center gap-3">
              <Power size={18} className={classData.isActive ? "text-green-600" : "text-red-600"} />
              <div>
                <p className="font-medium text-sm">Class Status</p>
                <p className="text-xs text-text-muted">
                  {classData.isActive
                    ? "Active - Students can access"
                    : "Inactive - Class is disabled"}
                </p>
              </div>
            </div>
            <button
              onClick={handleToggleStatus}
              className={`px-3 py-1.5 rounded-lg transition-colors text-sm ${
                classData.isActive
                  ? "border border-yellow-200 text-yellow-700 hover:bg-yellow-50"
                  : "bg-green-800 text-white hover:bg-green-700"
              }`}>
              {classData.isActive ? "Deactivate" : "Activate"}
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-6 rounded-2xl border-2 border-red-200 bg-red-50/30">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={18} className="text-red-600" />
          <h2 className="text-lg font-semibold text-red-800">Danger Zone</h2>
        </div>
        <p className="text-sm text-red-700 mb-4">
          Permanently delete this class and all associated data. This action cannot be undone.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          disabled={classData.totalStudents > 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors ${
            classData.totalStudents > 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
          title={
            classData.totalStudents > 0
              ? `Cannot delete class with ${classData.totalStudents} enrolled students`
              : ""
          }>
          <Trash2 size={16} /> Delete Class
        </button>
        {classData.totalStudents > 0 && (
          <p className="text-xs text-red-600 mt-2">
            Remove all {classData.totalStudents} student(s) from this class before deleting.
          </p>
        )}
      </div>
    </div>
  );
}
