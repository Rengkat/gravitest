"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Trash2, Edit, Copy } from "lucide-react";
import type { DifficultyLevel, Question } from "../../types";

interface QuestionItemProps {
  question: Question;
  index: number;
  onRemove: (questionId: string) => void;
  onDuplicate?: (question: Question) => void;
  onEdit?: (question: Question) => void;
}

const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  EASY: "bg-green-100 text-green-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  HARD: "bg-orange-100 text-orange-700",
  VERY_HARD: "bg-red-100 text-red-700",
};

export function QuestionItem({
  question,
  index,
  onRemove,
  onDuplicate,
  onEdit,
}: QuestionItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="px-6 py-4 hover:bg-cream/30 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <button
          type="button"
          className="flex-1 text-left min-w-0"
          onClick={() => setIsExpanded((prev) => !prev)}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-text-muted">Q{index + 1}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${DIFFICULTY_COLORS[question.difficulty]}`}>
              {question.difficulty.replace("_", " ")}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
              {question.topic}
            </span>
            <span className="text-xs text-text-muted">{question.marks} marks</span>
            <span className="text-sm text-gray-700 truncate max-w-md">
              {question.questionText.length > 100
                ? `${question.questionText.slice(0, 100)}...`
                : question.questionText}
            </span>
          </div>
        </button>

        <div className="flex gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onDuplicate?.(question)}
            className="p-1.5 rounded-lg hover:bg-cream transition-colors"
            title="Duplicate">
            <Copy size={14} className="text-text-muted" />
          </button>
          <button
            type="button"
            onClick={() => onEdit?.(question)}
            className="p-1.5 rounded-lg hover:bg-cream transition-colors"
            title="Edit">
            <Edit size={14} className="text-text-muted" />
          </button>
          <button
            type="button"
            onClick={() => onRemove(question.id)}
            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
            title="Remove">
            <Trash2 size={14} className="text-red-500" />
          </button>
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            title={isExpanded ? "Collapse" : "Expand"}
            className="p-1.5 rounded-lg hover:bg-cream transition-colors">
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-3 ml-2 md:ml-8 p-4 rounded-lg bg-gray-50">
          <p className="text-gray-800 mb-3 whitespace-pre-wrap">{question.questionText}</p>

          {question.options && question.options.length > 0 && (
            <div className="space-y-1 mb-3">
              <p className="text-sm font-medium text-text-muted">Options:</p>
              {question.options.map((option, i) => {
                const isCorrect = Array.isArray(question.correctAnswer)
                  ? question.correctAnswer.includes(option)
                  : option === question.correctAnswer;
                return (
                  <div
                    key={`${question.id}-option-${i}`}
                    className={`text-sm px-3 py-1 rounded ${
                      isCorrect ? "bg-green-100 text-green-800 font-medium" : "text-gray-700"
                    }`}>
                    {String.fromCharCode(65 + i)}. {option}
                    {isCorrect && <span className="ml-2 text-xs text-green-600">✓ Correct</span>}
                  </div>
                );
              })}
            </div>
          )}

          {question.explanation && (
            <div className="mt-3 p-3 rounded-lg bg-blue-50">
              <p className="text-sm font-medium text-blue-800">Explanation:</p>
              <p className="text-sm text-blue-700">{question.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
