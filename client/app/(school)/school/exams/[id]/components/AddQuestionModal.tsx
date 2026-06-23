"use client";

import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { QUESTION_TYPES, QUESTION_TYPE_LABELS, DIFFICULTY_LEVELS } from "../../types";
import type { CreateQuestionDto, QuestionType, DifficultyLevel } from "../../types";

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (questionData: CreateQuestionDto) => void | Promise<void>;
  /** Existing topics in this exam, offered as quick suggestions. */
  topicSuggestions?: string[];
}

const TYPES_WITH_OPTIONS: QuestionType[] = ["MCQ", "TRUE_FALSE", "MATCHING"];
const TYPES_WITH_SELECTABLE_ANSWER: QuestionType[] = ["MCQ", "TRUE_FALSE"];

const EMPTY_FORM = {
  type: "MCQ" as QuestionType,
  topic: "",
  questionText: "",
  options: [""],
  correctAnswer: "",
  explanation: "",
  marks: 5,
  difficulty: "MEDIUM" as DifficultyLevel,
};

export function AddQuestionModal({
  isOpen,
  onClose,
  onAdd,
  topicSuggestions = [],
}: AddQuestionModalProps) {
  const [questionData, setQuestionData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = <K extends keyof typeof EMPTY_FORM>(
    field: K,
    value: (typeof EMPTY_FORM)[K],
  ) => {
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
    if (questionData.options.length <= 1) return;
    setQuestionData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const resetForm = () => setQuestionData(EMPTY_FORM);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const showsOptions = TYPES_WITH_OPTIONS.includes(questionData.type);
      await onAdd({
        type: questionData.type,
        topic: questionData.topic.trim(),
        questionText: questionData.questionText.trim(),
        options: showsOptions
          ? questionData.options.map((o) => o.trim()).filter(Boolean)
          : undefined,
        correctAnswer: questionData.correctAnswer,
        explanation: questionData.explanation.trim() || undefined,
        marks: questionData.marks,
        difficulty: questionData.difficulty,
      });
      resetForm();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const showsOptions = TYPES_WITH_OPTIONS.includes(questionData.type);
  const showsSelectableAnswer = TYPES_WITH_SELECTABLE_ANSWER.includes(questionData.type);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />

        <div className="relative bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
            <h2 className="text-xl font-semibold text-green-900">Add Question</h2>
            <button
              type="button"
              title="Close"
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-cream transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="q-type" className="block text-sm font-medium text-gray-700 mb-1">
                  Question Type *
                </label>
                <select
                  id="q-type"
                  required
                  value={questionData.type}
                  onChange={(e) => {
                    const nextType = e.target.value as QuestionType;
                    handleChange("type", nextType);
                    // Selectable-answer types need their correct answer reset
                    // since the old free-text answer won't map to an option.
                    if (TYPES_WITH_SELECTABLE_ANSWER.includes(nextType)) {
                      handleChange("correctAnswer", "");
                    }
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500">
                  {QUESTION_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {QUESTION_TYPE_LABELS[type]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="q-topic" className="block text-sm font-medium text-gray-700 mb-1">
                  Topic *
                </label>
                <input
                  id="q-topic"
                  type="text"
                  required
                  list="topic-suggestions"
                  value={questionData.topic}
                  onChange={(e) => handleChange("topic", e.target.value)}
                  placeholder="e.g., Algebra, Mechanics"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                />
                {topicSuggestions.length > 0 && (
                  <datalist id="topic-suggestions">
                    {topicSuggestions.map((topic) => (
                      <option key={topic} value={topic} />
                    ))}
                  </datalist>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="q-text" className="block text-sm font-medium text-gray-700 mb-1">
                Question Text *
              </label>
              <textarea
                id="q-text"
                required
                rows={3}
                value={questionData.questionText}
                onChange={(e) => handleChange("questionText", e.target.value)}
                placeholder="Enter the question..."
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
              />
            </div>

            {/* Options for MCQ, True/False, Matching */}
            {showsOptions && (
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
                        type="button"
                        title="Remove option"
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
              <label htmlFor="q-answer" className="block text-sm font-medium text-gray-700 mb-1">
                Correct Answer *
              </label>
              {showsSelectableAnswer ? (
                <select
                  id="q-answer"
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
                  id="q-answer"
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
              <label
                htmlFor="q-explanation"
                className="block text-sm font-medium text-gray-700 mb-1">
                Explanation (Optional)
              </label>
              <textarea
                id="q-explanation"
                rows={2}
                value={questionData.explanation}
                onChange={(e) => handleChange("explanation", e.target.value)}
                placeholder="Explain why this is the correct answer..."
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="q-marks" className="block text-sm font-medium text-gray-700 mb-1">
                  Marks *
                </label>
                <input
                  id="q-marks"
                  type="number"
                  required
                  min={1}
                  value={questionData.marks}
                  onChange={(e) => handleChange("marks", Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label
                  htmlFor="q-difficulty"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty *
                </label>
                <select
                  id="q-difficulty"
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
                disabled={submitting}
                className="px-4 py-2 rounded-lg bg-green-800 text-white hover:bg-green-700 disabled:opacity-50 transition-colors">
                {submitting ? "Adding..." : "Add Question"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
