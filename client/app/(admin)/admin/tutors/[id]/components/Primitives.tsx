import { TrendingUp, TrendingDown } from "lucide-react";

// ─── QUICK STAT CARD ─────────────────────────────────────────
export function QuickStat({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div
      className="p-3 rounded-2xl bg-white border transition-all hover:-translate-y-1"
      style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
        style={{ background: `${color}15` }}>
        <Icon size={14} style={{ color }} />
      </div>
      <div className="text-lg font-bold text-green-900">{value}</div>
      <div className="text-[11px] text-text-muted">{label}</div>
    </div>
  );
}

// ─── EARNINGS CARD ───────────────────────────────────────────
export function EarningsCard({
  icon: Icon,
  label,
  value,
  color,
  trend,
}: {
  icon: any;
  label: string;
  value: string;
  color: string;
  trend?: number;
}) {
  return (
    <div className="p-5 rounded-2xl bg-white border" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}15` }}>
          <Icon size={18} style={{ color }} />
        </div>
        {trend != null && (
          <span
            className={`flex items-center gap-1 text-[11px] font-semibold ${trend >= 0 ? "text-green-600" : "text-red-500"}`}>
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-green-900">{value}</div>
      <div className="text-[12px] text-text-muted">{label}</div>
    </div>
  );
}

// ─── INFO ROW ────────────────────────────────────────────────
export function InfoRow({
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
      <span className="text-[12px] text-text-muted">{label}:</span>
      <span className="text-[13px] font-semibold text-green-900 truncate">{value}</span>
    </div>
  );
}

// ─── SECTION CARD ────────────────────────────────────────────
export function SectionCard({
  title,
  children,
  headerRight,
}: {
  title: string;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
}) {
  return (
    <div className="p-6 rounded-2xl bg-white border" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-lg text-green-900">{title}</h3>
        {headerRight}
      </div>
      {children}
    </div>
  );
}

// ─── DOCUMENT CARD ───────────────────────────────────────────
export function DocumentCard({
  label,
  url,
  icon: Icon,
}: {
  label: string;
  url?: string;
  icon: any;
}) {
  return (
    <div
      className="p-5 rounded-2xl bg-white border flex items-center gap-4"
      style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <div className="w-12 h-12 rounded-xl bg-cream flex items-center justify-center shrink-0">
        <Icon size={22} className="text-green-700" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-green-900">{label}</div>
        <div className="text-[11px] text-text-muted">{url ? "Uploaded" : "Not uploaded"}</div>
      </div>
      {url && (
        <div className="flex gap-1 shrink-0">
          {/* Eye */}
          <button className="p-2 rounded-lg hover:bg-green-50 transition-colors">
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="text-text-muted">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
          {/* Download */}
          <button className="p-2 rounded-lg hover:bg-blue-50 transition-colors">
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="text-text-muted">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

// ─── BUILDING ICON ───────────────────────────────────────────
export function BuildingIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <rect x="4" y="2" width="16" height="20" rx="2"/>
      <path d="M9 6h6M9 10h6M9 14h6M9 18h6"/>
    </svg>
  );
}

// ─── HASH ICON ───────────────────────────────────────────────
export function HashIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <line x1="4" y1="9" x2="20" y2="9"/>
      <line x1="4" y1="15" x2="20" y2="15"/>
      <line x1="10" y1="3" x2="8" y2="21"/>
      <line x1="16" y1="3" x2="14" y2="21"/>
    </svg>
  );
}
