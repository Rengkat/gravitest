"use client";

import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import type { Question, QuestionType, DifficultyLevel } from "../../types";

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (questionData: Omit<Question, "id" | "examId" | "createdAt" | "updatedAt">) => void;
  examMarks: number;
}

const QUESTION_TYPES: QuestionType[] = [
  "MCQ",
  "THEORY",
  "PRACTICAL",
  "TRUE_FALSE",
  "FILL_IN_BLANK",
  "MATCHING",
  "ESSAY",
  "OBJECTIVE",
];
const DIFFICULTY_LEVELS: DifficultyLevel[] = ["EASY", "MEDIUM", "HARD", "VERY_HARD"];

export function AddQuestionModal({ isOpen, onClose, onAdd, examMarks }: AddQuestionModalProps) {
  const [questionData, setQuestionData] = useState({
    type: "MCQ" as QuestionType,
    category: "",
    questionText: "",
    options: [""],
    correctAnswer: "",
    explanation: "",
    marks: 5,
    difficulty: "MEDIUM" as DifficultyLevel,
  });

  const handleChange = (field: string, value: any) => {
    setQuestionData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...questionData.options];
    newOptions[index] = value;
    setQuestionData((prev) => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    setQuestionData((prev) => ({ ...prev, options: [...prev.options, ""] }));
  };

  const removeOption = (index: number) => {
    if (questionData.options.length > 1) {
      setQuestionData((prev) => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const processedData = {
      ...questionData,
      options: questionData.options.filter((o) => o.trim() !== ""),
      correctAnswer: questionData.correctAnswer,
    };
    onAdd(processedData);
    // Reset form
    setQuestionData({
      type: "MCQ",
      category: "",
      questionText: "",
      options: [""],
      correctAnswer: "",
      explanation: "",
      marks: 5,
      difficulty: "MEDIUM",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />

        <div className="relative bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
            <h2 className="text-xl font-semibold text-green-900">Add Question</h2>
            <button
              title="close"
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-cream transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question Type *
                </label>
                <select
                  title="type"
                  required
                  value={questionData.type}
                  onChange={(e) => handleChange("type", e.target.value as QuestionType)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500">
                  {QUESTION_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <input
                  type="text"
                  required
                  value={questionData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  placeholder="e.g., Algebra, Mechanics"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question Text *
              </label>
              <textarea
                required
                rows={3}
                value={questionData.questionText}
                onChange={(e) => handleChange("questionText", e.target.value)}
                placeholder="Enter the question..."
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
              />
            </div>

            {/* Options for MCQ, True/False */}
            {(questionData.type === "MCQ" ||
              questionData.type === "TRUE_FALSE" ||
              questionData.type === "MATCHING") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Options *</label>
                {questionData.options.map((option, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                    />
                    {questionData.options.length > 1 && (
                      <button
                        title="option"
                        type="button"
                        onClick={() => removeOption(index)}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors text-red-500">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addOption}
                  className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 transition-colors">
                  <Plus size={14} /> Add Option
                </button>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correct Answer *
              </label>
              {questionData.type === "MCQ" || questionData.type === "TRUE_FALSE" ? (
                <select
                  title="correct answer"
                  required
                  value={questionData.correctAnswer}
                  onChange={(e) => handleChange("correctAnswer", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500">
                  <option value="">Select correct answer</option>
                  {questionData.options
                    .filter((o) => o.trim())
                    .map((option, index) => (
                      <option key={index} value={option}>
                        {String.fromCharCode(65 + index)}. {option}
                      </option>
                    ))}
                </select>
              ) : (
                <textarea
                  required
                  rows={2}
                  value={questionData.correctAnswer}
                  onChange={(e) => handleChange("correctAnswer", e.target.value)}
                  placeholder="Enter the correct answer..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Explanation (Optional)
              </label>
              <textarea
                rows={2}
                value={questionData.explanation}
                onChange={(e) => handleChange("explanation", e.target.value)}
                placeholder="Explain why this is the correct answer..."
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marks *</label>
                <input
                  title="marks"
                  type="number"
                  required
                  min={1}
                  value={questionData.marks}
                  onChange={(e) => handleChange("marks", parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty *</label>
                <select
                  title="difficulty"
                  required
                  value={questionData.difficulty}
                  onChange={(e) => handleChange("difficulty", e.target.value as DifficultyLevel)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500">
                  {DIFFICULTY_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-cream transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-green-800 text-white hover:bg-green-700 transition-colors">
                Add Question
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
