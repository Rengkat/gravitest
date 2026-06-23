"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  Mail,
  Phone,
  BookOpen,
  Users,
  MoreVertical,
  Edit,
  Trash2,
  UserPlus,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Award,
  BarChart3,
} from "lucide-react";
import { MOCK_TEACHERS } from "./mock-data";
import type { Teacher, TeacherFilters } from "./types";
import { InviteTeacherModal } from "./components/InviteTeacherModal";
import { AssignClassModal } from "./components/AssignClassModal";
import { TeacherDetailsModal } from "./components/TeacherDetailsModal";

export default function TeacherManagementPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<TeacherFilters>({});
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTeachers(MOCK_TEACHERS);
      setFilteredTeachers(MOCK_TEACHERS);
      setLoading(false);
    }, 500);
  }, []);

  // Filter teachers
  useEffect(() => {
    let filtered = teachers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (teacher) =>
          teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher.subjects.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())),
      );
    }

    // Role filter
    if (filters.role) {
      filtered = filtered.filter((teacher) => teacher.role === filters.role);
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter((teacher) =>
        filters.status === "active" ? teacher.isActive : !teacher.isActive,
      );
    }

    setFilteredTeachers(filtered);
    setCurrentPage(1);
  }, [searchTerm, filters, teachers]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTeachers = filteredTeachers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const getRoleBadge = (role: string) => {
    const configs: Record<string, { color: string; bg: string }> = {
      CLASS_ADMIN: { color: "text-blue-700", bg: "bg-blue-100" },
      HEAD_OF_DEPARTMENT: { color: "text-purple-700", bg: "bg-purple-100" },
      TEACHER: { color: "text-green-700", bg: "bg-green-100" },
    };
    const config = configs[role] || configs.TEACHER;
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${config.bg} ${config.color}`}>
        {role.replace("_", " ")}
      </span>
    );
  };

  const handleInviteTeacher = (formData: any) => {
    // Simulate API call
    const newTeacher: Teacher = {
      id: `teacher-${Date.now()}`,
      userId: `user-${Date.now()}`,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber || null,
      avatarUrl: null,
      role: formData.role,
      subjects: formData.subjects || [],
      assignedClasses: formData.classIds.map((classId: string) => ({
        classId,
        className: "New Class", // Would fetch from DB
        classArm: null,
        role: formData.role === "CLASS_ADMIN" ? "CLASS_ADMIN" : "SUBJECT_TEACHER",
        subjects: formData.subjects || [],
        assignedAt: new Date(),
        isActive: true,
      })),
      totalExams: 0,
      averageStudentScore: 0,
      passRate: 0,
      isActive: true,
      lastActive: null,
      joinedAt: new Date(),
    };
    setTeachers((prev) => [newTeacher, ...prev]);
    setShowInviteModal(false);
  };

  const handleAssignClass = (teacherId: string, classData: any) => {
    // Update teacher's assigned classes
    setTeachers((prev) =>
      prev.map((teacher) => {
        if (teacher.id === teacherId) {
          return {
            ...teacher,
            assignedClasses: [
              ...teacher.assignedClasses,
              {
                classId: classData.classId,
                className: classData.className,
                classArm: classData.classArm,
                role: classData.role,
                subjects: classData.subjects,
                assignedAt: new Date(),
                isActive: true,
              },
            ],
          };
        }
        return teacher;
      }),
    );
    setShowAssignModal(false);
  };

  const handleRemoveTeacher = (teacherId: string) => {
    if (confirm("Are you sure you want to remove this teacher?")) {
      setTeachers((prev) => prev.filter((t) => t.id !== teacherId));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-serif text-3xl text-green-900 mb-1">Teacher Management</h1>
            <p className="text-text-muted">
              Manage all teachers, assign classes, and track performance
            </p>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-800 text-white hover:bg-green-700 transition-all">
            <UserPlus size={16} />
            Invite Teacher
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
          <p className="text-sm text-text-muted mb-1">Total Teachers</p>
          <p className="text-2xl font-bold text-green-900">{teachers.length}</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
          <p className="text-sm text-text-muted mb-1">Class Admins</p>
          <p className="text-2xl font-bold text-green-900">
            {teachers.filter((t) => t.role === "CLASS_ADMIN").length}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
          <p className="text-sm text-text-muted mb-1">Active Teachers</p>
          <p className="text-2xl font-bold text-green-900">
            {teachers.filter((t) => t.isActive).length}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
          <p className="text-sm text-text-muted mb-1">Avg. Teacher Score</p>
          <p className="text-2xl font-bold text-green-900">
            {(
              teachers.reduce((sum, t) => sum + t.averageStudentScore, 0) / teachers.length || 0
            ).toFixed(1)}
            %
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"
              size={18}
            />
            <input
              type="text"
              placeholder="Search teachers by name, email, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500"
            />
          </div>
        </div>

        <select
          title="role"
          value={filters.role || "all"}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              role: e.target.value === "all" ? undefined : e.target.value,
            }))
          }
          className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500">
          <option value="all">All Roles</option>
          <option value="CLASS_ADMIN">Class Admin</option>
          <option value="HEAD_OF_DEPARTMENT">Head of Department</option>
          <option value="TEACHER">Teacher</option>
        </select>

        <select
          title="status"
          value={filters.status || "all"}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              status: e.target.value === "all" ? undefined : (e.target.value as any),
            }))
          }
          className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-cream transition-all">
          <Filter size={16} /> More Filters
        </button>
      </div>

      {/* Teachers Table */}
      <div
        className="bg-white rounded-2xl border overflow-hidden"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-900">
                  Teacher
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-900">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-900">
                  Subjects
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-900">
                  Classes
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-900">
                  Performance
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentTeachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-cream/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-700 font-semibold">
                          {getInitials(teacher.firstName, teacher.lastName)}
                        </span>
                      </div>
                      <div>
                        <button
                          onClick={() => {
                            setSelectedTeacher(teacher);
                            setShowDetailsModal(true);
                          }}
                          className="font-medium text-green-900 hover:text-green-700 transition-colors text-left">
                          {teacher.firstName} {teacher.lastName}
                        </button>
                        <div className="flex items-center gap-2 text-xs text-text-muted">
                          <Mail size={12} />
                          <span>{teacher.email}</span>
                          {teacher.phoneNumber && (
                            <>
                              <span>•</span>
                              <Phone size={12} />
                              <span>{teacher.phoneNumber}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getRoleBadge(teacher.role)}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects.slice(0, 2).map((subject, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
                          {subject}
                        </span>
                      ))}
                      {teacher.subjects.length > 2 && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
                          +{teacher.subjects.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-text-muted" />
                      <span className="font-medium">{teacher.assignedClasses.length}</span>
                    </div>
                    <div className="text-xs text-text-muted">
                      {teacher.assignedClasses.map((c) => c.className).join(", ")}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-green-900">
                        {teacher.averageStudentScore}%
                      </span>
                      <span className="text-xs text-text-muted">{teacher.passRate}% pass rate</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {teacher.isActive ? (
                      <span className="flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle size={12} /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-red-600">
                        <XCircle size={12} /> Inactive
                      </span>
                    )}
                    {teacher.lastActive && (
                      <span className="text-xs text-text-muted block">
                        Last active: {new Date(teacher.lastActive).toLocaleDateString()}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setSelectedTeacher(teacher);
                          setShowDetailsModal(true);
                        }}
                        className="p-1.5 rounded-lg hover:bg-cream transition-colors"
                        title="View Details">
                        <GraduationCap size={16} className="text-text-muted" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTeacher(teacher);
                          setShowAssignModal(true);
                        }}
                        className="p-1.5 rounded-lg hover:bg-cream transition-colors"
                        title="Assign Classes">
                        <Users size={16} className="text-text-muted" />
                      </button>
                      <button
                        onClick={() => handleRemoveTeacher(teacher.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Remove Teacher">
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <p className="text-sm text-text-muted">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredTeachers.length)}{" "}
              of {filteredTeachers.length} teachers
            </p>
            <div className="flex gap-2">
              <button
                title="page"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-cream disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <ChevronLeft size={16} />
              </button>
              <span className="px-4 py-2 text-sm text-text-muted">
                Page {currentPage} of {totalPages}
              </span>
              <button
                title="page"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-cream disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <InviteTeacherModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onInvite={handleInviteTeacher}
      />

      <AssignClassModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        teacher={selectedTeacher}
        onAssign={handleAssignClass}
      />

      <TeacherDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        teacher={selectedTeacher}
      />
    </div>
  );
}
