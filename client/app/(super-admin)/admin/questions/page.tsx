"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import {
  BreadcrumbLevel,
  ExamType,
  QuestionFilters,
  DEFAULT_FILTERS,
} from "@/types/adminQuestions";
import {
  EXAM_META,
  TOPICS_BY_SUBJECT,
  getYearMeta,
  getSubjectMeta,
} from "@/lib/mock/questionsMock";

import Breadcrumb from "./components/Breadcrumb";
import BankStatsPanel from "./components/BankStatsPanel";
import ExamCategoryGrid from "./components/ExamCategoryGrid";
import ExamDrillDown from "./components/ExamDrillDown";
import SubjectDrillDown from "./components/SubjectDrillDown";
import QuestionFiltersBar from "./components/QuestionFiltersBar";
import QuestionTable from "./components/QuestionTable";

export default function AdminQuestionsPage() {
  // ── Navigation state ────────────────────────────────────────────────────
  const [crumb, setCrumb] = useState<BreadcrumbLevel>({ level: "overview" });

  // ── Filter state ────────────────────────────────────────────────────────
  const [filters, setFilters] = useState<QuestionFilters>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);

  // ── Derived context from current crumb ──────────────────────────────────
  const contextExamType: ExamType | undefined =
    crumb.level !== "overview" && "examType" in crumb ? crumb.examType : undefined;

  const contextYear: string | undefined = crumb.level === "year" ? crumb.year : undefined;

  const contextSubject: string | undefined =
    crumb.level === "subject" || crumb.level === "topic" ? crumb.subject : undefined;

  const contextTopic: string | undefined = crumb.level === "topic" ? crumb.topic : undefined;

  // ── Available options for filter dropdowns (context-aware) ──────────────
  const availableYears = useMemo(
    () => (contextExamType ? getYearMeta(contextExamType).map((y) => y.year) : []),
    [contextExamType],
  );

  const availableSubjects = useMemo(
    () => (contextExamType ? EXAM_META[contextExamType].subjects : []),
    [contextExamType],
  );

  const availableTopics = useMemo(
    () => (contextSubject ? (TOPICS_BY_SUBJECT[contextSubject] ?? []) : []),
    [contextSubject],
  );

  // ── Active filter count (excluding context-locked ones) ─────────────────
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (!contextExamType && filters.examType) count++;
    if (!contextYear && filters.year) count++;
    if (!contextSubject && filters.subject) count++;
    if (!contextTopic && filters.topic) count++;
    if (filters.format) count++;
    if (filters.difficulty) count++;
    if (filters.status) count++;
    return count;
  }, [filters, contextExamType, contextYear, contextSubject, contextTopic]);

  // ── Handlers ────────────────────────────────────────────────────────────
  const navigate = useCallback((next: BreadcrumbLevel) => {
    setCrumb(next);
    // Reset only the filters that are now context-locked
    setFilters((prev) => ({
      ...DEFAULT_FILTERS,
      searchQuery: prev.searchQuery, // preserve search across navigation
    }));
    setShowFilters(false);
  }, []);

  const updateFilters = useCallback((partial: Partial<QuestionFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setShowFilters(false);
  }, []);

  // ── Page title logic ────────────────────────────────────────────────────
  const pageTitle = useMemo(() => {
    if (crumb.level === "overview") return "Question Bank";
    if (crumb.level === "exam" && "examType" in crumb)
      return `${EXAM_META[crumb.examType].name} Questions`;
    if (crumb.level === "year" && "year" in crumb)
      return `${EXAM_META[(crumb as any).examType].name} · ${(crumb as any).year}`;
    if (crumb.level === "subject" && "subject" in crumb)
      return `${(crumb as any).subject} — ${EXAM_META[(crumb as any).examType].name}`;
    if (crumb.level === "topic" && "topic" in crumb)
      return `${(crumb as any).topic} · ${(crumb as any).subject}`;
    return "Question Bank";
  }, [crumb]);

  const pageSubtitle = useMemo(() => {
    if (crumb.level === "overview")
      return "Manage and organise past questions across all exam types, years, and subjects.";
    if (crumb.level === "exam" && "examType" in crumb) return EXAM_META[crumb.examType].description;
    if (crumb.level === "year")
      return `All questions from the ${(crumb as any).year} ${EXAM_META[(crumb as any).examType].name} examination.`;
    if (crumb.level === "subject")
      return `All ${(crumb as any).subject} questions in ${EXAM_META[(crumb as any).examType].name}.`;
    if (crumb.level === "topic")
      return `Questions focused on ${(crumb as any).topic} in ${(crumb as any).subject}.`;
    return "";
  }, [crumb]);

  // ── Show question table when below exam level ───────────────────────────
  const showTable =
    crumb.level === "year" ||
    crumb.level === "topic" ||
    (crumb.level === "subject" && !!filters.searchQuery) ||
    (crumb.level === "exam" && (!!filters.searchQuery || activeFilterCount > 0));

  return (
    <div className="max-w-7xl mx-auto">
      {/* ── Page header ── */}
      <div className="mb-6">
        <Breadcrumb crumb={crumb} onNavigate={navigate} />

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl text-green-900 mb-1.5">{pageTitle}</h1>
            <p className="text-[14px] text-gray-500 max-w-2xl">{pageSubtitle}</p>
          </div>
          <Link
            href="/admin/questions/create"
            className="flex items-center gap-2 px-5 py-3 bg-green-800 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-xl font-semibold text-[14px] shrink-0">
            <Plus size={18} />
            Add Question
          </Link>
        </div>
      </div>

      {/* ── Overview: stats + exam category grid ── */}
      {crumb.level === "overview" && (
        <>
          <BankStatsPanel />
          <ExamCategoryGrid onNavigate={navigate} />
        </>
      )}

      {/* ── Exam level: years grid + subjects grid ── */}
      {crumb.level === "exam" && contextExamType && !showTable && (
        <ExamDrillDown examType={contextExamType} onNavigate={navigate} />
      )}

      {/* ── Subject level: topics grid ── */}
      {crumb.level === "subject" && contextExamType && contextSubject && !showTable && (
        <SubjectDrillDown
          examType={contextExamType}
          subject={contextSubject}
          onNavigate={navigate}
        />
      )}

      {/* ── Filter bar — shown at any level below overview ── */}
      {crumb.level !== "overview" && (
        <div className="mt-6">
          <QuestionFiltersBar
            filters={filters}
            showFilters={showFilters}
            activeFilterCount={activeFilterCount}
            onFiltersChange={updateFilters}
            onToggleFilters={() => setShowFilters((v) => !v)}
            onClearFilters={clearFilters}
            lockExamType={!!contextExamType}
            lockYear={!!contextYear}
            lockSubject={!!contextSubject}
            availableYears={availableYears}
            availableSubjects={availableSubjects}
            availableTopics={availableTopics}
          />
        </div>
      )}

      {/* ── Question table — shown on year/topic level OR when filters applied ── */}
      {showTable && crumb.level !== "overview" && (
        <QuestionTable
          filters={filters}
          contextExamType={contextExamType}
          contextYear={contextYear}
          contextSubject={contextSubject}
          contextTopic={contextTopic}
          title={pageTitle}
        />
      )}

      {/* ── Overview-level search/filter + table ── */}
      {crumb.level === "overview" && (
        <div className="mt-8">
          <h2 className="font-serif text-xl text-green-900 mb-4">Search All Questions</h2>
          <QuestionFiltersBar
            filters={filters}
            showFilters={showFilters}
            activeFilterCount={activeFilterCount}
            onFiltersChange={updateFilters}
            onToggleFilters={() => setShowFilters((v) => !v)}
            onClearFilters={clearFilters}
            availableYears={[]}
            availableSubjects={[]}
            availableTopics={[]}
          />
          {(filters.searchQuery || activeFilterCount > 0) && (
            <QuestionTable
              filters={filters}
              title={`Search results for "${filters.searchQuery || "applied filters"}"`}
            />
          )}
        </div>
      )}
    </div>
  );
}
