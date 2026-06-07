"use client";

import { GraduationCap, BookOpen, Target, Calendar, Building2, Users } from "lucide-react";
import type { StudentWithUser } from "../../types";

interface StudentAcademicInfoProps {
  student: StudentWithUser;
}

export function StudentAcademicInfo({ student }: StudentAcademicInfoProps) {
  const { studentProfile } = student;

  const formatDate = (date: Date | null) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 rounded-2xl bg-white border" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <h2 className="text-lg font-semibold text-green-900 mb-4">Academic Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-start gap-3">
          <Building2 size={18} className="text-text-muted mt-0.5" />
          <div>
            <p className="text-sm text-text-muted">Current School</p>
            <p className="font-medium">{studentProfile.currentSchool || "Not specified"}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <GraduationCap size={18} className="text-text-muted mt-0.5" />
          <div>
            <p className="text-sm text-text-muted">Current Class</p>
            <p className="font-medium">{studentProfile.currentClass || "Not assigned"}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <BookOpen size={18} className="text-text-muted mt-0.5" />
          <div>
            <p className="text-sm text-text-muted">Admission Number</p>
            <p className="font-medium">{studentProfile.admissionNo || "Not assigned"}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar size={18} className="text-text-muted mt-0.5" />
          <div>
            <p className="text-sm text-text-muted">Graduation Year</p>
            <p className="font-medium">{studentProfile.graduationYear || "Not set"}</p>
          </div>
        </div>
      </div>

      {/* Exam Targets */}
      {(studentProfile.examTargets.length > 0 || studentProfile.targetCourse) && (
        <>
          <div className="mt-4 pt-4 border-t">
            <h3 className="text-md font-semibold text-green-900 mb-3">Exam Targets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studentProfile.examTargets.length > 0 && (
                <div>
                  <p className="text-sm text-text-muted">Target Exams</p>
                  <div className="flex gap-2 flex-wrap mt-1">
                    {studentProfile.examTargets.map((exam) => (
                      <span
                        key={exam}
                        className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {exam}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {studentProfile.examDate && (
                <div>
                  <p className="text-sm text-text-muted">Exam Date</p>
                  <p className="font-medium">{formatDate(studentProfile.examDate)}</p>
                </div>
              )}

              {studentProfile.targetScore && (
                <div>
                  <p className="text-sm text-text-muted">Target Score</p>
                  <p className="font-medium">{studentProfile.targetScore} points</p>
                </div>
              )}

              {studentProfile.targetUniversity && (
                <div>
                  <p className="text-sm text-text-muted">Target University</p>
                  <p className="font-medium">{studentProfile.targetUniversity}</p>
                </div>
              )}

              {studentProfile.targetCourse && (
                <div>
                  <p className="text-sm text-text-muted">Target Course</p>
                  <p className="font-medium">{studentProfile.targetCourse}</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Focus Subjects */}
      {studentProfile.focusSubjects.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <h3 className="text-md font-semibold text-green-900 mb-3">Focus Subjects</h3>
          <div className="flex gap-2 flex-wrap">
            {studentProfile.focusSubjects.map((subject) => (
              <span
                key={subject}
                className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                {subject}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Parent Information */}
      {(studentProfile.parentName || studentProfile.parentPhone) && (
        <div className="mt-4 pt-4 border-t">
          <h3 className="text-md font-semibold text-green-900 mb-3">Parent/Guardian Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentProfile.parentName && (
              <div className="flex items-start gap-3">
                <Users size={18} className="text-text-muted mt-0.5" />
                <div>
                  <p className="text-sm text-text-muted">Parent/Guardian Name</p>
                  <p className="font-medium">{studentProfile.parentName}</p>
                </div>
              </div>
            )}

            {studentProfile.parentPhone && (
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-text-muted mt-0.5" />
                <div>
                  <p className="text-sm text-text-muted">Parent/Guardian Phone</p>
                  <p className="font-medium">{studentProfile.parentPhone}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
