"use client";

import { useState } from "react";
import { Save, X, Edit2, Key, Lock, Shield, Bell } from "lucide-react";
import type { StudentWithUser, EditStudentFormData } from "../../types";
import { Gender, NigerianState } from "@/utils/enums";

const inputCls =
  "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all text-green-900";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-semibold uppercase tracking-wide text-text-muted mb-1">
      {children}
    </label>
  );
}

function SectionHead({ title }: { title: string }) {
  return <h3 className="text-[12px] font-bold text-green-800 mb-3 pt-1">{title}</h3>;
}

interface Props {
  student: StudentWithUser;
  onStudentUpdate: (updated: StudentWithUser) => void;
}

export function StudentDetailView({ student, onStudentUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<EditStudentFormData>({
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
    // school-context academic fields only
    currentSchool: null, // not shown — we're in the school dashboard
    currentClass: student.studentProfile.currentClass,
    graduationYear: student.studentProfile.graduationYear,
    admissionNo: student.studentProfile.admissionNo,
    examTargets: [], // not shown in school context
    examDate: null,
    targetScore: null,
    targetUniversity: null,
    targetCourse: null,
    focusSubjects: student.studentProfile.focusSubjects,
    parentName: student.studentProfile.parentName,
    parentPhone: student.studentProfile.parentPhone,
  });

  const set = <K extends keyof EditStudentFormData>(k: K, v: EditStudentFormData[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Replace with: PATCH /school/students/:id
      await new Promise((r) => setTimeout(r, 600));
      onStudentUpdate({
        user: {
          ...student.user,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phoneNumber: form.phoneNumber,
          gender: form.gender,
          stateOfResidence: form.stateOfResidence,
          lga: form.lga,
          bio: form.bio,
        },
        studentProfile: {
          ...student.studentProfile,
          currentClass: form.currentClass,
          graduationYear: form.graduationYear,
          admissionNo: form.admissionNo,
          focusSubjects: form.focusSubjects,
          parentName: form.parentName,
          parentPhone: form.parentPhone,
        },
      });
      setEditing(false);
    } finally {
      setLoading(false);
    }
  };

  if (editing) {
    return (
      <div
        className="rounded-2xl bg-white border p-5"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-lg text-green-900">Edit Student</h2>
          <button
            onClick={() => setEditing(false)}
            className="p-1.5 rounded-lg hover:bg-cream transition-colors">
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Personal */}
          <div>
            <SectionHead title="Personal Information" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>First Name *</Label>
                <input
                  type="text"
                  className={inputCls}
                  value={form.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Middle Name</Label>
                <input
                  type="text"
                  className={inputCls}
                  value={form.middleName ?? ""}
                  onChange={(e) => set("middleName", e.target.value || null)}
                />
              </div>
              <div>
                <Label>Last Name *</Label>
                <input
                  type="text"
                  className={inputCls}
                  value={form.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Email *</Label>
                <input
                  type="email"
                  className={inputCls}
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Phone</Label>
                <input
                  type="tel"
                  className={inputCls}
                  value={form.phoneNumber ?? ""}
                  onChange={(e) => set("phoneNumber", e.target.value || null)}
                  placeholder="+234..."
                />
              </div>
              <div>
                <Label>Date of Birth</Label>
                <input
                  type="date"
                  className={inputCls}
                  value={
                    form.dateOfBirth ? new Date(form.dateOfBirth).toISOString().split("T")[0] : ""
                  }
                  onChange={(e) =>
                    set("dateOfBirth", e.target.value ? new Date(e.target.value) : null)
                  }
                />
              </div>
              <div>
                <Label>Gender</Label>
                <select
                  title="gender"
                  className={inputCls}
                  value={form.gender ?? ""}
                  onChange={(e) => set("gender", (e.target.value as Gender) || null)}>
                  <option value="">Not specified</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <Label>State of Residence</Label>
                <input
                  type="text"
                  className={inputCls}
                  value={form.stateOfResidence ?? ""}
                  onChange={(e) =>
                    set("stateOfResidence", (e.target.value as NigerianState) || null)
                  }
                  placeholder="e.g., Lagos"
                />
              </div>
            </div>
          </div>

          {/* School Record */}
          <div>
            <SectionHead title="School Record" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>Admission No.</Label>
                <input
                  type="text"
                  className={inputCls}
                  value={form.admissionNo ?? ""}
                  onChange={(e) => set("admissionNo", e.target.value || null)}
                />
              </div>
              <div>
                <Label>Class</Label>
                <input
                  type="text"
                  className={inputCls}
                  value={form.currentClass ?? ""}
                  onChange={(e) => set("currentClass", e.target.value || null)}
                  placeholder="e.g., SS2 Science"
                />
              </div>
              <div>
                <Label>Expected Graduation Year</Label>
                <input
                  type="number"
                  className={inputCls}
                  value={form.graduationYear ?? ""}
                  onChange={(e) =>
                    set("graduationYear", e.target.value ? parseInt(e.target.value) : null)
                  }
                  placeholder="e.g., 2027"
                />
              </div>
              <div>
                <Label>Subjects Offered (comma-separated)</Label>
                <input
                  type="text"
                  className={inputCls}
                  value={form.focusSubjects.join(", ")}
                  onChange={(e) =>
                    set(
                      "focusSubjects",
                      e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    )
                  }
                  placeholder="e.g., Mathematics, Physics, Chemistry"
                />
              </div>
            </div>
          </div>

          {/* Parent / Guardian */}
          <div>
            <SectionHead title="Parent / Guardian" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>Parent Name</Label>
                <input
                  type="text"
                  className={inputCls}
                  value={form.parentName ?? ""}
                  onChange={(e) => set("parentName", e.target.value || null)}
                />
              </div>
              <div>
                <Label>Parent Phone</Label>
                <input
                  type="tel"
                  className={inputCls}
                  value={form.parentPhone ?? ""}
                  onChange={(e) => set("parentPhone", e.target.value || null)}
                  placeholder="+234..."
                />
              </div>
            </div>
          </div>

          <div
            className="flex justify-end gap-3 pt-2 border-t"
            style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-4 py-2 rounded-xl border border-gray-200 text-[13px] hover:bg-cream transition-all">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-green-800 text-white text-[13px] font-semibold hover:bg-green-700 disabled:opacity-50 transition-all">
              <Save size={14} /> {loading ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ── View mode ──────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {/* Profile */}
      <div
        className="rounded-2xl bg-white border p-5"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[14px] font-bold text-green-900">Profile Settings</h2>
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-800 text-white text-[12px] font-semibold hover:bg-green-700 transition-all">
            <Edit2 size={13} /> Edit
          </button>
        </div>
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 text-[12px]">
          {[
            {
              label: "Full Name",
              value: [student.user.firstName, student.user.middleName, student.user.lastName]
                .filter(Boolean)
                .join(" "),
            },
            { label: "Email", value: student.user.email },
            { label: "Phone", value: student.user.phoneNumber ?? "—" },
            { label: "Class", value: student.studentProfile.currentClass ?? "—" },
            { label: "Admission No", value: student.studentProfile.admissionNo ?? "—" },
            { label: "Grad. Year", value: student.studentProfile.graduationYear ?? "—" },
          ].map(({ label, value }) => (
            <div key={label}>
              <dt className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                {label}
              </dt>
              <dd className="font-medium text-green-900 mt-0.5">{value}</dd>
            </div>
          ))}
        </dl>

        {student.studentProfile.focusSubjects.length > 0 && (
          <div className="mt-3 pt-3 border-t" style={{ borderColor: "rgba(30,80,50,0.06)" }}>
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-text-muted mb-1.5">
              Subjects Offered
            </dt>
            <div className="flex flex-wrap gap-1.5">
              {student.studentProfile.focusSubjects.map((s) => (
                <span
                  key={s}
                  className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[11px] font-semibold">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Security */}
      <div
        className="rounded-2xl bg-white border p-5"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <h2 className="text-[14px] font-bold text-green-900 mb-3">Account Actions</h2>
        <div className="space-y-1">
          {[
            { icon: Key, label: "Send Password Reset", hint: "Email a reset link" },
            { icon: Lock, label: "Force Logout from All Devices", hint: "Terminate all sessions" },
            { icon: Shield, label: "Resend Email Verification", hint: "Resend verification email" },
          ].map(({ icon: Icon, label, hint }) => (
            <button
              key={label}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-cream transition-colors">
              <div className="flex items-center gap-3">
                <Icon size={15} className="text-green-700 shrink-0" />
                <span className="text-[13px] font-medium text-green-900">{label}</span>
              </div>
              <span className="text-[11px] text-text-muted">{hint}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div
        className="rounded-2xl bg-white border p-5"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <h2 className="text-[14px] font-bold text-green-900 mb-3">Notifications</h2>
        <div className="space-y-1">
          {["Email Notifications", "Push Notifications"].map((label) => (
            <div
              key={label}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-cream transition-colors">
              <div className="flex items-center gap-3">
                <Bell size={15} className="text-green-700 shrink-0" />
                <span className="text-[13px] font-medium text-green-900">{label}</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600" />
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
