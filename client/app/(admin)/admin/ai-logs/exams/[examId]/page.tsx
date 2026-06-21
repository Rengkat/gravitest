"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, School, User, CheckCircle2, Edit3, Save, X } from "lucide-react";
import type { ExamSubmission } from "../../types";

function generateMockSubmission(id: string): ExamSubmission {
  return {
    id,
    examId: "exam-waec-2025-math",
    examName: "WAEC Mock Mathematics 2025",
    schoolId: "sch1",
    schoolName: "Lagos Model Secondary School",
    studentId: "s1",
    studentName: "Oluwaseun Adebayo",
    answers: [
      {
        questionId: "q1",
        questionText: "Solve: 2x + 5 = 15",
        studentAnswer: "x = 5",
        aiScore: 10,
        aiFeedback: "Correct.",
        maxPoints: 10,
      },
      {
        questionId: "q2",
        questionText: "Differentiate y = 3x² + 2x",
        studentAnswer: "dy/dx = 6x + 2",
        aiScore: 10,
        aiFeedback: "Correct.",
        maxPoints: 10,
      },
      {
        questionId: "q3",
        questionText: "Find the second derivative of y = x³ - 4x",
        studentAnswer: "y' = 3x² - 4, y'' = 6x",
        aiScore: 12,
        aiFeedback: "Correct method and answer, well shown.",
        maxPoints: 15,
      },
      {
        questionId: "q4",
        questionText: "Evaluate ∫(2x + 3)dx",
        studentAnswer: "x² + 3x + C — forgot to show integration steps",
        aiScore: 12,
        aiFeedback: "Final answer correct but working not fully shown.",
        maxPoints: 20,
      },
    ],
    aiScore: 82,
    aiFeedback: "Strong performance overall, with minor errors in the calculus section.",
    aiBreakdown: [
      {
        subject: "Algebra",
        score: 18,
        maxScore: 20,
        feedback: "Excellent grasp of linear equations.",
      },
      {
        subject: "Calculus",
        score: 12,
        maxScore: 20,
        feedback: "Needs review of differentiation rules.",
      },
      { subject: "Statistics", score: 19, maxScore: 20, feedback: "Excellent." },
    ],
    submittedAt: new Date(Date.now() - 24 * 60 * 60_000).toISOString(),
    gradedAt: new Date(Date.now() - 23 * 60 * 60_000).toISOString(),
    status: "reviewed",
    teacherReview: {
      reviewedBy: "Mr. Adewale Obi",
      reviewedAt: new Date(Date.now() - 20 * 60 * 60_000).toISOString(),
      adjustedScore: 84,
      comments: "Gave partial credit for method shown in calculus question 4.",
      adjustments: [
        {
          questionId: "q4",
          originalScore: 12,
          adjustedScore: 14,
          reason: "Partial credit for correct method",
        },
      ],
    },
  };
}

const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "#f59e0b", bg: "#f59e0b15" },
  graded: { label: "Graded", color: "#3b82f6", bg: "#3b82f615" },
  reviewed: { label: "Reviewed", color: "#10b981", bg: "#10b98115" },
};

export default function ExamSubmissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const examId = typeof params.examId === "string" ? params.examId : (params.examId?.[0] ?? "1");

  const [submission, setSubmission] = useState<ExamSubmission>(() =>
    generateMockSubmission(examId),
  );
  const [reviewing, setReviewing] = useState(false);
  const [comments, setComments] = useState(submission.teacherReview?.comments ?? "");
  const [adjustedScore, setAdjustedScore] = useState(
    String(submission.teacherReview?.adjustedScore ?? submission.aiScore),
  );

  const statusCfg = STATUS_CFG[submission.status];

  const handleSubmitReview = () => {
    // TODO: POST /admin/ai/scoring/exams/:examId/review { comments, adjustedScore }
    setSubmission((prev) => ({
      ...prev,
      status: "reviewed",
      teacherReview: {
        reviewedBy: "Current Admin",
        reviewedAt: new Date().toISOString(),
        adjustedScore: parseFloat(adjustedScore) || prev.aiScore,
        comments,
        adjustments: prev.teacherReview?.adjustments ?? [],
      },
    }));
    setReviewing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-[13px] text-text-muted hover:text-green-900 transition-colors">
            <ArrowLeft size={15} /> Back
          </button>
          <div className="w-px h-5 bg-gray-200" />
          <h1 className="font-serif text-xl text-green-900">{submission.examName}</h1>
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
            style={{ background: statusCfg.bg, color: statusCfg.color }}>
            {statusCfg.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div
          className="bg-white rounded-2xl border p-4 flex items-center gap-3"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
            <User size={16} className="text-green-700" />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-green-900">{submission.studentName}</div>
            <div className="text-[11px] text-text-muted">Student</div>
          </div>
        </div>
        <div
          className="bg-white rounded-2xl border p-4 flex items-center gap-3"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <School size={16} className="text-blue-700" />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-green-900">{submission.schoolName}</div>
            <div className="text-[11px] text-text-muted">School</div>
          </div>
        </div>
        <div
          className="bg-white rounded-2xl border p-4 flex items-center gap-3"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
            <CheckCircle2 size={16} className="text-amber-700" />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-green-900">
              {submission.teacherReview?.adjustedScore ?? submission.aiScore}%
            </div>
            <div className="text-[11px] text-text-muted">
              {submission.teacherReview ? "Final Score (Reviewed)" : "AI Score"}
            </div>
          </div>
        </div>
      </div>

      <div
        className="bg-white rounded-2xl border p-6"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <h3 className="font-serif text-base text-green-900 mb-4">Subject Breakdown</h3>
        <div className="space-y-3">
          {submission.aiBreakdown.map((b) => (
            <div key={b.subject}>
              <div className="flex items-center justify-between text-[12px] mb-1">
                <span className="text-green-900 font-medium">{b.subject}</span>
                <span className="font-bold text-green-900">
                  {b.score}/{b.maxScore}
                </span>
              </div>
              <div className="h-2 rounded-full bg-cream overflow-hidden mb-1">
                <div
                  className="h-full rounded-full bg-green-700"
                  style={{ width: `${(b.score / b.maxScore) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-text-muted">{b.feedback}</p>
            </div>
          ))}
        </div>
      </div>

      <div
        className="bg-white rounded-2xl border overflow-hidden"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <h3 className="font-serif text-base text-green-900">Answer Breakdown</h3>
        </div>
        {submission.answers.map((a, i) => (
          <div
            key={a.questionId}
            className="px-6 py-4 border-b last:border-0"
            style={{ borderColor: "rgba(30,80,50,0.06)" }}>
            <div className="flex items-start justify-between gap-3 mb-2">
              <span className="text-[13px] text-green-900 flex-1">
                <strong>Q{i + 1}.</strong> {a.questionText}
              </span>
              <span className="text-[12px] font-bold text-green-900 shrink-0">
                {a.aiScore}/{a.maxPoints}
              </span>
            </div>
            <div className="rounded-lg bg-cream p-2.5 text-[12px] text-green-900 mb-1.5">
              {a.studentAnswer}
            </div>
            <p className="text-[11px] text-text-muted">{a.aiFeedback}</p>
          </div>
        ))}
      </div>

      <div
        className="bg-white rounded-2xl border p-6"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-base text-green-900">Teacher Review</h3>
          {!reviewing && (
            <button
              onClick={() => setReviewing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-[12px] text-green-900 hover:bg-cream transition-all">
              <Edit3 size={12} /> {submission.teacherReview ? "Edit Review" : "Add Review"}
            </button>
          )}
        </div>

        {submission.teacherReview && !reviewing && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[12px] text-text-muted">
              <CheckCircle2 size={13} className="text-green-600" />
              Reviewed by{" "}
              <strong className="text-green-900">
                {submission.teacherReview.reviewedBy}
              </strong> on{" "}
              {new Date(submission.teacherReview.reviewedAt).toLocaleDateString("en-NG")}
            </div>
            <p className="text-[13px] text-green-900">{submission.teacherReview.comments}</p>
            {submission.teacherReview.adjustments.length > 0 && (
              <div className="mt-2 space-y-1">
                {submission.teacherReview.adjustments.map((adj, i) => (
                  <div
                    key={i}
                    className="text-[11px] text-blue-700 bg-blue-50 rounded-lg px-2.5 py-1.5">
                    Q: {adj.questionId} — {adj.originalScore} → {adj.adjustedScore} pts (
                    {adj.reason})
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!submission.teacherReview && !reviewing && (
          <p className="text-[13px] text-text-muted">
            No teacher review yet. This submission was auto-graded by AI.
          </p>
        )}

        {reviewing && (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-text-muted mb-1">
                Adjusted Final Score (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={adjustedScore}
                onChange={(e) => setAdjustedScore(e.target.value)}
                className="w-32 px-3 py-2 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-500/30"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-text-muted mb-1">
                Comments
              </label>
              <textarea
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-[13px] resize-none focus:outline-none focus:ring-2 focus:ring-green-500/30"
                placeholder="Add review comments…"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSubmitReview}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-800 text-white text-[13px] font-semibold hover:bg-green-700 transition-all">
                <Save size={13} /> Save Review
              </button>
              <button
                onClick={() => setReviewing(false)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-[13px] hover:bg-cream transition-all">
                <X size={13} /> Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
