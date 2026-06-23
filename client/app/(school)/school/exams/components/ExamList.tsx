"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Edit, Trash2, Eye } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { EmptyState } from "./EmptyState";
import type { Exam } from "../types";

interface ExamListProps {
  exams: Exam[];
  onExamDelete: (examId: string) => void;
  onExamEdit?: (exam: Exam) => void;
  /** Hide the Class column when the list is already scoped to one class. */
  showClassColumn?: boolean;
  emptyStateDescription?: string;
}

const ITEMS_PER_PAGE = 10;

export function ExamList({
  exams,
  onExamDelete,
  onExamEdit,
  showClassColumn = true,
  emptyStateDescription = "Create your first exam to get started",
}: ExamListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(exams.length / ITEMS_PER_PAGE));
  const indexOfFirstItem = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentExams = exams.slice(indexOfFirstItem, indexOfFirstItem + ITEMS_PER_PAGE);

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" });

  const formatTime = (date: Date) =>
    new Date(date).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" });

  if (exams.length === 0) {
    return <EmptyState title="No exams found" description={emptyStateDescription} />;
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
                  Exam Title
                </th>
                {showClassColumn && (
                  <th className="px-6 py-4 text-left text-sm font-semibold text-green-900">
                    Class
                  </th>
                )}
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-900">
                  Subject
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-900">
                  Questions
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-900">Marks</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-900">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentExams.map((exam) => (
                <tr key={exam.id} className="hover:bg-cream/30 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/school/exams/${exam.id}`}>
                      <div className="font-medium text-green-900 hover:text-green-700 transition-colors">
                        {exam.title}
                      </div>
                      {exam.description && (
                        <p className="text-xs text-text-muted truncate max-w-xs">
                          {exam.description}
                        </p>
                      )}
                    </Link>
                  </td>
                  {showClassColumn && (
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {exam.className}
                        {exam.classArm && (
                          <span className="text-text-muted"> ({exam.classArm})</span>
                        )}
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 text-sm">{exam.subject}</td>
                  <td className="px-6 py-4">
                    <span className="font-medium">{exam.totalQuestions}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium">{exam.totalMarks}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">
                    <div className="flex flex-col">
                      <span>{formatDate(exam.startDate)}</span>
                      <span className="text-xs">{formatTime(exam.startDate)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={exam.status} withIcon />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      <Link
                        href={`/school/exams/${exam.id}`}
                        className="p-1.5 rounded-lg hover:bg-cream transition-colors"
                        title="View Details">
                        <Eye size={16} className="text-text-muted" />
                      </Link>
                      {exam.status === "DRAFT" && (
                        <>
                          <button
                            type="button"
                            onClick={() => onExamEdit?.(exam)}
                            className="p-1.5 rounded-lg hover:bg-cream transition-colors"
                            title="Edit Exam">
                            <Edit size={16} className="text-text-muted" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onExamDelete(exam.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete Exam">
                            <Trash2 size={16} className="text-red-500" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-text-muted">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfFirstItem + ITEMS_PER_PAGE, exams.length)} of {exams.length} exams
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous page"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-cream disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <ChevronLeft size={16} />
              </button>
              <span className="px-4 py-2 text-sm text-text-muted">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                aria-label="Next page"
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
