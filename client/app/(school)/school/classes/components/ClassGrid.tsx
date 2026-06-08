"use client";

import Link from "next/link";
import {
  GraduationCap,
  Users,
  BookOpen,
  MoreVertical,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { ClassActionsMenu } from "./ClassActionsMenu";
import type { SchoolClass } from "../types";

interface ClassGridProps {
  classes: SchoolClass[];
  onClassUpdate: (updatedClass: SchoolClass) => void;
  onClassDelete: (classId: string) => void;
}

export function ClassGrid({ classes, onClassUpdate, onClassDelete }: ClassGridProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (classes.length === 0) {
    return (
      <div
        className="text-center py-12 bg-white rounded-2xl border"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <GraduationCap size={48} className="mx-auto text-text-muted mb-3" />
        <p className="text-text-muted">No classes found</p>
        <p className="text-sm text-text-muted mt-1">Create your first class to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {classes.map((classItem) => (
        <div
          key={classItem.id}
          className="group p-6 rounded-2xl bg-white border transition-all hover:-translate-y-1 hover:shadow-lg"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <GraduationCap size={22} className="text-green-600" />
            </div>
            <ClassActionsMenu
              classItem={classItem}
              onClassUpdate={onClassUpdate}
              onClassDelete={onClassDelete}
            />
          </div>

          <Link href={`/school/classes/${classItem.id}`}>
            <h3 className="text-[18px] font-bold text-green-900 mb-1 hover:text-green-700 transition-colors">
              {classItem.name}
              {classItem.arm && (
                <span className="text-sm font-normal text-text-muted ml-1">({classItem.arm})</span>
              )}
            </h3>
            <p className="text-[11px] text-text-muted mb-2 font-mono">{classItem.classCode}</p>
          </Link>

          {classItem.description && (
            <p className="text-[12px] text-text-muted mb-4 line-clamp-2">{classItem.description}</p>
          )}

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-2 rounded-lg bg-cream">
              <div className="flex items-center gap-1 text-[11px] text-text-muted mb-1">
                <Users size={12} /> Students
              </div>
              <div className="text-[16px] font-bold text-green-900">{classItem.totalStudents}</div>
            </div>
            <div className="p-2 rounded-lg bg-cream">
              <div className="flex items-center gap-1 text-[11px] text-text-muted mb-1">
                <BookOpen size={12} /> Exams
              </div>
              <div className="text-[16px] font-bold text-green-900">
                {classItem.totalExamsCreated}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1 text-[11px] text-text-muted">
              <Calendar size={12} />
              <span>Created {formatDate(classItem.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              {classItem.isActive ? (
                <span className="flex items-center gap-1 text-[11px] text-green-600">
                  <CheckCircle size={12} /> Active
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] text-red-600">
                  <XCircle size={12} /> Inactive
                </span>
              )}
            </div>
          </div>

          <Link
            href={`/school/classes/${classItem.id}`}
            className="block w-full text-center py-2 rounded-lg text-[13px] font-semibold bg-green-800 text-white hover:bg-green-700 transition-all">
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
}
