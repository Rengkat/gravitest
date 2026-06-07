"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { StudentWithUser, EditStudentFormData } from "../types";
import { Gender, NigerianState, ExamType } from "@/utils/enums";

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentWithUser;
  onSuccess: (updatedStudent: StudentWithUser) => void;
}

export function EditStudentModal({ isOpen, onClose, student, onSuccess }: EditStudentModalProps) {
  const [formData, setFormData] = useState<EditStudentFormData>({
    firstName: student.user.firstName,
    middleName: student.user.middleName,
    lastName: student.user.lastName,
    email: student.user.email,
    phoneNumber: student.user.phoneNumber,
    dateOfBirth: student.user.dateOfBirth,
    gender: student.user.gender,
    stateOfResidence: student.user.stateOfResidence,
    lga: student.user.lga,
    bio: student.user.bio,
    currentSchool: student.studentProfile.currentSchool,
    currentClass: student.studentProfile.currentClass,
    graduationYear: student.studentProfile.graduationYear,
    admissionNo: student.studentProfile.admissionNo,
    examTargets: student.studentProfile.examTargets,
    examDate: student.studentProfile.examDate,
    targetScore: student.studentProfile.targetScore,
    targetUniversity: student.studentProfile.targetUniversity,
    targetCourse: student.studentProfile.targetCourse,
    focusSubjects: student.studentProfile.focusSubjects,
    parentPhone: student.studentProfile.parentPhone,
    parentName: student.studentProfile.parentName,
  });

  const [loading, setLoading] = useState(false);
  const [subjectInput, setSubjectInput] = useState("");

  const handleChange = (field: keyof EditStudentFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSubject = () => {
    if (subjectInput.trim() && !formData.focusSubjects.includes(subjectInput.trim())) {
      handleChange("focusSubjects", [...formData.focusSubjects, subjectInput.trim()]);
      setSubjectInput("");
    }
  };

  const handleRemoveSubject = (subject: string) => {
    handleChange(
      "focusSubjects",
      formData.focusSubjects.filter((s) => s !== subject),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Replace with actual API call
      const response = await fetch(`/api/school/students/${student.user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const updatedStudent = await response.json();
      onSuccess(updatedStudent);
    } catch (error) {
      console.error("Error updating student:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />

        <div className="relative bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-green-900">Edit Student Profile</h2>
            <button
              title="close"
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-cream transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium text-green-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      title="first name"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Middle Name
                    </label>
                    <input
                      title="middle name"
                      type="text"
                      value={formData.middleName || ""}
                      onChange={(e) => handleChange("middleName", e.target.value || null)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      title="last name"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      title="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      title="phone number"
                      type="tel"
                      value={formData.phoneNumber || ""}
                      onChange={(e) => handleChange("phoneNumber", e.target.value || null)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      title="date of birth"
                      type="date"
                      value={
                        formData.dateOfBirth
                          ? new Date(formData.dateOfBirth).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        handleChange(
                          "dateOfBirth",
                          e.target.value ? new Date(e.target.value) : null,
                        )
                      }
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      title="gender"
                      value={formData.gender || ""}
                      onChange={(e) => handleChange("gender", e.target.value || null)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500">
                      <option value="">Select gender</option>
                      {Object.values(Gender).map((gender) => (
                        <option key={gender} value={gender}>
                          {gender}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State of Residence
                    </label>
                    <select
                      title="state of residence"
                      value={formData.stateOfResidence || ""}
                      onChange={(e) => handleChange("stateOfResidence", e.target.value || null)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500">
                      <option value="">Select state</option>
                      {Object.values(NigerianState).map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LGA</label>
                    <input
                      title="lga"
                      type="text"
                      value={formData.lga || ""}
                      onChange={(e) => handleChange("lga", e.target.value || null)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      title="bio"
                      rows={3}
                      value={formData.bio || ""}
                      onChange={(e) => handleChange("bio", e.target.value || null)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div>
                <h3 className="text-lg font-medium text-green-900 mb-4">Academic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current School
                    </label>
                    <input
                      title="current school"
                      type="text"
                      value={formData.currentSchool || ""}
                      onChange={(e) => handleChange("currentSchool", e.target.value || null)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Class
                    </label>
                    <input
                      title="current class"
                      type="text"
                      value={formData.currentClass || ""}
                      onChange={(e) => handleChange("currentClass", e.target.value || null)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Admission Number
                    </label>
                    <input
                      title="admission number"
                      type="text"
                      value={formData.admissionNo || ""}
                      onChange={(e) => handleChange("admissionNo", e.target.value || null)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Graduation Year
                    </label>
                    <input
                      title="graduation year"
                      type="number"
                      value={formData.graduationYear || ""}
                      onChange={(e) =>
                        handleChange(
                          "graduationYear",
                          e.target.value ? parseInt(e.target.value) : null,
                        )
                      }
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Exam Targets */}
              <div>
                <h3 className="text-lg font-medium text-green-900 mb-4">Exam Targets</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Exam Targets
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {Object.values(ExamType).map((exam) => (
                        <label key={exam} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.examTargets.includes(exam)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleChange("examTargets", [...formData.examTargets, exam]);
                              } else {
                                handleChange(
                                  "examTargets",
                                  formData.examTargets.filter((t) => t !== exam),
                                );
                              }
                            }}
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                          <span className="text-sm">{exam}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Exam Date
                    </label>
                    <input
                      title="exam date"
                      type="date"
                      value={
                        formData.examDate
                          ? new Date(formData.examDate).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        handleChange("examDate", e.target.value ? new Date(e.target.value) : null)
                      }
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Score
                    </label>
                    <input
                      title="target score"
                      type="number"
                      value={formData.targetScore || ""}
                      onChange={(e) =>
                        handleChange(
                          "targetScore",
                          e.target.value ? parseInt(e.target.value) : null,
                        )
                      }
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target University
                    </label>
                    <input
                      title="target university"
                      type="text"
                      value={formData.targetUniversity || ""}
                      onChange={(e) => handleChange("targetUniversity", e.target.value || null)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Course
                    </label>
                    <input
                      title="target course"
                      type="text"
                      value={formData.targetCourse || ""}
                      onChange={(e) => handleChange("targetCourse", e.target.value || null)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Focus Subjects */}
              <div>
                <h3 className="text-lg font-medium text-green-900 mb-4">Focus Subjects</h3>
                <div>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={subjectInput}
                      onChange={(e) => setSubjectInput(e.target.value)}
                      placeholder="Add a subject"
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                      onKeyPress={(e) => e.key === "Enter" && handleAddSubject()}
                    />
                    <button
                      type="button"
                      onClick={handleAddSubject}
                      className="px-4 py-2 rounded-lg bg-green-800 text-white hover:bg-green-700">
                      Add
                    </button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {formData.focusSubjects.map((subject) => (
                      <span
                        key={subject}
                        className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm flex items-center gap-2">
                        {subject}
                        <button
                          type="button"
                          onClick={() => handleRemoveSubject(subject)}
                          className="hover:text-red-600">
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Parent Information */}
              <div>
                <h3 className="text-lg font-medium text-green-900 mb-4">
                  Parent/Guardian Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Parent Name
                    </label>
                    <input
                      type="text"
                      title="parent name"
                      value={formData.parentName || ""}
                      onChange={(e) => handleChange("parentName", e.target.value || null)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Parent Phone
                    </label>
                    <input
                      type="tel"
                      title="parent phone"
                      value={formData.parentPhone || ""}
                      onChange={(e) => handleChange("parentPhone", e.target.value || null)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
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
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
