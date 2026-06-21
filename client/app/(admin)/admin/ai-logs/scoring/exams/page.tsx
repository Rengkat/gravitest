"use client";

import { useState } from "react";
import {
  School,
  ClipboardCheck,
  MessageSquare,
  Lightbulb,
  TrendingUp,
  Users,
  CheckCircle2,
} from "lucide-react";
import { ExamGradingPanel } from "../components/Examgradingpanel";
import { FeedbackAnalytics } from "../components/FeedbackAnalytics";
import { InsightsTab } from "../components/InsightsTab";
import type { ExamSubmission, PracticeQuestionScore } from "../../types";

type Tab = "overview" | "grading" | "feedback" | "insights";

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: "overview", label: "Overview", icon: TrendingUp },
  { id: "grading", label: "Submissions", icon: ClipboardCheck },
  { id: "feedback", label: "Feedback", icon: MessageSquare },
  { id: "insights", label: "Insights", icon: Lightbulb },
];

// TODO: replace with GET /admin/ai/scoring/exams
const MOCK_EXAM_SUBMISSIONS: ExamSubmission[] = [
  {
    id: "e1",
    examId: "exam-waec-2025-math",
    examName: "WAEC Mock Mathematics 2025",
    schoolId: "sch1",
    schoolName: "Lagos Model Secondary School",
    studentId: "s1",
    studentName: "Oluwaseun Adebayo",
    answers: [],
    aiScore: 82,
    aiFeedback: "Strong performance overall, with minor errors in the calculus section.",
    aiBreakdown: [
      { subject: "Algebra", score: 18, maxScore: 20, feedback: "Excellent" },
      {
        subject: "Calculus",
        score: 12,
        maxScore: 20,
        feedback: "Needs review of differentiation rules",
      },
      { subject: "Statistics", score: 19, maxScore: 20, feedback: "Excellent" },
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
  },
  {
    id: "e2",
    examId: "exam-neco-2025-bio",
    examName: "NECO Mock Biology 2025",
    schoolId: "sch2",
    schoolName: "Federal Government College, Abuja",
    studentId: "s4",
    studentName: "Ngozi Chukwu",
    answers: [],
    aiScore: 65,
    aiFeedback: "Solid grasp of genetics, but ecology answers were underdeveloped.",
    aiBreakdown: [
      { subject: "Genetics", score: 17, maxScore: 20, feedback: "Strong" },
      { subject: "Ecology", score: 9, maxScore: 20, feedback: "Weak — missing key terms" },
      { subject: "Cell Biology", score: 14, maxScore: 20, feedback: "Adequate" },
    ],
    submittedAt: new Date(Date.now() - 30 * 60 * 60_000).toISOString(),
    gradedAt: new Date(Date.now() - 29 * 60 * 60_000).toISOString(),
    status: "graded",
  },
  {
    id: "e3",
    examId: "exam-waec-2025-math",
    examName: "WAEC Mock Mathematics 2025",
    schoolId: "sch1",
    schoolName: "Lagos Model Secondary School",
    studentId: "s5",
    studentName: "Tunde Bakare",
    answers: [],
    aiScore: 41,
    aiFeedback:
      "Significant gaps across all topics. Recommend foundational revision before next assessment.",
    aiBreakdown: [
      { subject: "Algebra", score: 8, maxScore: 20, feedback: "Weak" },
      { subject: "Calculus", score: 6, maxScore: 20, feedback: "Weak" },
      { subject: "Statistics", score: 11, maxScore: 20, feedback: "Below average" },
    ],
    submittedAt: new Date(Date.now() - 5 * 60 * 60_000).toISOString(),
    gradedAt: new Date(Date.now() - 4 * 60 * 60_000).toISOString(),
    status: "pending",
  },
];

const EMPTY_PRACTICE_SCORES: PracticeQuestionScore[] = [];

export default function ExamScoringPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const schools = new Set(MOCK_EXAM_SUBMISSIONS.map((s) => s.schoolId));
  const avgScore = (
    MOCK_EXAM_SUBMISSIONS.reduce(
      (sum, s) => sum + (s.teacherReview?.adjustedScore ?? s.aiScore),
      0,
    ) / MOCK_EXAM_SUBMISSIONS.length
  ).toFixed(1);
  const reviewed = MOCK_EXAM_SUBMISSIONS.filter((s) => s.status === "reviewed").length;
  const reviewRate = ((reviewed / MOCK_EXAM_SUBMISSIONS.length) * 100).toFixed(0);

  const allSubjectPoints = MOCK_EXAM_SUBMISSIONS.map((s) =>
    s.aiBreakdown.map((b) => ({
      subject: b.subject,
      avgScore: (b.score / b.maxScore) * 100,
      questionCount: 1,
    })),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-green-900">School Exam Scoring</h1>
        <p className="text-text-muted text-[13px]">
          AI grading for exams submitted by partner schools
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            icon: School,
            label: "Schools",
            value: schools.size,
            color: "#2e8b57",
            bg: "#2e8b5715",
          },
          {
            icon: TrendingUp,
            label: "Avg Final Score",
            value: `${avgScore}%`,
            color: "#3b82f6",
            bg: "#3b82f615",
          },
          {
            icon: Users,
            label: "Submissions",
            value: MOCK_EXAM_SUBMISSIONS.length,
            color: "#8b5cf6",
            bg: "#8b5cf615",
          },
          {
            icon: CheckCircle2,
            label: "Teacher Review Rate",
            value: `${reviewRate}%`,
            color: "#10b981",
            bg: "#10b98115",
          },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div
            key={label}
            className="flex items-center gap-3 p-4 rounded-2xl bg-white border"
            style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: bg }}>
              <Icon size={17} style={{ color }} />
            </div>
            <div>
              <div className="text-[18px] font-bold text-green-900 leading-tight">{value}</div>
              <div className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                {label}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="flex items-center gap-1 border-b overflow-x-auto"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2.5 text-[12px] font-medium transition-all flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
                activeTab === tab.id
                  ? "border-green-800 text-green-900"
                  : "border-transparent text-text-muted hover:text-green-700"
              }`}>
              <Icon size={13} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "overview" && (
        <div
          className="bg-white rounded-2xl border p-6"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <h3 className="font-serif text-base text-green-900 mb-4">Submissions by School</h3>
          <div className="space-y-3">
            {Array.from(schools).map((schoolId) => {
              const schoolSubs = MOCK_EXAM_SUBMISSIONS.filter((s) => s.schoolId === schoolId);
              const schoolName = schoolSubs[0]?.schoolName ?? "Unknown School";
              const schoolAvg = (
                schoolSubs.reduce(
                  (sum, s) => sum + (s.teacherReview?.adjustedScore ?? s.aiScore),
                  0,
                ) / schoolSubs.length
              ).toFixed(1);
              return (
                <div
                  key={schoolId}
                  className="flex items-center justify-between p-3 rounded-xl bg-cream">
                  <div className="flex items-center gap-2">
                    <School size={14} className="text-green-700" />
                    <span className="text-[13px] font-semibold text-green-900">{schoolName}</span>
                  </div>
                  <div className="flex items-center gap-4 text-[12px] text-text-muted">
                    <span>{schoolSubs.length} submissions</span>
                    <span className="font-bold text-green-900">{schoolAvg}% avg</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "grading" && (
        <ExamGradingPanel
          submissions={MOCK_EXAM_SUBMISSIONS}
          basePath="/admin/ai-logs/scoring/exams"
        />
      )}

      {activeTab === "feedback" && (
        <FeedbackAnalytics
          practiceScores={EMPTY_PRACTICE_SCORES}
          examSubmissions={MOCK_EXAM_SUBMISSIONS}
        />
      )}

      {activeTab === "insights" && (
        <InsightsTab allSubjectPoints={allSubjectPoints} contextLabel="exam submissions" />
      )}
    </div>
  );
}
