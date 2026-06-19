"use client";

import { useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  Link as LinkIcon,
  Image,
  Plus,
  X,
  Sparkles,
} from "lucide-react";
import type {
  QuestionFormData,
  QuestionOption,
  QuestionPart,
  SubPart,
} from "@/types/creatQuestions";
import { EXAM_CONFIGS } from "@/lib/constants/createQuestion";
import { Card, FieldLabel, FieldError } from "./BasicInfoTab";
import { MCQOptions } from "./MCQOptions";
import { StructuredTheoryQuestions } from "./StructuredTheoryQuestions";

interface Props {
  formData: QuestionFormData;
  errors: Record<string, string>;
  updateField: (field: keyof QuestionFormData, value: unknown) => void;
  // MCQ
  updateOption: (id: string, updates: Partial<QuestionOption>) => void;
  addOption: () => void;
  removeOption: (id: string) => void;
  moveOption: (id: string, dir: "up" | "down") => void;
  setCorrectAnswer: (id: string) => void;
  // Key points
  addKeyPoint: () => void;
  updateKeyPoint: (index: number, value: string) => void;
  removeKeyPoint: (index: number) => void;
  // Theory structured
  addTheoryQuestion: () => void;
  removeTheoryQuestion: (id: string) => void;
  addPart: (qId: string) => void;
  removePart: (qId: string, partId: string) => void;
  updatePart: (qId: string, partId: string, updates: Partial<QuestionPart>) => void;
  addSubPart: (qId: string, partId: string) => void;
  removeSubPart: (qId: string, partId: string, spId: string) => void;
  updateSubPart: (qId: string, partId: string, spId: string, updates: Partial<SubPart>) => void;
  // Hints
  addHint: () => void;
  updateHint: (index: number, value: string) => void;
  removeHint: (index: number) => void;
}

export function ContentTab({
  formData,
  errors,
  updateField,
  updateOption,
  addOption,
  removeOption,
  moveOption,
  setCorrectAnswer,
  addKeyPoint,
  updateKeyPoint,
  removeKeyPoint,
  addTheoryQuestion,
  removeTheoryQuestion,
  addPart,
  removePart,
  updatePart,
  addSubPart,
  removeSubPart,
  updateSubPart,
  addHint,
  updateHint,
  removeHint,
}: Props) {
  const qTextRef = useRef<HTMLTextAreaElement>(null);

  const examConfig = formData.examType ? EXAM_CONFIGS[formData.examType] : null;
  const supportsStructured = examConfig?.supportsStructuredQuestions ?? false;
  const isTheory = formData.format === "THEORY" || formData.format === "MIXED";
  const isPractical = formData.format === "PRACTICAL" || formData.format === "MIXED";

  return (
    <>
      {/* Question Text */}
      <Card title="Question Text">
        {/* Minimal toolbar */}
        <div className="mb-2 flex items-center gap-1 p-2 bg-gray-50 rounded-lg">
          {[
            { Icon: Bold, title: "Bold" },
            { Icon: Italic, title: "Italic" },
            { Icon: Underline, title: "Underline" },
          ].map(({ Icon, title }) => (
            <button
              key={title}
              type="button"
              title={title}
              className="p-1.5 rounded hover:bg-white transition-colors">
              <Icon size={14} className="text-text-muted" />
            </button>
          ))}
          <div className="w-px h-4 bg-gray-300 mx-1" />
          {[
            { Icon: List, title: "Bullet List" },
            { Icon: ListOrdered, title: "Numbered List" },
            { Icon: AlignLeft, title: "Align" },
          ].map(({ Icon, title }) => (
            <button
              key={title}
              type="button"
              title={title}
              className="p-1.5 rounded hover:bg-white transition-colors">
              <Icon size={14} className="text-text-muted" />
            </button>
          ))}
          <div className="w-px h-4 bg-gray-300 mx-1" />
          {[
            { Icon: LinkIcon, title: "Link" },
            { Icon: Image, title: "Image" },
          ].map(({ Icon, title }) => (
            <button
              key={title}
              type="button"
              title={title}
              className="p-1.5 rounded hover:bg-white transition-colors">
              <Icon size={14} className="text-text-muted" />
            </button>
          ))}
        </div>

        <textarea
          ref={qTextRef}
          rows={6}
          placeholder="Enter your question here. You can use markdown formatting…"
          value={formData.questionText}
          onChange={(e) => updateField("questionText", e.target.value)}
          className={`w-full px-4 py-3 rounded-xl border text-[14px] focus:outline-none focus:ring-2 transition-all resize-none ${
            errors.questionText
              ? "border-red-300 focus:ring-red-500/30"
              : "border-gray-200 focus:ring-green-500/30 focus:border-green-400"
          }`}
        />
        <FieldError msg={errors.questionText} />
      </Card>

      {/* MCQ Options */}
      {formData.format === "MCQ" && (
        <MCQOptions
          options={formData.options}
          errors={errors}
          onAdd={addOption}
          onRemove={removeOption}
          onUpdate={updateOption}
          onMove={moveOption}
          onSetCorrect={setCorrectAnswer}
        />
      )}

      {/* Theory — structured (WAEC/NECO-style) or simple */}
      {isTheory && (
        <>
          {supportsStructured ? (
            <StructuredTheoryQuestions
              questions={formData.theoryQuestions}
              onAddQuestion={addTheoryQuestion}
              onRemoveQuestion={removeTheoryQuestion}
              onAddPart={addPart}
              onRemovePart={removePart}
              onUpdatePart={updatePart}
              onAddSubPart={addSubPart}
              onRemoveSubPart={removeSubPart}
              onUpdateSubPart={updateSubPart}
            />
          ) : null}

          {/* Always show flat theory helpers */}
          <TheoryHelpers
            formData={formData}
            errors={errors}
            updateField={updateField}
            addKeyPoint={addKeyPoint}
            updateKeyPoint={updateKeyPoint}
            removeKeyPoint={removeKeyPoint}
          />
        </>
      )}

      {/* Practical fields */}
      {isPractical && <PracticalFields formData={formData} updateField={updateField} />}

      {/* Explanation */}
      <Card title="Explanation & Solution">
        <textarea
          rows={5}
          placeholder="Provide a detailed explanation of the solution…"
          value={formData.explanation}
          onChange={(e) => updateField("explanation", e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all resize-none"
        />
      </Card>

      {/* Hints */}
      <div
        className="p-6 rounded-2xl bg-white border"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl text-green-900">Hints</h2>
          <button
            type="button"
            onClick={addHint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-green-700 hover:bg-green-50 transition-colors">
            <Plus size={12} />
            Add Hint
          </button>
        </div>
        <div className="space-y-2">
          {formData.hints.map((hint, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                <Sparkles size={14} className="text-amber-600" />
              </span>
              <input
                type="text"
                placeholder={`Hint ${i + 1}`}
                value={hint}
                onChange={(e) => updateHint(i, e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all"
              />
              <button
                type="button"
                onClick={() => removeHint(i)}
                className="p-1.5 rounded hover:bg-red-50 transition-colors">
                <X size={14} className="text-red-400" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── THEORY HELPERS ──────────────────────────────────────────
function TheoryHelpers({
  formData,
  errors,
  updateField,
  addKeyPoint,
  updateKeyPoint,
  removeKeyPoint,
}: {
  formData: QuestionFormData;
  errors: Record<string, string>;
  updateField: (f: keyof QuestionFormData, v: unknown) => void;
  addKeyPoint: () => void;
  updateKeyPoint: (i: number, v: string) => void;
  removeKeyPoint: (i: number) => void;
}) {
  return (
    <div
      className="p-6 rounded-2xl bg-white border space-y-6"
      style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <h2 className="font-serif text-xl text-green-900">Theory Details</h2>

      <div>
        <FieldLabel>Word Limit</FieldLabel>
        <input
          title="word limit"
          type="number"
          min="50"
          max="5000"
          step="50"
          value={formData.wordLimit}
          onChange={(e) => updateField("wordLimit", parseInt(e.target.value) || 500)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all"
        />
      </div>

      <div>
        <FieldLabel required>Marking Scheme</FieldLabel>
        <textarea
          rows={4}
          placeholder="Describe how marks should be allocated…"
          value={formData.markingScheme}
          onChange={(e) => updateField("markingScheme", e.target.value)}
          className={`w-full px-4 py-3 rounded-xl border text-[14px] focus:outline-none focus:ring-2 transition-all resize-none ${
            errors.markingScheme
              ? "border-red-300 focus:ring-red-500/30"
              : "border-gray-200 focus:ring-green-500/30 focus:border-green-400"
          }`}
        />
        <FieldError msg={errors.markingScheme} />
      </div>

      <div>
        <FieldLabel>Sample Answer</FieldLabel>
        <textarea
          rows={4}
          placeholder="Provide a model answer for reference…"
          value={formData.sampleAnswer}
          onChange={(e) => updateField("sampleAnswer", e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all resize-none"
        />
      </div>

      {/* Key Points */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <FieldLabel>Key Points for Grading</FieldLabel>
          <button
            type="button"
            onClick={addKeyPoint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-green-700 hover:bg-green-50 transition-colors">
            <Plus size={12} />
            Add Point
          </button>
        </div>
        <div className="space-y-2">
          {formData.keyPoints.map((pt, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[12px] font-semibold text-text-muted w-6">{i + 1}.</span>
              <input
                type="text"
                placeholder={`Key point ${i + 1}`}
                value={pt}
                onChange={(e) => updateKeyPoint(i, e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all"
              />
              <button
                title="i"
                type="button"
                onClick={() => removeKeyPoint(i)}
                disabled={formData.keyPoints.length <= 1}
                className="p-1.5 rounded hover:bg-red-50 transition-colors disabled:opacity-30">
                <X size={14} className="text-red-400" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PRACTICAL FIELDS ────────────────────────────────────────
function PracticalFields({
  formData,
  updateField,
}: {
  formData: QuestionFormData;
  updateField: (f: keyof QuestionFormData, v: unknown) => void;
}) {
  return (
    <div
      className="p-6 rounded-2xl bg-white border space-y-6"
      style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <h2 className="font-serif text-xl text-green-900">Practical Details</h2>

      <div>
        <FieldLabel>Required Materials</FieldLabel>
        <textarea
          rows={3}
          placeholder="List all materials, equipment, and reagents needed…"
          value={formData.requiredMaterials}
          onChange={(e) => updateField("requiredMaterials", e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all resize-none"
        />
      </div>

      <div>
        <FieldLabel>Procedure</FieldLabel>
        <textarea
          rows={4}
          placeholder="Step-by-step procedure…"
          value={formData.procedure}
          onChange={(e) => updateField("procedure", e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all resize-none"
        />
      </div>

      <div>
        <FieldLabel>Expected Observations</FieldLabel>
        <textarea
          rows={3}
          placeholder="What should students observe or record…"
          value={formData.observations}
          onChange={(e) => updateField("observations", e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all resize-none"
        />
      </div>
    </div>
  );
}
