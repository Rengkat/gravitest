import Link from "next/link";
import { Users, Star, MapPin } from "lucide-react";
import { STATUS_CONFIG, VERIFICATION_CONFIG, CATEGORY_CONFIG, SPECIALIZATIONS } from "../constants";
import type { Tutor } from "../types";

interface Props {
  tutor: Tutor;
  isSelected: boolean;
  onSelect: () => void;
}

export function TutorCard({ tutor, isSelected, onSelect }: Props) {
  const statusConfig = STATUS_CONFIG[tutor.status];
  const verifConfig = VERIFICATION_CONFIG[tutor.verificationLevel];
  const catConfig = CATEGORY_CONFIG[tutor.category];
  const VerifIcon = verifConfig.icon;
  const CatIcon = catConfig.icon;

  return (
    <div
      className={`p-5 rounded-2xl bg-white border transition-all hover:-translate-y-1 hover:shadow-lg group relative ${
        isSelected ? "ring-2 ring-green-800 shadow-lg" : ""
      }`}
      style={{ borderColor: "rgba(30,80,50,0.08)" }}>

      {/* Selection checkbox */}
      <div className="absolute top-3 left-3 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 rounded border-gray-300 text-green-800 focus:ring-green-500"
        />
      </div>

      {/* Avatar & header */}
      <div className="flex items-start justify-between mb-3 mt-2">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-cream flex items-center justify-center overflow-hidden">
              {tutor.avatar ? (
                <img src={tutor.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <Users size={28} className="text-green-800" />
              )}
            </div>
            {tutor.isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-500 border-2 border-white" />
            )}
            <div
              className="absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: catConfig.bg }}>
              <CatIcon size={10} style={{ color: catConfig.color }} />
            </div>
          </div>
          <div>
            <h3 className="text-[14px] font-semibold text-green-900 line-clamp-1">{tutor.name}</h3>
            <p className="text-[11px] text-text-muted line-clamp-1">{tutor.title}</p>
          </div>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <span
            className="px-2 py-0.5 rounded-full text-[9px] font-semibold"
            style={{ background: statusConfig.bg, color: statusConfig.text }}>
            {statusConfig.label}
          </span>
          <span className="flex items-center gap-1 text-[9px]" style={{ color: verifConfig.text }}>
            <VerifIcon size={9} /> {verifConfig.label}
          </span>
        </div>
      </div>

      {/* Specializations */}
      <div className="flex flex-wrap gap-1 mb-3">
        {tutor.specialization.slice(0, 3).map((spec) => {
          const specConfig = SPECIALIZATIONS[spec];
          return (
            <span
              key={spec}
              className="px-2 py-0.5 rounded-full text-[9px] font-medium"
              style={{ background: specConfig?.bg, color: specConfig?.color }}>
              {specConfig?.label || spec}
            </span>
          );
        })}
        {tutor.specialization.length > 3 && (
          <span className="px-2 py-0.5 rounded-full text-[9px] text-text-muted bg-gray-100">
            +{tutor.specialization.length - 3}
          </span>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="p-2 rounded-lg bg-cream/50 text-center">
          <div className="flex items-center justify-center gap-1 text-[12px] font-bold text-green-900">
            <Star size={10} className="text-gold fill-gold" /> {tutor.rating.toFixed(1)}
          </div>
          <div className="text-[9px] text-text-muted">{tutor.reviewCount} reviews</div>
        </div>
        <div className="p-2 rounded-lg bg-cream/50 text-center">
          <div className="text-[12px] font-bold text-green-900">{tutor.totalStudents}</div>
          <div className="text-[9px] text-text-muted">students</div>
        </div>
        <div className="p-2 rounded-lg bg-cream/50 text-center">
          <div className="text-[12px] font-bold text-green-900">{tutor.totalSessions}</div>
          <div className="text-[9px] text-text-muted">sessions</div>
        </div>
        <div className="p-2 rounded-lg bg-cream/50 text-center">
          <div className="text-[12px] font-bold text-green-900">
            ₦{(tutor.hourlyRate / 1000).toFixed(0)}K
          </div>
          <div className="text-[9px] text-text-muted">/hour</div>
        </div>
      </div>

      {/* Location & experience */}
      <div className="flex items-center justify-between text-[10px] text-text-muted mb-3">
        <span className="flex items-center gap-1">
          <MapPin size={10} /> {tutor.city}, {tutor.state}
        </span>
        <span>{tutor.experience} yrs exp</span>
      </div>

      {/* CTA */}
      <Link
        href={`/admin/tutors/${tutor.id}`}
        className="block w-full py-2 rounded-lg bg-green-800 text-white text-[12px] font-semibold text-center hover:bg-green-700 transition-all">
        View Profile
      </Link>
    </div>
  );
}
