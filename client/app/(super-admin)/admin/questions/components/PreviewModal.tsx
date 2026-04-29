"use client";

import { X, Check } from "lucide-react";
import type { QuestionFormData } from "@/types/creatQuestions";
import { FORMAT_DETAILS, DIFFICULTY_MAP } from "@/lib/constants/createQuestion";

interface Props {
  formData: QuestionFormData;
  onClose: () => void;
}

export function PreviewModal({ formData, onClose }: Props) {
  const diffCfg = DIFFICULTY_MAP[formData.difficulty];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h3 className="font-serif text-xl text-green-900">Question Preview</h3>
          <button
            title="close"
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={20} className="text-text-muted" />
          </button>
        </div>

        <div className="p-6">
          {/* Badges */}
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-600">
              {FORMAT_DETAILS[formData.format]?.label}
            </span>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{ background: diffCfg?.bg, color: diffCfg?.text }}>
              {diffCfg?.label}
            </span>
            <span className="text-[12px] text-text-muted">
              {formData.marks} mark{formData.marks > 1 ? "s" : ""}
            </span>
            {formData.subject && (
              <span className="text-[12px] text-text-muted">· {formData.subject}</span>
            )}
          </div>

          {/* Question text */}
          <p className="text-[16px] text-green-900 mb-6 leading-relaxed">
            {formData.questionText || <em className="text-gray-400">No question text entered</em>}
          </p>

          {/* Diagrams */}
          {formData.diagrams.map((d) =>
            d.preview ? (
              <div key={d.id} className="mb-4">
                <img src={d.preview} alt={d.caption} className="w-full rounded-lg" />
                {d.caption && (
                  <p className="text-center text-[12px] text-text-muted mt-2">{d.caption}</p>
                )}
              </div>
            ) : null,
          )}

          {/* MCQ Options */}
          {formData.format === "MCQ" && (
            <div className="space-y-2">
              {formData.options.map((opt, i) => (
                <div
                  key={opt.id}
                  className={`p-3 rounded-lg border ${
                    opt.isCorrect ? "border-green-500 bg-green-50" : "border-gray-200"
                  }`}>
                  <span className="font-semibold text-[14px]">{String.fromCharCode(65 + i)}.</span>{" "}
                  <span className="text-[14px]">{opt.text || "(empty)"}</span>
                  {opt.isCorrect && <Check size={16} className="inline ml-2 text-green-600" />}
                </div>
              ))}
            </div>
          )}

          {/* Structured theory preview */}
          {(formData.format === "THEORY" || formData.format === "MIXED") &&
            formData.theoryQuestions.length > 0 && (
              <div className="space-y-4 mt-2">
                {formData.theoryQuestions.map((q) => (
                  <div key={q.id} className="border border-gray-100 rounded-xl overflow-hidden">
                    <div className="px-4 py-2 bg-green-50">
                      <span className="font-bold text-green-900 text-[14px]">
                        Question {q.number}
                      </span>
                    </div>
                    <div className="p-4 space-y-3">
                      {q.parts.map((p) => (
                        <div key={p.id}>
                          <p className="text-[14px] text-gray-800">
                            <span className="font-semibold text-green-800">({p.label})</span>{" "}
                            {p.text || <em className="text-gray-400">No text</em>}
                            {p.marks > 0 && (
                              <span className="ml-2 text-[11px] text-text-muted">
                                [{p.marks} mark{p.marks !== 1 ? "s" : ""}]
                              </span>
                            )}
                          </p>
                          {p.subParts.length > 0 && (
                            <div className="ml-6 mt-1 space-y-1">
                              {p.subParts.map((sp) => (
                                <p key={sp.id} className="text-[13px] text-gray-700">
                                  <span className="font-semibold text-green-700">({sp.label})</span>{" "}
                                  {sp.text || <em className="text-gray-400">No text</em>}
                                  {sp.marks > 0 && (
                                    <span className="ml-2 text-[11px] text-text-muted">
                                      [{sp.marks} mark{sp.marks !== 1 ? "s" : ""}]
                                    </span>
                                  )}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
