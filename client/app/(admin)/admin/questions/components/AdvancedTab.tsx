"use client";

import { Plus, Trash2 } from "lucide-react";
import type { QuestionFormData, SubQuestion } from "@/types/creatQuestions";
import { Card, FieldLabel } from "./BasicInfoTab";

interface Props {
  formData: QuestionFormData;
  updateField: (field: keyof QuestionFormData, value: unknown) => void;
  addSubQuestion: () => void;
  updateSubQuestion: (id: string, updates: Partial<SubQuestion>) => void;
  removeSubQuestion: (id: string) => void;
}

export function AdvancedTab({
  formData,
  updateField,
  addSubQuestion,
  updateSubQuestion,
  removeSubQuestion,
}: Props) {
  return (
    <>
      {/* Sub-questions for MIXED */}
      {formData.format === "MIXED" && (
        <div
          className="p-6 rounded-2xl bg-white border"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl text-green-900">Sub-Questions</h2>
            <button
              type="button"
              onClick={addSubQuestion}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-800 text-white text-[13px] font-medium hover:bg-green-700 transition-all">
              <Plus size={14} />
              Add Sub-Question
            </button>
          </div>

          {formData.subQuestions.length === 0 ? (
            <div className="text-center py-8 text-[13px] text-text-muted">
              No sub-questions added. Sub-questions let you create multi-part questions.
            </div>
          ) : (
            <div className="space-y-4">
              {formData.subQuestions.map((sq) => (
                <div key={sq.id} className="p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[14px] font-semibold text-green-900">Part {sq.number}</h3>
                    <button
                      title="remove question"
                      type="button"
                      onClick={() => removeSubQuestion(sq.id)}
                      className="p-1.5 rounded hover:bg-red-50 transition-colors">
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <textarea
                      rows={2}
                      placeholder="Sub-question text…"
                      value={sq.text}
                      onChange={(e) => updateSubQuestion(sq.id, { text: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all resize-none"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-text-muted mb-1">Marks</label>
                        <input
                          title="marks"
                          type="number"
                          min="0"
                          value={sq.marks}
                          onChange={(e) =>
                            updateSubQuestion(sq.id, { marks: parseInt(e.target.value) || 0 })
                          }
                          className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-500/30"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-text-muted mb-1">Answer</label>
                        <input
                          type="text"
                          placeholder="Expected answer"
                          value={sq.answer ?? ""}
                          onChange={(e) => updateSubQuestion(sq.id, { answer: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-500/30"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Difficulty Rationale */}
      <Card title="Difficulty Rationale">
        <textarea
          rows={3}
          placeholder="Explain why this question is classified as easy/medium/hard…"
          value={formData.difficultyRationale}
          onChange={(e) => updateField("difficultyRationale", e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all resize-none"
        />
      </Card>

      {/* Adaptive Difficulty */}
      <div
        className="p-6 rounded-2xl bg-white border"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl text-green-900 mb-1">Adaptive Difficulty</h2>
            <p className="text-[13px] text-text-muted">
              Allow the system to adjust difficulty based on student performance
            </p>
          </div>
          <button
            title="dificulty"
            type="button"
            onClick={() => updateField("adaptiveDifficulty", !formData.adaptiveDifficulty)}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              formData.adaptiveDifficulty ? "bg-green-800" : "bg-gray-300"
            }`}>
            <div
              className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${
                formData.adaptiveDifficulty ? "translate-x-7" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>
    </>
  );
}
