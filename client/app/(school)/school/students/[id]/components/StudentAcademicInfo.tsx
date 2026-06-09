"use client";

import { GraduationCap, BookOpen, Hash, Calendar, Users, Phone, Award } from "lucide-react";
import type { StudentWithUser } from "../../types";

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div
      className="flex items-start gap-3 py-2.5 border-b last:border-0"
      style={{ borderColor: "rgba(30,80,50,0.06)" }}>
      <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={13} className="text-green-700" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">{label}</p>
        <div className="text-[13px] font-medium text-green-900 mt-0.5">{value}</div>
      </div>
    </div>
  );
}

export function StudentAcademicInfo({ student }: { student: StudentWithUser }) {
  const { studentProfile } = student;

  return (
    <div className="space-y-5">
      {/* Class record */}
      <div
        className="rounded-2xl bg-white border p-5"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-3">
          Class Record
        </h2>

        <InfoRow icon={Hash} label="Admission Number" value={studentProfile.admissionNo ?? "—"} />
        <InfoRow
          icon={BookOpen}
          label="Class"
          value={
            studentProfile.currentClass ? (
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold">
                {studentProfile.currentClass}
              </span>
            ) : (
              "—"
            )
          }
        />
        {studentProfile.graduationYear && (
          <InfoRow
            icon={GraduationCap}
            label="Expected Graduation"
            value={studentProfile.graduationYear.toString()}
          />
        )}
        <InfoRow
          icon={Calendar}
          label="Date Enrolled"
          value={new Date(student.user.createdAt).toLocaleDateString("en-NG", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        />
      </div>

      {/* Subjects offered */}
      {studentProfile.focusSubjects.length > 0 && (
        <div
          className="rounded-2xl bg-white border p-5"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
              Subjects Offered
            </h2>
            <span className="text-[11px] text-text-muted">
              {studentProfile.focusSubjects.length} subject
              {studentProfile.focusSubjects.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {studentProfile.focusSubjects.map((subject) => {
              // Get the student's score for this subject if available
              const perf = studentProfile.subjectPerformance?.[subject];
              const score = perf?.averageScore ?? null;
              const scoreColor =
                score === null
                  ? "#6b7280"
                  : score >= 75
                    ? "#10b981"
                    : score >= 50
                      ? "#f59e0b"
                      : "#ef4444";

              return (
                <div
                  key={subject}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-cream border"
                  style={{ borderColor: "rgba(30,80,50,0.08)" }}>
                  <BookOpen size={12} className="text-green-700 shrink-0" />
                  <span className="text-[12px] font-semibold text-green-900">{subject}</span>
                  {score !== null && (
                    <span className="text-[10px] font-bold" style={{ color: scoreColor }}>
                      {score.toFixed(0)}%
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Parent / guardian */}
      {(studentProfile.parentName || studentProfile.parentPhone) && (
        <div
          className="rounded-2xl bg-white border p-5"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-3">
            Parent / Guardian
          </h2>
          {studentProfile.parentName && (
            <InfoRow icon={Users} label="Name" value={studentProfile.parentName} />
          )}
          {studentProfile.parentPhone && (
            <InfoRow icon={Phone} label="Phone" value={studentProfile.parentPhone} />
          )}
        </div>
      )}

      {/* Class standing (if rank/percentile available) */}
      {(studentProfile.leaderboardRank || studentProfile.percentileStanding) && (
        <div
          className="rounded-2xl bg-white border p-5"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-3">
            Class Standing
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {studentProfile.leaderboardRank && (
              <div className="text-center p-3 rounded-xl bg-amber-50 border border-amber-100">
                <Award size={18} className="text-amber-500 mx-auto mb-1" />
                <div className="text-[20px] font-bold text-amber-700">
                  #{studentProfile.leaderboardRank}
                </div>
                <div className="text-[10px] text-amber-600">Class Rank</div>
              </div>
            )}
            {studentProfile.percentileStanding && (
              <div className="text-center p-3 rounded-xl bg-green-50 border border-green-100">
                <GraduationCap size={18} className="text-green-600 mx-auto mb-1" />
                <div className="text-[20px] font-bold text-green-700">
                  {studentProfile.percentileStanding}th
                </div>
                <div className="text-[10px] text-green-600">Percentile</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
