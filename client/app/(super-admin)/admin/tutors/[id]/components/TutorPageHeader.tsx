import Link from "next/link";
import {
  ArrowLeft, Users, Star, Target, MapPin,
  BadgeCheck, Crown, Ban, UserCheck, Edit, Save, X,
} from "lucide-react";
import { STATUS_COLOR } from "../constants";
import type { Tutor } from "../types";

interface Props {
  tutor: Tutor;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancelEdit: () => void;
  onSuspendClick: () => void;
  onActivate: () => void;
}

export function TutorPageHeader({
  tutor,
  isEditing,
  onEdit,
  onSave,
  onCancelEdit,
  onSuspendClick,
  onActivate,
}: Props) {
  return (
    <div className="mb-8">
      <Link
        href="/admin/tutors"
        className="inline-flex items-center gap-2 text-[14px] text-text-muted hover:text-green-800 mb-4 transition-colors">
        <ArrowLeft size={16} /> Back to Tutors
      </Link>

      <div className="flex items-start justify-between flex-wrap gap-4">
        {/* Avatar + identity */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-cream flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
              {tutor.avatar
                ? <img src={tutor.avatar} alt="" className="w-full h-full object-cover" />
                : <Users size={36} className="text-green-800" />
              }
            </div>
            {tutor.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-white" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="font-serif text-3xl text-green-900">{tutor.name}</h1>
              <span className={`px-3 py-1 rounded-full text-[12px] font-semibold capitalize ${STATUS_COLOR[tutor.status]}`}>
                {tutor.status.replace("_", " ")}
              </span>
              {tutor.isVerified && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-[12px] font-semibold">
                  <BadgeCheck size={14} /> Verified
                </span>
              )}
              {tutor.isFeatured && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-[12px] font-semibold">
                  <Crown size={14} /> Featured
                </span>
              )}
            </div>
            <p className="text-text-muted">{tutor.title}</p>
            <div className="flex items-center gap-4 mt-2 text-[13px] text-text-muted flex-wrap">
              <span className="flex items-center gap-1">
                <Star size={14} className="text-gold fill-gold" />
                {tutor.rating} ({tutor.reviewCount} reviews)
              </span>
              <span className="flex items-center gap-1">
                <Users size={14} /> {tutor.totalStudents.toLocaleString()} students
              </span>
              <span className="flex items-center gap-1">
                <Target size={14} /> {tutor.totalSessions.toLocaleString()} sessions
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={14} /> {tutor.city}, {tutor.state}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          {tutor.status === "suspended" ? (
            <button
              onClick={onActivate}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-800 text-white hover:bg-green-700 transition-all text-[14px] font-semibold">
              <UserCheck size={16} /> Reactivate
            </button>
          ) : (
            <button
              onClick={onSuspendClick}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-all text-[14px] font-semibold">
              <Ban size={16} /> Suspend
            </button>
          )}

          {isEditing ? (
            <>
              <button
                onClick={onCancelEdit}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-text-muted hover:bg-cream transition-all text-[14px] font-semibold">
                <X size={16} /> Cancel
              </button>
              <button
                onClick={onSave}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-800 text-white hover:bg-green-700 transition-all shadow-lg text-[14px] font-semibold">
                <Save size={16} /> Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-800 text-white hover:bg-green-700 transition-all shadow-lg text-[14px] font-semibold">
              <Edit size={16} /> Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
