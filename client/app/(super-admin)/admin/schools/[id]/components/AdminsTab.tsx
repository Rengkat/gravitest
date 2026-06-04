"use client";

import { Plus, Mail, Phone, UserMinus, Clock } from "lucide-react";
import type { SchoolData } from "@/types/schoolsTypes";
import type { SchoolActionType } from "../useSchoolDetail";

const ROLE_CFG = {
  admin: { label: "Admin", color: "#2e8b57", bg: "#2e8b5715" },
  finance: { label: "Finance", color: "#f59e0b", bg: "#f59e0b15" },
  academic: { label: "Academic", color: "#8b5cf6", bg: "#8b5cf615" },
};

interface Props {
  school: SchoolData;
  onAction: (a: SchoolActionType, meta?: { adminId?: string }) => void;
}

export function AdminsTab({ school, onAction }: Props) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-text-muted">
          {school.admins.length} admin{school.admins.length !== 1 ? "s" : ""} assigned
        </p>
        <button
          onClick={() => onAction("add_admin")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-800 text-white text-[13px] font-semibold hover:bg-green-700 transition-all">
          <Plus size={14} /> Add Admin
        </button>
      </div>

      {school.admins.length === 0 ? (
        <div
          className="rounded-2xl bg-white border p-12 text-center"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <p className="text-[14px] font-semibold text-green-900 mb-1">No admins assigned</p>
          <p className="text-[12px] text-text-muted mb-4">Add an admin to manage this school.</p>
          <button
            onClick={() => onAction("add_admin")}
            className="px-4 py-2 rounded-xl bg-green-800 text-white text-[13px] font-semibold hover:bg-green-700 transition-all">
            Add Admin
          </button>
        </div>
      ) : (
        <div
          className="rounded-2xl bg-white border overflow-hidden"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          {school.admins.map((admin, i) => {
            const roleCfg = ROLE_CFG[admin.role as keyof typeof ROLE_CFG] ?? ROLE_CFG.admin;
            const isLast = i === school.admins.length - 1;
            const initials = admin.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={admin.id}
                className={`flex items-center gap-4 p-4 hover:bg-cream/20 transition-colors ${!isLast ? "border-b" : ""}`}
                style={{ borderColor: "rgba(30,80,50,0.06)" }}>
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-green-800 text-white flex items-center justify-center text-[12px] font-bold shrink-0">
                  {initials}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="text-[14px] font-semibold text-green-900">{admin.name}</span>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{ background: roleCfg.bg, color: roleCfg.color }}>
                      {roleCfg.label}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{
                        background: admin.status === "active" ? "#10b98115" : "#ef444415",
                        color: admin.status === "active" ? "#10b981" : "#ef4444",
                      }}>
                      {admin.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-text-muted">
                    <span className="flex items-center gap-1">
                      <Mail size={10} /> {admin.email}
                    </span>
                    {admin.phone && (
                      <span className="flex items-center gap-1">
                        <Phone size={10} /> {admin.phone}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock size={10} /> Last active: {admin.lastActive}
                    </span>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => onAction("remove_admin", { adminId: admin.id })}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-100 bg-red-50 text-red-600 text-[12px] hover:bg-red-100 transition-all shrink-0"
                  title="Remove admin">
                  <UserMinus size={13} />
                  <span className="hidden sm:inline">Remove</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
