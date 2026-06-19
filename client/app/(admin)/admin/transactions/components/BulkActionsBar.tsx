"use client";

import { Check, X, RotateCcw, Download, Flag } from "lucide-react";

interface Props {
  count: number;
  onRefundAll: () => void;
  onExport: () => void;
  onFlagAll: () => void;
  onClear: () => void;
}

export function BulkActionsBar({ count, onRefundAll, onExport, onFlagAll, onClear }: Props) {
  return (
    <div className="mb-4 p-4 rounded-2xl bg-green-800 text-white flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-3">
        <Check size={18} />
        <span className="text-[14px] font-semibold">{count} transaction{count > 1 ? "s" : ""} selected</span>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Btn Icon={RotateCcw} label="Refund All"  onClick={onRefundAll} />
        <Btn Icon={Download}  label="Export"      onClick={onExport}    />
        <Btn Icon={Flag}      label="Flag Fraud"  onClick={onFlagAll}   danger />
        <button onClick={onClear} className="ml-2 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-[13px] font-medium">
          <X size={14} /> Clear
        </button>
      </div>
    </div>
  );
}

function Btn({ Icon, label, onClick, danger = false }: { Icon: any; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-[13px] font-medium ${danger ? "bg-red-500/30 hover:bg-red-500/50" : "bg-white/10 hover:bg-white/20"}`}>
      <Icon size={14} />{label}
    </button>
  );
}
