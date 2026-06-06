"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import BankStatsPanel from "./components/BankStatsPanel";
import ExamCategoryGrid from "./components/ExamCategoryGrid";

/**
 * Page 1 — Main Dashboard  /admin/questions
 *
 * Changes from original:
 *  • Removed the "Search All Questions" filter + table section that
 *    previously lived at the bottom of this page. It now lives on the
 *    Subject Questions page (/[examType]/[year]/[subject]).
 *  • All navigation is now real Next.js routing instead of crumb state.
 *  • ExamCategoryGrid navigates via <Link href="/admin/questions/[examType]">
 *    instead of calling an onNavigate callback.
 */
export default function AdminQuestionsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* ── Page header ── */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl text-green-900 mb-1.5">Question Bank</h1>
            <p className="text-[14px] text-gray-500 max-w-2xl">
              Manage and organise past questions across all exam types, years, and subjects.
            </p>
          </div>
          <Link
            href="/admin/questions/create"
            className="flex items-center gap-2 px-5 py-3 bg-green-800 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-xl font-semibold text-[14px] shrink-0"
          >
            <Plus size={18} />
            Add Question
          </Link>
        </div>
      </div>

      {/* ── Overall statistics ── */}
      <BankStatsPanel />

      {/* ── Exam category grid (Professional + Secondary School) ── */}
      {/*
        ExamCategoryGrid has been updated to use Link href routing.
        Clicking any exam type navigates to /admin/questions/[examType].
        The "Browse by Subject" section has been removed from ExamDrillDown
        and is now part of the Year-Subject page.
      */}
      <ExamCategoryGrid />
    </div>
  );
}
