"use client";

import Link from "next/link";
import {
  School,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  ChevronRight,
  Hash,
  Quote,
} from "lucide-react";
import type { SchoolData } from "@/types/schoolsTypes";
import { SCHOOL_TYPES, STATUS_MAP, SUBSCRIPTION_PLANS } from "@/lib/constants/schools";

export function SchoolDetailHeader({ school }: { school: SchoolData }) {
  const typeCfg = SCHOOL_TYPES[school.type];
  const statusCfg = STATUS_MAP[school.status];
  const planCfg = SUBSCRIPTION_PLANS[school.subscription.plan];
  const TypeIcon = typeCfg.icon;

  return (
    <div className="mb-6">
      {/* Breadcrumb */}
      <nav
        className="flex items-center gap-1.5 text-[12px] text-text-muted mb-5"
        aria-label="Breadcrumb">
        <Link href="/admin/schools" className="hover:text-green-700 transition-colors">
          Schools
        </Link>
        <ChevronRight size={12} />
        <span className="text-green-900 font-medium">{school.name}</span>
      </nav>

      {/* Header card */}
      <div
        className="rounded-2xl bg-white border p-6 flex flex-col lg:flex-row gap-6"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        {/* Left: logo + identity */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div
            className="w-16 h-16 rounded-2xl bg-cream flex items-center justify-center shrink-0 overflow-hidden border"
            style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            {school.logo ? (
              <img src={school.logo} alt={school.name} className="w-full h-full object-cover" />
            ) : (
              <School size={28} className="text-green-800" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <h1 className="font-serif text-2xl text-green-900 leading-tight">{school.name}</h1>
              <span className="font-mono text-[11px] text-text-muted bg-cream px-2 py-0.5 rounded-full">
                {school.code}
              </span>
            </div>

            {school.motto && (
              <p className="flex items-start gap-1.5 text-[12px] text-text-muted italic mb-2.5">
                <Quote size={11} className="mt-0.5 shrink-0" />
                {school.motto}
              </p>
            )}

            {/* Badge row */}
            <div className="flex flex-wrap gap-1.5">
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                style={{ background: typeCfg.bg, color: typeCfg.color }}>
                <TypeIcon size={9} /> {typeCfg.label}
              </span>
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                style={{ background: statusCfg.bg, color: statusCfg.text }}>
                {statusCfg.label}
              </span>
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                style={{ background: planCfg.bg, color: planCfg.color }}>
                {planCfg.label}
              </span>
              {school.accreditation?.map((a) => (
                <span
                  key={a}
                  className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700">
                  {a}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: meta grid */}
        <dl
          className="grid grid-cols-2 gap-x-8 gap-y-3 shrink-0 border-t lg:border-t-0 lg:border-l pt-5 lg:pt-0 lg:pl-6"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          {[
            {
              icon: MapPin,
              label: "Location",
              value: `${school.location.city}, ${school.location.state}`,
            },
            { icon: Calendar, label: "Founded", value: school.foundedYear.toString() },
            { icon: Phone, label: "Phone", value: school.contact.phone },
            { icon: Mail, label: "Email", value: school.contact.email },
            ...(school.contact.website
              ? [{ icon: Globe, label: "Website", value: school.contact.website }]
              : []),
            { icon: Hash, label: "School ID", value: school.id, mono: true },
          ].map(({ icon: Icon, label, value, mono }: any) => (
            <div key={label} className="flex flex-col gap-0.5">
              <dt className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                <Icon size={10} /> {label}
              </dt>
              <dd
                className={`text-[12px] font-medium text-green-900 break-all ${mono ? "font-mono" : ""}`}>
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
