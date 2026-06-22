"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { QuestionItem } from "./QuestionItem";
import type { Question } from "../../types";

interface QuestionCategoryProps {
  category: string;
  questions: Question[];
  onRemoveQuestion: (questionId: string) => void;
}

export function QuestionCategory({ category, questions, onRemoveQuestion }: QuestionCategoryProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
  const byType = questions.reduce(
    (acc, q) => {
      acc[q.type] = (acc[q.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div
      className="bg-white rounded-2xl border overflow-hidden"
      style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      {/* Category Header */}
      <div
        className="px-6 py-4 bg-cream cursor-pointer flex items-center justify-between hover:bg-cream/70 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-3">
          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          <h3 className="font-semibold text-green-900">{category}</h3>
          <span className="text-sm text-text-muted">
            {questions.length} question{questions.length !== 1 ? "s" : ""} • {totalMarks} marks
          </span>
        </div>
        <div className="flex gap-2 text-xs text-text-muted">
          {Object.entries(byType).map(([type, count]) => (
            <span key={type} className="px-2 py-1 rounded bg-white">
              {type}: {count}
            </span>
          ))}
        </div>
      </div>

      {/* Questions */}
      {isExpanded && (
        <div className="divide-y divide-gray-100">
          {questions.map((question, index) => (
            <QuestionItem
              key={question.id}
              question={question}
              index={index}
              onRemove={onRemoveQuestion}
            />
          ))}
        </div>
      )}
    </div>
  );
}
