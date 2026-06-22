"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import type { Exam } from "../types";

interface ExamListProps {
  exams: Exam[];
  onExamUpdate: (updatedExam: Exam) => void;
  onExamDelete: (examId: string) => void;
}

export function ExamList({ exams, onExamUpdate, onExamDelete }: ExamListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentExams = exams.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(exams.length / itemsPerPage);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { color: string; icon: any }> = {
      DRAFT: { color: "bg-gray-100 text-gray-700", icon: FileText },
      PUBLISHED: { color: "bg-blue-100 text-blue-700", icon: Eye },
      ONGOING: { color: "bg-yellow-100 text-yellow-700", icon: Clock },
      COMPLETED: { color: "bg-green-100 text-green-700", icon: CheckCircle },
    };
    const config = configs[status] || configs.DRAFT;
    const Icon = config.icon;
    return (
      <span className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full ${config.color}`}>
        <Icon size={12} />
        {status.charAt(0) + status.slice(1).toLowerCase()}
      </span>
    );
  };

  if (exams.length === 0) {
    return (
      <div
        className="text-center py-12 bg-white rounded-2xl border"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <FileText size={48} className="mx-auto text-text-muted mb-3" />
        <p className="text-text-muted">No exams found</p>
        <p className="text-sm text-text-muted mt-1">Create your first exam to get started</p>
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
                  Exam Title
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-900">Class</th>
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
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {exam.className}
                      {exam.classArm && <span className="text-text-muted"> ({exam.classArm})</span>}
                    </div>
                  </td>
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
                      <span className="text-xs">
                        {new Date(exam.startDate).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(exam.status)}</td>
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
                            onClick={() => {
                              /* Open edit modal */
                            }}
                            className="p-1.5 rounded-lg hover:bg-cream transition-colors"
                            title="Edit Exam">
                            <Edit size={16} className="text-text-muted" />
                          </button>
                          <button
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
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <p className="text-sm text-text-muted">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, exams.length)} of{" "}
              {exams.length} exams
            </p>
            <div className="flex gap-2">
              <button
                title="page number"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-cream disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <ChevronLeft size={16} />
              </button>
              <span className="px-4 py-2 text-sm text-text-muted">
                Page {currentPage} of {totalPages}
              </span>
              <button
                title="page numer"
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
