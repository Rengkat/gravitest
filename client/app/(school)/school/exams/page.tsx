"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search, LayoutGrid, List } from "lucide-react";
import { ExamStatsCards } from "./components/ExamStatsCards";
import { ExamClassGrid } from "./components/ExamClassGrid";
import { ExamList } from "./components/ExamList";
import { CreateExamModal } from "./components/CreateExamModal";
import {
  fetchExams,
  fetchClassExamStats,
  computeOverallStats,
  createExam,
  deleteExam,
} from "./mock";
import type { Exam, ExamFilters, ClassExamStats, CreateExamDto } from "./types";
import { EXAM_STATUSES, EXAM_STATUS_LABELS, TERMS, TERM_LABELS } from "./types";

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [classStats, setClassStats] = useState<ClassExamStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<ExamFilters>({
    sortBy: "startDate",
    sortOrder: "DESC",
  });

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    Promise.all([fetchExams(), fetchClassExamStats()]).then(([examData, stats]) => {
      if (!isMounted) return;
      setExams(examData);
      setClassStats(stats);
      setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => computeOverallStats(exams), [exams]);

  const filteredExams = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return exams
      .filter((exam) => {
        const matchesSearch =
          !term ||
          exam.title.toLowerCase().includes(term) ||
          exam.subject.toLowerCase().includes(term) ||
          exam.className.toLowerCase().includes(term);

        const matchesStatus = filters.status ? exam.status === filters.status : true;
        const matchesTerm = filters.term ? exam.term === filters.term : true;

        return matchesSearch && matchesStatus && matchesTerm;
      })
      .sort((a, b) => {
        const sortOrder = filters.sortOrder === "ASC" ? 1 : -1;
        switch (filters.sortBy) {
          case "title":
            return sortOrder * a.title.localeCompare(b.title);
          case "totalMarks":
            return sortOrder * (a.totalMarks - b.totalMarks);
          case "totalQuestions":
            return sortOrder * (a.totalQuestions - b.totalQuestions);
          case "startDate":
          default:
            return sortOrder * (new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        }
      });
  }, [exams, searchTerm, filters]);

  const handleCreateExam = async (examData: CreateExamDto) => {
    const newExam = await createExam(examData);
    setExams((prev) => [newExam, ...prev]);
    // Refresh per-class stats so the new exam is reflected on the grid.
    setClassStats(await fetchClassExamStats());
  };

  const handleExamDelete = async (examId: string) => {
    if (!confirm("Are you sure you want to delete this exam?")) return;
    await deleteExam(examId);
    setExams((prev) => prev.filter((e) => e.id !== examId));
    setClassStats(await fetchClassExamStats());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800" />
      </div>
    );
  }

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
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-800 text-white hover:bg-green-700 transition-all">
            <Plus size={16} /> Create Exam
          </button>
        </div>
      </div>

      {/* Overall Stats */}
      <ExamStatsCards stats={stats} />

      {/* Classes Overview */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-serif text-xl text-green-900">Classes</h2>
      </div>

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
            aria-label="Filter by status"
            value={filters.status || "all"}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                status: e.target.value === "all" ? undefined : (e.target.value as Exam["status"]),
              }))
            }
            className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500">
            <option value="all">All Status</option>
            {EXAM_STATUSES.map((status) => (
              <option key={status} value={status}>
                {EXAM_STATUS_LABELS[status]}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by term"
            value={filters.term || "all"}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                term: e.target.value === "all" ? undefined : (e.target.value as Exam["term"]),
              }))
            }
            className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500">
            <option value="all">All Terms</option>
            {TERMS.map((term) => (
              <option key={term} value={term}>
                {TERM_LABELS[term]}
              </option>
            ))}
          </select>

          <div className="flex rounded-xl border border-gray-200 overflow-hidden">
            <button
              title="view mode"
              type="button"
              aria-label="Group by class"
              aria-pressed={viewMode === "grid"}
              onClick={() => setViewMode("grid")}
              className={`p-2 px-3 transition-all ${viewMode === "grid" ? "bg-green-800 text-white" : "bg-white text-text-muted hover:bg-cream"}`}>
              <LayoutGrid size={18} />
            </button>
            <button
              title="view mode"
              type="button"
              aria-label="Show flat list"
              aria-pressed={viewMode === "list"}
              onClick={() => setViewMode("list")}
              className={`p-2 px-3 transition-all ${viewMode === "list" ? "bg-green-800 text-white" : "bg-white text-text-muted hover:bg-cream"}`}>
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Exams Display: grouped by class, or a flat searchable/sortable table */}
      {viewMode === "grid" ? (
        <ExamClassGrid classStats={classStats} exams={filteredExams} />
      ) : (
        <ExamList exams={filteredExams} onExamDelete={handleExamDelete} />
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
