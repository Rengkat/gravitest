"use client";

import { Booking } from "@/types/bookings";

type TabKey = "upcoming" | "past" | "all";

interface BookingsTabsProps {
  activeTab: TabKey;
  bookings: Booking[];
  onChange: (tab: TabKey) => void;
}

export default function BookingsTabs({ activeTab, bookings, onChange }: BookingsTabsProps) {
  const counts = {
    upcoming: bookings.filter((b) => b.status === "upcoming" || b.status === "ongoing").length,
    past:     bookings.filter((b) => b.status === "completed" || b.status === "cancelled").length,
    all:      bookings.length,
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: "upcoming", label: `Upcoming (${counts.upcoming})` },
    { key: "past",     label: `Past (${counts.past})` },
    { key: "all",      label: `All (${counts.all})` },
  ];

  return (
    <div className="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto">
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-6 py-3 text-sm font-medium transition-all relative whitespace-nowrap ${
            activeTab === key ? "text-green-700" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {label}
          {activeTab === key && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}
