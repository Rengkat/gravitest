"use client";

import { useState } from "react";
import { Edit, Trash2, Calendar, Clock, Users, BookOpen, MoreVertical } from "lucide-react";
import type { Exam, ExamStatus } from "../../types";

interface ExamDetailHeaderProps {
  exam: Exam;
  onExamUpdate: (updatedExam: Exam) => void;
}

export function ExamDetailHeader({ exam, onExamUpdate }: ExamDetailHeaderProps) {
  const [showActions, setShowActions] = useState(false);

  const getStatusBadge = (status: ExamStatus) => {
    const configs: Record<ExamStatus, { color: string; bg: string }> = {
      DRAFT: { color: "text-gray-700", bg: "bg-gray-100" },
      PUBLISHED: { color: "text-blue-700", bg: "bg-blue-100" },
      ONGOING: { color: "text-yellow-700", bg: "bg-yellow-100" },
      COMPLETED: { color: "text-green-700", bg: "bg-green-100" },
      ARCHIVED: { color: "text-gray-500", bg: "bg-gray-100" },
    };
    const config = configs[status] || configs.DRAFT;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.color}`}>
        {status.charAt(0) + status.slice(1).toLowerCase()}
      </span>
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-NG", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-serif text-2xl text-green-900">{exam.title}</h1>
            {getStatusBadge(exam.status)}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
            <span className="flex items-center gap-1">
              <BookOpen size={14} />
              {exam.subject}
            </span>
            <span className="flex items-center gap-1">
              <Users size={14} />
              {exam.className} {exam.classArm ? `(${exam.classArm})` : ""}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {formatDate(exam.startDate)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {exam.durationMinutes} minutes
            </span>
            <span>
              Term: {exam.term.replace("_", " ")} {exam.termYear}
            </span>
          </div>

          {exam.description && <p className="mt-2 text-sm text-gray-600">{exam.description}</p>}

          {exam.instruction && (
            <div className="mt-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
              <p className="text-sm font-medium text-yellow-800">Instructions:</p>
              <p className="text-sm text-yellow-700">{exam.instruction}</p>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            title="show actions"
            onClick={() => setShowActions(!showActions)}
            className="p-2 rounded-lg hover:bg-cream transition-colors">
            <MoreVertical size={20} className="text-text-muted" />
          </button>

          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-cream transition-colors">
                <Edit size={14} /> Edit Exam
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors">
                <Trash2 size={14} /> Delete Exam
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-text-muted">Questions</p>
          <p className="font-semibold">{exam.totalQuestions}</p>
        </div>
        <div>
          <p className="text-xs text-text-muted">Total Marks</p>
          <p className="font-semibold">{exam.totalMarks}</p>
        </div>
        <div>
          <p className="text-xs text-text-muted">Passing Score</p>
          <p className="font-semibold">{exam.passingScore || "N/A"}%</p>
        </div>
        <div>
          <p className="text-xs text-text-muted">Submissions</p>
          <p className="font-semibold">
            {exam.submittedCount || 0} / {exam.totalStudents}
          </p>
        </div>
      </div>
    </div>
  );
}
