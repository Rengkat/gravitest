"use client";

import { BookOpen, FileText, CheckCircle } from "lucide-react";
import type { SubjectExamStats } from "../../../types";

interface SubjectStatsGridProps {
  subjectStats: SubjectExamStats[];
  activeSubject: string | null;
  onSelectSubject: (subject: string | null) => void;
}

export function SubjectStatsGrid({
  subjectStats,
  activeSubject,
  onSelectSubject,
}: SubjectStatsGridProps) {
  if (subjectStats.length === 0) {
    return (
      <div
        className="text-center py-8 bg-white rounded-2xl border"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <BookOpen size={32} className="mx-auto text-text-muted mb-2" />
        <p className="text-text-muted">No subjects configured for this class yet</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-serif text-lg text-green-900">Exam Stats by Subject</h2>
        {activeSubject && (
          <button
            type="button"
            onClick={() => onSelectSubject(null)}
            className="text-sm text-green-700 hover:text-green-800 underline-offset-2 hover:underline">
            Clear filter
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjectStats.map((subjectStat) => {
          const isActive = activeSubject === subjectStat.subject;
          return (
            <button
              key={subjectStat.subject}
              type="button"
              onClick={() => onSelectSubject(isActive ? null : subjectStat.subject)}
              className={`text-left p-4 rounded-xl border transition-all ${
                isActive
                  ? "border-green-600 bg-green-50 shadow-sm"
                  : "border-gray-100 bg-white hover:border-green-300"
              }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-green-900">{subjectStat.subject}</span>
                <BookOpen size={16} className="text-green-600" />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-bold text-green-900">{subjectStat.totalExams}</p>
                  <p className="text-[11px] text-text-muted">Exams</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-green-900">{subjectStat.totalQuestions}</p>
                  <p className="text-[11px] text-text-muted">Questions</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-green-900">
                    {subjectStat.averageScore !== null ? `${subjectStat.averageScore}%` : "—"}
                  </p>
                  <p className="text-[11px] text-text-muted">Avg. Score</p>
                </div>
              </div>
              {subjectStat.completedExams > 0 && (
                <p className="mt-2 flex items-center gap-1 text-xs text-green-700">
                  <CheckCircle size={12} />
                  {subjectStat.completedExams} completed
                </p>
              )}
              {subjectStat.totalExams === 0 && (
                <p className="mt-2 flex items-center gap-1 text-xs text-text-muted">
                  <FileText size={12} />
                  No exams yet
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
