import { Download } from "lucide-react";
import { VIEW_TABS } from "../constants";
import type { ViewMode } from "../types";

interface Props {
  totalBookings: number;
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;
  onExport: () => void;
}

export function PageHeader({ totalBookings, viewMode, setViewMode, onExport }: Props) {
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl text-green-900 mb-2">Booking Management</h1>
          <p className="text-text-muted">
            Manage all {totalBookings} tutor bookings, sessions, and appointments.
          </p>
        </div>
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-cream transition-all text-[14px] font-medium text-text-muted">
          <Download size={16} /> Export
        </button>
      </div>

      <div className="flex items-center gap-2 mt-4 flex-wrap">
        {VIEW_TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setViewMode(key)}
            className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all flex items-center gap-2 ${
              viewMode === key
                ? "bg-green-800 text-white"
                : "bg-white border border-gray-200 text-text-muted hover:bg-cream"
            }`}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>
    </div>
  );
}
