// src/app/school/exams/class/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Search,
  Calendar,
  Clock,
  FileText,
  Eye,
  Edit,
  Trash2,
  PlayCircle,
  MoreVertical,
} from "lucide-react";
import { getExamsByClassId, MOCK_CLASS_EXAM_STATS } from "../../mock";
import type { Exam, ClassExamStats } from "../../types";

export default function ClassExamsPage() {
  const params = useParams();
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [classStats, setClassStats] = useState<ClassExamStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchClassExams();
  }, [params.id]);

  const fetchClassExams = async () => {
    setLoading(true);
    try {
      const classExams = getExamsByClassId(params.id as string);
      setExams(classExams);

      const stats = MOCK_CLASS_EXAM_STATS.find((c) => c.classId === params.id);
      setClassStats(stats || null);
    } catch (error) {
      console.error("Error fetching class exams:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { color: string; bg: string }> = {
      DRAFT: { color: "text-gray-700", bg: "bg-gray-100" },
      PUBLISHED: { color: "text-blue-700", bg: "bg-blue-100" },
      ONGOING: { color: "text-yellow-700", bg: "bg-yellow-100" },
      COMPLETED: { color: "text-green-700", bg: "bg-green-100" },
    };
    const config = configs[status] || configs.DRAFT;
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${config.bg} ${config.color}`}>
        {status.charAt(0) + status.slice(1).toLowerCase()}
      </span>
    );
  };

  const filteredExams = exams.filter((exam) => {
    const matchesSearch =
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || exam.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-text-muted hover:text-green-900 transition-colors mb-4">
          <ArrowLeft size={18} /> Back to Exams
        </button>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-serif text-3xl text-green-900">
              {classStats?.className} {classStats?.classArm ? `(${classStats.classArm})` : ""}
            </h1>
            <p className="text-text-muted">
              {classStats?.totalExams} exams • {classStats?.totalStudents} students
            </p>
          </div>
          <button
            onClick={() => router.push(`/school/exams/create?classId=${params.id}`)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-800 text-white hover:bg-green-700 transition-all">
            <Plus size={16} /> Create Exam
          </button>
        </div>
      </div>

      {/* Stats */}
      {classStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-3 rounded-lg bg-cream">
            <p className="text-xs text-text-muted">Total Exams</p>
            <p className="text-lg font-bold text-green-900">{classStats.totalExams}</p>
          </div>
          <div className="p-3 rounded-lg bg-cream">
            <p className="text-xs text-text-muted">Published</p>
            <p className="text-lg font-bold text-green-900">{classStats.publishedExams}</p>
          </div>
          <div className="p-3 rounded-lg bg-cream">
            <p className="text-xs text-text-muted">Completed</p>
            <p className="text-lg font-bold text-green-900">{classStats.completedExams}</p>
          </div>
          <div className="p-3 rounded-lg bg-cream">
            <p className="text-xs text-text-muted">Avg. Score</p>
            <p className="text-lg font-bold text-green-900">
              {classStats.averageScore.toFixed(1)}%
            </p>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-wrap gap-4 mb-6">
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
          title="status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500">
          <option value="all">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ONGOING">Ongoing</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {/* Exams List */}
      {filteredExams.length === 0 ? (
        <div
          className="text-center py-12 bg-white rounded-2xl border"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <FileText size={48} className="mx-auto text-text-muted mb-3" />
          <p className="text-text-muted">No exams found for this class</p>
          <p className="text-sm text-text-muted mt-1">Create an exam to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredExams.map((exam) => (
            <div
              key={exam.id}
              className="p-5 rounded-xl bg-white border hover:shadow-md transition-shadow"
              style={{ borderColor: "rgba(30,80,50,0.08)" }}>
              <div className="flex items-start justify-between">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => router.push(`/school/exams/${exam.id}`)}>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-green-900">{exam.title}</h3>
                    {getStatusBadge(exam.status)}
                  </div>
                  <p className="text-sm text-text-muted mb-2">{exam.subject}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-text-muted">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDate(exam.startDate)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {exam.durationMinutes} mins
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText size={14} />
                      {exam.totalQuestions} questions
                    </span>
                    <span>{exam.totalMarks} marks</span>
                    {exam.averageScore !== undefined && (
                      <span className="font-medium text-green-700">
                        Avg: {exam.averageScore.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => router.push(`/school/exams/${exam.id}`)}
                    className="p-2 rounded-lg hover:bg-cream transition-colors"
                    title="View Details">
                    <Eye size={16} className="text-text-muted" />
                  </button>
                  {exam.status === "DRAFT" && (
                    <>
                      <button
                        className="p-2 rounded-lg hover:bg-cream transition-colors"
                        title="Edit">
                        <Edit size={16} className="text-text-muted" />
                      </button>
                      <button
                        className="p-2 rounded-lg hover:bg-green-50 transition-colors"
                        title="Publish">
                        <PlayCircle size={16} className="text-green-600" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
