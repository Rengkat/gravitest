"use client";

import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  User as UserIcon,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type { StudentWithUser } from "../../types";

interface StudentBasicInfoProps {
  student: StudentWithUser;
}

export function StudentBasicInfo({ student }: StudentBasicInfoProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return "Not provided";
    return new Date(date).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateAge = (dateOfBirth: Date | null) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(student.user.dateOfBirth);

  return (
    <div className="p-6 rounded-2xl bg-white border" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <h2 className="text-lg font-semibold text-green-900 mb-4">Basic Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-start gap-3">
          <UserIcon size={18} className="text-text-muted mt-0.5" />
          <div>
            <p className="text-sm text-text-muted">Full Name</p>
            <p className="font-medium">
              {student.user.firstName} {student.user.middleName || ""} {student.user.lastName}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Mail size={18} className="text-text-muted mt-0.5" />
          <div>
            <p className="text-sm text-text-muted">Email Address</p>
            <p className="font-medium">{student.user.email}</p>
            {student.user.isEmailVerified ? (
              <span className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <CheckCircle size={12} /> Verified
              </span>
            ) : (
              <span className="text-xs text-yellow-600 flex items-center gap-1 mt-1">
                <XCircle size={12} /> Not verified
              </span>
            )}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone size={18} className="text-text-muted mt-0.5" />
          <div>
            <p className="text-sm text-text-muted">Phone Number</p>
            <p className="font-medium">{student.user.phoneNumber || "Not provided"}</p>
            {student.user.isPhoneVerified ? (
              <span className="text-xs text-green-600">Verified</span>
            ) : (
              <span className="text-xs text-yellow-600">Not verified</span>
            )}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar size={18} className="text-text-muted mt-0.5" />
          <div>
            <p className="text-sm text-text-muted">Date of Birth</p>
            <p className="font-medium">{formatDate(student.user.dateOfBirth)}</p>
            {age && <p className="text-xs text-text-muted">Age: {age} years</p>}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin size={18} className="text-text-muted mt-0.5" />
          <div>
            <p className="text-sm text-text-muted">Location</p>
            <p className="font-medium">
              {student.user.lga ? `${student.user.lga}, ` : ""}
              {student.user.stateOfResidence || "Not specified"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <UserIcon size={18} className="text-text-muted mt-0.5" />
          <div>
            <p className="text-sm text-text-muted">Gender</p>
            <p className="font-medium">{student.user.gender || "Not specified"}</p>
          </div>
        </div>
      </div>

      {student.user.bio && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-text-muted mb-1">Bio</p>
          <p className="text-gray-700">{student.user.bio}</p>
        </div>
      )}

      {/* Account Stats */}
      <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-text-muted">Member Since</p>
          <p className="font-medium text-sm">{formatDate(student.user.createdAt)}</p>
        </div>
        <div>
          <p className="text-sm text-text-muted">Total Logins</p>
          <p className="font-medium text-sm">{student.user.totalLoginCount} times</p>
        </div>
      </div>
    </div>
  );
}
