"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Trash2, Edit, Copy } from "lucide-react";
import type { Question } from "../../types";

interface QuestionItemProps {
  question: Question;
  index: number;
  onRemove: (questionId: string) => void;
}

export function QuestionItem({ question, index, onRemove }: QuestionItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "bg-green-100 text-green-700";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700";
      case "HARD":
        return "bg-orange-100 text-orange-700";
      case "VERY_HARD":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="px-6 py-4 hover:bg-cream/30 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-text-muted">Q{index + 1}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty.replace("_", " ")}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
              {question.type.replace("_", " ")}
            </span>
            <span className="text-xs text-text-muted">{question.marks} marks</span>
            <span className="text-sm text-gray-700 truncate">
              {question.questionText.length > 100
                ? `${question.questionText.substring(0, 100)}...`
                : question.questionText}
            </span>
          </div>
        </div>

        <div className="flex gap-1 ml-4">
          <button
            onClick={() => {
              /* Copy question */
            }}
            className="p-1.5 rounded-lg hover:bg-cream transition-colors"
            title="Duplicate">
            <Copy size={14} className="text-text-muted" />
          </button>
          <button
            onClick={() => {
              /* Edit question */
            }}
            className="p-1.5 rounded-lg hover:bg-cream transition-colors"
            title="Edit">
            <Edit size={14} className="text-text-muted" />
          </button>
          <button
            onClick={() => onRemove(question.id)}
            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
            title="Remove">
            <Trash2 size={14} className="text-red-500" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg hover:bg-cream transition-colors">
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-3 ml-8 p-4 rounded-lg bg-gray-50">
          <p className="text-gray-800 mb-3">{question.questionText}</p>

          {question.options && question.options.length > 0 && (
            <div className="space-y-1 mb-3">
              <p className="text-sm font-medium text-text-muted">Options:</p>
              {question.options.map((option, i) => (
                <div
                  key={i}
                  className={`text-sm px-3 py-1 rounded ${
                    option === question.correctAnswer
                      ? "bg-green-100 text-green-800 font-medium"
                      : "text-gray-700"
                  }`}>
                  {String.fromCharCode(65 + i)}. {option}
                  {option === question.correctAnswer && (
                    <span className="ml-2 text-xs text-green-600">✓ Correct</span>
                  )}
                </div>
              ))}
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
