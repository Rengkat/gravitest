"use client";

import Link from "next/link";
import {
  Target,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  ArrowRight,
  GraduationCap,
  BookOpen,
} from "lucide-react";

export default function AIScoringDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-green-900">AI Scoring & Feedback</h1>
        <p className="text-text-muted text-[13px]">
          Manage automated scoring for practice questions and exams
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <Target size={16} className="text-green-800" />
            </div>
            <span className="text-[11px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              This week
            </span>
          </div>
          <div className="text-2xl font-bold text-green-900">2,847</div>
          <div className="text-[11px] text-text-muted">Questions graded</div>
          <div className="text-[10px] text-green-600 mt-1">↑ 12% from last week</div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <TrendingUp size={16} className="text-blue-800" />
            </div>
          </div>
          <div className="text-2xl font-bold text-green-900">78.5%</div>
          <div className="text-[11px] text-text-muted">Average AI score</div>
          <div className="text-[10px] text-green-600 mt-1">↑ 3.2% improvement</div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <Users size={16} className="text-purple-800" />
            </div>
          </div>
          <div className="text-2xl font-bold text-green-900">1,234</div>
          <div className="text-[11px] text-text-muted">Students served</div>
          <div className="text-[10px] text-text-muted">Across 45 schools</div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <Clock size={16} className="text-amber-800" />
            </div>
          </div>
          <div className="text-2xl font-bold text-green-900">98%</div>
          <div className="text-[11px] text-text-muted">Auto-grading rate</div>
          <div className="text-[10px] text-text-muted">2% manually reviewed</div>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/ai/scoring/practice">
          <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-xl p-6 text-white hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <BookOpen size={24} />
              </div>
              <ArrowRight size={20} className="opacity-70" />
            </div>
            <h3 className="font-serif text-xl mb-2">Practice Questions</h3>
            <p className="text-white/70 text-[13px] mb-4">
              Review AI-graded practice questions and student responses
            </p>
            <div className="flex items-center gap-4 text-[12px]">
              <span className="flex items-center gap-1">
                <CheckCircle size={12} />
                2,847 graded
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                124 pending
              </span>
            </div>
          </div>
        </Link>

        <Link href="/admin/ai/scoring/exams">
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-6 text-white hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <GraduationCap size={24} />
              </div>
              <ArrowRight size={20} className="opacity-70" />
            </div>
            <h3 className="font-serif text-xl mb-2">Exam Grading</h3>
            <p className="text-white/70 text-[13px] mb-4">
              Monitor AI-graded exams and teacher reviews
            </p>
            <div className="flex items-center gap-4 text-[12px]">
              <span className="flex items-center gap-1">
                <CheckCircle size={12} />
                156 exams graded
              </span>
              <span className="flex items-center gap-1">
                <Users size={12} />
                45 schools
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
