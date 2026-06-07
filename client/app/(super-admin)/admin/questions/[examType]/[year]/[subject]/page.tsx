"use client";

import { useState, useCallback, useMemo } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  ChevronRight,
  Home,
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
  CheckCircle2,
  X,
  Search,
  Filter,
  ChevronDown,
  Check,
} from "lucide-react";

import {
  ExamType,
  QuestionFilters,
  QuestionFormat,
  DifficultyLevel,
  QuestionStatus,
  Question,
  DEFAULT_FILTERS,
} from "@/types/adminQuestions";
import { getMockQuestions, EXAM_META } from "@/lib/mock/questionsMock";
import {
  FORMAT_CONFIG,
  DIFFICULTY_CONFIG,
  STATUS_CONFIG,
  EXAM_CONFIG,
  formatNumber,
} from "@/utils/config";

interface paramsProps {
  examType: string;
  year: string;
  subject: string;
}
// ─── View Modal ──────────────────────────────────────────────────────────────

function ViewModal({
  question,
  onClose,
  onStatusChange,
}: {
  question: Question;
  onClose: () => void;
  onStatusChange: (id: string, status: QuestionStatus) => void;
}) {
  const fmtCfg = FORMAT_CONFIG[question.format];
  const diffCfg = DIFFICULTY_CONFIG[question.difficulty];
  const statCfg = STATUS_CONFIG[question.status];
  const examMeta = EXAM_META[question.examType];

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h3 className="font-serif text-xl text-green-900">Question Details</h3>
          <button
            title="close"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[12px] font-bold text-gray-400 font-mono">{question.id}</span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${fmtCfg.bg} ${fmtCfg.border} border`}
              style={{ color: fmtCfg.color }}>
              {question.format}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${diffCfg.bg} ${diffCfg.border} border`}
              style={{ color: diffCfg.color }}>
              {diffCfg.label}
            </span>
            <span className="text-[11px] text-gray-500">{question.marks} marks</span>
          </div>

          {/* Question text */}
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
              Question
            </p>
            <p className="text-[15px] text-green-900 leading-relaxed">{question.question}</p>
          </div>

          {/* MCQ Options */}
          {question.format === "MCQ" && question.options && (
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                Options
              </p>
              <div className="space-y-2">
                {question.options.map((opt, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border text-[13px] flex items-center gap-2 ${
                      idx === question.correctAnswer
                        ? "border-green-400 bg-green-50 text-green-800 font-semibold"
                        : "border-gray-200 bg-gray-50 text-gray-700"
                    }`}>
                    <span className="font-bold text-[12px] shrink-0">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    {opt}
                    {idx === question.correctAnswer && (
                      <Check size={14} className="ml-auto text-green-600 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Meta */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
            {[
              { label: "Exam", value: examMeta?.name ?? question.examType },
              { label: "Year", value: question.year },
              { label: "Subject", value: question.subject },
              { label: "Topic", value: question.topic },
              { label: "Usage", value: `${formatNumber(question.usageCount)} uses` },
              { label: "Avg Score", value: `${question.avgScore}%` },
              { label: "Quality", value: `${question.qualityScore}%` },
              { label: "Updated", value: question.updatedAt },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {label}
                </p>
                <p className="text-[13px] text-green-900 font-medium">{value}</p>
              </div>
            ))}
          </div>

          {/* Status change */}
          <div className="pt-3 border-t border-gray-100">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
              Status
            </p>
            <div className="flex gap-2 flex-wrap">
              {(Object.entries(STATUS_CONFIG) as any[]).map(([key, cfg]) => {
                const StatusIcon = cfg.icon;
                const isActive = question.status === key;
                return (
                  <button
                    key={key}
                    onClick={() => onStatusChange(question.id, key as QuestionStatus)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[12px] font-semibold transition-all ${
                      isActive
                        ? `${cfg.bg} ${cfg.border} border`
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                    style={isActive ? { color: cfg.color } : {}}>
                    <StatusIcon size={12} />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Edit Modal ──────────────────────────────────────────────────────────────

function EditModal({
  question,
  onClose,
  onSave,
}: {
  question: Question;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Question>) => void;
}) {
  const [draft, setDraft] = useState({
    question: question.question,
    status: question.status,
    difficulty: question.difficulty,
    marks: question.marks,
  });

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h3 className="font-serif text-xl text-green-900">Edit Question</h3>
            <p className="text-[11px] text-gray-400 font-mono mt-0.5">{question.id}</p>
          </div>
          <button
            title="close"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Question text */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Question Text
            </label>
            <textarea
              title="draft"
              rows={4}
              value={draft.question}
              onChange={(e) => setDraft((d) => ({ ...d, question: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] text-green-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Difficulty */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Difficulty
              </label>
              <select
                title="difficulty"
                value={draft.difficulty}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, difficulty: e.target.value as DifficultyLevel }))
                }
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] bg-white focus:outline-none focus:border-green-500">
                {(Object.entries(DIFFICULTY_CONFIG) as any[]).map(([k, c]) => (
                  <option key={k} value={k}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Marks */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Marks
              </label>
              <input
                title="marks"
                type="number"
                min={1}
                max={20}
                value={draft.marks}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, marks: parseInt(e.target.value, 10) || 1 }))
                }
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] focus:outline-none focus:border-green-500"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Status
            </label>
            <div className="flex gap-2 flex-wrap">
              {(Object.entries(STATUS_CONFIG) as any[]).map(([key, cfg]) => {
                const StatusIcon = cfg.icon;
                const isActive = draft.status === key;
                return (
                  <button
                    key={key}
                    onClick={() => setDraft((d) => ({ ...d, status: key as QuestionStatus }))}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[12px] font-semibold transition-all ${
                      isActive
                        ? `${cfg.bg} ${cfg.border} border`
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                    style={isActive ? { color: cfg.color } : {}}>
                    <StatusIcon size={12} />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-[14px] text-gray-600 hover:bg-gray-50 font-semibold transition-colors">
              Cancel
            </button>
            <button
              onClick={() => {
                onSave(question.id, draft);
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-green-800 text-white text-[14px] font-semibold hover:bg-green-700 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

const FORMAT_TABS: { key: QuestionFormat | "ALL"; label: string }[] = [
  { key: "ALL", label: "All Formats" },
  { key: "MCQ", label: "MCQ" },
  { key: "THEORY", label: "Theory" },
  { key: "PRACTICAL", label: "Practical" },
  { key: "MIXED", label: "Mixed" },
];

export default function SubjectQuestionsPage() {
  const { examType, year, subject } = useParams() as unknown as paramsProps;
  // const year = params.year;
  // const subject = decodeURIComponent(params.subject);

  const meta = EXAM_META[examType];
  const cfg = EXAM_CONFIG[examType];
  if (!meta || !cfg) return notFound();

  // ── Format tab state ────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<QuestionFormat | "ALL">("ALL");

  // ── Filter state (RELOCATED from dashboard) ─────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterFormat, setFilterFormat] = useState<QuestionFormat | "">("");
  const [filterDifficulty, setFilterDifficulty] = useState<DifficultyLevel | "">("");
  const [filterStatus, setFilterStatus] = useState<QuestionStatus | "">("");

  // ── Modal state ─────────────────────────────────────────────────────────
  const [viewQuestion, setViewQuestion] = useState<Question | null>(null);
  const [editQuestion, setEditQuestion] = useState<Question | null>(null);

  // ── Local question overrides (for status/edit updates) ───────────────────
  const [overrides, setOverrides] = useState<Record<string, Partial<Question>>>({});

  // ── Pagination ───────────────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const PER_PAGE = 15;

  const activeFilterCount = [filterFormat, filterDifficulty, filterStatus].filter(Boolean).length;

  const filters: QuestionFilters = {
    ...DEFAULT_FILTERS,
    examType,
    year,
    subject,
    format: activeTab !== "ALL" ? activeTab : filterFormat || "",
    difficulty: filterDifficulty,
    status: filterStatus,
    searchQuery,
  };

  const { questions: rawQuestions, total } = getMockQuestions({
    ...filters,
    page,
    perPage: PER_PAGE,
  });

  // Apply local overrides
  const questions = rawQuestions.map((q) => (overrides[q.id] ? { ...q, ...overrides[q.id] } : q));

  const totalPages = Math.ceil(total / PER_PAGE);

  const handleStatusChange = useCallback((id: string, status: QuestionStatus) => {
    setOverrides((prev) => ({ ...prev, [id]: { ...prev[id], status } }));
    // Update the viewed question too
    setViewQuestion((q) => (q?.id === id ? { ...q, status } : q));
  }, []);

  const handleSave = useCallback((id: string, updates: Partial<Question>) => {
    setOverrides((prev) => ({ ...prev, [id]: { ...prev[id], ...updates } }));
  }, []);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const toggleAll = () => {
    setSelected(
      selected.size === questions.length ? new Set() : new Set(questions.map((q) => q.id)),
    );
  };

  // Supported formats for this exam type
  const supportedTabs = FORMAT_TABS.filter(
    (t) => t.key === "ALL" || meta.supportedFormats.includes(t.key as QuestionFormat),
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* ── Breadcrumb ── */}
      <nav className="flex items-center gap-1.5 text-[13px] mb-6 flex-wrap">
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
        <Link
          href={`/admin/questions/${examType}/${year}`}
          className="text-gray-500 hover:text-green-800 transition-colors font-medium">
          {year}
        </Link>
        <ChevronRight size={13} className="text-gray-300 shrink-0" />
        <span className="font-semibold text-green-900">{subject}</span>
      </nav>

      {/* ── Page header ── */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-green-900 mb-1.5">
            {subject} — {meta.name}
          </h1>
          <p className="text-[14px] text-gray-500 max-w-2xl">
            All {subject} questions in {meta.name} · {year}
          </p>
        </div>
        <Link
          href="/admin/questions/create"
          className="flex items-center gap-2 px-5 py-3 bg-green-800 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-xl font-semibold text-[14px] shrink-0">
          <Plus size={18} />
          Add Question
        </Link>
      </div>

      {/* ── RELOCATED: Search All Questions filter ── */}
      {/*
        Originally at the bottom of the main dashboard page.
        Now lives at the TOP of this Subject Questions page.
        Scoped to: Format, Difficulty, Status.
        Exam / Year / Subject are context-locked (not shown as filters).
      */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search questions, topics, IDs…"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
            />
            {searchQuery && (
              <button title='query'
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters((v) => !v)}
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
              onClick={() => {
                setFilterFormat("");
                setFilterDifficulty("");
                setFilterStatus("");
                setShowFilters(false);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-[14px] font-semibold transition-all">
              <X size={14} /> Clear
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Format filter */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Format
                </label>
                <select title='format'
                  value={filterFormat}
                  onChange={(e) => {
                    setFilterFormat(e.target.value as QuestionFormat | "");
                    setPage(1);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] bg-white focus:outline-none focus:border-green-500">
                  <option value="">All Formats</option>
                  {(Object.entries(FORMAT_CONFIG) as any[]).map(([k, c]) => (
                    <option key={k} value={k}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty filter */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Difficulty
                </label>
                <select title='difficulty'
                  value={filterDifficulty}
                  onChange={(e) => {
                    setFilterDifficulty(e.target.value as DifficultyLevel | "");
                    setPage(1);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] bg-white focus:outline-none focus:border-green-500">
                  <option value="">All Levels</option>
                  {(Object.entries(DIFFICULTY_CONFIG) as any[]).map(([k, c]) => (
                    <option key={k} value={k}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status filter */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Status
                </label>
                <select
                  title="filter"
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value as QuestionStatus | "");
                    setPage(1);
                  }}
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

      {/* ── Format Tabs ── */}
      {/*
        Formats handled as in-page tabs — no new routes created.
        Only formats supported by this exam type are shown.
      */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 overflow-x-auto">
        {supportedTabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => {
              setActiveTab(key);
              setPage(1);
            }}
            className={`flex-1 min-w-fit px-4 py-2 rounded-lg text-[13px] font-semibold transition-all whitespace-nowrap ${
              activeTab === key
                ? "bg-white text-green-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* ── Question Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-[18px] text-green-900">{subject} Questions</h2>
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

        {questions.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-[15px] font-semibold">No questions found</p>
            <p className="text-[13px] mt-1">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <>
            <div className="px-6 py-2 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
              <input
                title="toggle"
                type="checkbox"
                checked={selected.size === questions.length && questions.length > 0}
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
                const FmtIcon = fmtCfg.icon;
                const StatIcon = statCfg.icon;

                return (
                  <div
                    key={question.id}
                    className={`px-6 py-5 hover:bg-gray-50/60 transition-colors ${
                      selected.has(question.id) ? "bg-green-50/40" : ""
                    }`}>
                    <div className="flex items-start gap-4">
                      <input
                        title="toggle"
                        type="checkbox"
                        checked={selected.has(question.id)}
                        onChange={() => toggleSelect(question.id)}
                        className="w-4 h-4 rounded accent-green-600 mt-1 shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        {/* Badges */}
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="text-[12px] font-bold text-gray-400 font-mono">
                            {question.id}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${fmtCfg.bg} ${fmtCfg.border} border`}
                            style={{ color: fmtCfg.color }}>
                            <FmtIcon size={9} />
                            {fmtCfg.label}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${diffCfg.bg} ${diffCfg.border} border`}
                            style={{ color: diffCfg.color }}>
                            {diffCfg.label}
                          </span>
                          {question.status !== "active" && (
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${statCfg.bg} ${statCfg.border} border`}
                              style={{ color: statCfg.color }}>
                              <StatIcon size={9} />
                              {statCfg.label}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                            <Target size={10} />
                            {question.qualityScore}% quality
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">
                            {question.marks} mark{question.marks !== 1 ? "s" : ""}
                          </span>
                        </div>

                        {/* Question text */}
                        <p className="text-[14px] text-green-900 font-medium leading-snug mb-3 line-clamp-2">
                          {question.question}
                        </p>

                        {/* MCQ preview */}
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
                            <BookOpen size={11} /> {EXAM_META[question.examType]?.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Tag size={11} /> {question.subject}
                          </span>
                          <span className="flex items-center gap-1">
                            <Hash size={11} /> {question.topic}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={11} /> {question.year}
                          </span>
                          <span className="flex items-center gap-1 ml-auto">
                            <Clock size={11} /> Updated {question.updatedAt}
                          </span>
                        </div>
                      </div>

                      {/* ── Actions: Eye (View Modal) + Edit (Edit Modal) ── */}
                      <div className="flex items-center gap-1 shrink-0">
                        {/* Eye → opens View modal */}
                        <button
                          onClick={() => setViewQuestion(question)}
                          className="p-2 rounded-lg hover:bg-green-50 transition-colors group"
                          title="View">
                          <Eye size={16} className="text-gray-400 group-hover:text-green-700" />
                        </button>

                        {/* Pencil → opens Edit modal */}
                        <button
                          onClick={() => setEditQuestion(question)}
                          className="p-2 rounded-lg hover:bg-blue-50 transition-colors group"
                          title="Edit">
                          <Edit size={16} className="text-gray-400 group-hover:text-blue-600" />
                        </button>

                        <button
                          className="p-2 rounded-lg hover:bg-green-50 transition-colors group"
                          title="Duplicate"
                          onClick={() => alert(`TODO: Duplicate ${question.id}`)}>
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
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) pageNum = i + 1;
                    else if (page <= 3) pageNum = i + 1;
                    else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = page - 2 + i;
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

      {/* ── Modals ── */}
      {viewQuestion && (
        <ViewModal
          question={
            overrides[viewQuestion.id]
              ? { ...viewQuestion, ...overrides[viewQuestion.id] }
              : viewQuestion
          }
          onClose={() => setViewQuestion(null)}
          onStatusChange={handleStatusChange}
        />
      )}
      {editQuestion && (
        <EditModal
          question={
            overrides[editQuestion.id]
              ? { ...editQuestion, ...overrides[editQuestion.id] }
              : editQuestion
          }
          onClose={() => setEditQuestion(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
