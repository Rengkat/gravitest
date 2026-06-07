// src/app/school/students/components/StudentTable.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { StudentActionsMenu } from "./StudentActionsMenu";
import type { StudentWithUser } from "../types";

interface StudentTableProps {
  students: StudentWithUser[];
  onStudentUpdate: (student: StudentWithUser) => void;
  onStudentDelete: (studentId: string) => void;
}

export function StudentTable({ students, onStudentUpdate, onStudentDelete }: StudentTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = students.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(students.length / itemsPerPage);

  const formatDate = (date: Date | null) => {
    if (!date) return "Never";
    return new Date(date).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const getStatusBadge = (isActive: boolean, isEmailVerified: boolean) => {
    if (!isActive) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">Deactivated</span>
      );
    }
    if (!isEmailVerified) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
          Unverified
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Active</span>
    );
  };

  return (
    <div
      className="bg-white rounded-2xl border overflow-hidden"
      style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-cream">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-green-900">Student</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-green-900">
                Admission No.
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-green-900">Class</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-green-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-green-900">
                Admission Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-green-900">
                Last Active
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-green-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentStudents.map((student) => (
              <tr key={student.user.id} className="hover:bg-cream/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                      {student.user.avatarUrl ? (
                        <img
                          src={student.user.avatarUrl}
                          alt={`${student.user.firstName} ${student.user.lastName}`}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-green-700 font-semibold">
                          {getInitials(student.user.firstName, student.user.lastName)}
                        </span>
                      )}
                    </div>
                    <div>
                      <Link
                        href={`/school/students/${student.user.id}`}
                        className="font-medium text-green-900 hover:text-green-700 transition-colors">
                        {student.user.firstName} {student.user.middleName} {student.user.lastName}
                      </Link>
                      <p className="text-xs text-text-muted">{student.user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-text-muted">
                  {student.studentProfile.admissionNo || "—"}
                </td>
                <td className="px-6 py-4 text-sm text-text-muted">
                  {student.studentProfile.currentClass || "Not assigned"}
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(student.user.isActive, student.user.isEmailVerified)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-text-muted" />
                    <span className="text-sm text-text-muted">
                      {formatDate(student.user.createdAt)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-text-muted">
                  {formatDate(student.user.lastLoginAt)}
                </td>
                <td className="px-6 py-4">
                  <StudentActionsMenu
                    student={student}
                    onStudentUpdate={onStudentUpdate}
                    onStudentDelete={onStudentDelete}
                  />
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
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, students.length)} of{" "}
            {students.length} students
          </p>
          <div className="flex gap-2">
            <button
              title="Previous Page"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 hover:bg-cream disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              <ChevronLeft size={16} />
            </button>
            <span className="px-4 py-2 text-sm text-text-muted">
              Page {currentPage} of {totalPages}
            </span>
            <button
              title="Next Page"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 hover:bg-cream disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
