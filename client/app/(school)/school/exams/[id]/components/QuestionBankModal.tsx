"use client";

import { useMemo, useState } from "react";
import { X, Search, Check, BookOpen } from "lucide-react";
import { QUESTION_TYPES, QUESTION_TYPE_LABELS } from "../../types";
import type { Question, QuestionType } from "../../types";

interface QuestionBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuestions: (questions: Question[]) => void | Promise<void>;
}

// Mock question bank — in a real app this would come from a shared,
// school-wide question bank API, filterable by subject/topic/type.
const MOCK_QUESTION_BANK: Question[] = [
  {
    id: "bank-001",
    examId: "bank",
    type: "MCQ",
    topic: "Algebra",
    questionText: "What is the value of x in 2x + 3 = 7?",
    options: ["x = 1", "x = 2", "x = 3", "x = 4"],
    correctAnswer: "x = 2",
    explanation: "Subtract 3 from both sides: 2x = 4, divide by 2: x = 2",
    marks: 5,
    difficulty: "EASY",
    orderIndex: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "bank-002",
    examId: "bank",
    type: "MCQ",
    topic: "Algebra",
    questionText: "Simplify: 3(x + 2) - 2(x - 1)",
    options: ["x + 4", "x + 8", "x + 6", "x + 10"],
    correctAnswer: "x + 8",
    explanation: "3x + 6 - 2x + 2 = x + 8",
    marks: 5,
    difficulty: "MEDIUM",
    orderIndex: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "bank-003",
    examId: "bank",
    type: "THEORY",
    topic: "Algebra",
    questionText: "Solve the quadratic equation: x² - 7x + 12 = 0",
    options: undefined,
    correctAnswer: "x = 3 or x = 4",
    explanation: "Factorize: (x - 3)(x - 4) = 0",
    marks: 10,
    difficulty: "MEDIUM",
    orderIndex: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "bank-004",
    examId: "bank",
    type: "MCQ",
    topic: "Mechanics",
    questionText: "What is the SI unit of force?",
    options: ["Newton", "Joule", "Watt", "Pascal"],
    correctAnswer: "Newton",
    explanation: "The SI unit of force is Newton (N)",
    marks: 5,
    difficulty: "EASY",
    orderIndex: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export function QuestionBankModal({ isOpen, onClose, onSelectQuestions }: QuestionBankModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<QuestionType | "all">("all");
  const [filterTopic, setFilterTopic] = useState<string>("all");

  const topics = useMemo(() => [...new Set(MOCK_QUESTION_BANK.map((q) => q.topic))], []);

  const filteredQuestions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return MOCK_QUESTION_BANK.filter((q) => {
      const matchesSearch =
        !term ||
        q.questionText.toLowerCase().includes(term) ||
        q.topic.toLowerCase().includes(term);
      const matchesType = filterType === "all" || q.type === filterType;
      const matchesTopic = filterTopic === "all" || q.topic === filterTopic;
      return matchesSearch && matchesType && matchesTopic;
    });
  }, [searchTerm, filterType, filterTopic]);

  if (!isOpen) return null;

  const toggleQuestion = (questionId: string) => {
    setSelectedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  const handleAddSelected = async () => {
    const selected = MOCK_QUESTION_BANK.filter((q) => selectedQuestions.has(q.id));
    await onSelectQuestions(selected);
    setSelectedQuestions(new Set());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />

        <div className="relative bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <BookOpen size={20} className="text-green-600" />
              <h2 className="text-xl font-semibold text-green-900">Question Bank</h2>
            </div>
            <button
              type="button"
              title="Close"
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-cream transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Search and Filters */}
          <div className="p-6 border-b">
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>

              <select
                aria-label="Filter by question type"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as QuestionType | "all")}
                className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500">
                <option value="all">All Types</option>
                {QUESTION_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {QUESTION_TYPE_LABELS[type]}
                  </option>
                ))}
              </select>

              <select
                aria-label="Filter by topic"
                value={filterTopic}
                onChange={(e) => setFilterTopic(e.target.value)}
                className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500">
                <option value="all">All Topics</option>
                {topics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Questions List */}
          <div className="p-6 overflow-y-auto flex-1">
            <div className="space-y-3">
              {filteredQuestions.map((question) => (
                <div
                  title="question id"
                  key={question.id}
                  role="checkbox"
                  aria-checked={selectedQuestions.has(question.id)}
                  tabIndex={0}
                  onClick={() => toggleQuestion(question.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleQuestion(question.id);
                    }
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedQuestions.has(question.id)
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-green-300"
                  }`}>
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-1 ${
                        selectedQuestions.has(question.id)
                          ? "bg-green-600 border-green-600"
                          : "border-gray-300"
                      }`}>
                      {selectedQuestions.has(question.id) && (
                        <Check size={14} className="text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                          {QUESTION_TYPE_LABELS[question.type]}
                        </span>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                          {question.topic}
                        </span>
                        <span className="text-xs text-text-muted">{question.marks} marks</span>
                      </div>
                      <p className="text-sm text-gray-700">{question.questionText}</p>
                      {question.options && (
                        <p className="text-xs text-text-muted mt-1">
                          {question.options.length} options available
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {filteredQuestions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-text-muted">No questions found</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t">
            <p className="text-sm text-text-muted">
              {selectedQuestions.size} question{selectedQuestions.size !== 1 ? "s" : ""} selected
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedQuestions(new Set())}
                className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-cream transition-colors">
                Clear Selection
              </button>
              <button
                type="button"
                onClick={handleAddSelected}
                disabled={selectedQuestions.size === 0}
                className="px-4 py-2 rounded-lg bg-green-800 text-white hover:bg-green-700 disabled:opacity-50 transition-colors">
                Add Selected Questions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
