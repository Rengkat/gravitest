"use client";

import Link from "next/link";
import { GraduationCap, FileText, Users, MoreVertical } from "lucide-react";
import type { Exam, ClassExamStats } from "../types";

interface ExamClassGridProps {
  classStats: ClassExamStats[];
  exams: Exam[];
  onExamUpdate: (updatedExam: Exam) => void;
  onExamDelete: (examId: string) => void;
}

export function ExamClassGrid({
  classStats,
  exams,
  onExamUpdate,
  onExamDelete,
}: ExamClassGridProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DRAFT":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">Draft</span>
        );
      case "PUBLISHED":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
            Published
          </span>
        );
      case "ONGOING":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
            Ongoing
          </span>
        );
      case "COMPLETED":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {classStats.map((classStat) => {
        const classExams = exams.filter((e) => e.classId === classStat.classId);

        return (
          <div
            key={classStat.classId}
            className="group p-6 rounded-2xl bg-white border transition-all hover:-translate-y-1 hover:shadow-lg"
            style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            {/* Class Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <GraduationCap size={22} className="text-green-600" />
                </div>
                <div>
                  <Link href={`/school/exams/class/${classStat.classId}`}>
                    <h3 className="text-[18px] font-bold text-green-900 hover:text-green-700 transition-colors">
                      {classStat.className}
                      {classStat.classArm && (
                        <span className="text-sm font-normal text-text-muted ml-1">
                          ({classStat.classArm})
                        </span>
                      )}
                    </h3>
                  </Link>
                  <p className="text-xs text-text-muted">
                    <Users size={12} className="inline mr-1" />
                    {classStat.totalStudents} students
                  </p>
                </div>
              </div>
              <Link
                href={`/school/exams/class/${classStat.classId}`}
                className="p-1.5 rounded-lg hover:bg-cream transition-colors">
                <MoreVertical size={16} className="text-text-muted" />
              </Link>
            </div>

            {/* Class Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="p-2 rounded-lg bg-cream text-center">
                <p className="text-xs text-text-muted">Total</p>
                <p className="text-lg font-bold text-green-900">{classStat.totalExams}</p>
              </div>
              <div className="p-2 rounded-lg bg-cream text-center">
                <p className="text-xs text-text-muted">Published</p>
                <p className="text-lg font-bold text-green-900">{classStat.publishedExams}</p>
              </div>
              <div className="p-2 rounded-lg bg-cream text-center">
                <p className="text-xs text-text-muted">Completed</p>
                <p className="text-lg font-bold text-green-900">{classStat.completedExams}</p>
              </div>
            </div>

            {/* Recent Exams */}
            {classExams.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {classExams.slice(0, 3).map((exam) => (
                  <Link
                    key={exam.id}
                    href={`/school/exams/${exam.id}`}
                    className="block p-2 rounded-lg hover:bg-cream transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">{exam.title}</p>
                        <p className="text-xs text-text-muted">
                          {exam.subject} • {new Date(exam.startDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="ml-2">{getStatusBadge(exam.status)}</div>
                    </div>
                  </Link>
                ))}
                {classExams.length > 3 && (
                  <p className="text-xs text-text-muted text-center">
                    +{classExams.length - 3} more exams
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <FileText size={32} className="mx-auto text-text-muted mb-2" />
                <p className="text-sm text-text-muted">No exams yet</p>
                <p className="text-xs text-text-muted">Create an exam for this class</p>
              </div>
            )}

            {/* Action Button */}
            <Link
              href={`/school/exams/class/${classStat.classId}`}
              className="block w-full text-center py-2 mt-4 rounded-lg text-[13px] font-semibold bg-green-800 text-white hover:bg-green-700 transition-all">
              View All Exams
            </Link>
          </div>
        );
      })}
    </div>
  );
}
