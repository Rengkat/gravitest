"use client";

import { Save, FileText, Eye, Check, Zap } from "lucide-react";
import type { QuestionFormData } from "@/types/creatQuestions";
import { EXAM_CONFIGS, FORMAT_DETAILS, DIFFICULTY_MAP } from "@/lib/constants/createQuestion";

interface Props {
  formData: QuestionFormData;
  onPublish: () => void;
  onDraft: () => void;
  onPreview: () => void;
}

export function QuestionSidebar({ formData, onPublish, onDraft, onPreview }: Props) {
  const examConfig = formData.examType ? EXAM_CONFIGS[formData.examType] : null;
  const completion = calculateCompletion(formData);

  return (
    <div className="space-y-6 sticky top-6">
      {/* Summary Card */}
      <div
        className="p-6 rounded-2xl bg-white border"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <h2 className="font-serif text-lg text-green-900 mb-4">Question Summary</h2>

        <div className="space-y-3 mb-6">
          <SummaryRow label="Category" value={formData.examCategory || "—"} />
          <SummaryRow label="Exam" value={examConfig?.name ?? formData.examType ?? "—"} />
          <SummaryRow label="Year" value={formData.year || "—"} />
          <SummaryRow label="Subject" value={formData.subject || "—"} />
          <SummaryRow label="Format" value={FORMAT_DETAILS[formData.format]?.label ?? "—"} />
          <SummaryRow
            label="Difficulty"
            value={DIFFICULTY_MAP[formData.difficulty]?.label ?? "—"}
          />
          <SummaryRow label="Marks" value={String(formData.marks)} />
          <SummaryRow label="Time" value={`${formData.timeAllocation}s`} />
          <SummaryRow
            label="Options"
            value={formData.format === "MCQ" ? String(formData.options.length) : "N/A"}
          />
          <SummaryRow label="Diagrams" value={String(formData.diagrams.length)} />
          <SummaryRow label="Status" value={formData.status} />
        </div>

        {/* Completion */}
        <div className="mb-6">
          <div className="flex justify-between text-[12px] mb-1">
            <span className="text-text-muted">Completion</span>
            <span className="font-semibold text-green-900">{completion}%</span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-green-800 transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={onPublish}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-800 text-white font-semibold hover:bg-green-700 transition-all shadow-lg hover:shadow-xl">
            <Save size={16} />
            Publish Question
          </button>
          <button
            type="button"
            onClick={onDraft}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-200 text-text-muted font-semibold hover:bg-gray-50 transition-all">
            <FileText size={16} />
            Save as Draft
          </button>
          <button
            type="button"
            onClick={onPreview}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-200 text-text-muted font-semibold hover:bg-gray-50 transition-all">
            <Eye size={16} />
            Preview Question
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-green-800 to-green-700 text-white">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={18} />
          <h3 className="font-serif text-lg">Tips for Quality Questions</h3>
        </div>
        <ul className="space-y-2 text-[12px] text-white/80">
          {[
            "Use clear, unambiguous language",
            "Add diagrams for visual clarity",
            "Include detailed explanations",
            "Verify answers with subject experts",
            "Align with curriculum standards",
          ].map((tip) => (
            <li key={tip} className="flex items-start gap-2">
              <Check size={12} className="shrink-0 mt-0.5" />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[12px] text-text-muted">{label}</span>
      <span
        className={`text-[12px] font-semibold capitalize ${
          value === "—" ? "text-gray-300" : "text-green-900"
        }`}>
        {value}
      </span>
    </div>
  );
}

// ─── COMPLETION CALCULATOR ──────────────────────────────────
function calculateCompletion(data: QuestionFormData): number {
  const fields = [
    { value: data.examCategory, weight: 10 },
    { value: data.examType, weight: 10 },
    { value: data.year, weight: 5 },
    { value: data.subject, weight: 10 },
    { value: data.questionText.trim(), weight: 20 },
    { value: data.explanation.trim(), weight: 10 },
    { value: data.topic.trim(), weight: 5 },
  ];

  let total = fields.reduce((s, f) => s + f.weight, 0);
  let completed = fields.reduce((s, f) => s + (f.value ? f.weight : 0), 0);

  if (data.format === "MCQ") {
    total += 15;
    if (data.options.some((o) => o.isCorrect) && data.options.every((o) => o.text.trim())) {
      completed += 15;
    }
  }

  if (data.format === "THEORY") {
    total += 10;
    if (data.markingScheme.trim()) completed += 10;
  }

  total += 5;
  if (data.diagrams.length > 0) completed += 5;

  return total > 0 ? Math.round((completed / total) * 100) : 0;
}
