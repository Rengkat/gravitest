"use client";

import Link from "next/link";
import { ChevronRight, Users, BookOpen, Edit, Mail, Phone } from "lucide-react";
import type { SchoolClass } from "@/types/schoolsTypes";
import { SUBJECT_CATEGORIES } from "@/lib/constants/schools";

interface Props {
  schoolId: string;
  cls: SchoolClass;
  isExpanded: boolean;
  onToggle: () => void;
}

export function ClassRow({ schoolId, cls, isExpanded, onToggle }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      {/* Class header — clickable to expand */}
      <div
        className="flex items-center gap-3 p-3 cursor-pointer hover:bg-cream/50 transition-colors"
        onClick={onToggle}>
        <ChevronRight
          size={16}
          className={`text-text-muted transition-transform shrink-0 ${isExpanded ? "rotate-90" : ""}`}
        />

        <span className="text-[14px] font-semibold text-green-900">{cls.name}</span>

        <div className="flex items-center gap-3 text-[12px] text-text-muted">
          <span>{cls.totalStudents} students</span>
          <span>•</span>
          <span>{cls.subjects.length} subjects</span>
          <span>•</span>
          <span>{cls.sessionsCompleted.toLocaleString()} sessions</span>
        </div>

        {/* Status badge */}
        <span
          className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
          style={{
            background: cls.status === "active" ? "#10b98115" : "#ef444415",
            color: cls.status === "active" ? "#10b981" : "#ef4444",
          }}>
          {cls.status}
        </span>

        {/* Score badge */}
        <span
          className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-semibold"
          style={{
            background: cls.averageScore >= 60 ? "#10b98115" : "#f59e0b15",
            color: cls.averageScore >= 60 ? "#10b981" : "#f59e0b",
          }}>
          {cls.averageScore}% avg
        </span>
      </div>

      {/* Expanded section */}
      {isExpanded && (
        <div className="border-t p-4 bg-cream/10" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          {/* Class Admin */}
          <div className="mb-4 p-3 rounded-lg bg-white flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-800 text-white flex items-center justify-center text-[12px] font-bold shrink-0">
                {cls.classAdmin.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <div className="text-[13px] font-semibold text-green-900">
                  {cls.classAdmin.name}
                </div>
                <div className="text-[11px] text-text-muted">Class Admin</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-text-muted flex-wrap">
              <span className="flex items-center gap-1">
                <Mail size={12} />
                {cls.classAdmin.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone size={12} />
                {cls.classAdmin.phone}
              </span>
            </div>
          </div>

          {/* Subjects grid */}
          <div className="mb-4">
            <h5 className="text-[13px] font-semibold text-green-900 mb-2">
              Subjects ({cls.subjects.length})
            </h5>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {cls.subjects.map((subject) => {
                const catCfg = SUBJECT_CATEGORIES[subject.category];
                const CatIcon = catCfg?.icon;
                return (
                  <div
                    key={subject.id}
                    className="p-2.5 rounded-lg bg-white border border-gray-100 flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${catCfg?.color || "#6b7280"}15` }}>
                      {CatIcon && <CatIcon size={14} style={{ color: catCfg?.color }} />}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[12px] font-semibold text-green-900 truncate">
                        {subject.name}
                      </div>
                      <div className="text-[10px] text-text-muted">
                        {subject.code} • {subject.totalQuestions.toLocaleString()} Qs
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Class quick actions */}
          <div className="flex gap-2 flex-wrap">
            <Link
              href={`/admin/schools/${schoolId}/classes/${cls.id}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-[12px] text-text-muted hover:bg-cream transition-colors">
              <Users size={12} />
              View Students
            </Link>
            <Link
              href={`/admin/schools/${schoolId}/classes/${cls.id}/questions`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-800 text-white text-[12px] font-medium hover:bg-green-700 transition-colors">
              <BookOpen size={12} />
              Questions
            </Link>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-[12px] text-text-muted hover:bg-cream transition-colors">
              <Edit size={12} />
              Edit Class
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
