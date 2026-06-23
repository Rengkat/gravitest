"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, BookOpen, PlayCircle } from "lucide-react";
import { ExamDetailHeader } from "./components/ExamDetailHeader";
import { QuestionTypeSection } from "./components/QuestionTypeSection";
import { AddQuestionModal } from "./components/AddQuestionModal";
import { QuestionBankModal } from "./components/QuestionBankModal";
import { EmptyState } from "../components/EmptyState";
import { fetchExamById, addQuestionToExam, removeQuestionFromExam } from "../mock";
import { QUESTION_TYPES, QUESTION_TYPE_LABELS } from "../types";
import type { Exam, Question, QuestionType, CreateQuestionDto } from "../types";

type CategoryFilter = "all" | QuestionType;

export default function ExamDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const examId = params.id;

  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [showQuestionBankModal, setShowQuestionBankModal] = useState(false);
  const [activeType, setActiveType] = useState<CategoryFilter>("all");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setNotFound(false);
    fetchExamById(examId).then((data) => {
      if (!isMounted) return;
      if (!data) {
        setNotFound(true);
      } else {
        setExam(data);
      }
      setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, [examId]);

  // Question types actually present on this exam, in the canonical order
  // defined by QUESTION_TYPES (so "MCQ" always comes before "Theory", etc).
  const typesInUse = useMemo(() => {
    if (!exam) return [];
    const present = new Set(exam.questions.map((q) => q.type));
    return QUESTION_TYPES.filter((type) => present.has(type));
  }, [exam]);

  const existingTopics = useMemo(() => {
    if (!exam) return [];
    return [...new Set(exam.questions.map((q) => q.topic))];
  }, [exam]);

  const questionsByType = useMemo(() => {
    if (!exam) return new Map<QuestionType, Question[]>();
    const map = new Map<QuestionType, Question[]>();
    for (const type of typesInUse) {
      map.set(
        type,
        exam.questions.filter((q) => q.type === type),
      );
    }
    return map;
  }, [exam, typesInUse]);

  const refreshExam = (updated: Exam | undefined) => {
    if (updated) setExam(updated);
  };

  const handleAddQuestion = async (questionData: CreateQuestionDto) => {
    const updated = await addQuestionToExam(examId, questionData);
    refreshExam(updated);
    setShowAddQuestionModal(false);
  };

  const handleAddQuestionsFromBank = async (questions: Question[]) => {
    let updated: Exam | undefined;
    for (const q of questions) {
      updated = await addQuestionToExam(examId, {
        type: q.type,
        topic: q.topic,
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        marks: q.marks,
        difficulty: q.difficulty,
      });
    }
    refreshExam(updated);
  };

  const handleRemoveQuestion = async (questionId: string) => {
    if (!confirm("Are you sure you want to remove this question?")) return;
    const updated = await removeQuestionFromExam(examId, questionId);
    refreshExam(updated);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800" />
      </div>
    );
  }

  if (notFound || !exam) {
    return (
      <div className="max-w-3xl mx-auto">
        <button
          type="button"
          onClick={() => router.push("/school/exams")}
          className="flex items-center gap-2 text-text-muted hover:text-green-900 transition-colors mb-6">
          <ArrowLeft size={18} /> Back to Exams
        </button>
        <EmptyState
          title="Exam not found"
          description="This exam may have been removed, or the link is incorrect."
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-text-muted hover:text-green-900 transition-colors mb-4">
          <ArrowLeft size={18} /> Back
        </button>
        <ExamDetailHeader exam={exam} />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          type="button"
          onClick={() => setShowAddQuestionModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-800 text-white hover:bg-green-700 transition-colors">
          <Plus size={16} /> Add Question
        </button>
        <button
          type="button"
          onClick={() => setShowQuestionBankModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-cream transition-colors">
          <BookOpen size={16} /> From Question Bank
        </button>
        {exam.status === "DRAFT" && (
          <button
            type="button"
            disabled={exam.questions.length === 0}
            title={exam.questions.length === 0 ? "Add at least one question first" : undefined}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ml-auto">
            <PlayCircle size={16} /> Publish Exam
          </button>
        )}
      </div>

      {/* Question Type Filter */}
      {exam.questions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            type="button"
            onClick={() => setActiveType("all")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              activeType === "all"
                ? "bg-green-800 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}>
            All Questions
            <span
              className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeType === "all" ? "bg-green-700" : "bg-gray-200"
              }`}>
              {exam.questions.length}
            </span>
          </button>
          {typesInUse.map((type) => {
            const count = questionsByType.get(type)?.length ?? 0;
            const isActive = activeType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setActiveType(type)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-green-800 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}>
                {QUESTION_TYPE_LABELS[type]}
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    isActive ? "bg-green-700" : "bg-gray-200"
                  }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Questions, grouped by type (MCQ / Theory / Practical / ...) */}
      {exam.questions.length === 0 ? (
        <EmptyState
          title="No questions added yet"
          description="Add questions to this exam, or pull some in from the question bank."
        />
      ) : (
        <div className="space-y-6">
          {activeType === "all" ? (
            typesInUse.map((type) => (
              <QuestionTypeSection
                key={type}
                type={type}
                questions={questionsByType.get(type) ?? []}
                onRemoveQuestion={handleRemoveQuestion}
              />
            ))
          ) : (
            <QuestionTypeSection
              type={activeType}
              questions={questionsByType.get(activeType) ?? []}
              onRemoveQuestion={handleRemoveQuestion}
            />
          )}
        </div>
      )}

      {/* Modals */}
      <AddQuestionModal
        isOpen={showAddQuestionModal}
        onClose={() => setShowAddQuestionModal(false)}
        onAdd={handleAddQuestion}
        topicSuggestions={existingTopics}
      />

      <QuestionBankModal
        isOpen={showQuestionBankModal}
        onClose={() => setShowQuestionBankModal(false)}
        onSelectQuestions={handleAddQuestionsFromBank}
      />
    </div>
  );
}
