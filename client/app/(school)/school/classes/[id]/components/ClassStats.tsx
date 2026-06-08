"use client";

import { Users, BookOpen, Clock, Target, TrendingUp, Calendar, Shield, Key } from "lucide-react";
import type { ClassWithDetails } from "../../types";

interface ClassStatsProps {
  classData: ClassWithDetails;
}

export function ClassStats({ classData }: ClassStatsProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate average student performance (mock)
  const averageStudentScore = classData.students?.length
    ? (
        classData.students.reduce((sum, s) => sum + (s.averageScore || 0), 0) /
        classData.students.length
      ).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className="p-4 rounded-xl bg-white border"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted mb-1">Total Students</p>
              <p className="text-2xl font-bold text-green-900">{classData.totalStudents}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Users size={20} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div
          className="p-4 rounded-xl bg-white border"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted mb-1">Total Exams</p>
              <p className="text-2xl font-bold text-green-900">{classData.totalExamsCreated}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <BookOpen size={20} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div
          className="p-4 rounded-xl bg-white border"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted mb-1">Avg. Student Score</p>
              <p className="text-2xl font-bold text-green-900">{averageStudentScore}%</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <TrendingUp size={20} className="text-green-600" />
            </div>
          </div>
        </div>

        <div
          className="p-4 rounded-xl bg-white border"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted mb-1">Class Admins</p>
              <p className="text-2xl font-bold text-green-900">
                {classData.classAdmins?.length || 0}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Shield size={20} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Class Information */}
      <div
        className="p-6 rounded-2xl bg-white border"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <h2 className="text-lg font-semibold text-green-900 mb-4">Class Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Key size={18} className="text-text-muted mt-0.5" />
            <div>
              <p className="text-sm text-text-muted">Class Code</p>
              <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                {classData.classCode}
              </code>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar size={18} className="text-text-muted mt-0.5" />
            <div>
              <p className="text-sm text-text-muted">Created Date</p>
              <p className="font-medium">{formatDate(classData.createdAt)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Target size={18} className="text-text-muted mt-0.5" />
            <div>
              <p className="text-sm text-text-muted">Academic Year</p>
              <p className="font-medium">{classData.year || "Not specified"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock size={18} className="text-text-muted mt-0.5" />
            <div>
              <p className="text-sm text-text-muted">Default Exam Duration</p>
              <p className="font-medium">{classData.defaultExamDurationMinutes} minutes</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <BookOpen size={18} className="text-text-muted mt-0.5" />
            <div>
              <p className="text-sm text-text-muted">Default Questions per Exam</p>
              <p className="font-medium">{classData.defaultQuestionCount} questions</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Shield size={18} className="text-text-muted mt-0.5" />
            <div>
              <p className="text-sm text-text-muted">PIN Last Changed</p>
              <p className="font-medium">
                {classData.pinLastChangedAt ? formatDate(classData.pinLastChangedAt) : "Never"}
              </p>
            </div>
          </div>
        </div>

        {classData.description && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-text-muted mb-1">Description</p>
            <p className="text-gray-700">{classData.description}</p>
          </div>
        )}
      </div>

      {/* Performance Overview */}
      {classData.students && classData.students.length > 0 && (
        <div
          className="p-6 rounded-2xl bg-white border"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <h2 className="text-lg font-semibold text-green-900 mb-4">Performance Overview</h2>

          {/* Score Distribution */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-text-muted">Score Distribution</span>
              <span className="text-text-muted">Students</span>
            </div>
            <div className="space-y-2">
              {[
                {
                  range: "90-100%",
                  color: "bg-green-600",
                  count: classData.students.filter((s) => (s.averageScore || 0) >= 90).length,
                },
                {
                  range: "75-89%",
                  color: "bg-blue-600",
                  count: classData.students.filter(
                    (s) => (s.averageScore || 0) >= 75 && (s.averageScore || 0) < 90,
                  ).length,
                },
                {
                  range: "60-74%",
                  color: "bg-yellow-600",
                  count: classData.students.filter(
                    (s) => (s.averageScore || 0) >= 60 && (s.averageScore || 0) < 75,
                  ).length,
                },
                {
                  range: "Below 60%",
                  color: "bg-red-600",
                  count: classData.students.filter((s) => (s.averageScore || 0) < 60).length,
                },
              ].map((item) => (
                <div key={item.range} className="flex items-center gap-3">
                  <span className="text-sm w-20">{item.range}</span>
                  <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full flex items-center justify-end px-2 text-white text-xs font-medium`}
                      style={{ width: `${(item.count / classData.totalStudents) * 100}%` }}>
                      {item.count > 0 && item.count}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performers */}
          <div>
            <h3 className="font-medium text-green-800 mb-3">Top Performers</h3>
            <div className="space-y-2">
              {classData.students
                .sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0))
                .slice(0, 5)
                .map((student, index) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-cream">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-green-900 w-6">#{index + 1}</span>
                      <div>
                        <p className="font-medium text-sm">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-xs text-text-muted">
                          {student.admissionNo || "No admission no."}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-900">
                        {student.averageScore?.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
