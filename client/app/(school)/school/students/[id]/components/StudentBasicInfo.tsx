// src/app/school/students/[id]/components/StudentBasicInfo.tsx
"use client";

import {
  Mail,
  Phone,
  Calendar,
  MapPin,
  Hash,
  User,
  BookOpen,
  GraduationCap,
  Users,
  BadgeCheck,
  AlertCircle,
} from "lucide-react";
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

interface Props {
  student: StudentWithUser;
}

export function StudentBasicInfo({ student }: Props) {
  const { user, studentProfile } = student;

  const fullName = [user.firstName, user.middleName, user.lastName].filter(Boolean).join(" ");

  const fmtDate = (d: Date | null) =>
    d
      ? new Date(d).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })
      : "—";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Personal Details */}
      <div
        className="rounded-2xl bg-white border p-5"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-3">
          Personal Details
        </h3>
        <InfoRow icon={User} label="Full Name" value={fullName} />
        <InfoRow
          icon={Mail}
          label="Email"
          value={
            <span className="flex items-center gap-1.5 flex-wrap">
              {user.email}
              {user.isEmailVerified ? (
                <BadgeCheck size={13} className="text-green-500" aria-label="Verified" />
              ) : (
                <AlertCircle size={13} className="text-amber-500" aria-label="Unverified" />
              )}
            </span>
          }
        />
        {user.phoneNumber && <InfoRow icon={Phone} label="Phone" value={user.phoneNumber} />}
        {user?.dateOfBirth && (
          <InfoRow icon={Calendar} label="Date of Birth" value={fmtDate(user.dateOfBirth)} />
        )}
        {user.gender && (
          <InfoRow
            icon={User}
            label="Gender"
            value={<span className="capitalize">{user.gender.toLowerCase()}</span>}
          />
        )}
        {user.stateOfResidence && (
          <InfoRow
            icon={MapPin}
            label="State"
            value={user.lga ? `${user.lga}, ${user.stateOfResidence}` : user.stateOfResidence}
          />
        )}
      </div>

      {/* School Record */}
      <div
        className="rounded-2xl bg-white border p-5"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-3">
          School Record
        </h3>
        <InfoRow icon={Hash} label="Admission No." value={studentProfile.admissionNo ?? "—"} />
        <InfoRow icon={BookOpen} label="Class" value={studentProfile.currentClass ?? "—"} />
        {studentProfile.graduationYear && (
          <InfoRow
            icon={GraduationCap}
            label="Expected Graduation"
            value={studentProfile.graduationYear.toString()}
          />
        )}
        <InfoRow icon={Calendar} label="Date Enrolled" value={fmtDate(user.createdAt)} />
        {studentProfile.parentName && (
          <InfoRow
            icon={Users}
            label="Parent / Guardian"
            value={
              <span>
                {studentProfile.parentName}
                {studentProfile.parentPhone && (
                  <span className="text-text-muted font-normal ml-1.5 text-[11px]">
                    · {studentProfile.parentPhone}
                  </span>
                )}
              </span>
            }
          />
        )}
        {/* Account status */}
        <InfoRow
          icon={BadgeCheck}
          label="Account Status"
          value={
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {user.isActive ? "Active" : "Deactivated"}
            </span>
          }
        />
      </div>
    </div>
  );
}
