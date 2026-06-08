"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Calendar,
  Clock,
  Users,
  FileText,
  Eye,
  BarChart3,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";

interface ClassExamsProps {
  classId: string;
}

// Mock exams data
const MOCK_EXAMS = [
  {
    id: "exam-001",
    title: "Mathematics Mid-Term Assessment",
    type: "Mid-Term",
    subject: "Mathematics",
    date: new Date("2026-06-15"),
    duration: 90,
    totalQuestions: 50,
    totalStudents: 35,
    averageScore: 78.5,
    status: "upcoming",
  },
  {
    id: "exam-002",
    title: "Physics End of Term Exam",
    type: "End of Term",
    subject: "Physics",
    date: new Date("2026-06-20"),
    duration: 120,
    totalQuestions: 60,
    totalStudents: 35,
    averageScore: 0,
    status: "upcoming",
  },
  {
    id: "exam-003",
    title: "Chemistry Quiz 2",
    type: "Quiz",
    subject: "Chemistry",
    date: new Date("2026-06-05"),
    duration: 30,
    totalQuestions: 20,
    totalStudents: 33,
    averageScore: 82.3,
    status: "completed",
  },
  {
    id: "exam-004",
    title: "English Comprehension Test",
    type: "Test",
    subject: "English",
    date: new Date("2026-05-28"),
    duration: 45,
    totalQuestions: 30,
    totalStudents: 34,
    averageScore: 75.8,
    status: "completed",
  },
];

export function ClassExams({ classId }: ClassExamsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "upcoming" | "completed">("all");

  const filteredExams = MOCK_EXAMS.filter((exam) => {
    const matchesSearch =
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" ? true : exam.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    if (status === "upcoming") {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">Upcoming</span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Completed</span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"
              size={18}
            />
            <input
              type="text"
              placeholder="Search exams by title or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500"
            />
          </div>
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500">
          <option value="all">All Exams</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
        </select>

        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-800 text-white hover:bg-green-700 transition-all">
          <Plus size={16} /> Create Exam
        </button>
      </div>

      {/* Exams List */}
      {filteredExams.length === 0 ? (
        <div
          className="text-center py-12 bg-white rounded-2xl border"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <FileText size={48} className="mx-auto text-text-muted mb-3" />
          <p className="text-text-muted">No exams found</p>
          <p className="text-sm text-text-muted mt-1">Create your first exam for this class</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredExams.map((exam) => (
            <div
              key={exam.id}
              className="p-5 rounded-xl bg-white border hover:shadow-md transition-shadow"
              style={{ borderColor: "rgba(30,80,50,0.08)" }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-green-900">{exam.title}</h3>
                    {getStatusBadge(exam.status)}
                  </div>
                  <p className="text-sm text-text-muted mb-2">{exam.subject}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-text-muted">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{formatDate(exam.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{exam.duration} mins</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText size={14} />
                      <span>{exam.totalQuestions} questions</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      <span>{exam.totalStudents} students</span>
                    </div>
                    {exam.status === "completed" && (
                      <div className="flex items-center gap-1">
                        <BarChart3 size={14} />
                        <span>Avg: {exam.averageScore}%</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/school/classes/${classId}/exams/${exam.id}`}
                    className="p-2 rounded-lg hover:bg-cream transition-colors">
                    <Eye size={16} className="text-text-muted" />
                  </Link>
                  <button className="p-2 rounded-lg hover:bg-cream transition-colors">
                    <MoreVertical size={16} className="text-text-muted" />
                  </button>
                </div>
              </div>

              {exam.status === "upcoming" && (
                <div className="mt-3 pt-3 border-t flex justify-end gap-2">
                  <button className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-cream transition-colors text-sm">
                    Edit Details
                  </button>
                  <button className="px-3 py-1.5 rounded-lg bg-green-800 text-white hover:bg-green-700 transition-colors text-sm">
                    Publish Exam
                  </button>
                </div>
              )}

              {exam.status === "completed" && (
                <div className="mt-3 pt-3 border-t flex justify-end gap-2">
                  <Link
                    href={`/school/classes/${classId}/exams/${exam.id}/results`}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-cream transition-colors text-sm">
                    View Results
                  </Link>
                  <button className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-cream transition-colors text-sm">
                    Review Analytics
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
