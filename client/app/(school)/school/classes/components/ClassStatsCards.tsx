"use client";

import { GraduationCap, Users, BookOpen, UserCheck, School, TrendingUp } from "lucide-react";

interface ClassStatsCardsProps {
  stats: {
    totalClasses: number;
    activeClasses: number;
    inactiveClasses: number;
    totalStudents: number;
    totalExams: number;
    averageStudentsPerClass: number;
  };
}

export function ClassStatsCards({ stats }: ClassStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Classes Card */}
      <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-muted mb-1">Total Classes</p>
            <p className="text-2xl font-bold text-green-900">{stats.totalClasses}</p>
            <p className="text-xs text-text-muted">
              {stats.activeClasses} active, {stats.inactiveClasses} inactive
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
            <GraduationCap size={20} className="text-green-600" />
          </div>
        </div>
      </div>

      {/* Total Students Card */}
      <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-muted mb-1">Total Students</p>
            <p className="text-2xl font-bold text-green-900">{stats.totalStudents}</p>
            <p className="text-xs text-text-muted">
              Avg. {stats.averageStudentsPerClass} per class
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Users size={20} className="text-blue-600" />
          </div>
        </div>
      </div>

      {/* Total Exams Card */}
      <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-muted mb-1">Total Exams</p>
            <p className="text-2xl font-bold text-green-900">{stats.totalExams}</p>
            <p className="text-xs text-text-muted">Across all classes</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <BookOpen size={20} className="text-purple-600" />
          </div>
        </div>
      </div>

      {/* Active Rate Card */}
      <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-muted mb-1">Active Rate</p>
            <p className="text-2xl font-bold text-green-900">
              {Math.round((stats.activeClasses / stats.totalClasses) * 100)}%
            </p>
            <p className="text-xs text-text-muted">Classes currently active</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <TrendingUp size={20} className="text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
