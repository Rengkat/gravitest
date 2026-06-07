"use client";

import { useState } from "react";
import { Save, X, Edit2, Shield, Key, Bell, Lock } from "lucide-react";
import type { StudentWithUser, EditStudentFormData } from "../../types";
import { Gender, NigerianState, ExamType } from "@/utils/enums";

interface StudentDetailViewProps {
  student: StudentWithUser;
  onStudentUpdate: (updatedStudent: StudentWithUser) => void;
}

export function StudentDetailView({ student, onStudentUpdate }: StudentDetailViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const handleChange = (field: keyof EditStudentFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
      onStudentUpdate(updatedStudent);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating student:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div
        className="p-6 rounded-2xl bg-white border"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-green-900">Edit Profile</h2>
          <button
            onClick={() => setIsEditing(false)}
            className="p-1 rounded-lg hover:bg-cream transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {/* Personal Info */}
          <div>
            <h3 className="font-medium text-green-800 mb-2">Personal Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500 text-sm"
                required
              />
              <input
                type="text"
                placeholder="Middle Name"
                value={formData.middleName || ""}
                onChange={(e) => handleChange("middleName", e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500 text-sm"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500 text-sm"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500 text-sm"
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phoneNumber || ""}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500 text-sm"
              />
              <input
                type="date"
                value={
                  formData.dateOfBirth
                    ? new Date(formData.dateOfBirth).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  handleChange("dateOfBirth", e.target.value ? new Date(e.target.value) : null)
                }
                className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500 text-sm"
              />
            </div>
          </div>

          {/* Academic Info */}
          <div>
            <h3 className="font-medium text-green-800 mb-2">Academic Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Current School"
                value={formData.currentSchool || ""}
                onChange={(e) => handleChange("currentSchool", e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500 text-sm"
              />
              <input
                type="text"
                placeholder="Current Class"
                value={formData.currentClass || ""}
                onChange={(e) => handleChange("currentClass", e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500 text-sm"
              />
              <input
                type="text"
                placeholder="Admission Number"
                value={formData.admissionNo || ""}
                onChange={(e) => handleChange("admissionNo", e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500 text-sm"
              />
              <input
                type="number"
                placeholder="Graduation Year"
                value={formData.graduationYear || ""}
                onChange={(e) =>
                  handleChange("graduationYear", e.target.value ? parseInt(e.target.value) : null)
                }
                className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500 text-sm"
              />
            </div>
          </div>

          {/* Parent Info */}
          <div>
            <h3 className="font-medium text-green-800 mb-2">Parent/Guardian Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Parent Name"
                value={formData.parentName || ""}
                onChange={(e) => handleChange("parentName", e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500 text-sm"
              />
              <input
                type="tel"
                placeholder="Parent Phone"
                value={formData.parentPhone || ""}
                onChange={(e) => handleChange("parentPhone", e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-cream transition-colors text-sm">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-green-800 text-white hover:bg-green-700 disabled:opacity-50 transition-colors text-sm flex items-center gap-2">
              <Save size={16} />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile View Mode */}
      <div
        className="p-6 rounded-2xl bg-white border"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-green-900">Profile Settings</h2>
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-800 text-white hover:bg-green-700 transition-colors text-sm">
            <Edit2 size={14} /> Edit Profile
          </button>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-text-muted">Full Name</p>
              <p className="font-medium">
                {student.user.firstName} {student.user.middleName} {student.user.lastName}
              </p>
            </div>
            <div>
              <p className="text-text-muted">Email</p>
              <p className="font-medium">{student.user.email}</p>
            </div>
            <div>
              <p className="text-text-muted">Phone</p>
              <p className="font-medium">{student.user.phoneNumber || "Not set"}</p>
            </div>
            <div>
              <p className="text-text-muted">Current Class</p>
              <p className="font-medium">{student.studentProfile.currentClass || "Not set"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div
        className="p-6 rounded-2xl bg-white border"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <h2 className="text-lg font-semibold text-green-900 mb-4">Security Settings</h2>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-cream transition-colors">
            <div className="flex items-center gap-3">
              <Key size={18} className="text-green-600" />
              <span className="text-sm">Reset Password</span>
            </div>
            <span className="text-xs text-text-muted">Send reset link</span>
          </button>

          <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-cream transition-colors">
            <div className="flex items-center gap-3">
              <Lock size={18} className="text-green-600" />
              <span className="text-sm">Force Logout from All Devices</span>
            </div>
            <span className="text-xs text-text-muted">Terminate all sessions</span>
          </button>

          <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-cream transition-colors">
            <div className="flex items-center gap-3">
              <Shield size={18} className="text-green-600" />
              <span className="text-sm">Force Email Verification</span>
            </div>
            <span className="text-xs text-text-muted">Resend verification email</span>
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      <div
        className="p-6 rounded-2xl bg-white border"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <h2 className="text-lg font-semibold text-green-900 mb-4">Notification Settings</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-cream transition-colors">
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-green-600" />
              <span className="text-sm">Email Notifications</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-cream transition-colors">
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-green-600" />
              <span className="text-sm">Push Notifications</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
