"use client";

import { Search, Filter, X, ChevronDown } from "lucide-react";
import {
  QuestionFilters,
  QuestionFormat,
  DifficultyLevel,
  QuestionStatus,
  ExamType,
} from "@/types/adminQuestions";
import { EXAM_META } from "@/lib/mock/questionsMock";
import { FORMAT_CONFIG, DIFFICULTY_CONFIG, STATUS_CONFIG } from "@/utils/config";

interface QuestionFiltersBarProps {
  filters: QuestionFilters;
  showFilters: boolean;
  activeFilterCount: number;
  onFiltersChange: (f: Partial<QuestionFilters>) => void;
  onToggleFilters: () => void;
  onClearFilters: () => void;
  // Context locks — when drilling down these are already set and hidden
  lockExamType?: boolean;
  lockYear?: boolean;
  lockSubject?: boolean;
  availableYears?: string[];
  availableSubjects?: string[];
  availableTopics?: string[];
}

const YEARS = Array.from({ length: 25 }, (_, i) => String(2025 - i));

export default function QuestionFiltersBar({
  filters,
  showFilters,
  activeFilterCount,
  onFiltersChange,
  onToggleFilters,
  onClearFilters,
  lockExamType,
  lockYear,
  lockSubject,
  availableYears = YEARS,
  availableSubjects = [],
  availableTopics = [],
}: QuestionFiltersBarProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions, topics, IDs…"
            value={filters.searchQuery}
            onChange={(e) => onFiltersChange({ searchQuery: e.target.value })}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
          />
          {filters.searchQuery && (
            <button
              title="Clear search"
              onClick={() => onFiltersChange({ searchQuery: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter toggle */}
        <button
          onClick={onToggleFilters}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[14px] font-semibold transition-all ${
            showFilters || activeFilterCount > 0
              ? "bg-green-800 text-white border-green-800 shadow-sm"
              : "border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}>
          <Filter size={15} />
          Filters
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-white/30 text-white text-[10px] font-black flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown
            size={13}
            className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
          />
        </button>

        {activeFilterCount > 0 && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-[14px] font-semibold transition-all">
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Exam type — only if not locked */}
            {!lockExamType && (
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Exam
                </label>
                <select
                  title="exam type"
                  value={filters.examType}
                  onChange={(e) => onFiltersChange({ examType: e.target.value as ExamType | "" })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] bg-white focus:outline-none focus:border-green-500">
                  <option value="">All Exams</option>
                  {(Object.entries(EXAM_META) as any[]).map(([key, m]) => (
                    <option key={key} value={key}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Year — only if not locked */}
            {!lockYear && (
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Year
                </label>
                <select
                  title="year"
                  value={filters.year}
                  onChange={(e) => onFiltersChange({ year: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] bg-white focus:outline-none focus:border-green-500">
                  <option value="">All Years</option>
                  {availableYears.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Subject — only if not locked */}
            {!lockSubject && availableSubjects.length > 0 && (
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Subject
                </label>
                <select
                  title="subject"
                  value={filters.subject}
                  onChange={(e) => onFiltersChange({ subject: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] bg-white focus:outline-none focus:border-green-500">
                  <option value="">All Subjects</option>
                  {availableSubjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Topic */}
            {availableTopics.length > 0 && (
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Topic
                </label>
                <select
                  title="topic"
                  value={filters.topic}
                  onChange={(e) => onFiltersChange({ topic: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] bg-white focus:outline-none focus:border-green-500">
                  <option value="">All Topics</option>
                  {availableTopics.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Format */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Format
              </label>
              <select
                title="format"
                value={filters.format}
                onChange={(e) => onFiltersChange({ format: e.target.value as QuestionFormat | "" })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] bg-white focus:outline-none focus:border-green-500">
                <option value="">All Formats</option>
                {(Object.entries(FORMAT_CONFIG) as any[]).map(([k, c]) => (
                  <option key={k} value={k}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Difficulty
              </label>
              <select
                title="difficulty"
                value={filters.difficulty}
                onChange={(e) =>
                  onFiltersChange({ difficulty: e.target.value as DifficultyLevel | "" })
                }
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] bg-white focus:outline-none focus:border-green-500">
                <option value="">All Levels</option>
                {(Object.entries(DIFFICULTY_CONFIG) as any[]).map(([k, c]) => (
                  <option key={k} value={k}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                title="status"
                value={filters.status}
                onChange={(e) => onFiltersChange({ status: e.target.value as QuestionStatus | "" })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] bg-white focus:outline-none focus:border-green-500">
                <option value="">All Status</option>
                {(Object.entries(STATUS_CONFIG) as any[]).map(([k, c]) => (
                  <option key={k} value={k}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
