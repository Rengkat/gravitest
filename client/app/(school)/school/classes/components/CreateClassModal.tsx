"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { CreateClassDto } from "../types";

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (classData: CreateClassDto) => void;
}

export function CreateClassModal({ isOpen, onClose, onCreate }: CreateClassModalProps) {
  const [formData, setFormData] = useState<CreateClassDto>({
    name: "",
    arm: "",
    year: new Date().getFullYear(),
    description: "",
    defaultExamDurationMinutes: 60,
    defaultQuestionCount: 40,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof CreateClassDto, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    onCreate(formData);
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />

        <div className="relative bg-white rounded-2xl w-full max-w-md">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-green-900">Create New Class</h2>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-cream transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="e.g., SS3 Science, JSS3 A"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Arm/Section (Optional)
                </label>
                <input
                  type="text"
                  value={formData.arm}
                  onChange={(e) => handleChange("arm", e.target.value)}
                  placeholder="e.g., A, B, Science, Art"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Academic Year
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleChange("year", parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Optional class description..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                    Default Questions
                  </label>
                  <input
                    type="number"
                    value={formData.defaultQuestionCount}
                    onChange={(e) => handleChange("defaultQuestionCount", parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-cream transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-green-800 text-white hover:bg-green-700 disabled:opacity-50 transition-colors">
                {loading ? "Creating..." : "Create Class"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
