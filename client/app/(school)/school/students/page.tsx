"use client";

import { useState } from "react";
import { Plus, Search, Filter, Download, Users, UserCheck, UserX, BookOpen } from "lucide-react";
import { StudentTable } from "./components/StudentTable";
import type { StudentWithUser } from "./types";
import { MOCK_STUDENTS } from "./mock";

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentWithUser[]>(MOCK_STUDENTS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [filterClass, setFilterClass] = useState("all");

  const uniqueClasses = [
    ...new Set(students.map((s) => s.studentProfile.currentClass).filter(Boolean)),
  ] as string[];

  const stats = {
    total: students.length,
    active: students.filter((s) => s.user.isActive).length,
    inactive: students.filter((s) => !s.user.isActive).length,
    classes: uniqueClasses.length,
  };

  // Per-class counts for the inline distribution
  const byClass = students.reduce<Record<string, number>>((acc, s) => {
    const c = s.studentProfile.currentClass ?? "Unassigned";
    acc[c] = (acc[c] ?? 0) + 1;
    return acc;
  }, {});

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      `${s.user.firstName} ${s.user.lastName} ${s.user.email} ${s.studentProfile.admissionNo ?? ""}`
        .toLowerCase()
        .includes(q);
    const matchStatus =
      filterStatus === "all"
        ? true
        : filterStatus === "active"
          ? s.user.isActive
          : !s.user.isActive;
    const matchClass =
      filterClass === "all"
        ? true
        : (s.studentProfile.currentClass ?? "Unassigned") === filterClass;
    return matchSearch && matchStatus && matchClass;
  });

  const handleUpdate = (updated: StudentWithUser) =>
    setStudents((prev) => prev.map((s) => (s.user.id === updated.user.id ? updated : s)));

  const handleDelete = (id: string) => setStudents((prev) => prev.filter((s) => s.user.id !== id));

  return (
    <div className="max-w-7xl mx-auto">
      {/* ── Page header ── */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="font-serif text-3xl text-green-900 mb-1">Students</h1>
          <p className="text-[13px] text-text-muted">
            {stats.total} students across {stats.classes} class{stats.classes !== 1 ? "es" : ""}
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-800 text-white text-[13px] font-semibold hover:bg-green-700 transition-all">
          <Plus size={15} /> Add Student
        </button>
      </div>

      {/* ── Stats row (compact, single line) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { icon: Users, label: "Total", value: stats.total, color: "#2e8b57", bg: "#2e8b5715" },
          {
            icon: UserCheck,
            label: "Active",
            value: stats.active,
            color: "#10b981",
            bg: "#10b98115",
          },
          {
            icon: UserX,
            label: "Inactive",
            value: stats.inactive,
            color: "#ef4444",
            bg: "#ef444415",
          },
          {
            icon: BookOpen,
            label: "Classes",
            value: stats.classes,
            color: "#8b5cf6",
            bg: "#8b5cf615",
          },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div
            key={label}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border"
            style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: bg }}>
              <Icon size={17} style={{ color }} />
            </div>
            <div>
              <div className="text-[20px] font-bold text-green-900 leading-tight">{value}</div>
              <div className="text-[10px] text-text-muted font-semibold uppercase tracking-wide">
                {label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Class distribution — compact inline bar ── */}
      {uniqueClasses.length > 0 && (
        <div
          className="rounded-2xl bg-white border p-4 mb-5"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
              By Class
            </h3>
            <span className="text-[11px] text-text-muted">{stats.total} total</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(byClass)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([cls, count]) => (
                <button
                  key={cls}
                  onClick={() => setFilterClass(filterClass === cls ? "all" : cls)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[12px] font-semibold transition-all ${
                    filterClass === cls
                      ? "bg-green-800 text-white border-green-800"
                      : "bg-cream border-gray-200 text-green-900 hover:border-green-400"
                  }`}>
                  {cls}
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${filterClass === cls ? "bg-white/20 text-white" : "bg-white text-text-muted"}`}>
                    {count}
                  </span>
                </button>
              ))}
            {filterClass !== "all" && (
              <button
                onClick={() => setFilterClass("all")}
                className="px-3 py-1.5 rounded-xl border border-dashed border-gray-300 text-[11px] text-text-muted hover:bg-cream transition-all">
                Clear filter
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Search + filters ── */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search name, email, admission no…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500 text-[13px]"
          />
        </div>

        <select
          title="Status filter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500 text-[13px]">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <select
          title="Class filter"
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500 text-[13px]">
          <option value="all">All Classes</option>
          {uniqueClasses.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 hover:bg-cream transition-all text-[13px]">
          <Filter size={14} /> Filter
        </button>

        <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 hover:bg-cream transition-all text-[13px]">
          <Download size={14} /> Export
        </button>
      </div>

      {/* Result count when filtering */}
      {(search || filterStatus !== "all" || filterClass !== "all") && (
        <p className="text-[12px] text-text-muted mb-3">
          Showing <strong className="text-green-900">{filtered.length}</strong> of {students.length}{" "}
          students
        </p>
      )}

      {/* ── Table ── */}
      <StudentTable
        students={filtered}
        onStudentUpdate={handleUpdate}
        onStudentDelete={handleDelete}
      />
    </div>
  );
}
