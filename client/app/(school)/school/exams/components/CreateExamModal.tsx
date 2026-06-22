"use client";

import { useState } from "react";
import { X, Calendar, Clock, BookOpen, Users } from "lucide-react";
import type { CreateExamDto, ClassExamStats, Term } from "../types";

interface CreateExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (examData: CreateExamDto) => void;
  classStats: ClassExamStats[];
}

export function CreateExamModal({ isOpen, onClose, onCreate, classStats }: CreateExamModalProps) {
  const [formData, setFormData] = useState<CreateExamDto>({
    classId: classStats[0]?.classId || "",
    subject: "",
    title: "",
    term: "FIRST",
    termYear: "2025/2026",
    description: "",
    totalMarks: 100,
    durationMinutes: 60,
    startDate: new Date(),
    endDate: new Date(),
    instruction: "",
    passingScore: 40,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof CreateExamDto, value: any) => {
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

        <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
            <h2 className="text-xl font-semibold text-green-900">Create New Exam</h2>
            <button
              title="close"
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-cream transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              {/* Class Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class * <Users size={14} className="inline ml-1" />
                </label>
                <select
                  required
                  value={formData.classId}
                  onChange={(e) => handleChange("classId", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500">
                  {classStats.map((cls) => (
                    <option key={cls.classId} value={cls.classId}>
                      {cls.className} {cls.classArm ? `(${cls.classArm})` : ""} -{" "}
                      {cls.totalStudents} students
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => handleChange("subject", e.target.value)}
                    placeholder="e.g., Mathematics"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Exam Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="e.g., First Term Mathematics"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Term *</label>
                  <select
                    title="term"
                    required
                    value={formData.term}
                    onChange={(e) => handleChange("term", e.target.value as Term)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500">
                    <option value="FIRST">First Term</option>
                    <option value="SECOND">Second Term</option>
                    <option value="THIRD">Third Term</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Term Year *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.termYear}
                    onChange={(e) => handleChange("termYear", e.target.value)}
                    placeholder="e.g., 2025/2026"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Optional exam description..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Marks *
                  </label>
                  <input
                    title="total marks"
                    type="number"
                    required
                    min={1}
                    value={formData.totalMarks}
                    onChange={(e) => handleChange("totalMarks", parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes) *
                  </label>
                  <input
                    title="durations"
                    type="number"
                    required
                    min={1}
                    value={formData.durationMinutes}
                    onChange={(e) => handleChange("durationMinutes", parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date & Time *
                  </label>
                  <input
                    title="time"
                    type="datetime-local"
                    required
                    value={new Date(
                      formData.startDate.getTime() - formData.startDate.getTimezoneOffset() * 60000,
                    )
                      .toISOString()
                      .slice(0, 16)}
                    onChange={(e) => handleChange("startDate", new Date(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date & Time *
                  </label>
                  <input
                    title="time"
                    type="datetime-local"
                    required
                    value={new Date(
                      formData.endDate.getTime() - formData.endDate.getTimezoneOffset() * 60000,
                    )
                      .toISOString()
                      .slice(0, 16)}
                    onChange={(e) => handleChange("endDate", new Date(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                <textarea
                  rows={2}
                  value={formData.instruction}
                  onChange={(e) => handleChange("instruction", e.target.value)}
                  placeholder="Instructions for students..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Passing Score (%)
                </label>
                <input
                  title="score"
                  type="number"
                  min={0}
                  max={100}
                  value={formData.passingScore}
                  onChange={(e) => handleChange("passingScore", parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                />
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
                {loading ? "Creating..." : "Create Exam"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
