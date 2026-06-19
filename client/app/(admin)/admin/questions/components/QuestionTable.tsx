"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Eye,
  Edit,
  Copy,
  Trash2,
  Download,
  ArrowUpDown,
  BookOpen,
  Calendar,
  Tag,
  Hash,
  Clock,
  Target,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { Question, QuestionFilters, ExamType } from "@/types/adminQuestions";
import { getMockQuestions, EXAM_META, TOPICS_BY_SUBJECT } from "@/lib/mock/questionsMock";
import {
  FORMAT_CONFIG,
  DIFFICULTY_CONFIG,
  STATUS_CONFIG,
  EXAM_CONFIG,
  formatNumber,
} from "@/utils/config";

interface QuestionTableProps {
  filters: QuestionFilters;
  contextExamType?: ExamType;
  contextYear?: string;
  contextSubject?: string;
  contextTopic?: string;
  title?: string;
}

export default function QuestionTable({
  filters,
  contextExamType,
  contextYear,
  contextSubject,
  contextTopic,
  title,
}: QuestionTableProps) {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const PER_PAGE = 15;

  // Merge context locks into filters for the query
  const queryFilters = {
    examType: contextExamType ?? (filters.examType as ExamType | undefined),
    year: contextYear ?? filters.year,
    subject: contextSubject ?? filters.subject,
    topic: contextTopic ?? filters.topic,
    format: filters.format || undefined,
    difficulty: filters.difficulty || undefined,
    status: filters.status || undefined,
    searchQuery: filters.searchQuery,
    page,
    perPage: PER_PAGE,
  };

  const { questions, total } = getMockQuestions(queryFilters);
  const totalPages = Math.ceil(total / PER_PAGE);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === questions.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(questions.map((q) => q.id)));
    }
  };

  const allSelected = questions.length > 0 && selected.size === questions.length;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Table header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-[18px] text-green-900">{title ?? "Questions"}</h2>
          <p className="text-[12px] text-gray-500 mt-0.5">
            {formatNumber(total)} question{total !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selected.size > 0 && (
            <div className="flex items-center gap-2 mr-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-xl">
              <CheckCircle2 size={14} className="text-green-600" />
              <span className="text-[13px] font-semibold text-green-800">
                {selected.size} selected
              </span>
              <button className="text-[12px] text-red-500 hover:text-red-600 font-semibold ml-1">
                Delete
              </button>
            </div>
          )}
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] text-gray-600 hover:bg-gray-50 border border-gray-200 transition-colors">
            <Download size={14} /> Export
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] text-gray-600 hover:bg-gray-50 border border-gray-200 transition-colors">
            <ArrowUpDown size={14} /> Sort
          </button>
        </div>
      </div>

      {/* Question rows */}
      {questions.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-[15px] font-semibold">No questions found</p>
          <p className="text-[13px] mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          {/* Select-all row */}
          <div className="px-6 py-2 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              className="w-4 h-4 rounded accent-green-600"
            />
            <span className="text-[12px] text-gray-500 font-medium">Select all on this page</span>
          </div>

          <div className="divide-y divide-gray-50">
            {questions.map((question) => {
              const fmtCfg = FORMAT_CONFIG[question.format];
              const diffCfg = DIFFICULTY_CONFIG[question.difficulty];
              const statCfg = STATUS_CONFIG[question.status];
              const examCfg = EXAM_CONFIG[question.examType];
              const FmtIcon = fmtCfg.icon;
              const StatIcon = statCfg.icon;

              return (
                <div
                  key={question.id}
                  className={`px-6 py-5 hover:bg-gray-50/60 transition-colors ${
                    selected.has(question.id) ? "bg-green-50/40" : ""
                  }`}>
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selected.has(question.id)}
                      onChange={() => toggleSelect(question.id)}
                      className="w-4 h-4 rounded accent-green-600 mt-1 shrink-0"
                    />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Badges row */}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-[12px] font-bold text-gray-400 font-mono">
                          {question.id}
                        </span>

                        {/* Format */}
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${fmtCfg.bg} ${fmtCfg.border} border`}
                          style={{ color: fmtCfg.color }}>
                          <FmtIcon size={9} />
                          {fmtCfg.label}
                        </span>

                        {/* Difficulty */}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${diffCfg.bg} ${diffCfg.border} border`}
                          style={{ color: diffCfg.color }}>
                          {diffCfg.label}
                        </span>

                        {/* Status — only show if not active */}
                        {question.status !== "active" && (
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${statCfg.bg} ${statCfg.border} border`}
                            style={{ color: statCfg.color }}>
                            <StatIcon size={9} />
                            {statCfg.label}
                          </span>
                        )}

                        {/* Quality score */}
                        <span className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                          <Target size={10} />
                          {question.qualityScore}% quality
                        </span>

                        {/* Marks */}
                        <span className="text-[10px] text-gray-400 font-medium">
                          {question.marks} mark{question.marks !== 1 ? "s" : ""}
                        </span>
                      </div>

                      {/* Question text */}
                      <p className="text-[14px] text-green-900 font-medium leading-snug mb-3 line-clamp-2">
                        {question.question}
                      </p>

                      {/* MCQ options preview */}
                      {question.format === "MCQ" && question.options && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {question.options.map((opt, idx) => (
                            <span
                              key={idx}
                              className={`text-[11px] px-2.5 py-1 rounded-lg border ${
                                idx === question.correctAnswer
                                  ? "bg-green-50 border-green-300 text-green-700 font-bold"
                                  : "bg-gray-50 border-gray-200 text-gray-600"
                              }`}>
                              {idx === question.correctAnswer && <span className="mr-1">✓</span>}
                              {opt}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-400">
                        <span className="flex items-center gap-1">
                          <BookOpen size={11} />
                          {EXAM_META[question.examType]?.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Tag size={11} />
                          {question.subject}
                        </span>
                        <span className="flex items-center gap-1">
                          <Hash size={11} />
                          {question.topic}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {question.year}
                        </span>
                        <span className="flex items-center gap-1">
                          <Target size={11} />
                          {formatNumber(question.usageCount)} uses
                        </span>
                        <span className="flex items-center gap-1">
                          <Target size={11} />
                          {question.avgScore}% avg score
                        </span>
                        <span className="flex items-center gap-1 ml-auto">
                          <Clock size={11} />
                          Updated {question.updatedAt}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <Link
                        href={`/admin/questions/${question.id}`}
                        className="p-2 rounded-lg hover:bg-green-50 transition-colors group"
                        title="View">
                        <Eye size={16} className="text-gray-400 group-hover:text-green-700" />
                      </Link>
                      <Link
                        href={`/admin/questions/${question.id}/edit`}
                        className="p-2 rounded-lg hover:bg-blue-50 transition-colors group"
                        title="Edit">
                        <Edit size={16} className="text-gray-400 group-hover:text-blue-600" />
                      </Link>
                      <button
                        className="p-2 rounded-lg hover:bg-green-50 transition-colors group"
                        title="Duplicate"
                        onClick={() => alert(`TODO: Duplicate question ${question.id}`)}>
                        <Copy size={16} className="text-gray-400 group-hover:text-green-600" />
                      </button>
                      <button
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors group"
                        title="Delete"
                        onClick={() => {
                          if (confirm(`Delete question ${question.id}?`)) {
                            // TODO: call delete API
                          }
                        }}>
                        <Trash2 size={16} className="text-gray-400 group-hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-[13px] text-gray-500">
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, total)} of{" "}
              {formatNumber(total)} questions
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-[13px] text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft size={14} /> Prev
              </button>

              {/* Page numbers */}
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-[13px] font-medium transition-colors ${
                        page === pageNum
                          ? "bg-green-800 text-white"
                          : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}>
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && page < totalPages - 2 && (
                  <>
                    <span className="flex items-end text-gray-400 text-[13px] px-1">…</span>
                    <button
                      onClick={() => setPage(totalPages)}
                      className="w-8 h-8 rounded-lg text-[13px] border border-gray-200 text-gray-600 hover:bg-gray-50">
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-[13px] text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
