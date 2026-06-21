"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, User } from "lucide-react";
import { StudentInsightPanel } from "../../components/Studentinsightpanel";
import type { PracticeQuestionScore } from "../../../types";

// TODO: replace with GET /admin/ai/scoring/practice/students/:id
function getMockStudentData(id: string) {
  return {
    studentId: id,
    studentName: "Oluwaseun Adebayo",
    subjects: [
      { subject: "Biology", avgScore: 78, questionCount: 40 },
      { subject: "Chemistry", avgScore: 52, questionCount: 35 },
      { subject: "Physics", avgScore: 68, questionCount: 28 },
      { subject: "Mathematics", avgScore: 85, questionCount: 50 },
    ] as { subject: string; avgScore: number; questionCount: number }[],
    recentScores: [
      {
        id: "p1",
        questionId: "q101",
        questionText: "Explain the process of photosynthesis and its importance to plant life.",
        studentId: id,
        studentName: "Oluwaseun Adebayo",
        studentAnswer:
          "Photosynthesis is how plants convert sunlight into energy using chlorophyll.",
        aiScore: 78,
        aiFeedback:
          "Good general understanding but missing the role of water and carbon dioxide as inputs.",
        confidence: 0.91,
        suggestedImprovements: ["Mention carbon dioxide and water as reactants"],
        scoringCriteria: [],
        gradedAt: new Date(Date.now() - 2 * 60 * 60_000).toISOString(),
      } as PracticeQuestionScore,
    ],
  };
}

export default function PracticeStudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = typeof params.id === "string" ? params.id : (params.id?.[0] ?? "1");
  const data = getMockStudentData(studentId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-[13px] text-text-muted hover:text-green-900 transition-colors">
          <ArrowLeft size={15} /> Back
        </button>
        <div className="w-px h-5 bg-gray-200" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-[11px] font-bold">
            <User size={14} />
          </div>
          <h1 className="font-serif text-xl text-green-900">{data.studentName}</h1>
        </div>
      </div>

      <StudentInsightPanel
        studentId={data.studentId}
        studentName={data.studentName}
        subjectPoints={data.subjects}
      />

      <div
        className="bg-white rounded-2xl border overflow-hidden"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <h3 className="font-serif text-base text-green-900">Recent Graded Questions</h3>
        </div>
        {data.recentScores.map((s) => (
          <div
            key={s.id}
            className="px-6 py-4 border-b last:border-0"
            style={{ borderColor: "rgba(30,80,50,0.06)" }}>
            <div className="flex items-start justify-between gap-3 mb-2">
              <span className="text-[13px] text-green-900 flex-1">{s.questionText}</span>
              <span className="text-[13px] font-bold text-green-900 shrink-0">{s.aiScore}%</span>
            </div>
            <div className="rounded-lg bg-cream p-2.5 text-[12px] text-green-900 mb-1.5">
              {s.studentAnswer}
            </div>
            <p className="text-[11px] text-text-muted">{s.aiFeedback}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
