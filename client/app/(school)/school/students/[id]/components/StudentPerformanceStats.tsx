// src/app/school/students/components/StudentPerformanceStats.tsx
"use client";

import { TrendingUp, CheckCircle, Clock, Award, Target, BarChart3 } from "lucide-react";
import type { StudentWithUser } from "../../types";

interface StudentPerformanceStatsProps {
  student: StudentWithUser;
}

export function StudentPerformanceStats({ student }: StudentPerformanceStatsProps) {
  const { studentProfile } = student;

  const accuracyRate =
    studentProfile.totalQuestionsAttempted > 0
      ? (studentProfile.totalQuestionsCorrect / studentProfile.totalQuestionsAttempted) * 100
      : 0;

  const averageTimePerQuestion =
    studentProfile.totalMinutesStudied > 0 && studentProfile.totalQuestionsAttempted > 0
      ? (studentProfile.totalMinutesStudied / studentProfile.totalQuestionsAttempted).toFixed(1)
      : 0;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div
        className="p-6 rounded-2xl bg-white border"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <h2 className="text-lg font-semibold text-green-900 mb-4">Performance Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 rounded-lg bg-cream">
            <div className="flex items-center gap-2 mb-1">
              <Target size={16} className="text-green-600" />
              <span className="text-xs text-text-muted">Avg. Score</span>
            </div>
            <p className="text-2xl font-bold text-green-900">
              {studentProfile.averageScore.toFixed(1)}%
            </p>
          </div>

          <div className="p-3 rounded-lg bg-cream">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle size={16} className="text-green-600" />
              <span className="text-xs text-text-muted">Accuracy</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{accuracyRate.toFixed(1)}%</p>
          </div>

          <div className="p-3 rounded-lg bg-cream">
            <div className="flex items-center gap-2 mb-1">
              <Clock size={16} className="text-green-600" />
              <span className="text-xs text-text-muted">Study Time</span>
            </div>
            <p className="text-2xl font-bold text-green-900">
              {studentProfile.totalMinutesStudied} min
            </p>
          </div>

          <div className="p-3 rounded-lg bg-cream">
            <div className="flex items-center gap-2 mb-1">
              <Award size={16} className="text-green-600" />
              <span className="text-xs text-text-muted">Exams Taken</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{studentProfile.totalExamsTaken}</p>
          </div>
        </div>
      </div>

      {/* Score Range */}
      <div
        className="p-6 rounded-2xl bg-white border"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <h2 className="text-lg font-semibold text-green-900 mb-4">Score Range</h2>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-text-muted">Best Score</span>
              <span className="font-semibold text-green-900">{studentProfile.bestScore || 0}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-green-600"
                style={{ width: `${studentProfile.bestScore || 0}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-text-muted">Average Score</span>
              <span className="font-semibold text-green-900">
                {studentProfile.averageScore.toFixed(1)}%
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-600"
                style={{ width: `${studentProfile.averageScore}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-text-muted">Worst Score</span>
              <span className="font-semibold text-green-900">
                {studentProfile.worstScore || 0}%
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-orange-600"
                style={{ width: `${studentProfile.worstScore || 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Subject Performance */}
      {studentProfile.subjectPerformance &&
        Object.keys(studentProfile.subjectPerformance).length > 0 && (
          <div
            className="p-6 rounded-2xl bg-white border"
            style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <h2 className="text-lg font-semibold text-green-900 mb-4">Subject Performance</h2>
            <div className="space-y-4">
              {Object.entries(studentProfile.subjectPerformance).map(
                ([subject, data]: [string, any]) => (
                  <div key={subject}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{subject}</span>
                      <span className="text-text-muted">{data.averageScore}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-green-600"
                        style={{ width: `${data.averageScore}%` }}
                      />
                    </div>
                    <div className="flex gap-4 mt-1 text-xs text-text-muted">
                      <span>{data.questionsAttempted} questions</span>
                      <span>{data.totalMinutes} min</span>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        )}

      {/* Exam Performance */}
      {studentProfile.examPerformance && Object.keys(studentProfile.examPerformance).length > 0 && (
        <div
          className="p-6 rounded-2xl bg-white border"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <h2 className="text-lg font-semibold text-green-900 mb-4">Exam Performance</h2>
          <div className="space-y-4">
            {Object.entries(studentProfile.examPerformance).map(
              ([examType, data]: [string, any]) => (
                <div key={examType} className="p-4 rounded-lg bg-cream">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-green-900">{examType}</h3>
                    <span className="text-sm font-medium text-green-900">
                      {data.averageScore}% avg
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-text-muted">Exams Taken:</span>
                      <span className="ml-2 font-medium">{data.examsTaken}</span>
                    </div>
                    <div>
                      <span className="text-text-muted">Best Score:</span>
                      <span className="ml-2 font-medium text-green-700">{data.bestScore}%</span>
                    </div>
                    <div>
                      <span className="text-text-muted">Worst Score:</span>
                      <span className="ml-2 font-medium text-orange-700">{data.worstScore}%</span>
                    </div>
                    <div>
                      <span className="text-text-muted">Last Attempt:</span>
                      <span className="ml-2 font-medium">
                        {new Date(data.lastAttemptAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      )}

      {/* Question Stats */}
      <div
        className="p-6 rounded-2xl bg-white border"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <h2 className="text-lg font-semibold text-green-900 mb-4">Question Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-cream">
            <p className="text-sm text-text-muted mb-1">Total Questions</p>
            <p className="text-2xl font-bold text-green-900">
              {studentProfile.totalQuestionsAttempted}
            </p>
          </div>
          <div className="text-center p-3 rounded-lg bg-cream">
            <p className="text-sm text-text-muted mb-1">Correct Answers</p>
            <p className="text-2xl font-bold text-green-900">
              {studentProfile.totalQuestionsCorrect}
            </p>
          </div>
          <div className="text-center p-3 rounded-lg bg-cream">
            <p className="text-sm text-text-muted mb-1">Incorrect Answers</p>
            <p className="text-2xl font-bold text-orange-600">
              {studentProfile.totalQuestionsAttempted - studentProfile.totalQuestionsCorrect}
            </p>
          </div>
          <div className="text-center p-3 rounded-lg bg-cream">
            <p className="text-sm text-text-muted mb-1">Avg Time/Question</p>
            <p className="text-2xl font-bold text-green-900">{averageTimePerQuestion} min</p>
          </div>
        </div>
      </div>
    </div>
  );
}
