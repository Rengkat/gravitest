import { DETAIL_TABS } from "../constants";
import type { ActiveTab } from "../types";

interface Props {
  activeTab: ActiveTab;
  onChange: (tab: ActiveTab) => void;
}

export function TabBar({ activeTab, onChange }: Props) {
  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
      {DETAIL_TABS.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-5 py-3 rounded-xl text-[14px] font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === key
              ? "bg-green-800 text-white shadow-lg"
              : "bg-white border border-gray-200 text-text-muted hover:bg-cream"
          }`}>
          <Icon size={16} /> {label}
        </button>
      ))}
    </div>
  );
}
