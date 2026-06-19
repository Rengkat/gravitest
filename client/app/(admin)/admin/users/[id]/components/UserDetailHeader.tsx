"use client";

import Link from "next/link";
import {
  BadgeCheck,
  MapPin,
  Smartphone,
  Calendar,
  Clock,
  Hash,
  ChevronRight,
  Shield,
  Tag,
} from "lucide-react";
import type { User } from "../../types";
import {
  ROLE_CONFIG,
  STATUS_CONFIG,
  SUBSCRIPTION_CONFIG,
  ACCOUNT_TYPE_CONFIG,
  VERIFICATION_CONFIG,
} from "../../constants";
import { Avatar, Badge } from "../../components/Primitives";

export function UserDetailHeader({ user }: { user: User }) {
  const roleCfg = ROLE_CONFIG[user.role];
  const statusCfg = STATUS_CONFIG[user.status];
  const subCfg = SUBSCRIPTION_CONFIG[user.subscriptionTier];
  const accCfg = ACCOUNT_TYPE_CONFIG[user.accountType];
  const verCfg = VERIFICATION_CONFIG[user.verificationStatus];
  const RoleIcon = roleCfg.icon;
  const SubIcon = subCfg.icon;
  const StatusIcon = statusCfg.icon;

  return (
    <div className="mb-6">
      {/* Breadcrumb */}
      <nav
        className="flex items-center gap-1.5 text-[12px] text-text-muted mb-5"
        aria-label="Breadcrumb">
        <Link href="/admin/users" className="hover:text-green-700 transition-colors">
          Users
        </Link>
        <ChevronRight size={12} />
        <span className="text-green-900 font-medium">
          {user.firstName} {user.lastName}
        </span>
      </nav>

      {/* Header card */}
      <div
        className="rounded-2xl bg-white border p-6 flex flex-col lg:flex-row gap-6"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        {/* Left: avatar + identity */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="relative shrink-0">
            <Avatar user={user} size="lg" />
            <span
              className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white"
              style={{ background: statusCfg.color }}
              title={statusCfg.label}
            />
          </div>

          <div className="min-w-0 flex-1">
            {/* Name + trust signals */}
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <h1 className="font-serif text-2xl text-green-900 leading-tight">
                {user.firstName} {user.lastName}
              </h1>
              {user.verificationStatus === "verified" && (
                <BadgeCheck size={18} className="text-green-600 shrink-0" aria-label="Verified" />
              )}
              {user.twoFactorEnabled && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[9px] font-bold">
                  <Shield size={9} /> 2FA
                </span>
              )}
            </div>

            {/* Email · phone */}
            <p className="text-[13px] text-text-muted mb-3">
              {user.email}
              <span className="mx-2 opacity-40">·</span>
              {user.phone}
            </p>

            {/* Badge row */}
            <div className="flex flex-wrap gap-1.5">
              <Badge label={roleCfg.label} color={roleCfg.color} bg={roleCfg.bg} icon={RoleIcon} />
              <Badge
                label={statusCfg.label}
                color={statusCfg.color}
                bg={statusCfg.bg}
                icon={StatusIcon}
              />
              <Badge label={subCfg.label} color={subCfg.color} bg={subCfg.bg} icon={SubIcon} />
              <Badge label={accCfg.label} color={accCfg.color} bg={accCfg.bg} />
              <Badge label={verCfg.label} color={verCfg.color} bg={verCfg.bg} />
              {user.tags?.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-text-muted">
                  <Tag size={9} />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: meta grid */}
        <dl
          className="grid grid-cols-2 gap-x-8 gap-y-3 shrink-0 border-t lg:border-t-0 lg:border-l pt-5 lg:pt-0 lg:pl-6 text-left"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          {[
            { icon: Calendar, label: "Joined", value: user.joinDate },
            { icon: Clock, label: "Last Active", value: user.lastActive },
            { icon: MapPin, label: "Location", value: user.lastLocation ?? "—" },
            { icon: Smartphone, label: "Device", value: user.lastDevice ?? "—" },
            { icon: Hash, label: "User ID", value: user.id, mono: true },
            { icon: Hash, label: "Referral Code", value: user.referralCode ?? "—", mono: true },
          ].map(({ icon: Icon, label, value, mono }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <dt className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                <Icon size={10} />
                {label}
              </dt>
              <dd
                className={`text-[12px] font-medium text-green-900 break-all ${
                  mono ? "font-mono" : ""
                }`}>
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
