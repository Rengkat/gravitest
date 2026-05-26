// ─── MINI STAT CARD ──────────────────────────────────────────
export function MiniCard({
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

// ─── FILTER SELECT ───────────────────────────────────────────
export function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-[12px] font-semibold text-green-900 mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-500/30">
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── PAGINATION ──────────────────────────────────────────────
export function Pagination({
  currentPage,
  totalPages,
  onChange,
}: {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onChange(1)}
        disabled={currentPage === 1}
        className="px-3 py-1.5 rounded-lg border border-gray-200 text-[13px] disabled:opacity-50 hover:bg-cream transition-colors">
        First
      </button>
      <button
        onClick={() => onChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1.5 rounded-lg border border-gray-200 text-[13px] disabled:opacity-50 hover:bg-cream transition-colors">
        Prev
      </button>
      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        const page = i + Math.max(1, Math.min(currentPage - 2, totalPages - 4));
        return (
          <button
            key={page}
            onClick={() => onChange(page)}
            className={`w-9 h-9 rounded-lg text-[13px] font-medium transition-colors ${
              page === currentPage
                ? "bg-green-800 text-white"
                : "border border-gray-200 hover:bg-cream"
            }`}>
            {page}
          </button>
        );
      })}
      <button
        onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 rounded-lg border border-gray-200 text-[13px] disabled:opacity-50 hover:bg-cream transition-colors">
        Next
      </button>
      <button
        onClick={() => onChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 rounded-lg border border-gray-200 text-[13px] disabled:opacity-50 hover:bg-cream transition-colors">
        Last
      </button>
    </div>
  );
}

// ─── SECTION CARD ────────────────────────────────────────────
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
