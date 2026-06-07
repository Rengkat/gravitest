// src/app/school/students/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Download,
  Users,
  GraduationCap,
  UserCheck,
  UserX,
  School,
} from "lucide-react";
import { StudentTable } from "./components/StudentTable";
import type { StudentWithUser } from "./types";
import { MOCK_STUDENTS } from "./mock";

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentWithUser[]>(MOCK_STUDENTS);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [filterClass, setFilterClass] = useState<string>("all");

  // Get unique classes for filter
  const uniqueClasses = [
    ...new Set(students.map((s) => s.studentProfile.currentClass).filter(Boolean)),
  ];

  // Stats calculations
  const stats = {
    totalStudents: students.length,
    activeStudents: students.filter((s) => s.user.isActive).length,
    inactiveStudents: students.filter((s) => !s.user.isActive).length,
    totalClasses: uniqueClasses.length,
    studentsByClass: students.reduce(
      (acc, student) => {
        const className = student.studentProfile.currentClass || "Unassigned";
        acc[className] = (acc[className] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ),
    studentsByGender: {
      male: students.filter((s) => s.user.gender === "MALE").length,
      female: students.filter((s) => s.user.gender === "FEMALE").length,
      other: students.filter((s) => s.user.gender === "OTHER").length,
      unspecified: students.filter((s) => !s.user.gender).length,
    },
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      `${student.user.firstName} ${student.user.lastName} ${student.user.email} ${student.studentProfile.admissionNo || ""}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all"
        ? true
        : filterStatus === "active"
          ? student.user.isActive
          : !student.user.isActive;

    const matchesClass =
      filterClass === "all"
        ? true
        : (student.studentProfile.currentClass || "Unassigned") === filterClass;

    return matchesSearch && matchesStatus && matchesClass;
  });

  const handleStudentUpdate = (updatedStudent: StudentWithUser) => {
    setStudents((prev) =>
      prev.map((s) => (s.user.id === updatedStudent.user.id ? updatedStudent : s)),
    );
  };

  const handleStudentDelete = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.user.id !== studentId));
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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-serif text-3xl text-green-900 mb-2">Students</h1>
            <p className="text-text-muted">
              Manage all students, view performance, and take actions
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-800 text-white hover:bg-green-700 transition-all">
            <Plus size={16} /> Add Student
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Students Card */}
        <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted mb-1">Total Students</p>
              <p className="text-2xl font-bold text-green-900">{stats.totalStudents}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Users size={20} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* Active Students Card */}
        <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted mb-1">Active Students</p>
              <p className="text-2xl font-bold text-green-900">{stats.activeStudents}</p>
              <p className="text-xs text-text-muted">
                {((stats.activeStudents / stats.totalStudents) * 100).toFixed(1)}% of total
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <UserCheck size={20} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* Inactive Students Card */}
        <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted mb-1">Inactive Students</p>
              <p className="text-2xl font-bold text-orange-600">{stats.inactiveStudents}</p>
              <p className="text-xs text-text-muted">
                {((stats.inactiveStudents / stats.totalStudents) * 100).toFixed(1)}% of total
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <UserX size={20} className="text-orange-600" />
            </div>
          </div>
        </div>

        {/* Total Classes Card */}
        <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted mb-1">Active Classes</p>
              <p className="text-2xl font-bold text-green-900">{stats.totalClasses}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <School size={20} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Class Distribution Row */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Students by Class */}
        <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
          <h3 className="text-sm font-semibold text-green-900 mb-3">Students by Class</h3>
          <div className="space-y-2">
            {Object.entries(stats.studentsByClass).map(([className, count]) => (
              <div key={className} className="flex items-center justify-between">
                <span className="text-sm text-text-muted">{className}</span>
                <div className="flex items-center gap-3 flex-1 ml-4">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-green-600"
                      style={{ width: `${(count / stats.totalStudents) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-green-900 min-w-[40px]">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Students by Gender */}
        <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
          <h3 className="text-sm font-semibold text-green-900 mb-3">Students by Gender</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">Male</span>
              <div className="flex items-center gap-3 flex-1 ml-4">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{
                      width: `${(stats.studentsByGender.male / stats.totalStudents) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-blue-900 min-w-[40px]">
                  {stats.studentsByGender.male}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">Female</span>
              <div className="flex items-center gap-3 flex-1 ml-4">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-pink-600"
                    style={{
                      width: `${(stats.studentsByGender.female / stats.totalStudents) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-pink-900 min-w-[40px]">
                  {stats.studentsByGender.female}
                </span>
              </div>
            </div>
            {stats.studentsByGender.other > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Other</span>
                <div className="flex items-center gap-3 flex-1 ml-4">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-purple-600"
                      style={{
                        width: `${(stats.studentsByGender.other / stats.totalStudents) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-purple-900 min-w-[40px]">
                    {stats.studentsByGender.other}
                  </span>
                </div>
              </div>
            )}
            {stats.studentsByGender.unspecified > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Unspecified</span>
                <div className="flex items-center gap-3 flex-1 ml-4">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gray-600"
                      style={{
                        width: `${(stats.studentsByGender.unspecified / stats.totalStudents) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 min-w-[40px]">
                    {stats.studentsByGender.unspecified}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name, email, or admission number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500"
            />
          </div>
        </div>

        <select
          title="status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <select
          title="class"
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500">
          <option value="all">All Classes</option>
          {uniqueClasses.map((className) => (
            <option key={className} value={className}>
              {className}
            </option>
          ))}
        </select>

        <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-cream transition-all">
          <Filter size={16} /> More Filters
        </button>

        <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-cream transition-all">
          <Download size={16} /> Export
        </button>
      </div>

      {/* Student Table */}
      <StudentTable
        students={filteredStudents}
        onStudentUpdate={handleStudentUpdate}
        onStudentDelete={handleStudentDelete}
      />
    </div>
  );
}
