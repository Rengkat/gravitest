"use client";

import Link from "next/link";
import { School, MapPin, MoreVertical } from "lucide-react";
import type { SchoolData } from "@/types/schoolsTypes";
import { SCHOOL_TYPES, STATUS_MAP, SUBSCRIPTION_PLANS } from "@/lib/constants/schools";

export function SchoolGridCard({ school }: { school: SchoolData }) {
  const typeConfig = SCHOOL_TYPES[school.type];
  const statusConfig = STATUS_MAP[school.status];
  const planConfig = SUBSCRIPTION_PLANS[school.subscription.plan];
  const TypeIcon = typeConfig.icon;

  return (
    <div
      className="p-5 rounded-2xl bg-white border transition-all hover:-translate-y-1 hover:shadow-lg"
      style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-cream flex items-center justify-center overflow-hidden shrink-0">
            {school.logo ? (
              <img src={school.logo} alt="" className="w-full h-full object-cover" />
            ) : (
              <School size={28} className="text-green-800" />
            )}
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-green-900 line-clamp-1">{school.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <span
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-semibold"
                style={{ background: typeConfig.bg, color: typeConfig.color }}>
                <TypeIcon size={8} />
                {typeConfig.label}
              </span>
              <span
                className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold"
                style={{ background: statusConfig.bg, color: statusConfig.text }}>
                {statusConfig.label}
              </span>
            </div>
          </div>
        </div>
        <span
          className="px-2 py-1 rounded-full text-[10px] font-semibold shrink-0"
          style={{ background: planConfig.bg, color: planConfig.color }}>
          {planConfig.label}
        </span>
      </div>

      {/* Location */}
      <div className="flex items-center gap-1.5 mb-3 text-[12px] text-text-muted">
        <MapPin size={12} />
        <span>
          {school.location.city}, {school.location.state}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <StatTile label="Students" value={school.stats.totalStudents} />
        <StatTile label="Classes" value={school.stats.totalClasses} />
        <StatTile label="Performance" value={`${school.stats.averagePerformance}%`} />
        <StatTile label="Teachers" value={school.stats.totalTeachers} />
      </div>

      {/* Features */}
      <div className="flex flex-wrap gap-1 mb-4">
        {school.subscription.features.slice(0, 3).map((f) => (
          <span key={f} className="px-2 py-0.5 rounded-full bg-green-50 text-[10px] text-green-700">
            {f}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Link
          href={`/admin/schools/${school.id}`}
          className="flex-1 py-2 rounded-lg bg-green-800 text-white text-[12px] font-semibold text-center hover:bg-green-700 transition-all">
          View Details
        </Link>
        <button title="mute" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <MoreVertical size={14} className="text-text-muted" />
        </button>
      </div>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-2 rounded-lg bg-cream/50 text-center">
      <div className="text-lg font-bold text-green-900">{value}</div>
      <div className="text-[10px] text-text-muted">{label}</div>
    </div>
  );
}
