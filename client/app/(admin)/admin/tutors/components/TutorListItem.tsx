import Link from "next/link";
import { Users, Star, Eye, Crown } from "lucide-react";
import { STATUS_CONFIG, VERIFICATION_CONFIG, CATEGORY_CONFIG, SPECIALIZATIONS } from "../constants";
import type { Tutor } from "../types";

interface Props {
  tutor: Tutor;
  isSelected: boolean;
  onSelect: () => void;
}

export function TutorListItem({ tutor, isSelected, onSelect }: Props) {
  const statusConfig = STATUS_CONFIG[tutor.status];
  const verifConfig = VERIFICATION_CONFIG[tutor.verificationLevel];
  const catConfig = CATEGORY_CONFIG[tutor.category];
  const VerifIcon = verifConfig.icon;
  const CatIcon = catConfig.icon;

  return (
    <div
      className={`p-4 rounded-2xl bg-white border flex items-center gap-4 hover:bg-cream/30 transition-colors group ${
        isSelected ? "ring-2 ring-green-800 bg-green-50" : ""
      }`}
      style={{ borderColor: "rgba(30,80,50,0.08)" }}>

      <input
        type="checkbox"
        checked={isSelected}
        onChange={onSelect}
        className="w-4 h-4 rounded border-gray-300 text-green-800 focus:ring-green-500 shrink-0"
      />

      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center overflow-hidden">
          {tutor.avatar ? (
            <img src={tutor.avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            <Users size={22} className="text-green-800" />
          )}
        </div>
        {tutor.isOnline && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h3 className="text-[14px] font-semibold text-green-900">{tutor.name}</h3>
          <span
            className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold flex items-center gap-0.5"
            style={{ background: catConfig.bg, color: catConfig.color }}>
            <CatIcon size={8} /> {catConfig.label}
          </span>
          <span
            className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold"
            style={{ background: statusConfig.bg, color: statusConfig.text }}>
            {statusConfig.label}
          </span>
          <span
            className="flex items-center gap-0.5 text-[9px]"
            style={{ color: verifConfig.text }}>
            <VerifIcon size={9} /> {verifConfig.label}
          </span>
          {tutor.isFeatured && (
            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-purple-100 text-purple-600 flex items-center gap-0.5">
              <Crown size={9} /> Featured
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-[11px] text-text-muted flex-wrap">
          <span>{tutor.title}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Star size={10} className="text-gold fill-gold" /> {tutor.rating.toFixed(1)} ({tutor.reviewCount})
          </span>
          <span>•</span>
          <span>{tutor.totalStudents} students</span>
          <span>•</span>
          <span>{tutor.totalSessions} sessions</span>
        </div>

        <div className="flex flex-wrap gap-1 mt-2">
          {tutor.specialization.slice(0, 4).map((spec) => {
            const specConfig = SPECIALIZATIONS[spec];
            return (
              <span
                key={spec}
                className="px-1.5 py-0.5 rounded-full text-[8px] font-medium"
                style={{ background: specConfig?.bg, color: specConfig?.color }}>
                {specConfig?.label || spec}
              </span>
            );
          })}
        </div>
      </div>

      {/* Earnings */}
      <div className="text-right shrink-0">
        <div className="text-[14px] font-bold text-green-900">
          ₦{tutor.hourlyRate.toLocaleString()}
          <span className="text-[11px] text-text-muted font-normal">/hr</span>
        </div>
        <div className="text-[10px] text-text-muted">
          ₦{tutor.earningsThisMonth.toLocaleString()} this mo
        </div>
      </div>

      {/* Action */}
      <Link
        href={`/admin/tutors/${tutor.id}`}
        className="p-2 rounded-lg hover:bg-green-50 transition-colors shrink-0">
        <Eye size={16} className="text-text-muted group-hover:text-green-600" />
      </Link>
    </div>
  );
}
