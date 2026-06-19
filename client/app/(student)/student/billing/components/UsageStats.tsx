import { TrendingUp, BookOpen, Zap, Video, Database, Users } from "lucide-react";
import { MOCK_USAGE, formatDate, formatMinutes } from "@/lib/constants/billing";

export default function UsageStats() {
  const u = MOCK_USAGE;
  const storePct = Math.round((u.storageUsedMB / u.storageLimitMB) * 100);

  const stats = [
    {
      icon: BookOpen,
      label: "Exam Sessions",
      value: u.examSessions.toString(),
      color: "text-sky-200",
    },
    {
      icon: Zap,
      label: "Questions",
      value: u.questionsAnswered.toLocaleString(),
      color: "text-amber-200",
    },
    {
      icon: Zap,
      label: "AI Explanations",
      value: u.aiExplanations.toString(),
      color: "text-purple-200",
    },
    {
      icon: Video,
      label: "Video Watched",
      value: formatMinutes(u.videoMinutesWatched),
      color: "text-pink-200",
    },
    {
      icon: Users,
      label: "Tutor Sessions",
      value: u.tutorSessionsThisMonth.toString(),
      color: "text-emerald-200",
    },
  ];

  return (
    <div
      className="rounded-2xl p-6 text-white relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #065f46 0%, #047857 60%, #059669 100%)" }}>
      {/* Texture */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-300 rounded-full blur-3xl opacity-10 pointer-events-none" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
            <TrendingUp size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-white">This Billing Period</h3>
            <p className="text-[11px] text-green-300">
              {formatDate(u.periodStart)} — {formatDate(u.periodEnd)}
            </p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-5">
          {stats.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="text-center">
              <Icon size={16} className={`${color} mx-auto mb-1.5 opacity-80`} />
              <p className="text-[22px] font-black text-white">{value}</p>
              <p className="text-[11px] text-green-200 leading-tight">{label}</p>
            </div>
          ))}
        </div>

        {/* Storage bar */}
        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Database size={14} className="text-green-300" />
            <span className="text-[13px] font-semibold text-white">Storage</span>
            <span className="ml-auto text-[12px] text-green-200">
              {u.storageUsedMB} MB / {u.storageLimitMB} MB used ({storePct}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                storePct > 80 ? "bg-red-400" : storePct > 60 ? "bg-amber-400" : "bg-white"
              }`}
              style={{ width: `${storePct}%` }}
            />
          </div>
          {storePct > 80 && (
            <p className="text-[11px] text-red-300 mt-1.5 font-medium">
              ⚠ Storage nearly full — upgrade to Pro Annual for 2 GB
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
