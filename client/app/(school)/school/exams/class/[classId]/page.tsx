"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { ClassHeader } from "./components/ClassHeader";
import { SubjectStatsGrid } from "./components/SubjectStatsGrid";
import { ExamList } from "../../components/ExamList";
import { CreateExamModal } from "../../components/CreateExamModal";
import { EmptyState } from "../../components/EmptyState";
import {
  fetchClassById,
  fetchExamsByClassId,
  fetchClassExamStats,
  computeSubjectExamStats,
  createExam,
  deleteExam,
} from "../../mock";
import type { Exam, SchoolClass, CreateExamDto, ClassExamStats } from "../../types";

export default function ClassExamsPage() {
  const params = useParams<{ classId: string }>();
  const router = useRouter();
  const classId = params.classId;

  const [schoolClass, setSchoolClass] = useState<SchoolClass | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [allClassStats, setAllClassStats] = useState<ClassExamStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setNotFound(false);

    Promise.all([
      fetchClassById(classId),
      fetchExamsByClassId(classId),
      fetchClassExamStats(),
    ]).then(([classData, examData, classStats]) => {
      if (!isMounted) return;
      if (!classData) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setSchoolClass(classData);
      setExams(examData);
      setAllClassStats(classStats);
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [classId]);

  const subjectStats = useMemo(() => {
    if (!schoolClass) return [];
    return computeSubjectExamStats(schoolClass.subjects, exams);
  }, [schoolClass, exams]);

  const visibleExams = useMemo(() => {
    if (!activeSubject) return exams;
    return exams.filter((exam) => exam.subject.toLowerCase() === activeSubject.toLowerCase());
  }, [exams, activeSubject]);

  const refreshExams = async () => {
    const [examData, classStats] = await Promise.all([
      fetchExamsByClassId(classId),
      fetchClassExamStats(),
    ]);
    setExams(examData);
    setAllClassStats(classStats);
  };

  const handleCreateExam = async (examData: CreateExamDto) => {
    await createExam(examData);
    await refreshExams();
  };

  const handleExamDelete = async (examId: string) => {
    if (!confirm("Are you sure you want to delete this exam?")) return;
    await deleteExam(examId);
    await refreshExams();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800" />
      </div>
    );
  }

  if (notFound || !schoolClass) {
    return (
      <div className="max-w-3xl mx-auto">
        <button
          type="button"
          onClick={() => router.push("/school/exams")}
          className="flex items-center gap-2 text-text-muted hover:text-green-900 transition-colors mb-6">
          <ArrowLeft size={18} /> Back to Exams
        </button>
        <EmptyState
          title="Class not found"
          description="This class may have been removed, or the link is incorrect."
        />
      </div>
    );
  }

  // The class's own stats, lifted from the list we already fetched, used for
  // the "Add Exam" modal's class dropdown (kept consistent with the overview page).
  const currentClassStat = allClassStats.find((c) => c.classId === classId) ?? {
    classId: schoolClass.classId,
    className: schoolClass.className,
    classArm: schoolClass.classArm,
    totalStudents: schoolClass.totalStudents,
    totalExams: exams.length,
    publishedExams: exams.filter((e) => e.status === "PUBLISHED").length,
    completedExams: exams.filter((e) => e.status === "COMPLETED").length,
    averageScore: null,
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back link */}
      <button
        type="button"
        onClick={() => router.push("/school/exams")}
        className="flex items-center gap-2 text-text-muted hover:text-green-900 transition-colors mb-6">
        <ArrowLeft size={18} /> Back to Exams
      </button>

      {/* Header + Add Exam action */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <ClassHeader schoolClass={schoolClass} />
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-800 text-white hover:bg-green-700 transition-all">
          <Plus size={16} /> Add Exam
        </button>
      </div>

      {/* Subject-based stats */}
      <div className="mb-8">
        <SubjectStatsGrid
          subjectStats={subjectStats}
          activeSubject={activeSubject}
          onSelectSubject={setActiveSubject}
        />
      </div>

      {/* Exams for this class */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-serif text-lg text-green-900">
          {activeSubject ? `${activeSubject} Exams` : "All Exams"}
        </h2>
        <span className="text-sm text-text-muted">
          {visibleExams.length} exam{visibleExams.length !== 1 ? "s" : ""}
        </span>
      </div>

      <ExamList
        exams={visibleExams}
        onExamDelete={handleExamDelete}
        showClassColumn={false}
        emptyStateDescription="Click “Add Exam” above to create the first exam for this class"
      />

      {/* Create Exam Modal, pre-locked to this class */}
      <CreateExamModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateExam}
        classStats={[currentClassStat, ...allClassStats.filter((c) => c.classId !== classId)]}
        lockedClassId={classId}
        subjectOptions={schoolClass.subjects}
      />
    </div>
  );
}
