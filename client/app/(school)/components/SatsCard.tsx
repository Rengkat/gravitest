// components/StatCard.tsx
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: string;
  trend?: number;
  suffix?: string;
};

export default function StatCard({
  icon: Icon,
  label,
  value,
  color,
  trend,
  suffix,
}: StatCardProps) {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  const formatValue = () => {
    if (typeof value === "number") {
      return value.toLocaleString();
    }
    return value;
  };

  const displayValue = formatValue();

  return (
    <div
      className="p-5 rounded-2xl bg-white border transition-all duration-300 hover:-translate-y-1 group"
      style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-105"
          style={{ background: `${color}15` }}>
          <Icon size={18} strokeWidth={1.8} style={{ color }} />
        </div>
        <div className="flex items-center gap-1">
          {trend !== undefined && (
            <div
              className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                isPositive
                  ? "bg-green-100 text-green-700"
                  : isNegative
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-600"
              }`}>
              {isPositive && <TrendingUp size={10} />}
              {isNegative && <TrendingDown size={10} />}
              {trend !== 0 && <span>{Math.abs(trend)}%</span>}
            </div>
          )}
          <span className="text-[22px] font-bold text-green-900">
            {displayValue}
            {suffix && (
              <span className="text-[12px] font-normal text-text-muted ml-0.5">{suffix}</span>
            )}
          </span>
        </div>
      </div>
      <div className="text-[13px] font-medium text-text-muted">{label}</div>
    </div>
  );
}
