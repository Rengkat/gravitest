"use client";

import { GraduationCap, Users } from "lucide-react";
import type { SchoolClass } from "../../../types";

interface ClassHeaderProps {
  schoolClass: SchoolClass;
}

export function ClassHeader({ schoolClass }: ClassHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center shrink-0">
        <GraduationCap size={28} className="text-green-600" />
      </div>
      <div>
        <h1 className="font-serif text-3xl text-green-900">
          {schoolClass.className}
          {schoolClass.classArm && (
            <span className="text-xl font-normal text-text-muted ml-2">
              ({schoolClass.classArm})
            </span>
          )}
        </h1>
        <p className="text-text-muted flex items-center gap-1 mt-1">
          <Users size={14} />
          {schoolClass.totalStudents} students • {schoolClass.subjects.length} subjects
        </p>
      </div>
    </div>
  );
}
