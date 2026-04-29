"use client";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const btnCls = "px-3 py-1.5 rounded-lg border border-gray-200 text-[13px] text-text-muted hover:bg-cream transition-colors disabled:opacity-50";

  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) =>
    i + Math.max(1, Math.min(currentPage - 2, totalPages - 4))
  );

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button onClick={() => onPageChange(1)} disabled={currentPage === 1} className={btnCls}>First</button>
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className={btnCls}>Prev</button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-9 h-9 rounded-lg text-[13px] font-medium transition-all ${
            page === currentPage
              ? "bg-green-800 text-white"
              : "border border-gray-200 text-text-muted hover:bg-cream"
          }`}
        >
          {page}
        </button>
      ))}

      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className={btnCls}>Next</button>
      <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} className={btnCls}>Last</button>
    </div>
  );
}
