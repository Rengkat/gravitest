"use client";

import Link from "next/link";
import { GraduationCap, FileText, Users, ChevronRight } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { EmptyState } from "./EmptyState";
import type { Exam, ClassExamStats } from "../types";

interface ExamClassGridProps {
  classStats: ClassExamStats[];
  exams: Exam[];
}

export function ExamClassGrid({ classStats, exams }: ExamClassGridProps) {
  if (classStats.length === 0) {
    return (
      <EmptyState title="No classes found" description="Classes will appear here once set up." />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {classStats.map((classStat) => {
        const classExams = exams
          .filter((e) => e.classId === classStat.classId)
          .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

        return (
          <Link
            key={classStat.classId}
            href={`/school/exams/class/${classStat.classId}`}
            className="group p-6 rounded-2xl bg-white border transition-all hover:-translate-y-1 hover:shadow-lg"
            style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            {/* Class Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                  <GraduationCap size={22} className="text-green-600" />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-green-900 group-hover:text-green-700 transition-colors">
                    {classStat.className}
                    {classStat.classArm && (
                      <span className="text-sm font-normal text-text-muted ml-1">
                        ({classStat.classArm})
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-text-muted flex items-center gap-1">
                    <Users size={12} />
                    {classStat.totalStudents} students
                  </p>
                </div>
              </div>
              <ChevronRight
                size={18}
                className="text-text-muted group-hover:text-green-700 transition-colors mt-1"
              />
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
                  <div key={exam.id} className="flex items-center justify-between p-2 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">{exam.title}</p>
                      <p className="text-xs text-text-muted">
                        {exam.subject} • {new Date(exam.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="ml-2">
                      <StatusBadge status={exam.status} />
                    </div>
                  </div>
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

            {/* Action */}
            <div className="block w-full text-center py-2 mt-4 rounded-lg text-[13px] font-semibold bg-green-800 text-white group-hover:bg-green-700 transition-all">
              View All Exams
            </div>
          </Link>
        );
      })}
    </div>
  );
}
