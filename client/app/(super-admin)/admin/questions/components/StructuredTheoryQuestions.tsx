"use client";

import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { TheoryQuestion, QuestionPart, SubPart } from "@/types/creatQuestions";
import { Card } from "./BasicInfoTab";

interface Props {
  questions: TheoryQuestion[];
  onAddQuestion: () => void;
  onRemoveQuestion: (id: string) => void;
  onAddPart: (questionId: string) => void;
  onRemovePart: (questionId: string, partId: string) => void;
  onUpdatePart: (questionId: string, partId: string, updates: Partial<QuestionPart>) => void;
  onAddSubPart: (questionId: string, partId: string) => void;
  onRemoveSubPart: (questionId: string, partId: string, subPartId: string) => void;
  onUpdateSubPart: (
    questionId: string,
    partId: string,
    subPartId: string,
    updates: Partial<SubPart>,
  ) => void;
}

export function StructuredTheoryQuestions({
  questions,
  onAddQuestion,
  onRemoveQuestion,
  onAddPart,
  onRemovePart,
  onUpdatePart,
  onAddSubPart,
  onRemoveSubPart,
  onUpdateSubPart,
}: Props) {
  return (
    <Card title="Structured Questions">
      <p className="text-[13px] text-text-muted -mt-4 mb-6">
        Build questions using the standard exam format — e.g.{" "}
        <span className="font-mono font-semibold text-green-800">1(a)(b)(i)(ii)</span>
      </p>

      <div className="space-y-4">
        {questions.map((q) => (
          <QuestionBlock
            key={q.id}
            question={q}
            onRemove={() => onRemoveQuestion(q.id)}
            onAddPart={() => onAddPart(q.id)}
            onRemovePart={(partId) => onRemovePart(q.id, partId)}
            onUpdatePart={(partId, updates) => onUpdatePart(q.id, partId, updates)}
            onAddSubPart={(partId) => onAddSubPart(q.id, partId)}
            onRemoveSubPart={(partId, spId) => onRemoveSubPart(q.id, partId, spId)}
            onUpdateSubPart={(partId, spId, updates) =>
              onUpdateSubPart(q.id, partId, spId, updates)
            }
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onAddQuestion}
        className="w-full mt-4 py-3 rounded-xl border-2 border-dashed border-gray-300 text-[13px] text-text-muted hover:border-green-800/30 hover:text-green-800 transition-all flex items-center justify-center gap-2">
        <Plus size={16} />
        Add Question {questions.length + 1}
      </button>
    </Card>
  );
}

// ─── QUESTION BLOCK ─────────────────────────────────────────
function QuestionBlock({
  question,
  onRemove,
  onAddPart,
  onRemovePart,
  onUpdatePart,
  onAddSubPart,
  onRemoveSubPart,
  onUpdateSubPart,
}: {
  question: TheoryQuestion;
  onRemove: () => void;
  onAddPart: () => void;
  onRemovePart: (partId: string) => void;
  onUpdatePart: (partId: string, updates: Partial<QuestionPart>) => void;
  onAddSubPart: (partId: string) => void;
  onRemoveSubPart: (partId: string, spId: string) => void;
  onUpdateSubPart: (partId: string, spId: string, updates: Partial<SubPart>) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="rounded-2xl border-2 border-green-100 bg-green-50/30 overflow-hidden">
      {/* Question header */}
      <div className="flex items-center justify-between px-5 py-3 bg-green-800">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold text-[15px]">
            {question.number}
          </span>
          <span className="text-white font-semibold text-[14px]">Question {question.number}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white">
            {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
          {question.number > 1 && (
            <button
              title="remove"
              type="button"
              onClick={onRemove}
              className="p-1.5 rounded-lg bg-red-500/30 hover:bg-red-500/50 transition-colors text-white">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {!collapsed && (
        <div className="p-4 space-y-3">
          {question.parts.map((part) => (
            <PartBlock
              key={part.id}
              questionNumber={question.number}
              part={part}
              onRemove={() => onRemovePart(part.id)}
              onUpdate={(updates) => onUpdatePart(part.id, updates)}
              onAddSubPart={() => onAddSubPart(part.id)}
              onRemoveSubPart={(spId) => onRemoveSubPart(part.id, spId)}
              onUpdateSubPart={(spId, updates) => onUpdateSubPart(part.id, spId, updates)}
              canRemove={question.parts.length > 1}
            />
          ))}

          <button
            type="button"
            onClick={onAddPart}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-green-300 text-[12px] text-green-700 hover:bg-green-50 transition-colors">
            <Plus size={13} />
            Add Part ({String.fromCharCode(96 + question.parts.length + 1)})
          </button>
        </div>
      )}
    </div>
  );
}

// ─── PART BLOCK ─────────────────────────────────────────────
function PartBlock({
  questionNumber,
  part,
  onRemove,
  onUpdate,
  onAddSubPart,
  onRemoveSubPart,
  onUpdateSubPart,
  canRemove,
}: {
  questionNumber: number;
  part: QuestionPart;
  onRemove: () => void;
  onUpdate: (updates: Partial<QuestionPart>) => void;
  onAddSubPart: () => void;
  onRemoveSubPart: (spId: string) => void;
  onUpdateSubPart: (spId: string, updates: Partial<SubPart>) => void;
  canRemove: boolean;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      {/* Part header */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
        <span className="text-[13px] font-bold text-green-800">
          {questionNumber}({part.label})
        </span>
        <div className="flex-1 flex items-center gap-3">
          <input
            type="text"
            placeholder={`Part (${part.label}) text…`}
            value={part.text}
            onChange={(e) => onUpdate({ text: e.target.value })}
            className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all"
          />
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] text-text-muted whitespace-nowrap">Marks:</span>
            <input
              title="marks"
              type="number"
              min="0"
              value={part.marks}
              onChange={(e) => onUpdate({ marks: parseInt(e.target.value) || 0 })}
              className="w-16 px-2 py-1.5 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-500/30 text-center"
            />
          </div>
        </div>
        {canRemove && (
          <button
            title="remove"
            type="button"
            onClick={onRemove}
            className="p-1 rounded hover:bg-red-50 transition-colors">
            <Trash2 size={13} className="text-red-400" />
          </button>
        )}
      </div>

      {/* Model answer for this part */}
      <div className="px-4 pt-3 pb-2">
        <textarea
          rows={2}
          placeholder="Model / expected answer for this part (optional)…"
          value={part.answer ?? ""}
          onChange={(e) => onUpdate({ answer: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all resize-none"
        />
      </div>

      {/* Sub-parts */}
      {part.subParts.length > 0 && (
        <div className="px-4 pb-2 space-y-2">
          {part.subParts.map((sp) => (
            <SubPartRow
              key={sp.id}
              questionNumber={questionNumber}
              partLabel={part.label}
              sp={sp}
              onRemove={() => onRemoveSubPart(sp.id)}
              onUpdate={(updates) => onUpdateSubPart(sp.id, updates)}
              canRemove={part.subParts.length > 0}
            />
          ))}
        </div>
      )}

      {/* Add sub-part */}
      <div className="px-4 pb-3">
        <button
          type="button"
          onClick={onAddSubPart}
          className="flex items-center gap-1.5 text-[11px] text-green-700 hover:text-green-800 transition-colors font-medium">
          <Plus size={12} />
          Add sub-part ({part.subParts.length === 0 ? "i" : nextRoman(part.subParts.length)})
        </button>
      </div>
    </div>
  );
}

// ─── SUB-PART ROW ────────────────────────────────────────────
function SubPartRow({
  questionNumber,
  partLabel,
  sp,
  onRemove,
  onUpdate,
  canRemove,
}: {
  questionNumber: number;
  partLabel: string;
  sp: SubPart;
  onRemove: () => void;
  onUpdate: (updates: Partial<SubPart>) => void;
  canRemove: boolean;
}) {
  return (
    <div className="ml-4 rounded-lg border border-gray-100 bg-gray-50/60 overflow-hidden">
      <div className="flex items-center gap-3 px-3 py-2">
        <span className="text-[12px] font-bold text-green-700 whitespace-nowrap">
          {questionNumber}({partLabel})({sp.label})
        </span>
        <input
          type="text"
          placeholder={`Sub-part (${sp.label}) text…`}
          value={sp.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
          className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-[12px] focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all bg-white"
        />
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] text-text-muted">Marks:</span>
          <input
            title="update"
            type="number"
            min="0"
            value={sp.marks}
            onChange={(e) => onUpdate({ marks: parseInt(e.target.value) || 0 })}
            className="w-14 px-2 py-1.5 rounded-lg border border-gray-200 text-[12px] focus:outline-none text-center bg-white"
          />
        </div>
        {canRemove && (
          <button
            title="remove"
            type="button"
            onClick={onRemove}
            className="p-1 rounded hover:bg-red-50 transition-colors">
            <Trash2 size={12} className="text-red-400" />
          </button>
        )}
      </div>
      <div className="px-3 pb-2">
        <input
          type="text"
          placeholder="Expected answer (optional)…"
          value={sp.answer ?? ""}
          onChange={(e) => onUpdate({ answer: e.target.value })}
          className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-[12px] focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all bg-white"
        />
      </div>
    </div>
  );
}

// ─── HELPER ─────────────────────────────────────────────────
const ROMAN = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];
const nextRoman = (count: number) => ROMAN[count] ?? `${count + 1}`;
