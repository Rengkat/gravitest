// src/app/school/students/[id]/components/StudentPerformanceStats.tsx
"use client";

import {
  TrendingUp,
  CheckCircle,
  Clock,
  BookOpen,
  Award,
  BarChart3,
  Target,
  Trophy,
} from "lucide-react";
import type { StudentWithUser } from "../../types";

interface Props {
  student: StudentWithUser;
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  sub,
}: {
  icon: any;
  label: string;
  value: string | number;
  color: string;
  sub?: string;
}) {
  return (
    <div
      className="p-4 rounded-xl bg-white border flex items-center gap-3"
      style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${color}15` }}>
        <Icon size={16} style={{ color }} />
      </div>
      <div>
        <div className="text-[17px] font-bold text-green-900 leading-tight">{value}</div>
        <div className="text-[10px] text-text-muted leading-none mt-0.5">{label}</div>
        {sub && (
          <div className="text-[10px] mt-0.5" style={{ color }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

function ScoreBar({
  label,
  score,
  color,
  sub,
}: {
  label: string;
  score: number;
  color: string;
  sub?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[12px] font-medium text-green-900">{label}</span>
        <span className="text-[12px] font-bold" style={{ color }}>
          {score.toFixed(1)}%
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${Math.min(score, 100)}%`, background: color }}
        />
      </div>
      {sub && <p className="text-[10px] text-text-muted mt-0.5">{sub}</p>}
    </div>
  );
}

function getScoreColor(score: number) {
  if (score >= 75) return "#10b981";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}

export function StudentPerformanceStats({ student }: Props) {
  const { studentProfile } = student;

  const accuracy =
    studentProfile.totalQuestionsAttempted > 0
      ? (studentProfile.totalQuestionsCorrect / studentProfile.totalQuestionsAttempted) * 100
      : 0;

  const hoursStudied = Math.floor(studentProfile.totalMinutesStudied / 60);
  const minutesRemainder = studentProfile.totalMinutesStudied % 60;
  const studyTimeLabel =
    hoursStudied > 0
      ? `${hoursStudied}h ${minutesRemainder}m`
      : `${studentProfile.totalMinutesStudied}m`;

  const overallColor = getScoreColor(studentProfile.averageScore);

  const subjectEntries = studentProfile.subjectPerformance
    ? Object.entries(studentProfile.subjectPerformance)
    : [];

  return (
    <div className="space-y-5">
      {/* ── Key stats ── */}
      <div>
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-3">
          Performance Overview
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            icon={Target}
            label="Avg. Score"
            value={`${studentProfile.averageScore.toFixed(1)}%`}
            color={overallColor}
          />
          <StatCard
            icon={CheckCircle}
            label="Accuracy Rate"
            value={`${accuracy.toFixed(1)}%`}
            color="#3b82f6"
          />
          <StatCard icon={Clock} label="Study Time" value={studyTimeLabel} color="#8b5cf6" />
          <StatCard
            icon={BarChart3}
            label="Sessions Taken"
            value={studentProfile.totalExamsTaken}
            color="#f59e0b"
          />
        </div>
      </div>

      {/* ── Score range ── */}
      <div
        className="rounded-2xl bg-white border p-5"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-4">
          Score Range
        </h3>
        <div className="space-y-3">
          <ScoreBar label="Best Score" score={studentProfile.bestScore ?? 0} color="#10b981" />
          <ScoreBar
            label="Average Score"
            score={studentProfile.averageScore}
            color={overallColor}
          />
          <ScoreBar label="Lowest Score" score={studentProfile.worstScore ?? 0} color="#ef4444" />
        </div>
      </div>

      {/* ── Questions breakdown ── */}
      <div
        className="rounded-2xl bg-white border p-5"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-4">
          Questions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "Attempted",
              value: studentProfile.totalQuestionsAttempted.toLocaleString(),
              color: "#3b82f6",
            },
            {
              label: "Correct",
              value: studentProfile.totalQuestionsCorrect.toLocaleString(),
              color: "#10b981",
            },
            {
              label: "Incorrect",
              value: (
                studentProfile.totalQuestionsAttempted - studentProfile.totalQuestionsCorrect
              ).toLocaleString(),
              color: "#ef4444",
            },
            {
              label: "Accuracy",
              value: `${accuracy.toFixed(1)}%`,
              color: accuracy >= 60 ? "#10b981" : "#f59e0b",
            },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-center p-3 rounded-xl bg-cream">
              <div className="text-[18px] font-bold leading-tight" style={{ color }}>
                {value}
              </div>
              <div className="text-[10px] text-text-muted mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Subject performance — class-based view ── */}
      {subjectEntries.length > 0 && (
        <div
          className="rounded-2xl bg-white border p-5"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
              Performance by Subject
            </h3>
            <span className="text-[11px] text-text-muted">
              {subjectEntries.length} subject{subjectEntries.length !== 1 ? "s" : ""} offered
            </span>
          </div>

          <div className="space-y-4">
            {subjectEntries
              .sort(([, a]: any, [, b]: any) => b.averageScore - a.averageScore)
              .map(([subject, data]: [string, any]) => {
                const col = getScoreColor(data.averageScore);
                return (
                  <div key={subject}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <BookOpen size={12} className="text-text-muted shrink-0" />
                        <span className="text-[13px] font-semibold text-green-900">{subject}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-text-muted">
                        <span>{data.questionsAttempted} questions</span>
                        <span>{data.totalMinutes} min</span>
                        <span className="font-bold" style={{ color: col }}>
                          {data.averageScore}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${data.averageScore}%`, background: col }}
                      />
                    </div>
                    {/* Correct / incorrect mini row */}
                    <div className="flex gap-3 mt-1 text-[10px] text-text-muted">
                      <span className="text-green-600">{data.questionsCorrect} correct</span>
                      <span className="text-red-500">
                        {data.questionsAttempted - data.questionsCorrect} incorrect
                      </span>
                      {data.lastPracticedAt && (
                        <span className="ml-auto">
                          Last:{" "}
                          {new Date(data.lastPracticedAt).toLocaleDateString("en-NG", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ── Class leaderboard position (if available) ── */}
      {(studentProfile.leaderboardRank || studentProfile.percentileStanding) && (
        <div
          className="rounded-2xl bg-white border p-5"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-4">
            Class Standing
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {studentProfile.leaderboardRank && (
              <div className="text-center p-4 rounded-xl bg-amber-50 border border-amber-100">
                <Trophy size={20} className="text-amber-500 mx-auto mb-1" />
                <div className="text-[22px] font-bold text-amber-700">
                  #{studentProfile.leaderboardRank}
                </div>
                <div className="text-[11px] text-amber-600">Class Rank</div>
              </div>
            )}
            {studentProfile.percentileStanding && (
              <div className="text-center p-4 rounded-xl bg-green-50 border border-green-100">
                <Award size={20} className="text-green-600 mx-auto mb-1" />
                <div className="text-[22px] font-bold text-green-700">
                  {studentProfile.percentileStanding}th
                </div>
                <div className="text-[11px] text-green-600">Percentile</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
