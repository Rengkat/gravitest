"use client";

import { Mail, Clock, RotateCw, XCircle } from "lucide-react";
import type { TeacherInvitation } from "../types";

interface PendingInvitationsListProps {
  invitations: TeacherInvitation[];
  onResend: (invitation: TeacherInvitation) => void;
  onRevoke: (invitation: TeacherInvitation) => void;
  resendingId?: string | null;
}

export function PendingInvitationsList({
  invitations,
  onResend,
  onRevoke,
  resendingId,
}: PendingInvitationsListProps) {
  if (invitations.length === 0) return null;

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("en-NG", { month: "short", day: "numeric" });

  const isExpired = (date: Date) => new Date(date).getTime() < Date.now();

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="font-serif text-lg text-green-900">Pending Invitations</h2>
        <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
          {invitations.length}
        </span>
      </div>

      <div
        className="bg-white rounded-2xl border divide-y divide-gray-100"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        {invitations.map((invitation) => {
          const expired = isExpired(invitation.expiresAt);
          return (
            <div
              key={invitation.id}
              className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                  <Mail size={16} className="text-yellow-700" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-green-900 truncate">
                    {invitation.firstName} {invitation.lastName}
                  </p>
                  <p className="text-xs text-text-muted truncate">{invitation.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-text-muted shrink-0">
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                  {invitation.role.replace("_", " ")}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {expired ? (
                    <span className="text-red-600 font-medium">Expired</span>
                  ) : (
                    `Expires ${formatDate(invitation.expiresAt)}`
                  )}
                </span>
              </div>

              <div className="flex gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => onResend(invitation)}
                  disabled={resendingId === invitation.id}
                  title="Resend invitation"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 hover:bg-cream disabled:opacity-50 transition-colors">
                  <RotateCw
                    size={12}
                    className={resendingId === invitation.id ? "animate-spin" : ""}
                  />
                  {resendingId === invitation.id ? "Resending..." : "Resend"}
                </button>
                <button
                  type="button"
                  onClick={() => onRevoke(invitation)}
                  title="Revoke invitation"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors">
                  <XCircle size={12} />
                  Revoke
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
