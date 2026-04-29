"use client";

import { useState } from "react";
import { ChevronRight, GraduationCap, Briefcase } from "lucide-react";
import { ExamType, BreadcrumbLevel } from "@/types/adminQuestions";
import { EXAM_CATEGORIES, EXAM_META } from "@/lib/mock/questionsMock";
import { EXAM_CONFIG, FORMAT_CONFIG, formatNumber } from "@/utils/config";

interface ExamCategoryGridProps {
  onNavigate: (crumb: BreadcrumbLevel) => void;
}

export default function ExamCategoryGrid({ onNavigate }: ExamCategoryGridProps) {
  const [expandedExam, setExpandedExam] = useState<ExamType | null>(null);

  return (
    <div className="mb-8">
      <h2 className="font-serif text-xl text-green-900 mb-4">Exam Categories</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {EXAM_CATEGORIES.map((category) => {
          const CatIcon = category.id === "secondary" ? GraduationCap : Briefcase;
          const catGrad =
            category.id === "secondary"
              ? "from-green-500 to-emerald-600"
              : "from-purple-500 to-violet-600";

          return (
            <div
              key={category.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Category header */}
              <div className={`bg-gradient-to-r ${catGrad} p-5`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <CatIcon size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-white">{category.name}</h3>
                    <p className="text-[12px] text-white/70">
                      {category.examTypes.length} exam types ·{" "}
                      {formatNumber(category.totalQuestions)} questions
                    </p>
                  </div>
                </div>
                {/* Format mini-stats */}
                <div className="grid grid-cols-4 gap-2">
                  {(Object.entries(category.byFormat) as any[]).map(([fmt, count]) => {
                    const cfg = FORMAT_CONFIG[fmt as keyof typeof FORMAT_CONFIG];
                    if (!cfg) return null;
                    return (
                      <div key={fmt} className="text-center bg-white/10 rounded-xl py-2">
                        <div className="text-[14px] font-bold text-white">
                          {formatNumber(count as number)}
                        </div>
                        <div className="text-[10px] text-white/70">{fmt}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Exam list */}
              <div className="p-3 space-y-1">
                {category.examTypes.map((examType) => {
                  const meta = EXAM_META[examType];
                  const cfg = EXAM_CONFIG[examType];
                  const Icon = cfg.icon;
                  const isExpanded = expandedExam === examType;

                  return (
                    <div key={examType}>
                      <button
                        onClick={() => setExpandedExam(isExpanded ? null : examType)}
                        className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all ${
                          isExpanded
                            ? "bg-green-50 border border-green-100"
                            : "hover:bg-gray-50 border border-transparent"
                        }`}>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: `${cfg.color}18` }}>
                            <Icon size={17} style={{ color: cfg.color }} />
                          </div>
                          <div className="text-left">
                            <div className="text-[14px] font-semibold text-green-900">
                              {meta.name}
                              {meta.isMultipleChoiceOnly && (
                                <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                                  MCQ Only
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-gray-500">
                              {meta.fullName} · {meta.subjects.length} subjects
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[13px] font-bold text-green-900">
                            {formatNumber(meta.totalQuestions)}
                          </span>
                          <ChevronRight
                            size={15}
                            className={`text-gray-400 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                          />
                        </div>
                      </button>

                      {/* Expanded preview */}
                      {isExpanded && (
                        <div className="mx-3 mb-2 p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <p className="text-[12px] text-gray-500 mb-3">{meta.description}</p>

                          {/* Format buttons */}
                          <div className="grid grid-cols-2 gap-2 mb-3">
                            {meta.supportedFormats.map((fmt) => {
                              const fmtCfg = FORMAT_CONFIG[fmt];
                              const FmtIcon = fmtCfg.icon;
                              return (
                                <button
                                  key={fmt}
                                  onClick={() => onNavigate({ level: "exam", examType })}
                                  className={`flex items-center gap-2 px-3 py-2 rounded-lg ${fmtCfg.bg} ${fmtCfg.border} border hover:opacity-80 transition-all text-left`}>
                                  <FmtIcon size={13} style={{ color: fmtCfg.color }} />
                                  <span
                                    className="text-[12px] font-semibold"
                                    style={{ color: fmtCfg.color }}>
                                    {fmtCfg.label}
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Quick stats */}
                          <div className="flex gap-4 text-center mb-3">
                            {[
                              { label: "Years", value: meta.yearsCovered },
                              { label: "Subjects", value: meta.subjects.length },
                              { label: "Avg Quality", value: `${meta.avgQualityScore}%` },
                            ].map(({ label, value }) => (
                              <div
                                key={label}
                                className="flex-1 bg-white rounded-lg py-2 border border-gray-100">
                                <div className="text-[14px] font-bold text-green-900">{value}</div>
                                <div className="text-[10px] text-gray-500">{label}</div>
                              </div>
                            ))}
                          </div>

                          <button
                            onClick={() => onNavigate({ level: "exam", examType })}
                            className="w-full py-2 rounded-lg bg-green-800 text-white text-[13px] font-semibold hover:bg-green-700 transition-colors">
                            Browse {meta.name} Questions →
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
