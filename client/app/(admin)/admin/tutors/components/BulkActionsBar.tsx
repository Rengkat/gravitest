import { Check, Ban, BadgeCheck, X } from "lucide-react";

interface Props {
  count: number;
  onActivate: () => void;
  onSuspend: () => void;
  onVerify: () => void;
  onClear: () => void;
}

export function BulkActionsBar({ count, onActivate, onSuspend, onVerify, onClear }: Props) {
  return (
    <div className="mb-4 p-4 rounded-2xl bg-green-800 text-white flex items-center justify-between flex-wrap gap-3">
      <span className="text-[14px] font-semibold">
        {count} tutor{count > 1 ? "s" : ""} selected
      </span>
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={onActivate}
          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[13px] font-medium flex items-center gap-1 transition-colors">
          <Check size={14} /> Activate
        </button>
        <button
          onClick={onSuspend}
          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[13px] font-medium flex items-center gap-1 transition-colors">
          <Ban size={14} /> Suspend
        </button>
        <button
          onClick={onVerify}
          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[13px] font-medium flex items-center gap-1 transition-colors">
          <BadgeCheck size={14} /> Verify
        </button>
        <button
          onClick={onClear}
          className="ml-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[13px] font-medium flex items-center gap-1 transition-colors">
          <X size={14} /> Clear
        </button>
      </div>
    </div>
  );
}
