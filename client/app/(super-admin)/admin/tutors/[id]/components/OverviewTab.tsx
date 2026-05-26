import {
  Star, Users, Target, Check, DollarSign, TrendingUp, Heart, RotateCcw,
  Mail, Phone, MapPin, Globe, Calendar, Clock, Plus,
} from "lucide-react";
import { QuickStat, InfoRow, SectionCard, BuildingIcon, HashIcon } from "./Primitives";
import type { Tutor } from "../types";

interface Props {
  tutor: Tutor;
  isEditing: boolean;
  editData: Tutor;
  setEditData: (data: Tutor) => void;
}

export function OverviewTab({ tutor, isEditing, editData, setEditData }: Props) {
  const displayData = isEditing ? editData : tutor;

  return (
    <div className="space-y-6">
      {/* Quick stat strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <QuickStat icon={Star}        label="Rating"      value={tutor.rating.toFixed(1)}                    color="#f59e0b" />
        <QuickStat icon={Users}       label="Students"    value={tutor.totalStudents.toLocaleString()}         color="#3b82f6" />
        <QuickStat icon={Target}      label="Sessions"    value={tutor.totalSessions.toLocaleString()}         color="#8b5cf6" />
        <QuickStat icon={Check}       label="Completion"  value={`${tutor.completionRate}%`}                  color="#10b981" />
        <QuickStat icon={DollarSign}  label="Hourly Rate" value={`₦${tutor.hourlyRate.toLocaleString()}`}     color="#2e8b57" />
        <QuickStat icon={TrendingUp}  label="This Month"  value={`₦${tutor.earnings.thisMonth.toLocaleString()}`} color="#6366f1" />
        <QuickStat icon={Heart}       label="Retention"   value={`${tutor.studentRetentionRate}%`}            color="#ec4899" />
        <QuickStat icon={RotateCcw}   label="Repeat Rate" value={`${tutor.repeatStudentRate}%`}               color="#f97316" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <SectionCard title="About">
            {isEditing ? (
              <textarea
                value={editData.about}
                onChange={(e) => setEditData({ ...editData, about: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] resize-none min-h-[100px] focus:outline-none focus:ring-2 focus:ring-green-500/30"
              />
            ) : (
              <p className="text-[14px] text-text-muted leading-relaxed">{tutor.about}</p>
            )}
          </SectionCard>

          {/* Teaching style */}
          <SectionCard title="Teaching Style">
            {isEditing ? (
              <textarea
                value={editData.teachingStyle}
                onChange={(e) => setEditData({ ...editData, teachingStyle: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] resize-none min-h-[100px] focus:outline-none focus:ring-2 focus:ring-green-500/30"
              />
            ) : (
              <p className="text-[14px] text-text-muted leading-relaxed">{tutor.teachingStyle}</p>
            )}
          </SectionCard>

          {/* Packages */}
          <SectionCard
            title="Session Packages"
            headerRight={
              isEditing ? (
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-800 text-white text-[12px] font-medium hover:bg-green-700 transition-colors">
                  <Plus size={14} /> Add Package
                </button>
              ) : null
            }>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {tutor.packages.map((pkg, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border-2 text-center relative ${
                    pkg.popular ? "border-green-800 bg-green-50" : "border-gray-200"
                  }`}>
                  {pkg.popular && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-green-800 text-white text-[10px] font-bold">
                      Popular
                    </span>
                  )}
                  <h4 className="text-[14px] font-semibold text-green-900 mb-1">{pkg.name}</h4>
                  <p className="text-[11px] text-text-muted mb-2">{pkg.duration}</p>
                  <div className="text-xl font-bold text-green-900 mb-1">
                    ₦{pkg.price.toLocaleString()}
                  </div>
                  {pkg.savings > 0 && (
                    <p className="text-[11px] text-green-600 font-medium">
                      Save ₦{pkg.savings.toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Personal info */}
          <SectionCard title="Personal Information">
            <div className="space-y-3">
              <InfoRow icon={Mail}     label="Email"         value={tutor.email} />
              <InfoRow icon={Phone}    label="Phone"         value={tutor.phone} />
              <InfoRow icon={MapPin}   label="Location"      value={`${tutor.city}, ${tutor.state}`} />
              <InfoRow icon={Globe}    label="Languages"     value={tutor.languages.join(", ")} />
              <InfoRow icon={Calendar} label="Joined"        value={tutor.joinedDate} />
              <InfoRow icon={Clock}    label="Last Active"   value={tutor.lastActive} />
              <InfoRow
                icon={Target}
                label="Teaching Mode"
                value={
                  tutor.teachingMode === "online"
                    ? "Online"
                    : tutor.teachingMode === "in_person"
                      ? "In-Person"
                      : "Both"
                }
              />
            </div>
          </SectionCard>

          {/* Availability */}
          <SectionCard title="Availability">
            <div className="flex flex-wrap gap-1 mb-3">
              {tutor.availability.map((day) => (
                <span
                  key={day}
                  className="px-3 py-1.5 rounded-lg bg-green-50 text-[12px] font-medium text-green-700">
                  {day}
                </span>
              ))}
            </div>
            <h4 className="text-[12px] font-semibold text-green-900 mb-2">Time Slots</h4>
            <div className="flex flex-wrap gap-1">
              {tutor.timeSlots.map((slot) => (
                <span key={slot} className="px-2.5 py-1 rounded-lg bg-cream/50 text-[11px] text-text-muted">
                  {slot}
                </span>
              ))}
            </div>
          </SectionCard>

          {/* Banking */}
          <SectionCard title="Banking Details">
            <div className="space-y-2">
              <InfoRow icon={BuildingIcon} label="Bank"    value={tutor.bankName} />
              <InfoRow icon={HashIcon}     label="Account" value={tutor.accountNumber} />
              <InfoRow icon={Users}        label="Name"    value={tutor.accountName} />
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
