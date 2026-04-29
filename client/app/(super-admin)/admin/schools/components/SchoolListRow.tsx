"use client";

import Link from "next/link";
import {
  School,
  ChevronRight,
  Eye,
  Edit,
  MapPin,
  Hash,
  Calendar,
  Phone,
  Mail,
  Globe,
  Home,
  Target,
  Activity,
  DollarSign,
  Plus,
  BadgeCheck,
} from "lucide-react";
import type { SchoolData } from "@/types/schoolsTypes";
import { SCHOOL_TYPES, STATUS_MAP, SUBSCRIPTION_PLANS } from "@/lib/constants/schools";
import { InfoItem } from "./Primitives";
import { ClassRow } from "./ClassRow";

interface Props {
  school: SchoolData;
  isExpanded: boolean;
  expandedClass: string | null;
  isSelected: boolean;
  onToggleExpand: () => void;
  onToggleClass: (id: string) => void;
  onToggleSelect: (id: string) => void;
  onAddClass: (schoolId: string) => void;
}

export function SchoolListRow({
  school,
  isExpanded,
  expandedClass,
  isSelected,
  onToggleExpand,
  onToggleClass,
  onToggleSelect,
  onAddClass,
}: Props) {
  const typeConfig = SCHOOL_TYPES[school.type];
  const statusConfig = STATUS_MAP[school.status];
  const planConfig = SUBSCRIPTION_PLANS[school.subscription.plan];
  const TypeIcon = typeConfig.icon;

  return (
    <div
      className="bg-white rounded-2xl border overflow-hidden transition-all"
      style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      {/* ── School header row ── */}
      <div
        className="p-5 flex items-center gap-4 cursor-pointer hover:bg-cream/30 transition-colors"
        onClick={onToggleExpand}>
        {/* Checkbox + chevron */}
        <div className="flex items-center gap-1 shrink-0">
          <input
            title="toggle"
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onToggleSelect(school.id);
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-4 h-4 rounded border-gray-300 text-green-800"
          />
          <ChevronRight
            size={20}
            className={`text-text-muted transition-transform ${isExpanded ? "rotate-90" : ""}`}
          />
        </div>

        {/* Logo / initial */}
        <div className="w-12 h-12 rounded-xl bg-cream flex items-center justify-center overflow-hidden shrink-0">
          {school.logo ? (
            <img src={school.logo} alt="" className="w-full h-full object-cover" />
          ) : (
            <School size={24} className="text-green-800" />
          )}
        </div>

        {/* Name + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-[15px] font-semibold text-green-900 truncate">{school.name}</h3>
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{ background: typeConfig.bg, color: typeConfig.color }}>
              <TypeIcon size={10} />
              {typeConfig.label}
            </span>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{ background: statusConfig.bg, color: statusConfig.text }}>
              {statusConfig.label}
            </span>
          </div>
          <div className="flex items-center gap-4 text-[12px] text-text-muted flex-wrap">
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {school.location.city}, {school.location.state}
            </span>
            <span className="flex items-center gap-1">
              <Hash size={12} />
              {school.code}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              Est. {school.foundedYear}
            </span>
          </div>
        </div>

        {/* Stats (desktop) */}
        <div className="hidden md:flex items-center gap-6 shrink-0">
          <StatCol label="Students" value={school.stats.totalStudents} />
          <StatCol label="Classes" value={school.stats.totalClasses} />
          <StatCol label="Performance" value={`${school.stats.averagePerformance}%`} />
        </div>

        {/* Plan badge */}
        <span
          className="px-3 py-1.5 rounded-full text-[11px] font-semibold shrink-0"
          style={{ background: planConfig.bg, color: planConfig.color }}>
          {planConfig.label}
        </span>

        {/* Quick actions */}
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <Link
            href={`/admin/schools/${school.id}`}
            className="p-2 rounded-lg hover:bg-green-50 transition-colors">
            <Eye size={16} className="text-text-muted hover:text-green-600" />
          </Link>
          <button title="edit" className="p-2 rounded-lg hover:bg-blue-50 transition-colors">
            <Edit size={16} className="text-text-muted hover:text-blue-600" />
          </button>
        </div>
      </div>

      {/* ── Expanded detail panel ── */}
      {isExpanded && (
        <div
          className="border-t px-5 py-4 bg-cream/20"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          {/* Contact / stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <InfoItem icon={Phone} label="Phone" value={school.contact.phone} />
            <InfoItem icon={Mail} label="Email" value={school.contact.email} />
            <InfoItem icon={Globe} label="Website" value={school.contact.website || "N/A"} />
            <InfoItem icon={Home} label="Address" value={school.location.address} />
            <InfoItem
              icon={Target}
              label="Avg Performance"
              value={`${school.stats.averagePerformance}%`}
            />
            <InfoItem
              icon={Activity}
              label="Sessions Done"
              value={school.stats.sessionsCompleted.toLocaleString()}
            />
            <InfoItem
              icon={Hash}
              label="Questions Done"
              value={school.stats.questionsAttempted.toLocaleString()}
            />
            <InfoItem
              icon={DollarSign}
              label="Total Spent"
              value={`₦${school.stats.totalSpent.toLocaleString()}`}
            />
          </div>

          {/* Subscription row */}
          <div className="p-4 rounded-xl bg-white mb-6 flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span
                  className="px-3 py-1 rounded-full text-[12px] font-semibold"
                  style={{ background: planConfig.bg, color: planConfig.color }}>
                  {planConfig.label} Plan
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-[12px] font-semibold ${
                    school.subscription.status === "active"
                      ? "bg-green-100 text-green-600"
                      : school.subscription.status === "trial"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-red-100 text-red-600"
                  }`}>
                  {school.subscription.status}
                </span>
              </div>
              <div className="text-[13px] text-text-muted">
                {school.subscription.maxStudents.toLocaleString()} students •{" "}
                {school.subscription.maxClasses} classes • Expires {school.subscription.expiryDate}
              </div>
            </div>
            <button className="px-4 py-2 rounded-lg bg-green-800 text-white text-[13px] font-medium hover:bg-green-700 transition-all">
              Manage Subscription
            </button>
          </div>

          {/* Classes */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-serif text-lg text-green-900">
                Classes ({school.classes.length})
              </h4>
              <button
                onClick={() => onAddClass(school.id)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-800 text-white text-[12px] font-medium hover:bg-green-700 transition-all">
                <Plus size={14} />
                Add Class
              </button>
            </div>

            <div className="space-y-2">
              {school.classes.map((cls) => (
                <ClassRow
                  key={cls.id}
                  schoolId={school.id}
                  cls={cls}
                  isExpanded={expandedClass === cls.id}
                  onToggle={() => onToggleClass(cls.id)}
                />
              ))}
            </div>
          </div>

          {/* Admins */}
          <div className="mb-6">
            <h4 className="font-serif text-lg text-green-900 mb-3">
              School Admins ({school.admins.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {school.admins.map((admin) => (
                <div
                  key={admin.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-[12px] font-bold text-green-800 shrink-0">
                      {admin.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-green-900">{admin.name}</div>
                      <div className="text-[11px] text-text-muted capitalize">
                        {admin.role.replace(/_/g, " ")}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      admin.status === "active"
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                    {admin.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Facilities & Accreditation */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-[13px] font-semibold text-green-900 mb-2">Facilities</h4>
              <div className="flex flex-wrap gap-1">
                {school.facilities.map((f) => (
                  <span
                    key={f}
                    className="px-2 py-1 rounded-full bg-green-50 text-[11px] text-green-700">
                    {f}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[13px] font-semibold text-green-900 mb-2">Accreditation</h4>
              <div className="flex flex-wrap gap-1">
                {school.accreditation.map((a) => (
                  <span
                    key={a}
                    className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-[11px] text-blue-700">
                    <BadgeCheck size={10} />
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCol({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center">
      <div className="text-lg font-bold text-green-900">{value}</div>
      <div className="text-[10px] text-text-muted">{label}</div>
    </div>
  );
}
