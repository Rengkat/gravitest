import { Download, UserPlus, BarChart3, LayoutGrid, List, GraduationCap, Briefcase } from "lucide-react";
import type { TutorCategory, TutorStats } from "../types";

type ViewMode = "analytics" | "grid" | "list";

interface Props {
  stats: TutorStats | null;
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;
  categoryFilter: "all" | TutorCategory;
  setCategoryFilter: (v: "all" | TutorCategory) => void;
  onExport: () => void;
  onAddTutor: () => void;
}

const VIEW_TABS = [
  { key: "analytics" as const, label: "Analytics",  icon: BarChart3   },
  { key: "grid"      as const, label: "Grid View",  icon: LayoutGrid  },
  { key: "list"      as const, label: "List View",  icon: List        },
];

export function PageHeader({
  stats,
  viewMode,
  setViewMode,
  categoryFilter,
  setCategoryFilter,
  onExport,
  onAddTutor,
}: Props) {
  const btnBase =
    "px-4 py-2 rounded-lg text-[13px] font-medium transition-all flex items-center gap-2";
  const activeBtn = "bg-green-800 text-white";
  const inactiveBtn = "bg-white border border-gray-200 text-text-muted hover:bg-cream";

  return (
    <div className="mb-8">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl text-green-900 mb-2">Tutor Management</h1>
          <p className="text-text-muted">
            Manage all {stats?.totalTutors ?? 0} tutors across secondary and professional categories.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-cream transition-all text-[14px] font-medium text-text-muted">
            <Download size={16} /> Export
          </button>
          <button
            onClick={onAddTutor}
            className="flex items-center gap-2 px-5 py-3 bg-green-800 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-xl font-semibold text-sm">
            <UserPlus size={18} /> Add Tutor
          </button>
        </div>
      </div>

      {/* View toggle & category filter */}
      <div className="flex items-center gap-2 mt-4 flex-wrap">
        {VIEW_TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setViewMode(key)}
            className={`${btnBase} ${viewMode === key ? activeBtn : inactiveBtn}`}>
            <Icon size={14} /> {label}
          </button>
        ))}

        <div className="w-px h-8 bg-gray-200 mx-2" />

        <button
          onClick={() => setCategoryFilter("all")}
          className={`${btnBase} ${categoryFilter === "all" ? activeBtn : inactiveBtn}`}>
          All Tutors
        </button>
        <button
          onClick={() => setCategoryFilter("secondary")}
          className={`${btnBase} ${categoryFilter === "secondary" ? activeBtn : inactiveBtn}`}>
          <GraduationCap size={14} /> Secondary ({stats?.secondaryTutors ?? 0})
        </button>
        <button
          onClick={() => setCategoryFilter("professional")}
          className={`${btnBase} ${categoryFilter === "professional" ? activeBtn : inactiveBtn}`}>
          <Briefcase size={14} /> Professional ({stats?.professionalTutors ?? 0})
        </button>
      </div>
    </div>
  );
}
