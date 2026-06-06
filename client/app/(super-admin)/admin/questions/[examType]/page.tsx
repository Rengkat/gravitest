"use client";

import { useMemo } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { Plus, Calendar, ChevronRight, Home } from "lucide-react";

import { ExamType } from "@/types/adminQuestions";
import { EXAM_META, getYearMeta } from "@/lib/mock/questionsMock";
import { EXAM_CONFIG, FORMAT_CONFIG, formatNumber } from "@/utils/config";

interface PageProps {
  params: { examType: string };
}

/**
 * Page 2 — Exam Type  /admin/questions/[examType]
 *
 * Changes from original ExamDrillDown:
 *  • "Browse by Subject" section REMOVED — it now lives on the
 *    Year-Subject page (/[examType]/[year]).
 *  • Clicking a year card routes to /admin/questions/[examType]/[year].
 *  • Breadcrumb is inline and uses Links for navigation.
 */
export default function ExamTypePage() {
  const { examType } = useParams();
  const meta = EXAM_META[examType];
  const cfg = EXAM_CONFIG[examType];

  if (!meta || !cfg) return notFound();

  const Icon = cfg.icon;
  const yearMeta = getYearMeta(examType);

  return (
    <div className="max-w-7xl mx-auto">
      {/* ── Breadcrumb ── */}
      <nav className="flex items-center gap-1.5 text-[13px] mb-6">
        <Home size={13} className="text-gray-400 shrink-0" />
        <ChevronRight size={13} className="text-gray-300 shrink-0" />
        <Link
          href="/admin/questions"
          className="text-gray-500 hover:text-green-800 transition-colors font-medium">
          Question Bank
        </Link>
        <ChevronRight size={13} className="text-gray-300 shrink-0" />
        <span className="font-semibold text-green-900">{meta.name}</span>
      </nav>

      {/* ── Page header ── */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-green-900 mb-1.5">{meta.name} Questions</h1>
          <p className="text-[14px] text-gray-500 max-w-2xl">{meta.description}</p>
        </div>
        <Link
          href="/admin/questions/create"
          className="flex items-center gap-2 px-5 py-3 bg-green-800 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-xl font-semibold text-[14px] shrink-0">
          <Plus size={18} />
          Add Question
        </Link>
      </div>

      {/* ── Exam-specific stats banner ── */}
      <div className={`bg-gradient-to-r ${cfg.bg} rounded-2xl p-6 text-white mb-6`}>
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

      {/* MCQ-only notice */}
      {meta.isMultipleChoiceOnly && (
        <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl mb-6">
          <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
          <p className="text-[13px] text-blue-700 font-medium">
            {meta.name} is <strong>MCQ only</strong> — all questions are multiple choice. Theory and
            Practical formats do not apply.
          </p>
        </div>
      )}

      {/* ── Years grid ── */}
      {/*
        Clicking a year navigates to /admin/questions/[examType]/[year].
        "Browse by Subject" has been REMOVED from this level.
      */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <Calendar size={18} className="text-green-700" />
          <h3 className="font-serif text-[18px] text-green-900">Browse by Year</h3>
          <span className="text-[12px] text-gray-400 ml-auto">{yearMeta.length} years of data</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {yearMeta.map(({ year, totalQuestions, byFormat }) => (
            <Link
              key={year}
              href={`/admin/questions/${examType}/${year}`}
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
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
