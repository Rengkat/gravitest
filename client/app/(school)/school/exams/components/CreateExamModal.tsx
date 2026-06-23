"use client";

import { useEffect, useState } from "react";
import { X, Users } from "lucide-react";
import { TERMS, TERM_LABELS } from "../types";
import type { CreateExamDto, ClassExamStats, Term } from "../types";

interface CreateExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (examData: CreateExamDto) => void | Promise<void>;
  classStats: ClassExamStats[];
  /** When provided, the class field is pre-filled and locked (e.g. from a class detail page). */
  lockedClassId?: string;
  /** Subjects to offer in the dropdown, typically the locked class's subjects. */
  subjectOptions?: string[];
}

const toDateTimeInputValue = (date: Date) =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

function buildInitialFormData(classStats: ClassExamStats[], lockedClassId?: string): CreateExamDto {
  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
  return {
    classId: lockedClassId ?? classStats[0]?.classId ?? "",
    subject: "",
    title: "",
    term: "FIRST",
    termYear: "2025/2026",
    description: "",
    totalMarks: 100,
    durationMinutes: 60,
    startDate: now,
    endDate: oneHourLater,
    instruction: "",
    passingScore: 40,
  };
}

export function CreateExamModal({
  isOpen,
  onClose,
  onCreate,
  classStats,
  lockedClassId,
  subjectOptions,
}: CreateExamModalProps) {
  const [formData, setFormData] = useState<CreateExamDto>(() =>
    buildInitialFormData(classStats, lockedClassId),
  );
  const [submitting, setSubmitting] = useState(false);

  // Reset the form whenever the modal is (re)opened, so stale input from a
  // previous session never leaks into a new one.
  useEffect(() => {
    if (isOpen) {
      setFormData(buildInitialFormData(classStats, lockedClassId));
    }
  }, [isOpen, classStats, lockedClassId]);

  if (!isOpen) return null;

  const handleChange = <K extends keyof CreateExamDto>(field: K, value: CreateExamDto[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await onCreate(formData);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />

        <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
            <h2 className="text-xl font-semibold text-green-900">Create New Exam</h2>
            <button
              type="button"
              title="Close"
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-cream transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              {/* Class Selection */}
              <div>
                <label
                  htmlFor="exam-class"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Class * <Users size={14} className="inline ml-1" />
                </label>
                <select
                  id="exam-class"
                  required
                  disabled={Boolean(lockedClassId)}
                  value={formData.classId}
                  onChange={(e) => handleChange("classId", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-500">
                  {classStats.map((cls) => (
                    <option key={cls.classId} value={cls.classId}>
                      {cls.className} {cls.classArm ? `(${cls.classArm})` : ""} —{" "}
                      {cls.totalStudents} students
                    </option>
                  ))}
                </select>
                {lockedClassId && (
                  <p className="text-xs text-text-muted mt-1">
                    Creating this exam for the current class.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="exam-subject"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Subject *
                  </label>
                  {subjectOptions && subjectOptions.length > 0 ? (
                    <select
                      id="exam-subject"
                      required
                      value={formData.subject}
                      onChange={(e) => handleChange("subject", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500">
                      <option value="" disabled>
                        Select a subject
                      </option>
                      {subjectOptions.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id="exam-subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => handleChange("subject", e.target.value)}
                      placeholder="e.g., Mathematics"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                    />
                  )}
                </div>

                <div>
                  <label
                    htmlFor="exam-title"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Exam Title *
                  </label>
                  <input
                    id="exam-title"
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
                  <label
                    htmlFor="exam-term"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Term *
                  </label>
                  <select
                    id="exam-term"
                    required
                    value={formData.term}
                    onChange={(e) => handleChange("term", e.target.value as Term)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500">
                    {TERMS.map((term) => (
                      <option key={term} value={term}>
                        {TERM_LABELS[term]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="exam-term-year"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Term Year *
                  </label>
                  <input
                    id="exam-term-year"
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
                <label
                  htmlFor="exam-description"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="exam-description"
                  rows={2}
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Optional exam description..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="exam-total-marks"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Total Marks *
                  </label>
                  <input
                    id="exam-total-marks"
                    type="number"
                    required
                    min={1}
                    value={formData.totalMarks}
                    onChange={(e) => handleChange("totalMarks", Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="exam-duration"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes) *
                  </label>
                  <input
                    id="exam-duration"
                    type="number"
                    required
                    min={1}
                    value={formData.durationMinutes}
                    onChange={(e) => handleChange("durationMinutes", Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="exam-start"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date & Time *
                  </label>
                  <input
                    id="exam-start"
                    type="datetime-local"
                    required
                    value={toDateTimeInputValue(formData.startDate)}
                    onChange={(e) => handleChange("startDate", new Date(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="exam-end"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    End Date & Time *
                  </label>
                  <input
                    id="exam-end"
                    type="datetime-local"
                    required
                    min={toDateTimeInputValue(formData.startDate)}
                    value={toDateTimeInputValue(formData.endDate)}
                    onChange={(e) => handleChange("endDate", new Date(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="exam-instructions"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions
                </label>
                <textarea
                  id="exam-instructions"
                  rows={2}
                  value={formData.instruction}
                  onChange={(e) => handleChange("instruction", e.target.value)}
                  placeholder="Instructions for students..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label
                  htmlFor="exam-passing-score"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Passing Score (%)
                </label>
                <input
                  id="exam-passing-score"
                  type="number"
                  min={0}
                  max={100}
                  value={formData.passingScore}
                  onChange={(e) => handleChange("passingScore", Number(e.target.value))}
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
                disabled={submitting}
                className="px-4 py-2 rounded-lg bg-green-800 text-white hover:bg-green-700 disabled:opacity-50 transition-colors">
                {submitting ? "Creating..." : "Create Exam"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
