"use client";

import { useState } from "react";
import { X, Mail, User, Phone, BookOpen, Users, Send, UserPlus } from "lucide-react";
import type { TeacherFormData } from "../types";

interface InviteTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (data: TeacherFormData) => void;
}

// Mock available classes for assignment
const AVAILABLE_CLASSES = [
  { id: "class-001", name: "SS3 Science", arm: "A" },
  { id: "class-002", name: "SS3 Art", arm: "B" },
  { id: "class-003", name: "SS3 Commercial", arm: null },
  { id: "class-004", name: "SS2 Science", arm: "A" },
  { id: "class-005", name: "JSS3", arm: "A" },
];

const AVAILABLE_SUBJECTS = [
  "Mathematics",
  "English",
  "Physics",
  "Chemistry",
  "Biology",
  "Economics",
  "Commerce",
  "Accounting",
  "Literature",
  "Government",
  "History",
  "Geography",
  "Computer Science",
  "Physical Education",
];

export function InviteTeacherModal({ isOpen, onClose, onInvite }: InviteTeacherModalProps) {
  const [formData, setFormData] = useState<TeacherFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "TEACHER",
    classIds: [],
    subjects: [],
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"details" | "assign">("details");

  const handleChange = (field: keyof TeacherFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    onInvite(formData);
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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <UserPlus size={20} className="text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-green-900">Invite Teacher</h2>
            </div>
            <button
              title="close"
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-cream transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <div
                  className={`h-2 rounded-full ${step === "details" ? "bg-green-800" : "bg-green-400"}`}
                />
                <p className="text-xs text-text-muted mt-1">Teacher Details</p>
              </div>
              <div className="flex-1">
                <div
                  className={`h-2 rounded-full ${step === "assign" ? "bg-green-800" : "bg-gray-200"}`}
                />
                <p className="text-xs text-text-muted mt-1">Class Assignment</p>
              </div>
            </div>

            {step === "details" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"
                        size={18}
                      />
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => handleChange("firstName", e.target.value)}
                        placeholder="e.g., Mr. Adebayo"
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      placeholder="e.g., Ogunlesi"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"
                      size={18}
                    />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="teacher@school.com"
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"
                      size={18}
                    />
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleChange("phoneNumber", e.target.value)}
                      placeholder="+234 800 000 0000"
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                  <select
                    title="role"
                    required
                    value={formData.role}
                    onChange={(e) =>
                      handleChange("role", e.target.value as TeacherFormData["role"])
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500">
                    <option value="TEACHER">Teacher</option>
                    <option value="CLASS_ADMIN">Class Admin</option>
                    <option value="HEAD_OF_DEPARTMENT">Head of Department</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subjects Taught *
                  </label>
                  <select
                    title="subjects"
                    required
                    multiple
                    value={formData.subjects}
                    onChange={(e) => {
                      const selected = Array.from(
                        e.target.selectedOptions,
                        (option) => option.value,
                      );
                      handleChange("subjects", selected);
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500 min-h-[100px]">
                    {AVAILABLE_SUBJECTS.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-text-muted mt-1">
                    Hold Ctrl/Cmd to select multiple subjects
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-cream transition-colors">
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("assign")}
                    className="px-4 py-2 rounded-lg bg-green-800 text-white hover:bg-green-700 transition-colors">
                    Next: Assign Classes →
                  </button>
                </div>
              </div>
            )}

            {step === "assign" && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>📌 Assign classes to this teacher.</strong>
                    <br />
                    They will be able to manage exams and students for these classes.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign to Classes
                  </label>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {AVAILABLE_CLASSES.map((cls) => (
                      <label
                        key={cls.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-cream cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.classIds.includes(cls.id)}
                          onChange={() => {
                            const newClassIds = formData.classIds.includes(cls.id)
                              ? formData.classIds.filter((id) => id !== cls.id)
                              : [...formData.classIds, cls.id];
                            handleChange("classIds", newClassIds);
                          }}
                          className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <div>
                          <p className="font-medium text-sm">
                            {cls.name} {cls.arm ? `(${cls.arm})` : ""}
                          </p>
                          <p className="text-xs text-text-muted">ID: {cls.id}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setStep("details")}
                    className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-cream transition-colors">
                    ← Back
                  </button>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-cream transition-colors">
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading || formData.classIds.length === 0}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-800 text-white hover:bg-green-700 disabled:opacity-50 transition-colors">
                      {loading ? (
                        "Sending Invitation..."
                      ) : (
                        <>
                          <Send size={16} />
                          Send Invitation
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
