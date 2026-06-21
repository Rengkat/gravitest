"use client";

import { useState } from "react";
import {
  Target,
  ClipboardCheck,
  MessageSquare,
  BookOpen,
  TrendingUp,
  Users,
  Clock,
} from "lucide-react";
import { ScoreDistribution } from "./components/ScoreDistribution";
import { AutoGradingPanel } from "./components/AutoGradingPanel";
import { FeedbackAnalytics } from "./components/FeedbackAnalytics";
import { RubricManager } from "./components/RubricManager";
import type { PracticeQuestionScore, ExamSubmission, ScoringAnalytics } from "../types";

type Tab = "overview" | "grading" | "feedback" | "rubrics";

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: "overview", label: "Overview", icon: TrendingUp },
  { id: "grading", label: "Auto-Grading", icon: ClipboardCheck },
  { id: "feedback", label: "Feedback", icon: MessageSquare },
  { id: "rubrics", label: "Rubrics", icon: BookOpen },
];

// TODO: replace with GET /admin/ai/scoring/analytics
const MOCK_ANALYTICS: ScoringAnalytics = {
  totalQuestionsGraded: 2847,
  averageScore: 78.5,
  scoreDistribution: [
    { range: "0–20%", count: 42 },
    { range: "21–40%", count: 98 },
    { range: "41–60%", count: 312 },
    { range: "61–80%", count: 980 },
    { range: "81–100%", count: 1415 },
  ],
  confidenceDistribution: [
    { range: "Low", count: 180 },
    { range: "Medium", count: 620 },
    { range: "High", count: 2047 },
  ],
  subjectPerformance: [
    { subject: "Mathematics", avgScore: 74.2, questionCount: 812 },
    { subject: "English Language", avgScore: 81.5, questionCount: 640 },
    { subject: "Physics", avgScore: 71.8, questionCount: 530 },
    { subject: "Chemistry", avgScore: 79.3, questionCount: 478 },
    { subject: "Biology", avgScore: 83.1, questionCount: 387 },
  ],
  teacherReviewRate: 12.4,
  reviewDiscrepancy: 4.2,
};

// TODO: replace with GET /admin/ai/scoring/practice
const MOCK_PRACTICE_SCORES: PracticeQuestionScore[] = [
  {
    id: "p1",
    questionId: "q101",
    questionText: "Explain the process of photosynthesis and its importance to plant life.",
    studentId: "s1",
    studentName: "Oluwaseun Adebayo",
    studentAnswer:
      "Photosynthesis is how plants convert sunlight into energy using chlorophyll. It happens in the leaves and produces oxygen as a byproduct.",
    correctAnswer:
      "Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to produce glucose and oxygen, primarily occurring in chloroplasts.",
    aiScore: 78,
    aiFeedback:
      "Good general understanding but missing the role of water and carbon dioxide as inputs.",
    confidence: 0.91,
    suggestedImprovements: [
      "Mention carbon dioxide and water as reactants",
      "Reference glucose as the produced sugar",
    ],
    scoringCriteria: [
      {
        criterion: "Correct process described",
        maxPoints: 5,
        awardedPoints: 4,
        feedback: "Mostly correct",
      },
      {
        criterion: "Mentions chlorophyll/chloroplasts",
        maxPoints: 3,
        awardedPoints: 3,
        feedback: "Correctly identified",
      },
      {
        criterion: "Mentions all reactants",
        maxPoints: 2,
        awardedPoints: 1,
        feedback: "Missing CO2 and water",
      },
    ],
    gradedAt: new Date(Date.now() - 2 * 60 * 60_000).toISOString(),
  },
  {
    id: "p2",
    questionId: "q102",
    questionText: "Solve for x: 2x² - 5x - 3 = 0",
    studentId: "s2",
    studentName: "Chioma Eze",
    studentAnswer: "x = 3 or x = -1/2",
    correctAnswer: "x = 3 or x = -1/2",
    aiScore: 100,
    aiFeedback: "Perfect solution using the quadratic formula.",
    confidence: 0.98,
    suggestedImprovements: [],
    scoringCriteria: [
      {
        criterion: "Correct factorization/formula use",
        maxPoints: 5,
        awardedPoints: 5,
        feedback: "Correct",
      },
      { criterion: "Both roots correct", maxPoints: 5, awardedPoints: 5, feedback: "Correct" },
    ],
    gradedAt: new Date(Date.now() - 3 * 60 * 60_000).toISOString(),
    reviewedBy: "Mrs. Funmi Bello",
    reviewedScore: 100,
    reviewNotes: "Confirmed correct.",
  },
  {
    id: "p3",
    questionId: "q103",
    questionText: "What is Newton's Third Law of Motion?",
    studentId: "s3",
    studentName: "Emeka Nwosu",
    studentAnswer: "Every action has a reaction.",
    correctAnswer: "For every action, there is an equal and opposite reaction.",
    aiScore: 45,
    aiFeedback:
      "The core idea is present but the answer lacks precision — 'equal and opposite' is essential.",
    confidence: 0.62,
    suggestedImprovements: [
      "State that the reaction is equal in magnitude",
      "State that the reaction is opposite in direction",
    ],
    scoringCriteria: [
      {
        criterion: "States action-reaction concept",
        maxPoints: 4,
        awardedPoints: 2,
        feedback: "Too vague",
      },
      {
        criterion: "Mentions 'equal and opposite'",
        maxPoints: 6,
        awardedPoints: 2.5,
        feedback: "Missing precision",
      },
    ],
    gradedAt: new Date(Date.now() - 5 * 60 * 60_000).toISOString(),
  },
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
];

export default function ExamsScoringPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const handleOverride = (scoreId: string, reviewedScore: number, reviewNotes: string) => {
    // TODO: PATCH /admin/ai/scoring/practice/:scoreId  { reviewedScore, reviewNotes }
    console.log("Override:", scoreId, reviewedScore, reviewNotes);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-green-900">AI Scoring & Feedback</h1>
        <p className="text-text-muted text-[13px]">
          Monitor automated grading quality, review AI feedback, and manage rubrics
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            icon: Target,
            label: "Questions Graded",
            value: MOCK_ANALYTICS.totalQuestionsGraded.toLocaleString(),
            color: "#2e8b57",
            bg: "#2e8b5715",
          },
          {
            icon: TrendingUp,
            label: "Avg AI Score",
            value: `${MOCK_ANALYTICS.averageScore}%`,
            color: "#3b82f6",
            bg: "#3b82f615",
          },
          {
            icon: Users,
            label: "Teacher Review Rate",
            value: `${MOCK_ANALYTICS.teacherReviewRate}%`,
            color: "#8b5cf6",
            bg: "#8b5cf615",
          },
          {
            icon: Clock,
            label: "AI/Teacher Diff",
            value: `±${MOCK_ANALYTICS.reviewDiscrepancy}`,
            color: "#f59e0b",
            bg: "#f59e0b15",
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
        <div className="space-y-5">
          <ScoreDistribution analytics={MOCK_ANALYTICS} />
          <div
            className="bg-white rounded-2xl border p-6"
            style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <h3 className="font-serif text-base text-green-900 mb-4">Performance by Subject</h3>
            <div className="space-y-3">
              {MOCK_ANALYTICS.subjectPerformance.map((s) => (
                <div key={s.subject} className="flex items-center gap-3">
                  <span className="text-[12px] text-green-900 w-36 shrink-0 truncate">
                    {s.subject}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-cream overflow-hidden">
                    <div
                      className="h-full rounded-full bg-green-700"
                      style={{ width: `${s.avgScore}%` }}
                    />
                  </div>
                  <span className="text-[12px] font-bold text-green-900 w-12 text-right">
                    {s.avgScore}%
                  </span>
                  <span className="text-[10px] text-text-muted w-20 text-right">
                    {s.questionCount} qs
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "grading" && (
        <AutoGradingPanel scores={MOCK_PRACTICE_SCORES} onOverride={handleOverride} />
      )}

      {activeTab === "feedback" && (
        <FeedbackAnalytics
          practiceScores={MOCK_PRACTICE_SCORES}
          examSubmissions={MOCK_EXAM_SUBMISSIONS}
        />
      )}

      {activeTab === "rubrics" && <RubricManager />}
    </div>
  );
}
