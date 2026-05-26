// ─── INFO BLOCK ─────────────────────────────────────────────
export function InfoBlock({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon size={14} className="text-text-muted mt-0.5 shrink-0" />
      <div>
        <div className="text-[11px] text-text-muted">{label}</div>
        <div className="text-[13px] font-semibold text-green-900">{value}</div>
      </div>
    </div>
  );
}

// ─── CONTACT ROW ─────────────────────────────────────────────
export function ContactRow({ icon: Icon, value }: { icon: any; value: string }) {
  return (
    <div className="flex items-center gap-2 text-[12px] text-text-muted">
      <Icon size={12} /> {value}
    </div>
  );
}

// ─── FINANCE ROW ─────────────────────────────────────────────
export function FinanceRow({
  label,
  value,
  isBold,
  isNegative,
  isStatus,
}: {
  label: string;
  value: string;
  isBold?: boolean;
  isNegative?: boolean;
  isStatus?: boolean;
}) {
  const cls = isBold
    ? "font-bold text-green-900"
    : isNegative
      ? "text-red-500"
      : isStatus
        ? "font-semibold text-green-900"
        : "text-green-900";

  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[13px] text-text-muted">{label}</span>
      <span className={`text-[13px] ${cls}`}>{value}</span>
    </div>
  );
}

// ─── SECTION CARD ─────────────────────────────────────────────
export function SectionCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`p-6 rounded-2xl bg-white border ${className}`}
      style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <h3 className="font-serif text-lg text-green-900 mb-4">{title}</h3>
      {children}
    </div>
  );
}

// ─── PACKAGE ICON ────────────────────────────────────────────
export function PackageIcon({ size, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size ?? 16}
      height={size ?? 16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={className}>
      <path d="M12 2l10 5v10l-10 5-10-5V7l10-5z" />
      <path d="M2 7l10 5M12 22V12M22 7l-10 5" />
    </svg>
  );
}
