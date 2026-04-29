"use client";

import { useMemo } from "react";
import { Calendar, BookOpen, Hash } from "lucide-react";
import { ExamType, BreadcrumbLevel } from "@/types/adminQuestions";
import { EXAM_META, getYearMeta, getSubjectMeta } from "@/lib/mock/questionsMock";
import { EXAM_CONFIG, FORMAT_CONFIG, formatNumber } from "@/utils/config";

interface ExamDrillDownProps {
  examType: ExamType;
  onNavigate: (crumb: BreadcrumbLevel) => void;
}

export default function ExamDrillDown({ examType, onNavigate }: ExamDrillDownProps) {
  const meta = EXAM_META[examType];
  const cfg = EXAM_CONFIG[examType];
  const Icon = cfg.icon;

  const yearMeta = useMemo(() => getYearMeta(examType), [examType]);
  const subjectMeta = useMemo(() => getSubjectMeta(examType), [examType]);

  return (
    <div className="space-y-6">
      {/* Exam header */}
      <div className={`bg-gradient-to-r ${cfg.bg} rounded-2xl p-6 text-white`}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
            <Icon size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-[22px] font-bold text-white">
              {meta.name} — {meta.fullName}
            </h2>
            <p className="text-[13px] text-white/70">{meta.description}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Questions", value: formatNumber(meta.totalQuestions) },
            { label: "Years Covered", value: `${meta.yearsCovered} years` },
            { label: "Subjects", value: meta.subjects.length },
            { label: "Avg Quality", value: `${meta.avgQualityScore}%` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/15 rounded-xl p-3 text-center">
              <div className="text-[18px] font-black text-white">{value}</div>
              <div className="text-[10px] text-white/70 font-medium">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Format note for MCQ-only exams */}
      {meta.isMultipleChoiceOnly && (
        <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
          <p className="text-[13px] text-blue-700 font-medium">
            {meta.name} is <strong>MCQ only</strong> — all questions are multiple choice. Theory and
            Practical formats do not apply.
          </p>
        </div>
      )}

      {/* Years grid */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <Calendar size={18} className="text-green-700" />
          <h3 className="font-serif text-[18px] text-green-900">Browse by Year</h3>
          <span className="text-[12px] text-gray-400 ml-auto">{yearMeta.length} years of data</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {yearMeta.map(({ year, totalQuestions, byFormat }) => (
            <button
              key={year}
              onClick={() => onNavigate({ level: "year", examType, year })}
              className="group p-4 rounded-xl border-2 border-gray-100 bg-white hover:border-green-700/40 hover:shadow-md transition-all text-left">
              <div className="text-[20px] font-black text-green-900 group-hover:text-green-700 mb-1">
                {year}
              </div>
              <div className="text-[12px] font-semibold text-gray-700 mb-2">
                {formatNumber(totalQuestions)} Qs
              </div>
              <div className="flex flex-wrap gap-1">
                {(Object.entries(byFormat) as any[]).map(([fmt, count]) => {
                  const fmtCfg = FORMAT_CONFIG[fmt as keyof typeof FORMAT_CONFIG];
                  if (!fmtCfg || !count) return null;
                  return (
                    <span
                      key={fmt}
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                      style={{ background: `${fmtCfg.color}18`, color: fmtCfg.color }}>
                      {fmt}
                    </span>
                  );
                })}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Subjects grid */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <BookOpen size={18} className="text-green-700" />
          <h3 className="font-serif text-[18px] text-green-900">Browse by Subject</h3>
          <span className="text-[12px] text-gray-400 ml-auto">{subjectMeta.length} subjects</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {subjectMeta.map(({ subject, totalQuestions, byFormat, avgQualityScore }) => (
            <button
              key={subject}
              onClick={() => onNavigate({ level: "subject", examType, subject })}
              className="group flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 bg-white hover:border-green-700/40 hover:shadow-md transition-all text-left">
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-green-900 group-hover:text-green-700 mb-1">
                  {subject}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(Object.entries(byFormat) as any[]).map(([fmt, count]) => {
                    const fmtCfg = FORMAT_CONFIG[fmt as keyof typeof FORMAT_CONFIG];
                    if (!fmtCfg || !count) return null;
                    return (
                      <span
                        key={fmt}
                        className="text-[10px] font-medium"
                        style={{ color: fmtCfg.color }}>
                        {fmt}: {count}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="text-right shrink-0 ml-3">
                <div className="text-[18px] font-black text-green-900">
                  {formatNumber(totalQuestions)}
                </div>
                <div className="text-[10px] text-gray-400">{avgQualityScore}% quality</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
