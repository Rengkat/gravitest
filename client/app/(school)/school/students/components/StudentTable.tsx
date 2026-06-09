"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Eye, TrendingUp } from "lucide-react";
import { StudentActionsMenu } from "./StudentActionsMenu";
import type { StudentWithUser } from "../types";

interface StudentTableProps {
  students: StudentWithUser[];
  onStudentUpdate: (student: StudentWithUser) => void;
  onStudentDelete: (studentId: string) => void;
}

const ITEMS_PER_PAGE = 15;

function getInitials(first: string, last: string) {
  return `${first[0]}${last[0]}`.toUpperCase();
}

function StatusBadge({
  isActive,
  isEmailVerified,
}: {
  isActive: boolean;
  isEmailVerified: boolean;
}) {
  if (!isActive)
    return (
      <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-red-100 text-red-700">
        Deactivated
      </span>
    );
  if (!isEmailVerified)
    return (
      <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-amber-100 text-amber-700">
        Unverified
      </span>
    );
  return (
    <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-green-100 text-green-700">
      Active
    </span>
  );
}

function ScorePill({ score }: { score: number }) {
  const color = score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
  const bg = score >= 75 ? "#10b98115" : score >= 50 ? "#f59e0b15" : "#ef444415";
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
      style={{ color, background: bg }}>
      <TrendingUp size={9} />
      {score.toFixed(0)}%
    </span>
  );
}

function fmtDate(date: Date | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function StudentTable({ students, onStudentUpdate, onStudentDelete }: StudentTableProps) {
  const [page, setPage] = useState(1);
  const total = Math.ceil(students.length / ITEMS_PER_PAGE);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const slice = students.slice(start, start + ITEMS_PER_PAGE);

  return (
    <div
      className="bg-white rounded-2xl border overflow-hidden"
      style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-cream">
            <tr>
              {[
                "Student",
                "Adm. No.",
                "Class",
                "Subjects",
                "Avg. Score",
                "Status",
                "Last Active",
                "",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-green-900 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {slice.map((student) => {
              const { user, studentProfile } = student;
              const name = [user.firstName, user.middleName, user.lastName]
                .filter(Boolean)
                .join(" ");
              const subjectCount = studentProfile.focusSubjects?.length ?? 0;

              return (
                <tr key={user.id} className="hover:bg-cream/30 transition-colors group">
                  {/* Student */}
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 text-[11px] font-bold text-green-700">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          getInitials(user.firstName, user.lastName)
                        )}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/school/students/${user.id}`}
                          className="text-[13px] font-semibold text-green-900 hover:text-green-700 transition-colors leading-tight block truncate max-w-[160px]">
                          {name}
                        </Link>
                        <p className="text-[11px] text-text-muted truncate max-w-[160px]">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Adm No */}
                  <td className="px-4 py-2.5 text-[12px] text-text-muted font-mono">
                    {studentProfile.admissionNo || "—"}
                  </td>

                  {/* Class */}
                  <td className="px-4 py-2.5">
                    {studentProfile.currentClass ? (
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold">
                        {studentProfile.currentClass}
                      </span>
                    ) : (
                      <span className="text-[11px] text-text-muted">—</span>
                    )}
                  </td>

                  {/* Subjects count */}
                  <td className="px-4 py-2.5">
                    <span className="text-[12px] text-text-muted">
                      {subjectCount > 0
                        ? `${subjectCount} subject${subjectCount !== 1 ? "s" : ""}`
                        : "—"}
                    </span>
                  </td>

                  {/* Avg score */}
                  <td className="px-4 py-2.5">
                    <ScorePill score={studentProfile.averageScore} />
                  </td>

                  {/* Status */}
                  <td className="px-4 py-2.5">
                    <StatusBadge isActive={user.isActive} isEmailVerified={user.isEmailVerified} />
                  </td>

                  {/* Last active */}
                  <td className="px-4 py-2.5 text-[11px] text-text-muted whitespace-nowrap">
                    {fmtDate(user.lastLoginAt)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/school/students/${user.id}`}
                        className="p-1.5 rounded-lg hover:bg-green-50 text-text-muted hover:text-green-700 transition-colors"
                        title="View"
                        aria-label={`View ${name}`}>
                        <Eye size={14} />
                      </Link>
                      <StudentActionsMenu
                        student={student}
                        onStudentUpdate={onStudentUpdate}
                        onStudentDelete={onStudentDelete}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}

            {slice.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-[13px] text-text-muted">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > 1 && (
        <div
          className="px-5 py-3 border-t flex items-center justify-between"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <p className="text-[11px] text-text-muted">
            {start + 1}–{Math.min(start + ITEMS_PER_PAGE, students.length)} of {students.length}{" "}
            students
          </p>
          <div className="flex items-center gap-1">
            <button
              title="Previous"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-cream disabled:opacity-40 transition-all">
              <ChevronLeft size={14} />
            </button>
            <span className="px-3 text-[11px] text-text-muted">
              Page {page} of {total}
            </span>
            <button
              title="Next"
              onClick={() => setPage((p) => Math.min(total, p + 1))}
              disabled={page === total}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-cream disabled:opacity-40 transition-all">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
