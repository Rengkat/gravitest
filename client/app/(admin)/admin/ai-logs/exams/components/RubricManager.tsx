"use client";

import { useState } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronUp,
  Save,
  X,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import type { ScoringCriteria } from "../../types";

// No dedicated "Rubric" entity exists in the backend yet — this manages
// named templates of ScoringCriteria[] that the AI grader can be configured
// to apply per subject/exam. Frontend-only until the rubric endpoints exist.
interface RubricTemplate {
  id: string;
  name: string;
  subject: string;
  examType: string;
  description: string;
  criteria: ScoringCriteria[];
  isActive: boolean;
  lastUpdated: string;
}

const MOCK_RUBRICS: RubricTemplate[] = [
  {
    id: "r1",
    name: "WAEC Essay Rubric",
    subject: "English Language",
    examType: "WAEC",
    description:
      "Standard rubric for WAEC English essay questions covering content, language use, and mechanics.",
    isActive: true,
    lastUpdated: "2025-04-10",
    criteria: [
      {
        criterion: "Content & Ideas",
        maxPoints: 8,
        awardedPoints: 0,
        feedback: "Relevance, depth, and originality of ideas.",
      },
      {
        criterion: "Organisation",
        maxPoints: 4,
        awardedPoints: 0,
        feedback: "Logical structure, paragraphing, coherence.",
      },
      {
        criterion: "Language Use",
        maxPoints: 5,
        awardedPoints: 0,
        feedback: "Vocabulary range, sentence variety, expression.",
      },
      {
        criterion: "Mechanics",
        maxPoints: 3,
        awardedPoints: 0,
        feedback: "Spelling, punctuation, grammar accuracy.",
      },
    ],
  },
  {
    id: "r2",
    name: "JAMB Physics Calculation",
    subject: "Physics",
    examType: "JAMB",
    description: "Rubric for structured Physics calculation questions requiring method and answer.",
    isActive: true,
    lastUpdated: "2025-03-22",
    criteria: [
      {
        criterion: "Formula Selection",
        maxPoints: 2,
        awardedPoints: 0,
        feedback: "Correct formula identified and stated.",
      },
      {
        criterion: "Substitution",
        maxPoints: 3,
        awardedPoints: 0,
        feedback: "Correct values substituted into formula.",
      },
      {
        criterion: "Working",
        maxPoints: 3,
        awardedPoints: 0,
        feedback: "Clear step-by-step working shown.",
      },
      {
        criterion: "Final Answer",
        maxPoints: 2,
        awardedPoints: 0,
        feedback: "Correct numerical answer with appropriate unit.",
      },
    ],
  },
];

const inputCls =
  "w-full px-3 py-2 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-500/30 text-green-900";

export function RubricManager() {
  const [rubrics, setRubrics] = useState<RubricTemplate[]>(MOCK_RUBRICS);
  const [expandedId, setExpandedId] = useState<string | null>(MOCK_RUBRICS[0]?.id ?? null);
  const [showNew, setShowNew] = useState(false);
  const [newRubric, setNewRubric] = useState<Partial<RubricTemplate>>({
    name: "",
    subject: "",
    examType: "",
    description: "",
  });

  const toggleExpand = (id: string) => setExpandedId((prev) => (prev === id ? null : id));
  const handleDelete = (id: string) => setRubrics((prev) => prev.filter((r) => r.id !== id));
  const handleToggleActive = (id: string) =>
    setRubrics((prev) => prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r)));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-lg text-green-900">Grading Rubrics</h3>
          <p className="text-[12px] text-text-muted mt-0.5">
            {rubrics.filter((r) => r.isActive).length} active rubric
            {rubrics.filter((r) => r.isActive).length !== 1 ? "s" : ""} used by the AI grader
          </p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-800 text-white text-[13px] font-semibold hover:bg-green-700 transition-all">
          <Plus size={14} /> New Rubric
        </button>
      </div>

      {rubrics.map((rubric) => {
        const isExpanded = expandedId === rubric.id;
        const totalPoints = rubric.criteria.reduce((s, c) => s + c.maxPoints, 0);
        return (
          <div
            key={rubric.id}
            className="bg-white rounded-2xl border overflow-hidden"
            style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <div
              className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-cream/20"
              onClick={() => toggleExpand(rubric.id)}>
              <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                <BookOpen size={16} className="text-green-700" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[14px] font-semibold text-green-900">{rubric.name}</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-700">
                    {rubric.examType}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-green-50 text-green-700">
                    {rubric.subject}
                  </span>
                  {!rubric.isActive && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-gray-100 text-gray-500">
                      Inactive
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-text-muted mt-0.5 truncate">{rubric.description}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-bold text-green-900">{totalPoints} pts</span>
                {isExpanded ? (
                  <ChevronUp size={15} className="text-text-muted" />
                ) : (
                  <ChevronDown size={15} className="text-text-muted" />
                )}
              </div>
            </div>

            {isExpanded && (
              <div
                className="border-t px-5 py-4 space-y-4"
                style={{ borderColor: "rgba(30,80,50,0.06)" }}>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-3">
                    Criteria
                  </h4>
                  <div className="space-y-2">
                    {rubric.criteria.map((c, i) => (
                      <div key={i} className="p-3 rounded-xl bg-cream border border-gray-100">
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={13} className="text-green-600 shrink-0 mt-0.5" />
                            <span className="text-[13px] font-semibold text-green-900">
                              {c.criterion}
                            </span>
                          </div>
                          <span className="text-[12px] font-bold text-green-900 shrink-0">
                            {c.maxPoints} pts
                          </span>
                        </div>
                        <p className="text-[11px] text-text-muted ml-5">{c.feedback}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t"
                  style={{ borderColor: "rgba(30,80,50,0.06)" }}>
                  <p className="text-[10px] text-text-muted">Updated {rubric.lastUpdated}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleActive(rubric.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-all ${
                        rubric.isActive
                          ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                          : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                      }`}>
                      {rubric.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-[12px] text-green-900 hover:bg-cream transition-all">
                      <Edit3 size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(rubric.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-100 bg-red-50 text-red-600 text-[12px] hover:bg-red-100 transition-all">
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {showNew && (
        <div
          className="bg-white rounded-2xl border p-6"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg text-green-900">New Rubric</h3>
            <button
              title="Close"
              onClick={() => setShowNew(false)}
              className="p-1.5 rounded-lg hover:bg-cream text-text-muted">
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-text-muted mb-1">
                Rubric Name *
              </label>
              <input
                type="text"
                className={inputCls}
                value={newRubric.name ?? ""}
                onChange={(e) => setNewRubric((n) => ({ ...n, name: e.target.value }))}
                placeholder="e.g., NECO Chemistry Rubric"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-text-muted mb-1">
                Subject
              </label>
              <input
                type="text"
                className={inputCls}
                value={newRubric.subject ?? ""}
                onChange={(e) => setNewRubric((n) => ({ ...n, subject: e.target.value }))}
                placeholder="e.g., Chemistry"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-text-muted mb-1">
                Exam Type
              </label>
              <input
                type="text"
                className={inputCls}
                value={newRubric.examType ?? ""}
                onChange={(e) => setNewRubric((n) => ({ ...n, examType: e.target.value }))}
                placeholder="e.g., NECO"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-text-muted mb-1">
              Description
            </label>
            <textarea
              title="Optional description of the rubric"
              placeholder="Optional description of the rubric"
              className={`${inputCls} resize-none`}
              rows={2}
              value={newRubric.description ?? ""}
              onChange={(e) => setNewRubric((n) => ({ ...n, description: e.target.value }))}
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                if (!newRubric.name?.trim()) return;
                setRubrics((prev) => [
                  ...prev,
                  {
                    id: `r${Date.now()}`,
                    name: newRubric.name!,
                    subject: newRubric.subject ?? "",
                    examType: newRubric.examType ?? "",
                    description: newRubric.description ?? "",
                    criteria: [],
                    isActive: false,
                    lastUpdated: new Date().toISOString().split("T")[0],
                  },
                ]);
                setShowNew(false);
                setNewRubric({ name: "", subject: "", examType: "", description: "" });
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-800 text-white text-[13px] font-semibold hover:bg-green-700 transition-all">
              <Save size={13} /> Create Rubric
            </button>
            <button
              onClick={() => setShowNew(false)}
              className="px-4 py-2 rounded-lg border border-gray-200 text-[13px] hover:bg-cream transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
