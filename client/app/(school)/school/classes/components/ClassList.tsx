"use client";

import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { ClassActionsMenu } from "./ClassActionsMenu";
import type { SchoolClass } from "../types";

interface ClassListProps {
  classes: SchoolClass[];
  onClassUpdate: (updatedClass: SchoolClass) => void;
  onClassDelete: (classId: string) => void;
}

export function ClassList({ classes, onClassUpdate, onClassDelete }: ClassListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClasses = classes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(classes.length / itemsPerPage);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (classes.length === 0) {
    return (
      <div
        className="text-center py-12 bg-white rounded-2xl border"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <GraduationCap size={48} className="mx-auto text-text-muted mb-3" />
        <p className="text-text-muted">No classes found</p>
      </div>
    );
  }

  return (
    <div>
      <div
        className="bg-white rounded-2xl border overflow-hidden"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-900">
                  Class Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-900">
                  Class Code
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-900">
                  Students
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-900">Exams</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-900">
                  Created
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentClasses.map((classItem) => (
                <tr key={classItem.id} className="hover:bg-cream/30 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/school/classes/${classItem.id}`}>
                      <div className="font-medium text-green-900 hover:text-green-700 transition-colors">
                        {classItem.name}
                        {classItem.arm && (
                          <span className="text-sm text-text-muted ml-1">({classItem.arm})</span>
                        )}
                      </div>
                      {classItem.year && (
                        <p className="text-xs text-text-muted">Year {classItem.year}</p>
                      )}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {classItem.classCode}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-text-muted" />
                      <span className="font-medium">{classItem.totalStudents}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <BookOpen size={14} className="text-text-muted" />
                      <span className="font-medium">{classItem.totalExamsCreated}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {classItem.isActive ? (
                      <span className="flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle size={12} /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-red-600">
                        <XCircle size={12} /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      {formatDate(classItem.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <ClassActionsMenu
                      classItem={classItem}
                      onClassUpdate={onClassUpdate}
                      onClassDelete={onClassDelete}
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
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, classes.length)} of{" "}
              {classes.length} classes
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-cream disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <ChevronLeft size={16} />
              </button>
              <span className="px-4 py-2 text-sm text-text-muted">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-cream disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
