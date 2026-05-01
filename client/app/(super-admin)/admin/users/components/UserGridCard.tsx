"use client";

import Link from "next/link";
import { Eye, Edit, Trash2, BadgeCheck } from "lucide-react";
import type { User, UserStatus } from "../types";
import { ROLE_CONFIG, STATUS_CONFIG, SUBSCRIPTION_CONFIG } from "../constants";
import { Avatar, Badge } from "./Primitives";
import { RoleProfilePanel } from "./RoleProfilePanel";

interface Props {
  user: User;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: UserStatus) => void;
}

export function UserGridCard({ user, onDelete, onStatusChange }: Props) {
  const roleCfg = ROLE_CONFIG[user.role];
  const statusCfg = STATUS_CONFIG[user.status];
  const subCfg = SUBSCRIPTION_CONFIG[user.subscriptionTier];
  const RoleIcon = roleCfg.icon;
  const SubIcon = subCfg.icon;

  return (
    <div
      className="rounded-2xl bg-white border overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg"
      style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      {/* Coloured role header stripe */}
      <div className="h-2" style={{ background: roleCfg.color }} />

      <div className="p-5">
        {/* Top row */}
        <div className="flex items-start gap-3 mb-4">
          <Avatar user={user} size="lg" />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              <span className="text-[14px] font-semibold text-green-900 truncate">
                {user.firstName} {user.lastName}
              </span>
              {user.verificationStatus === "verified" && (
                <BadgeCheck size={14} className="text-green-600 shrink-0" />
              )}
            </div>

            <div className="flex flex-wrap gap-1 mb-1">
              <Badge
                label={roleCfg.label}
                color={roleCfg.color}
                bg={roleCfg.bg}
                icon={RoleIcon}
                size="xs"
              />
              <span
                className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold"
                style={{ background: statusCfg.bg, color: statusCfg.color }}>
                {statusCfg.label}
              </span>
              <Badge
                label={subCfg.label}
                color={subCfg.color}
                bg={subCfg.bg}
                icon={SubIcon}
                size="xs"
              />
            </div>

            <div className="text-[11px] text-text-muted truncate">{user.email}</div>
          </div>
        </div>

        {/* Role-specific profile */}
        <div className="mb-4 p-3 rounded-xl bg-cream/40">
          <RoleProfilePanel user={user} />
        </div>

        {/* Activity */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-[11px]">
          <div className="p-2 rounded-lg bg-gray-50 text-center">
            <div className="font-bold text-green-900">{user.joinDate}</div>
            <div className="text-text-muted">Joined</div>
          </div>
          <div className="p-2 rounded-lg bg-gray-50 text-center">
            <div className="font-bold text-green-900">{user.lastActive}</div>
            <div className="text-text-muted">Last Active</div>
          </div>
        </div>

        {user.totalSpent > 0 && (
          <div className="text-center mb-3 text-[12px]">
            <span className="text-text-muted">Total spent: </span>
            <span className="font-bold text-green-900">₦{user.totalSpent.toLocaleString()}</span>
          </div>
        )}

        {/* Tags */}
        {user.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {user.tags.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-full bg-green-50 text-[10px] text-green-700">
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/users/${user.id}`}
            className="flex-1 py-2 rounded-lg bg-green-800 text-white text-[12px] font-semibold text-center hover:bg-green-700 transition-all flex items-center justify-center gap-1">
            <Eye size={12} /> View Profile
          </Link>
          <button title="edit" className="p-2 rounded-lg hover:bg-blue-50 transition-colors">
            <Edit size={14} className="text-text-muted hover:text-blue-600" />
          </button>
          <button
            title="delete"
            onClick={() => onDelete(user.id)}
            className="p-2 rounded-lg hover:bg-red-50 transition-colors">
            <Trash2 size={14} className="text-text-muted hover:text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
