"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Users,
  Plus,
  MoreVertical,
  BarChart3,
  BookOpen,
  Settings,
  ChevronRight,
} from "lucide-react";

const CLASSES_DATA = [
  {
    id: 1,
    name: "SS3 Science",
    students: 120,
    averageScore: 78.5,
    subjects: 8,
    teacher: "Mr. Adebayo",
    status: "active",
  },
  {
    id: 2,
    name: "SS3 Art",
    students: 85,
    averageScore: 75.2,
    subjects: 7,
    teacher: "Mrs. Okafor",
    status: "active",
  },
  {
    id: 3,
    name: "SS3 Commercial",
    students: 95,
    averageScore: 72.8,
    subjects: 7,
    teacher: "Mr. Eze",
    status: "active",
  },
  {
    id: 4,
    name: "SS2 Science",
    students: 110,
    averageScore: 70.5,
    subjects: 8,
    teacher: "Dr. Williams",
    status: "active",
  },
];

export default function ClassesPage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-serif text-3xl text-green-900 mb-2">Classes</h1>
            <p className="text-text-muted">Manage all classes and their performance</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-800 text-white hover:bg-green-700 transition-all">
            <Plus size={16} /> Create Class
          </button>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CLASSES_DATA.map((cls) => (
          <div
            key={cls.id}
            className="p-6 rounded-2xl bg-white border transition-all hover:-translate-y-1 hover:shadow-lg"
            style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <GraduationCap size={22} className="text-green-600" />
              </div>
              <button
                title="vertical"
                className="p-1.5 rounded-lg hover:bg-cream transition-colors">
                <MoreVertical size={16} className="text-text-muted" />
              </button>
            </div>

            <h3 className="text-[18px] font-bold text-green-900 mb-1">{cls.name}</h3>
            <p className="text-[12px] text-text-muted mb-4">Teacher: {cls.teacher}</p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-2 rounded-lg bg-cream">
                <div className="flex items-center gap-1 text-[11px] text-text-muted mb-1">
                  <Users size={12} /> Students
                </div>
                <div className="text-[16px] font-bold text-green-900">{cls.students}</div>
              </div>
              <div className="p-2 rounded-lg bg-cream">
                <div className="flex items-center gap-1 text-[11px] text-text-muted mb-1">
                  <BookOpen size={12} /> Subjects
                </div>
                <div className="text-[16px] font-bold text-green-900">{cls.subjects}</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-[12px] mb-1">
                <span className="text-text-muted">Average Score</span>
                <span className="font-semibold text-green-900">{cls.averageScore}%</span>
              </div>
              <div className="h-2 bg-cream rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-green-600"
                  style={{ width: `${cls.averageScore}%` }}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/school/classes/${cls.id}`}
                className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[13px] font-semibold bg-green-800 text-white hover:bg-green-700 transition-all">
                View Details <ChevronRight size={14} />
              </Link>
              <Link
                href={`/school/performance?class=${cls.id}`}
                className="p-2 rounded-lg border border-gray-200 hover:bg-cream transition-all">
                <BarChart3 size={16} className="text-text-muted" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
