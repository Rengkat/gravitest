"use client";

import type { LucideIcon } from "lucide-react";
import { FileText } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon = FileText, title, description, action }: EmptyStateProps) {
  return (
    <div
      className="text-center py-12 bg-white rounded-2xl border"
      style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <Icon size={48} className="mx-auto text-text-muted mb-3" />
      <p className="text-text-muted font-medium">{title}</p>
      {description && <p className="text-sm text-text-muted mt-1">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
