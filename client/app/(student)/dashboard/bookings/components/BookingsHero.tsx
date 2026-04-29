"use client";

import { Calendar, BarChart3 } from "lucide-react";

interface BookingsHeroProps {
  showAnalytics: boolean;
  onToggleAnalytics: () => void;
}

export default function BookingsHero({ showAnalytics, onToggleAnalytics }: BookingsHeroProps) {
  return (
    <div className="relative bg-gradient-to-r from-green-900 to-emerald-900 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-green-400 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={24} className="text-yellow-400" />
              <h1 className="text-3xl md:text-4xl font-bold">My Bookings</h1>
            </div>
            <p className="text-green-100">
              Manage your sessions, track progress, and review your learning journey
            </p>
          </div>
          <button
            onClick={onToggleAnalytics}
            className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <BarChart3 size={18} />
            {showAnalytics ? "Hide Analytics" : "Show Analytics"}
          </button>
        </div>
      </div>
    </div>
  );
}
