"use client";

import { Plus, Trash2, Users, BookOpen, ChevronRight, Mail, Phone } from "lucide-react";
import type { SchoolData } from "@/types/schoolsTypes";
import { SUBJECT_CATEGORIES } from "@/lib/constants/schools";
import type { SchoolActionType } from "../useSchoolDetail";

interface Props {
  school: SchoolData;
  expandedClass: string | null;
  onToggleClass: (id: string) => void;
  onAction: (a: SchoolActionType, meta?: { classId?: string }) => void;
}

export function ClassesTab({ school, expandedClass, onToggleClass, onAction }: Props) {
  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-text-muted">
          {school.classes.length} class{school.classes.length !== 1 ? "es" : ""} ·{" "}
          {school.stats.totalStudents.toLocaleString()} total students
        </p>
        <button
          onClick={() => onAction("add_class")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-800 text-white text-[13px] font-semibold hover:bg-green-700 transition-all">
          <Plus size={14} /> Add Class
        </button>
      </div>

      {school.classes.length === 0 ? (
        <div
          className="rounded-2xl bg-white border p-12 text-center"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <Users size={32} className="text-text-muted mx-auto mb-3 opacity-40" />
          <p className="text-[14px] font-semibold text-green-900 mb-1">No classes yet</p>
          <p className="text-[12px] text-text-muted mb-4">Add the first class to this school.</p>
          <button
            onClick={() => onAction("add_class")}
            className="px-4 py-2 rounded-xl bg-green-800 text-white text-[13px] font-semibold hover:bg-green-700 transition-all">
            Add Class
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {school.classes.map((cls) => {
            const isExpanded = expandedClass === cls.id;
            return (
              <div
                key={cls.id}
                className="rounded-2xl bg-white border overflow-hidden"
                style={{ borderColor: "rgba(30,80,50,0.08)" }}>
                {/* Row header */}
                <div
                  className="flex items-center gap-3 p-4 cursor-pointer hover:bg-cream/30 transition-colors"
                  onClick={() => onToggleClass(cls.id)}>
                  <ChevronRight
                    size={15}
                    className={`text-text-muted transition-transform shrink-0 ${isExpanded ? "rotate-90" : ""}`}
                  />

                  {/* Level badge */}
                  <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-bold shrink-0">
                    {cls.level}
                  </span>

                  <span className="text-[14px] font-semibold text-green-900 flex-1 min-w-0 truncate">
                    {cls.name}
                  </span>

                  <div className="hidden sm:flex items-center gap-4 text-[12px] text-text-muted">
                    <span className="flex items-center gap-1">
                      <Users size={11} /> {cls.totalStudents}/{cls.capacity}
                    </span>
                    <span>{cls.subjects.length} subjects</span>
                    <span>{cls.sessionsCompleted.toLocaleString()} sessions</span>
                  </div>

                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0"
                    style={{
                      background: cls.status === "active" ? "#10b98115" : "#ef444415",
                      color: cls.status === "active" ? "#10b981" : "#ef4444",
                    }}>
                    {cls.status}
                  </span>

                  <span
                    className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0"
                    style={{
                      background: cls.averageScore >= 60 ? "#10b98115" : "#f59e0b15",
                      color: cls.averageScore >= 60 ? "#10b981" : "#f59e0b",
                    }}>
                    {cls.averageScore}% avg
                  </span>
                </div>

                {/* Expanded body */}
                {isExpanded && (
                  <div
                    className="border-t p-5 bg-cream/10 space-y-4"
                    style={{ borderColor: "rgba(30,80,50,0.08)" }}>
                    {/* Class admin */}
                    <div className="p-3 rounded-xl bg-white border border-gray-100 flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-green-800 text-white flex items-center justify-center text-[11px] font-bold shrink-0">
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
                          <Mail size={11} /> {cls.classAdmin.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone size={11} /> {cls.classAdmin.phone}
                        </span>
                      </div>
                    </div>

                    {/* Subjects grid */}
                    {cls.subjects.length > 0 && (
                      <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2">
                          Subjects ({cls.subjects.length})
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                          {cls.subjects.map((subject) => {
                            const catCfg = SUBJECT_CATEGORIES[subject.category];
                            const CatIcon = catCfg?.icon;
                            return (
                              <div
                                key={subject.id}
                                className="p-2.5 rounded-xl bg-white border border-gray-100 flex items-center gap-2">
                                <div
                                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                                  style={{ background: `${catCfg?.color || "#6b7280"}15` }}>
                                  {CatIcon && (
                                    <CatIcon size={13} style={{ color: catCfg?.color }} />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <div className="text-[12px] font-semibold text-green-900 truncate">
                                    {subject.name}
                                  </div>
                                  <div className="text-[10px] text-text-muted">
                                    {subject.code} · {subject.totalQuestions.toLocaleString()} Qs
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 flex-wrap pt-1">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-800 text-white text-[12px] font-medium hover:bg-green-700 transition-all">
                        <BookOpen size={12} /> Questions
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-[12px] text-green-900 hover:bg-cream transition-all">
                        <Users size={12} /> View Students
                      </button>
                      <button
                        onClick={() => onAction("delete_class", { classId: cls.id })}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-100 bg-red-50 text-red-600 text-[12px] hover:bg-red-100 transition-all ml-auto">
                        <Trash2 size={12} /> Remove Class
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
