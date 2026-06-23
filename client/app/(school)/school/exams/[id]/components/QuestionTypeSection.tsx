"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { QuestionItem } from "./QuestionItem";
import { QUESTION_TYPE_LABELS } from "../../types";
import type { Question, QuestionType } from "../../types";

interface QuestionTypeSectionProps {
  type: QuestionType;
  questions: Question[];
  onRemoveQuestion: (questionId: string) => void;
}

export function QuestionTypeSection({
  type,
  questions,
  onRemoveQuestion,
}: QuestionTypeSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
  const byTopic = questions.reduce<Record<string, number>>((acc, q) => {
    acc[q.topic] = (acc[q.topic] || 0) + 1;
    return acc;
  }, {});

  return (
    <div
      className="bg-white rounded-2xl border overflow-hidden"
      style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      {/* Section Header */}
      <button
        type="button"
        className="w-full px-6 py-4 bg-cream cursor-pointer flex items-center justify-between hover:bg-cream/70 transition-colors text-left"
        onClick={() => setIsExpanded((prev) => !prev)}>
        <div className="flex items-center gap-3">
          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          <h3 className="font-semibold text-green-900">{QUESTION_TYPE_LABELS[type]}</h3>
          <span className="text-sm text-text-muted">
            {questions.length} question{questions.length !== 1 ? "s" : ""} • {totalMarks} marks
          </span>
        </div>
        <div className="flex gap-2 text-xs text-text-muted flex-wrap justify-end">
          {Object.entries(byTopic).map(([topic, count]) => (
            <span key={topic} className="px-2 py-1 rounded bg-white">
              {topic}: {count}
            </span>
          ))}
        </div>
      </button>

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
