"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  BookOpen,
  Clock,
  Calendar,
  Users,
  Edit,
  Trash2,
  PlayCircle,
  FileText,
} from "lucide-react";
import { ExamDetailHeader } from "./components/ExamDetailHeader";
import { QuestionCategory } from "./components/QuestionCategory";
import { AddQuestionModal } from "./components/AddQuestionModal";
import { QuestionBankModal } from "./components/QuestionBankModal";
import { getExamById } from "../mock";
import type { Exam, Question, QuestionType, DifficultyLevel } from "../types";

export default function ExamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [showQuestionBankModal, setShowQuestionBankModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    fetchExamDetails();
  }, [params.id]);

  const fetchExamDetails = async () => {
    setLoading(true);
    try {
      const data = getExamById(params.id as string);
      setExam(data || null);
    } catch (error) {
      console.error("Error fetching exam details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = (
    questionData: Omit<Question, "id" | "examId" | "createdAt" | "updatedAt">,
  ) => {
    if (!exam) return;
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      examId: exam.id,
      ...questionData,
      orderIndex: exam.questions.length + 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updatedExam = {
      ...exam,
      questions: [...exam.questions, newQuestion],
      totalQuestions: exam.totalQuestions + 1,
      totalMarks: exam.totalMarks + questionData.marks,
    };
    setExam(updatedExam);
    setShowAddQuestionModal(false);
  };

  const handleRemoveQuestion = (questionId: string) => {
    if (!exam) return;
    if (confirm("Are you sure you want to remove this question?")) {
      const removedQuestion = exam.questions.find((q) => q.id === questionId);
      const updatedExam = {
        ...exam,
        questions: exam.questions.filter((q) => q.id !== questionId),
        totalQuestions: exam.totalQuestions - 1,
        totalMarks: exam.totalMarks - (removedQuestion?.marks || 0),
      };
      setExam(updatedExam);
    }
  };

  const getUniqueCategories = (questions: Question[]) => {
    const categories = new Set(questions.map((q) => q.category));
    return ["all", ...Array.from(categories)];
  };

  const getCategoryQuestions = (category: string) => {
    if (!exam) return [];
    if (category === "all") return exam.questions;
    return exam.questions.filter((q) => q.category === category);
  };

  const getCategoryStats = (category: string) => {
    const questions = getCategoryQuestions(category);
    const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
    const byType: Record<string, number> = {};
    questions.forEach((q) => {
      byType[q.type] = (byType[q.type] || 0) + 1;
    });
    return { total: questions.length, totalMarks, byType };
  };

  if (loading || !exam) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800" />
      </div>
    );
  }

  const categories = getUniqueCategories(exam.questions);
  const filteredQuestions = getCategoryQuestions(activeCategory);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-text-muted hover:text-green-900 transition-colors mb-4">
          <ArrowLeft size={18} /> Back to Exams
        </button>
        <ExamDetailHeader exam={exam} onExamUpdate={setExam} />
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-3 rounded-lg bg-cream">
          <p className="text-xs text-text-muted">Total Questions</p>
          <p className="text-lg font-bold text-green-900">{exam.totalQuestions}</p>
        </div>
        <div className="p-3 rounded-lg bg-cream">
          <p className="text-xs text-text-muted">Total Marks</p>
          <p className="text-lg font-bold text-green-900">{exam.totalMarks}</p>
        </div>
        <div className="p-3 rounded-lg bg-cream">
          <p className="text-xs text-text-muted">Duration</p>
          <p className="text-lg font-bold text-green-900">{exam.durationMinutes} min</p>
        </div>
        <div className="p-3 rounded-lg bg-cream">
          <p className="text-xs text-text-muted">Students</p>
          <p className="text-lg font-bold text-green-900">{exam.totalStudents}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setShowAddQuestionModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-800 text-white hover:bg-green-700 transition-colors">
          <Plus size={16} /> Add Question
        </button>
        <button
          onClick={() => setShowQuestionBankModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-cream transition-colors">
          <BookOpen size={16} /> From Question Bank
        </button>
        {exam.status === "DRAFT" && (
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors ml-auto">
            <PlayCircle size={16} /> Publish Exam
          </button>
        )}
      </div>

      {/* Category Filter */}
      {exam.questions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => {
            const stats = getCategoryStats(category);
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-green-800 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}>
                {category === "all" ? "All Questions" : category}
                {stats.total > 0 && (
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      isActive ? "bg-green-700" : "bg-gray-200"
                    }`}>
                    {stats.total}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Questions by Category */}
      {exam.questions.length === 0 ? (
        <div
          className="text-center py-12 bg-white rounded-2xl border"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <FileText size={48} className="mx-auto text-text-muted mb-3" />
          <p className="text-text-muted">No questions added yet</p>
          <p className="text-sm text-text-muted mt-1">Add questions to this exam</p>
        </div>
      ) : (
        <div className="space-y-6">
          {activeCategory === "all" ? (
            // Group by category when showing all
            categories
              .filter((c) => c !== "all")
              .map((category) => {
                const categoryQuestions = getCategoryQuestions(category);
                if (categoryQuestions.length === 0) return null;
                return (
                  <QuestionCategory
                    key={category}
                    category={category}
                    questions={categoryQuestions}
                    onRemoveQuestion={handleRemoveQuestion}
                  />
                );
              })
          ) : (
            // Show single category
            <QuestionCategory
              category={activeCategory}
              questions={filteredQuestions}
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
        examMarks={exam.totalMarks}
      />

      <QuestionBankModal
        isOpen={showQuestionBankModal}
        onClose={() => setShowQuestionBankModal(false)}
        onSelectQuestions={(questions) => {
          // Add selected questions from bank
          questions.forEach((q) => {
            handleAddQuestion({
              type: q.type,
              category: q.category,
              questionText: q.questionText,
              options: q.options,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
              marks: q.marks,
              difficulty: q.difficulty,
            });
          });
        }}
      />
    </div>
  );
}
