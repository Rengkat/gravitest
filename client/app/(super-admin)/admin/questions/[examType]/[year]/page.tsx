"use client";

import { useMemo } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { Plus, BookOpen, ChevronRight, Home } from "lucide-react";

import { ExamType } from "@/types/adminQuestions";
import { EXAM_META, getYearMeta, getSubjectMeta } from "@/lib/mock/questionsMock";
import { EXAM_CONFIG, FORMAT_CONFIG, formatNumber } from "@/utils/config";

interface PageProps {
  params: { examType: string; year: string };
}

/**
 * Page 3 — Year-Subject  /admin/questions/[examType]/[year]
 *
 * What's new at this level:
 *  • Statistics scoped to this exam type + year combination.
 *  • "Browse by Subject" grid — RELOCATED from ExamDrillDown (exam level).
 *    Clicking a subject routes to /admin/questions/[examType]/[year]/[subject].
 */
export default function YearSubjectPage() {
  const { examType, year } = useParams();

  const meta = EXAM_META[examType];
  const cfg = EXAM_CONFIG[examType];

  if (!meta || !cfg) return notFound();

  // Year-level stats
  const allYearMeta = getYearMeta(examType);
  const yearData = allYearMeta.find((y) => y.year === year);
  if (!yearData) return notFound();

  // Subject-level stats (we scope to this year conceptually — using full subject meta
  // as mock data doesn't have per-year subject breakdown)
  const subjectMeta = getSubjectMeta(examType);

  const Icon = cfg.icon;

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
        <Link
          href={`/admin/questions/${examType}`}
          className="text-gray-500 hover:text-green-800 transition-colors font-medium">
          {meta.name}
        </Link>
        <ChevronRight size={13} className="text-gray-300 shrink-0" />
        <span className="font-semibold text-green-900">{year}</span>
      </nav>

      {/* ── Page header ── */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-green-900 mb-1.5">
            {meta.name} · {year}
          </h1>
          <p className="text-[14px] text-gray-500 max-w-2xl">
            All questions from the {year} {meta.name} examination.
          </p>
        </div>
        <Link
          href="/admin/questions/create"
          className="flex items-center gap-2 px-5 py-3 bg-green-800 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-xl font-semibold text-[14px] shrink-0">
          <Plus size={18} />
          Add Question
        </Link>
      </div>

      {/* ── Year-scoped statistics ── */}
      <div className={`bg-gradient-to-r ${cfg.bg} rounded-2xl p-6 text-white mb-6`}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
            <Icon size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-[20px] font-bold text-white">
              {meta.name} {year} — Statistics
            </h2>
            <p className="text-[13px] text-white/70">{meta.fullName}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Questions", value: formatNumber(yearData.totalQuestions) },
            { label: "Subjects", value: subjectMeta.length },
            {
              label: "Formats",
              value: Object.values(yearData.byFormat).filter(Boolean).length,
            },
            { label: "Avg Quality", value: `${meta.avgQualityScore}%` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/15 rounded-xl p-3 text-center">
              <div className="text-[18px] font-black text-white">{value}</div>
              <div className="text-[10px] text-white/70 font-medium">{label}</div>
            </div>
          ))}
        </div>

        {/* Format breakdown for this year */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
          {(Object.entries(yearData.byFormat) as any[]).map(([fmt, count]) => {
            const fmtCfg = FORMAT_CONFIG[fmt as keyof typeof FORMAT_CONFIG];
            if (!fmtCfg || !count) return null;
            return (
              <div key={fmt} className="bg-white/10 rounded-xl py-2 text-center">
                <div className="text-[14px] font-bold text-white">
                  {formatNumber(count as number)}
                </div>
                <div className="text-[10px] text-white/70">{fmt}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Browse by Subject ── */}
      {/*
        RELOCATED from ExamDrillDown (was at exam level).
        Now scoped to this specific year.
        Clicking a subject → /admin/questions/[examType]/[year]/[subject]
      */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <BookOpen size={18} className="text-green-700" />
          <h3 className="font-serif text-[18px] text-green-900">Browse by Subject</h3>
          <span className="text-[12px] text-gray-400 ml-auto">{subjectMeta.length} subjects</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {subjectMeta.map(({ subject, totalQuestions, byFormat, avgQualityScore }) => (
            <Link
              key={subject}
              href={`/admin/questions/${examType}/${year}/${encodeURIComponent(subject)}`}
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
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
