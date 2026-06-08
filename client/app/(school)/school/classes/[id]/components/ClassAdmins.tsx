"use client";

import { useState } from "react";
import { UserPlus, Shield, Mail, UserMinus, Search } from "lucide-react";
import Link from "next/link";
import type { ClassAdmin } from "../../types";

interface ClassAdminsProps {
  classId: string;
  admins: ClassAdmin[];
  onAdminAdd: (adminIds: string[]) => void;
  onAdminRemove: (adminId: string) => void;
}

// Mock available teachers for adding as admins
const AVAILABLE_TEACHERS = [
  {
    id: "teacher-001",
    firstName: "Mr. Adebayo",
    lastName: "Ogunlesi",
    email: "adebayo.teacher@example.com",
    role: "Teacher",
  },
  {
    id: "teacher-002",
    firstName: "Mrs. Okafor",
    lastName: "Nkechi",
    email: "nkechi.okafor@example.com",
    role: "Senior Teacher",
  },
  {
    id: "teacher-003",
    firstName: "Dr. Williams",
    lastName: "Michael",
    email: "michael.williams@example.com",
    role: "Head of Science",
  },
  {
    id: "teacher-004",
    firstName: "Mr. Eze",
    lastName: "Chinedu",
    email: "chinedu.eze@example.com",
    role: "Teacher",
  },
];

export function ClassAdmins({ classId, admins, onAdminAdd, onAdminRemove }: ClassAdminsProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAdmins = admins.filter((admin) =>
    `${admin.firstName} ${admin.lastName} ${admin.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const handleAddAdmins = () => {
    if (selectedAdmins.length > 0) {
      onAdminAdd(selectedAdmins);
      setSelectedAdmins([]);
      setShowAddModal(false);
    }
  };

  const handleRemoveAdmin = (adminId: string, adminName: string) => {
    if (confirm(`Are you sure you want to remove ${adminName} as a class admin?`)) {
      onAdminRemove(adminId);
    }
  };

  const toggleAdminSelection = (adminId: string) => {
    setSelectedAdmins((prev) =>
      prev.includes(adminId) ? prev.filter((id) => id !== adminId) : [...prev, adminId],
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex-1 min-w-[250px]">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"
              size={18}
            />
            <input
              type="text"
              placeholder="Search class admins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500"
            />
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-800 text-white hover:bg-green-700 transition-all">
          <UserPlus size={16} /> Add Class Admin
        </button>
      </div>

      {/* Admins Grid */}
      {filteredAdmins.length === 0 ? (
        <div
          className="text-center py-12 bg-white rounded-2xl border"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <Shield size={48} className="mx-auto text-text-muted mb-3" />
          <p className="text-text-muted">No class admins assigned yet</p>
          <p className="text-sm text-text-muted mt-1">Add teachers to manage this class</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAdmins.map((admin) => (
            <div
              key={admin.id}
              className="p-4 rounded-xl bg-white border"
              style={{ borderColor: "rgba(30,80,50,0.08)" }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <span className="text-green-700 font-semibold">
                      {getInitials(admin.firstName, admin.lastName)}
                    </span>
                  </div>
                  <div>
                    <Link
                      href={`/school/teachers/${admin.userId}`}
                      className="font-medium text-green-900 hover:text-green-700 transition-colors">
                      {admin.firstName} {admin.lastName}
                    </Link>
                    <p className="text-xs text-text-muted">{admin.role}</p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleRemoveAdmin(admin.id, `${admin.firstName} ${admin.lastName}`)
                  }
                  className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-red-600"
                  title="Remove as admin">
                  <UserMinus size={14} />
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <Mail size={12} />
                <span>{admin.email}</span>
              </div>
              <div className="mt-2 pt-2 border-t text-xs text-text-muted">
                Assigned: {new Date(admin.assignedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Admins Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />

            <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-green-900">Add Class Admins</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg hover:bg-cream transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="mb-4">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="Search teachers..."
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  {AVAILABLE_TEACHERS.filter(
                    (t) => !admins.some((admin) => admin.userId === t.id),
                  ).map((teacher) => (
                    <label
                      key={teacher.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-cream cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedAdmins.includes(teacher.id)}
                        onChange={() => toggleAdminSelection(teacher.id)}
                        className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {teacher.firstName} {teacher.lastName}
                        </p>
                        <p className="text-xs text-text-muted">
                          {teacher.email} • {teacher.role}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-cream transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleAddAdmins}
                  disabled={selectedAdmins.length === 0}
                  className="px-4 py-2 rounded-lg bg-green-800 text-white hover:bg-green-700 disabled:opacity-50 transition-colors">
                  Add {selectedAdmins.length} Admin(s)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { X } from "lucide-react";
