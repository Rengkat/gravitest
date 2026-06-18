"use client";

import Link from "next/link";
import { Eye, Edit, Trash2, BadgeCheck } from "lucide-react";
import type { User, UserStatus } from "../types";
import { ROLE_CONFIG, STATUS_CONFIG, SUBSCRIPTION_CONFIG } from "../constants";
import { Avatar, Badge } from "./Primitives";
import { RoleProfilePanel } from "./RoleProfilePanel";

interface Props {
  user: User;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: UserStatus) => void;
}

export function UserTableRow({
  user,
  isSelected,
  onToggleSelect,
  onDelete,
  onStatusChange,
}: Props) {
  const roleCfg = ROLE_CONFIG[user.role];
  const statusCfg = STATUS_CONFIG[user.status];
  const subCfg = SUBSCRIPTION_CONFIG[user.subscriptionTier];
  const RoleIcon = roleCfg.icon;
  const SubIcon = subCfg.icon;

  return (
    <div
      className={`p-4 rounded-2xl bg-white border flex items-start gap-4 hover:bg-cream/20 transition-colors ${
        isSelected ? "ring-2 ring-green-800/20" : ""
      }`}
      style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      {/* Checkbox */}
      <input
        title="toggle"
        type="checkbox"
        checked={isSelected}
        onChange={() => onToggleSelect(user.id)}
        className="w-4 h-4 rounded border-gray-300 text-green-800 mt-1 shrink-0"
      />

      {/* Avatar */}
      <Avatar user={user} />

      {/* Main info */}
      <div className="flex-1 min-w-0">
        {/* Name + badges row */}
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-[14px] font-semibold text-green-900 truncate">
            {user.firstName} {user.lastName}
          </span>

          {/* Role */}
          <Badge
            label={roleCfg.label}
            color={roleCfg.color}
            bg={roleCfg.bg}
            icon={RoleIcon}
            size="xs"
          />

          {/* Status */}
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
            style={{ background: statusCfg.bg, color: statusCfg.color }}>
            {statusCfg.label}
          </span>

          {/* Subscription */}
          <Badge
            label={subCfg.label}
            color={subCfg.color}
            bg={subCfg.bg}
            icon={SubIcon}
            size="xs"
          />

          {/* Verification */}
          {user.verificationStatus === "verified" && (
            <BadgeCheck size={14} className="text-green-600 shrink-0" />
          )}

          {/* 2FA */}
          {user.twoFactorEnabled && (
            <span className="px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[9px] font-bold">
              2FA
            </span>
          )}
        </div>

        {/* Email / phone */}
        <div className="flex items-center gap-3 text-[12px] text-text-muted mb-2 flex-wrap">
          <span>{user.email}</span>
          <span>·</span>
          <span>{user.phone}</span>
          <span>·</span>
          <span>Joined {user.joinDate}</span>
          <span>·</span>
          <span>Last active {user.lastActive}</span>
        </div>

        {/* Role-specific profile */}
        <RoleProfilePanel user={user} compact />
      </div>

      {/* Spent */}
      <div className="text-right shrink-0 hidden md:block">
        {user.totalSpent > 0 ? (
          <div className="text-[13px] font-bold text-green-900">
            ₦{user.totalSpent.toLocaleString()}
          </div>
        ) : (
          <div className="text-[12px] text-text-muted">—</div>
        )}
        <div className="text-[10px] text-text-muted mt-0.5">spent</div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <Link
          href={`/admin/users/${user.id}`}
          className="p-2 rounded-lg hover:bg-green-50 transition-colors">
          <Eye size={16} className="text-text-muted hover:text-green-600" />
        </Link>
        {/* <button title="edit" className="p-2 rounded-lg hover:bg-blue-50 transition-colors">
          <Edit size={16} className="text-text-muted hover:text-blue-600" />
        </button> */}
        <button
          title="delete"
          onClick={() => onDelete(user.id)}
          className="p-2 rounded-lg hover:bg-red-50 transition-colors">
          <Trash2 size={16} className="text-text-muted hover:text-red-500" />
        </button>
      </div>
    </div>
  );
}
