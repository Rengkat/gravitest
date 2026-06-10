"use client";

import { RefreshCw } from "lucide-react";

interface Props {
  text?: string;
}

export function LoadingSpinner({ text = "Loading..." }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <RefreshCw size={32} className="animate-spin text-green-800 mb-4" />
      <span className="text-text-muted text-[14px]">{text}</span>
    </div>
  );
}
