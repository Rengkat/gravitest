"use client";

import { FileText, Eye, Clock, CheckCircle, Archive } from "lucide-react";
import { EXAM_STATUS_LABELS, type ExamStatus } from "../types";

const STATUS_CONFIG: Record<ExamStatus, { bg: string; color: string; icon: typeof FileText }> = {
  DRAFT: { bg: "bg-gray-100", color: "text-gray-700", icon: FileText },
  PUBLISHED: { bg: "bg-blue-100", color: "text-blue-700", icon: Eye },
  ONGOING: { bg: "bg-yellow-100", color: "text-yellow-700", icon: Clock },
  COMPLETED: { bg: "bg-green-100", color: "text-green-700", icon: CheckCircle },
  ARCHIVED: { bg: "bg-gray-100", color: "text-gray-500", icon: Archive },
};

interface StatusBadgeProps {
  status: ExamStatus;
  withIcon?: boolean;
  className?: string;
}

export function StatusBadge({ status, withIcon = false, className = "" }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color} ${className}`}>
      {withIcon && <Icon size={12} />}
      {EXAM_STATUS_LABELS[status]}
    </span>
  );
}
