"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, LayoutGrid, List, ArrowUpDown } from "lucide-react";
import { ExamStatsCards } from "./components/ExamStatsCards";
import { ExamClassGrid } from "./components/ExamClassGrid";
import { ExamList } from "./components/ExamList";
import { CreateExamModal } from "./components/CreateExamModal";
import { MOCK_EXAMS, MOCK_CLASS_EXAM_STATS } from "./mock";
import type { Exam, ExamFilters, ClassExamStats, CreateExamDto } from "./types";

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>(MOCK_EXAMS);
  const [classStats, setClassStats] = useState<ClassExamStats[]>(MOCK_CLASS_EXAM_STATS);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClassId, setSelectedClassId] = useState<string | undefined>(undefined);
  const [filters, setFilters] = useState<ExamFilters>({
    sortBy: "startDate",
    sortOrder: "DESC",
  });

  // Calculate overall stats
  const stats = {
    totalExams: exams.length,
    draftExams: exams.filter((e) => e.status === "DRAFT").length,
    publishedExams: exams.filter((e) => e.status === "PUBLISHED").length,
    ongoingExams: exams.filter((e) => e.status === "ONGOING").length,
    completedExams: exams.filter((e) => e.status === "COMPLETED").length,
    totalQuestions: exams.reduce((sum, e) => sum + e.totalQuestions, 0),
    averageMarks: Math.round(
      exams.reduce((sum, e) => sum + (e.averageScore || 0), 0) / exams.length || 0,
    ),
  };

  // Filter and sort exams
  const filteredExams = exams
    .filter((exam) => {
      const matchesSearch =
        exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.className?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false;

      const matchesClass = selectedClassId ? exam.classId === selectedClassId : true;
      const matchesStatus = filters.status ? exam.status === filters.status : true;
      const matchesTerm = filters.term ? exam.term === filters.term : true;

      return matchesSearch && matchesClass && matchesStatus && matchesTerm;
    })
    .sort((a, b) => {
      const sortField = filters.sortBy || "startDate";
      const sortOrder = filters.sortOrder === "ASC" ? 1 : -1;

      switch (sortField) {
        case "title":
          return sortOrder * a.title.localeCompare(b.title);
        case "startDate":
          return sortOrder * (new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        case "totalMarks":
          return sortOrder * (a.totalMarks - b.totalMarks);
        case "totalQuestions":
          return sortOrder * (a.totalQuestions - b.totalQuestions);
        default:
          return sortOrder * (new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      }
    });

  const handleCreateExam = async (examData: CreateExamDto) => {
    // Replace with actual API call
    const newExam: Exam = {
      id: `exam-${Date.now()}`,
      schoolId: "school-001",
      ...examData,
      totalQuestions: 0,
      submittedCount: 0,
      status: ExamStatus.DRAFT,
      questions: [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setExams((prev) => [newExam, ...prev]);
    setShowCreateModal(false);
  };

  const handleExamUpdate = (updatedExam: Exam) => {
    setExams((prev) => prev.map((e) => (e.id === updatedExam.id ? updatedExam : e)));
  };

  const handleExamDelete = (examId: string) => {
    if (confirm("Are you sure you want to delete this exam?")) {
      setExams((prev) => prev.filter((e) => e.id !== examId));
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-serif text-3xl text-green-900 mb-2">Exams</h1>
            <p className="text-text-muted">
              Manage all school exams, create new assessments, and track performance
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-800 text-white hover:bg-green-700 transition-all">
            <Plus size={16} /> Create Exam
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <ExamStatsCards stats={stats} />

      {/* Filters and View Toggle */}
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"
              size={18}
            />
            <input
              type="text"
              placeholder="Search exams by title, subject, or class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            title="class id"
            value={selectedClassId || "all"}
            onChange={(e) =>
              setSelectedClassId(e.target.value === "all" ? undefined : e.target.value)
            }
            className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500">
            <option value="all">All Classes</option>
            {classStats.map((cls) => (
              <option key={cls.classId} value={cls.classId}>
                {cls.className} {cls.classArm ? `(${cls.classArm})` : ""}
              </option>
            ))}
          </select>

          <select
            title="status"
            value={filters.status || "all"}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                status: e.target.value === "all" ? undefined : (e.target.value as any),
              }))
            }
            className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500">
            <option value="all">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <select
            title="term"
            value={filters.term || "all"}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                term: e.target.value === "all" ? undefined : (e.target.value as any),
              }))
            }
            className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500">
            <option value="all">All Terms</option>
            <option value="FIRST">First Term</option>
            <option value="SECOND">Second Term</option>
            <option value="THIRD">Third Term</option>
          </select>

          <div className="flex rounded-xl border border-gray-200 overflow-hidden">
            <button
              title="view mode"
              onClick={() => setViewMode("grid")}
              className={`p-2 px-3 transition-all ${viewMode === "grid" ? "bg-green-800 text-white" : "bg-white text-text-muted hover:bg-cream"}`}>
              <LayoutGrid size={18} />
            </button>
            <button
              title="view mode"
              onClick={() => setViewMode("list")}
              className={`p-2 px-3 transition-all ${viewMode === "list" ? "bg-green-800 text-white" : "bg-white text-text-muted hover:bg-cream"}`}>
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Exams Display */}
      {viewMode === "grid" ? (
        <ExamClassGrid
          classStats={classStats}
          exams={filteredExams}
          onExamUpdate={handleExamUpdate}
          onExamDelete={handleExamDelete}
        />
      ) : (
        <ExamList
          exams={filteredExams}
          onExamUpdate={handleExamUpdate}
          onExamDelete={handleExamDelete}
        />
      )}

      {/* Create Exam Modal */}
      <CreateExamModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateExam}
        classStats={classStats}
      />
    </div>
  );
}
