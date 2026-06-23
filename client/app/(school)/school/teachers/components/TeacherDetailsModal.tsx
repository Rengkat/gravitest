"use client";

import { useState } from "react";
import {
  X,
  Mail,
  Phone,
  BookOpen,
  Users,
  Calendar,
  Award,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import type { Teacher } from "../types";

interface TeacherDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher | null;
}

export function TeacherDetailsModal({ isOpen, onClose, teacher }: TeacherDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "classes" | "performance">("overview");

  if (!isOpen || !teacher) return null;

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />

        <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white z-10">
            <div className="flex items-start justify-between p-6 border-b">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-green-700">
                    {getInitials(teacher.firstName, teacher.lastName)}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-green-900">
                    {teacher.firstName} {teacher.lastName}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        teacher.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                      {teacher.isActive ? "Active" : "Inactive"}
                    </span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
                      {teacher.role.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-muted mt-2">
                    <Mail size={14} />
                    <span>{teacher.email}</span>
                    {teacher.phoneNumber && (
                      <>
                        <span>•</span>
                        <Phone size={14} />
                        <span>{teacher.phoneNumber}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button
                title="close"
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-cream transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 px-6 border-b">
              {(["overview", "classes", "performance"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 text-sm font-medium capitalize transition-colors relative ${
                    activeTab === tab ? "text-green-800" : "text-text-muted hover:text-green-700"
                  }`}>
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-800 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 rounded-lg bg-cream text-center">
                    <p className="text-xs text-text-muted">Classes</p>
                    <p className="text-xl font-bold text-green-900">
                      {teacher.assignedClasses.length}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-cream text-center">
                    <p className="text-xs text-text-muted">Exams</p>
                    <p className="text-xl font-bold text-green-900">{teacher.totalExams}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-cream text-center">
                    <p className="text-xs text-text-muted">Avg. Score</p>
                    <p className="text-xl font-bold text-green-900">
                      {teacher.averageStudentScore}%
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-text-muted">Full Name</span>
                    <span className="font-medium">
                      {teacher.firstName} {teacher.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-text-muted">Email</span>
                    <span className="font-medium">{teacher.email}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-text-muted">Phone</span>
                    <span className="font-medium">{teacher.phoneNumber || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-text-muted">Role</span>
                    <span className="font-medium">{teacher.role.replace("_", " ")}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-text-muted">Subjects</span>
                    <span className="font-medium">{teacher.subjects.join(", ")}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-text-muted">Joined</span>
                    <span className="font-medium">{formatDate(teacher.joinedAt)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-text-muted">Last Active</span>
                    <span className="font-medium">{formatDate(teacher.lastActive)}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "classes" && (
              <div className="space-y-4">
                {teacher.assignedClasses.length === 0 ? (
                  <div className="text-center py-8">
                    <Users size={40} className="mx-auto text-text-muted mb-2" />
                    <p className="text-text-muted">No classes assigned yet</p>
                  </div>
                ) : (
                  teacher.assignedClasses.map((cls, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl border"
                      style={{ borderColor: "rgba(30,80,50,0.08)" }}>
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-green-900">
                            {cls.className} {cls.classArm ? `(${cls.classArm})` : ""}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`px-2 py-0.5 text-xs rounded-full ${
                                cls.role === "CLASS_ADMIN"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}>
                              {cls.role.replace("_", " ")}
                            </span>
                            <span className="text-xs text-text-muted">
                              Assigned: {formatDate(cls.assignedAt)}
                            </span>
                          </div>
                          {cls.subjects.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {cls.subjects.map((subject, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
                                  {subject}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <span
                          className={`text-xs ${cls.isActive ? "text-green-600" : "text-red-600"}`}>
                          {cls.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "performance" && (
              <div className="space-y-6">
                {/* Performance Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-green-50 text-center">
                    <p className="text-sm text-text-muted">Average Score</p>
                    <p className="text-2xl font-bold text-green-900">
                      {teacher.averageStudentScore}%
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-50 text-center">
                    <p className="text-sm text-text-muted">Pass Rate</p>
                    <p className="text-2xl font-bold text-blue-900">{teacher.passRate}%</p>
                  </div>
                </div>

                {/* Per Class Performance */}
                {teacher.assignedClasses.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Performance by Class</h4>
                    <div className="space-y-3">
                      {teacher.assignedClasses.map((cls, index) => (
                        <div key={index} className="p-3 rounded-lg bg-cream">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">
                              {cls.className} {cls.classArm ? `(${cls.classArm})` : ""}
                            </span>
                            <span className="text-sm text-text-muted">
                              {Math.round(teacher.averageStudentScore + (Math.random() - 0.5) * 10)}
                              %
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                            <div
                              className="h-full bg-green-600 rounded-full"
                              style={{
                                width: `${Math.round(teacher.averageStudentScore + (Math.random() - 0.5) * 10)}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
