"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, School, User, CheckCircle2, Clock, FileEdit } from "lucide-react";
import Link from "next/link";
import type { ExamSubmission } from "../../types";

interface Props {
  submissions: ExamSubmission[];
  basePath: string; // e.g. /admin/ai-logs/scoring/exams
}

const STATUS_CFG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  pending: { label: "Pending", color: "#f59e0b", bg: "#f59e0b15", icon: Clock },
  graded: { label: "Graded", color: "#3b82f6", bg: "#3b82f615", icon: CheckCircle2 },
  reviewed: { label: "Reviewed", color: "#10b981", bg: "#10b98115", icon: CheckCircle2 },
};

function SubmissionRow({ submission, basePath }: { submission: ExamSubmission; basePath: string }) {
  const [expanded, setExpanded] = useState(false);
  const statusCfg = STATUS_CFG[submission.status];
  const StatusIcon = statusCfg.icon;
  const finalScore = submission.teacherReview?.adjustedScore ?? submission.aiScore;

  return (
    <div className="border-b last:border-0" style={{ borderColor: "rgba(30,80,50,0.06)" }}>
      <div
        className="flex items-center gap-3 px-5 py-3 hover:bg-cream/20 cursor-pointer"
        onClick={() => setExpanded(!expanded)}>
        <div className="w-8 h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-[10px] font-bold shrink-0">
          {submission.studentName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-semibold text-green-900 truncate">
            {submission.studentName}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
            <School size={10} /> {submission.schoolName} · {submission.examName}
          </div>
        </div>
        <span
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0"
          style={{ background: statusCfg.bg, color: statusCfg.color }}>
          <StatusIcon size={9} /> {statusCfg.label}
        </span>
        <span className="text-[13px] font-bold text-green-900 w-12 text-right shrink-0">
          {finalScore}%
        </span>
        {expanded ? (
          <ChevronUp size={14} className="text-text-muted shrink-0" />
        ) : (
          <ChevronDown size={14} className="text-text-muted shrink-0" />
        )}
      </div>

      {expanded && (
        <div className="px-5 pb-4 space-y-3" onClick={(e) => e.stopPropagation()}>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted mb-1.5">
              Subject Breakdown
            </p>
            <div className="space-y-1.5">
              {submission.aiBreakdown.map((b) => (
                <div
                  key={b.subject}
                  className="flex items-center justify-between text-[12px] bg-cream rounded-lg px-3 py-1.5">
                  <span className="text-green-900">{b.subject}</span>
                  <span className="font-semibold text-green-900">
                    {b.score}/{b.maxScore}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted mb-1">
              AI Feedback
            </p>
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 text-[12px] text-blue-900">
              {submission.aiFeedback}
            </div>
          </div>

          {submission.teacherReview && (
            <div className="flex items-center gap-1.5 text-[11px] text-green-700">
              <CheckCircle2 size={11} /> Reviewed by {submission.teacherReview.reviewedBy} —
              adjusted to {submission.teacherReview.adjustedScore}%
            </div>
          )}

          <Link
            href={`${basePath}/${submission.id}`}
            className="flex items-center gap-1.5 text-[11px] text-blue-600 hover:underline">
            <FileEdit size={11} /> Open full submission & review
          </Link>
        </div>
      )}
    </div>
  );
}

export function ExamGradingPanel({ submissions, basePath }: Props) {
  const reviewed = submissions.filter((s) => s.status === "reviewed").length;
  const pending = submissions.filter((s) => s.status === "pending").length;
  const avgScore = submissions.length
    ? (
        submissions.reduce((sum, s) => sum + (s.teacherReview?.adjustedScore ?? s.aiScore), 0) /
        submissions.length
      ).toFixed(1)
    : "—";

  return (
    <div className="space-y-4">
      <div
        className="bg-white rounded-2xl border p-6"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h3 className="font-serif text-lg text-green-900">Exam Submissions</h3>
            <p className="text-[12px] text-text-muted mt-0.5">
              {submissions.length} submissions across all schools
            </p>
          </div>
          <div className="text-right">
            <div className="text-[26px] font-bold text-green-900">{avgScore}%</div>
            <div className="text-[10px] text-text-muted">Average Final Score</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-xl bg-green-50">
            <div className="text-[20px] font-bold text-green-700">{reviewed}</div>
            <div className="text-[10px] text-text-muted font-semibold">Teacher Reviewed</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-amber-50">
            <div className="text-[20px] font-bold text-amber-700">{pending}</div>
            <div className="text-[10px] text-text-muted font-semibold">Pending Review</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-blue-50">
            <div className="text-[20px] font-bold text-blue-700">
              {new Set(submissions.map((s) => s.schoolId)).size}
            </div>
            <div className="text-[10px] text-text-muted font-semibold">Schools</div>
          </div>
        </div>
      </div>

      <div
        className="bg-white rounded-2xl border overflow-hidden"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <div
          className="flex items-center justify-between px-5 py-3 border-b"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
            Submissions
          </h3>
        </div>
        {submissions.length === 0 ? (
          <div className="px-5 py-8 text-center text-[13px] text-text-muted">
            No submissions yet.
          </div>
        ) : (
          submissions.map((s) => <SubmissionRow key={s.id} submission={s} basePath={basePath} />)
        )}
      </div>
    </div>
  );
}
