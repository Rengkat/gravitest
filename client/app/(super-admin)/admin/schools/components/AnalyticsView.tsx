"use client";

import {
  School,
  Users,
  Layers,
  Check,
  Crown,
  Landmark,
  Globe,
  DollarSign,
  MapPin,
} from "lucide-react";
import type { SchoolType, SubscriptionPlan } from "@/types/schoolsTypes";
import { SCHOOL_TYPES, SUBSCRIPTION_PLANS } from "@/lib/constants/schools";
import { StatsMiniCard, Card } from "./Primitives";

interface AggregateStats {
  totalSchools: number;
  totalStudents: number;
  totalClasses: number;
  activeSchools: number;
  privateSchools: number;
  publicSchools: number;
  internationalSchools: number;
  totalRevenue: number;
  averagePerformance: number;
  byState: Record<string, number>;
  byPlan: Record<string, number>;
}

export function AnalyticsView({ stats }: { stats: AggregateStats }) {
  return (
    <div className="space-y-6">
      {/* Mini stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <StatsMiniCard
          icon={School}
          label="Total Schools"
          value={stats.totalSchools}
          color="#2e8b57"
        />
        <StatsMiniCard
          icon={Users}
          label="Total Students"
          value={stats.totalStudents.toLocaleString()}
          color="#3b82f6"
        />
        <StatsMiniCard
          icon={Layers}
          label="Total Classes"
          value={stats.totalClasses}
          color="#8b5cf6"
        />
        <StatsMiniCard
          icon={Check}
          label="Active Schools"
          value={stats.activeSchools}
          color="#10b981"
        />
        <StatsMiniCard icon={Crown} label="Private" value={stats.privateSchools} color="#7c3aed" />
        <StatsMiniCard icon={Landmark} label="Public" value={stats.publicSchools} color="#2e8b57" />
        <StatsMiniCard
          icon={Globe}
          label="International"
          value={stats.internationalSchools}
          color="#3b82f6"
        />
        <StatsMiniCard
          icon={DollarSign}
          label="Revenue"
          value={`₦${(stats.totalRevenue / 1000000).toFixed(0)}M`}
          color="#f59e0b"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Type distribution */}
        <Card className="p-6">
          <h3 className="font-serif text-lg text-green-900 mb-4">School Type Distribution</h3>
          <div className="space-y-4">
            {(
              Object.entries(SCHOOL_TYPES) as [SchoolType, (typeof SCHOOL_TYPES)[SchoolType]][]
            ).map(([type, cfg]) => {
              const Icon = cfg.icon;
              const count =
                type === "private"
                  ? stats.privateSchools
                  : type === "public"
                    ? stats.publicSchools
                    : stats.internationalSchools;
              const pct =
                stats.totalSchools > 0 ? ((count / stats.totalSchools) * 100).toFixed(1) : "0";
              return (
                <div key={type} className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: cfg.bg }}>
                    <Icon size={18} style={{ color: cfg.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-[13px] font-semibold text-green-900">{cfg.label}</span>
                      <span className="text-[13px] font-bold text-green-900">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-cream overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: cfg.color }}
                      />
                    </div>
                  </div>
                  <span className="text-[12px] text-text-muted w-12 text-right">{pct}%</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* By State */}
        <Card className="p-6">
          <h3 className="font-serif text-lg text-green-900 mb-4">Schools by State</h3>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {Object.entries(stats.byState)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 15)
              .map(([state, count]) => (
                <div
                  key={state}
                  className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-text-muted" />
                    <span className="text-[13px] text-green-900">{state}</span>
                  </div>
                  <span className="text-[13px] font-bold text-green-900">{count}</span>
                </div>
              ))}
          </div>
        </Card>
      </div>

      {/* Subscription plans */}
      <Card className="p-6">
        <h3 className="font-serif text-lg text-green-900 mb-4">Subscription Plan Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(
            Object.entries(SUBSCRIPTION_PLANS) as [
              SubscriptionPlan,
              (typeof SUBSCRIPTION_PLANS)[SubscriptionPlan],
            ][]
          ).map(([plan, cfg]) => {
            const count = stats.byPlan[plan] || 0;
            const pct =
              stats.totalSchools > 0 ? ((count / stats.totalSchools) * 100).toFixed(1) : "0";
            return (
              <div
                key={plan}
                className="p-4 rounded-xl text-center"
                style={{ background: cfg.bg, border: `1px solid ${cfg.color}20` }}>
                <div className="text-2xl font-bold mb-1" style={{ color: cfg.color }}>
                  {count}
                </div>
                <div className="text-[12px] font-semibold" style={{ color: cfg.color }}>
                  {cfg.label}
                </div>
                <div className="text-[11px] opacity-70" style={{ color: cfg.color }}>
                  {cfg.price}
                </div>
                <div className="text-[10px] opacity-50" style={{ color: cfg.color }}>
                  {pct}%
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
