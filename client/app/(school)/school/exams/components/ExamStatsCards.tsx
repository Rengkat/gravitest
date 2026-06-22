// src/app/school/exams/components/ExamStatsCards.tsx
"use client";

import { FileText, Clock, CheckCircle, PlayCircle, BookOpen, TrendingUp } from "lucide-react";

interface ExamStatsCardsProps {
  stats: {
    totalExams: number;
    draftExams: number;
    publishedExams: number;
    ongoingExams: number;
    completedExams: number;
    totalQuestions: number;
    averageMarks: number;
  };
}

export function ExamStatsCards({ stats }: ExamStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Exams Card */}
      <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-muted mb-1">Total Exams</p>
            <p className="text-2xl font-bold text-green-900">{stats.totalExams}</p>
            <p className="text-xs text-text-muted">
              {stats.draftExams} draft, {stats.publishedExams} published
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
            <FileText size={20} className="text-green-600" />
          </div>
        </div>
      </div>

      {/* Active Exams Card */}
      <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-muted mb-1">Active Exams</p>
            <p className="text-2xl font-bold text-green-900">
              {stats.ongoingExams + stats.publishedExams}
            </p>
            <p className="text-xs text-text-muted">
              {stats.ongoingExams} ongoing, {stats.publishedExams} published
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <PlayCircle size={20} className="text-blue-600" />
          </div>
        </div>
      </div>

      {/* Completed Exams Card */}
      <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-muted mb-1">Completed Exams</p>
            <p className="text-2xl font-bold text-green-900">{stats.completedExams}</p>
            <p className="text-xs text-text-muted">Avg. {stats.averageMarks}% score</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <CheckCircle size={20} className="text-purple-600" />
          </div>
        </div>
      </div>

      {/* Total Questions Card */}
      <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-muted mb-1">Total Questions</p>
            <p className="text-2xl font-bold text-green-900">{stats.totalQuestions}</p>
            <p className="text-xs text-text-muted">Across all exams</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <BookOpen size={20} className="text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
