"use client";

import { Hash, TrendingUp, Target } from "lucide-react";
import { ExamType, BreadcrumbLevel } from "@/types/adminQuestions";
import { EXAM_META, TOPICS_BY_SUBJECT } from "@/lib/mock/questionsMock";
import { EXAM_CONFIG, DIFFICULTY_CONFIG, formatNumber } from "@/utils/config";

interface SubjectDrillDownProps {
  examType: ExamType;
  subject: string;
  onNavigate: (crumb: BreadcrumbLevel) => void;
}

export default function SubjectDrillDown({ examType, subject, onNavigate }: SubjectDrillDownProps) {
  const examMeta = EXAM_META[examType];
  const cfg = EXAM_CONFIG[examType];
  const topics = TOPICS_BY_SUBJECT[subject] ?? ["General"];

  // Simulate topic-level stats
  const topicStats = topics.map((topic) => ({
    topic,
    total: Math.floor(50 + Math.random() * 200),
    easy: Math.floor(Math.random() * 60),
    medium: Math.floor(Math.random() * 80),
    hard: Math.floor(Math.random() * 40),
    avgScore: Math.floor(50 + Math.random() * 40),
    recentlyAdded: Math.floor(Math.random() * 20),
  }));

  const grandTotal = topicStats.reduce((a, b) => a + b.total, 0);

  return (
    <div className="space-y-6">
      {/* Subject header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-4 mb-5">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: `${cfg.color}18` }}>
            <cfg.icon size={24} style={{ color: cfg.color }} />
          </div>
          <div>
            <h2 className="text-[20px] font-bold text-green-900">{subject}</h2>
            <p className="text-[13px] text-gray-500">
              {examMeta.name} · {formatNumber(grandTotal)} total questions
            </p>
          </div>
        </div>

        {/* Topic breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {topicStats.map(({ topic, total, easy, medium, hard, avgScore, recentlyAdded }) => {
            const easyPct = total ? Math.round((easy / total) * 100) : 0;
            const medPct = total ? Math.round((medium / total) * 100) : 0;
            const hardPct = total ? Math.round((hard / total) * 100) : 0;

            return (
              <button
                key={topic}
                onClick={() => onNavigate({ level: "topic", examType, subject, topic })}
                className="group text-left p-4 rounded-xl border-2 border-gray-100 hover:border-green-700/40 hover:shadow-md transition-all bg-white">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-[14px] font-bold text-green-900 group-hover:text-green-700 leading-tight">
                    {topic}
                  </p>
                  <div className="text-right shrink-0 ml-3">
                    <div className="text-[16px] font-black text-green-900">
                      {formatNumber(total)}
                    </div>
                    <div className="text-[10px] text-gray-400">questions</div>
                  </div>
                </div>

                {/* Difficulty bar */}
                <div className="flex h-2 rounded-full overflow-hidden mb-2 gap-px">
                  <div className="bg-emerald-500 rounded-l-full" style={{ width: `${easyPct}%` }} />
                  <div className="bg-amber-500" style={{ width: `${medPct}%` }} />
                  <div className="bg-red-500 rounded-r-full" style={{ width: `${hardPct}%` }} />
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-500">
                  <div className="flex gap-2">
                    <span className="text-emerald-600 font-semibold">Easy {easy}</span>
                    <span className="text-amber-600 font-semibold">Med {medium}</span>
                    <span className="text-red-600 font-semibold">Hard {hard}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp size={11} className="text-green-600" />
                    <span className="font-semibold text-green-700">{avgScore}% avg score</span>
                  </div>
                </div>

                {recentlyAdded > 0 && (
                  <div className="mt-2 text-[10px] font-bold text-blue-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />+
                    {recentlyAdded} added recently
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
