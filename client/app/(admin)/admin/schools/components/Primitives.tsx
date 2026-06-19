"use client";

// ─── STATS MINI CARD ────────────────────────────────────────
export function StatsMiniCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div
      className="p-3 rounded-2xl bg-white border transition-all hover:-translate-y-1"
      style={{ borderColor: "rgba(30,80,50,0.08)" }}
    >
      <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: `${color}15` }}>
        <Icon size={14} style={{ color }} />
      </div>
      <div className="text-lg font-bold text-green-900">{value}</div>
      <div className="text-[11px] text-text-muted">{label}</div>
    </div>
  );
}

// ─── INFO ITEM ───────────────────────────────────────────────
export function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={14} className="text-text-muted shrink-0" />
      <div className="min-w-0">
        <div className="text-[10px] text-text-muted">{label}</div>
        <div className="text-[12px] font-semibold text-green-900 truncate">{value}</div>
      </div>
    </div>
  );
}

// ─── CARD WRAPPER ────────────────────────────────────────────
export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl bg-white border ${className}`}
      style={{ borderColor: "rgba(30,80,50,0.08)" }}
    >
      {children}
    </div>
  );
}
