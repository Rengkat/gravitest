"use client";

import { FileText, CheckCircle, PlayCircle, BookOpen } from "lucide-react";
import type { ExamStats } from "../types";

interface ExamStatsCardsProps {
  stats: ExamStats;
}

export function ExamStatsCards({ stats }: ExamStatsCardsProps) {
  const cards = [
    {
      label: "Total Exams",
      value: stats.totalExams,
      caption: `${stats.draftExams} draft, ${stats.publishedExams} published`,
      icon: FileText,
      iconBg: "bg-green-500/10",
      iconColor: "text-green-600",
    },
    {
      label: "Active Exams",
      value: stats.ongoingExams + stats.publishedExams,
      caption: `${stats.ongoingExams} ongoing, ${stats.publishedExams} published`,
      icon: PlayCircle,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600",
    },
    {
      label: "Completed Exams",
      value: stats.completedExams,
      caption: `Avg. ${stats.averageMarks}% score`,
      icon: CheckCircle,
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600",
    },
    {
      label: "Total Questions",
      value: stats.totalQuestions,
      caption: "Across all exams",
      icon: BookOpen,
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => (
        <div key={card.label} className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted mb-1">{card.label}</p>
              <p className="text-2xl font-bold text-green-900">{card.value}</p>
              <p className="text-xs text-text-muted">{card.caption}</p>
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.iconBg}`}>
              <card.icon size={20} className={card.iconColor} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
