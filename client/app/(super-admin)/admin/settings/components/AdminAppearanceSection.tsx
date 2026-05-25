// app/admin/settings/components/AdminAppearanceSection.tsx
"use client";

import { useState } from "react";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { AppearanceSettings, ThemeMode, FontSize, DashboardLayout } from "@/types/settings";
import { ACCENT_COLORS } from "@/lib/constants/settings";
import { SettingsCard, ToggleRow, ChipGroup, SaveBar } from "./ui";

interface AdminAppearanceSectionProps {
  settings: AppearanceSettings;
  onChange: (s: AppearanceSettings) => void;
}

const THEME_OPTIONS: { id: ThemeMode; label: string; icon: any; desc: string }[] = [
  { id: "light", label: "Light", icon: Sun, desc: "Bright & clear" },
  { id: "dark", label: "Dark", icon: Moon, desc: "Easy on the eyes" },
  { id: "system", label: "System", icon: Monitor, desc: "Follows your device" },
];

const FONT_LABELS: Record<FontSize, string> = {
  small: "Small",
  medium: "Medium",
  large: "Large",
};

const LAYOUT_OPTIONS: { id: DashboardLayout; label: string; desc: string; preview: string }[] = [
  { id: "compact", label: "Compact", desc: "More content, less spacing", preview: "░░░░░░░░" },
  {
    id: "comfortable",
    label: "Comfortable",
    desc: "Balanced spacing (default)",
    preview: "░░░  ░░░",
  },
  { id: "spacious", label: "Spacious", desc: "Generous breathing room", preview: "░░    ░░" },
];

export default function AdminAppearanceSection({
  settings,
  onChange,
}: AdminAppearanceSectionProps) {
  const [local, setLocal] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const isDirty = JSON.stringify(local) !== JSON.stringify(settings);

  const update = <K extends keyof AppearanceSettings>(key: K, val: AppearanceSettings[K]) => {
    setLocal((prev) => ({ ...prev, [key]: val }));
    setSaved(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    onChange(local);
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-5">
      {/* Admin Theme - Red accent */}
      <SettingsCard title="Admin Theme" description="Choose how the admin dashboard looks">
        <div className="grid grid-cols-3 gap-3">
          {THEME_OPTIONS.map(({ id, label, icon: Icon, desc }) => {
            const active = local.theme === id;
            return (
              <button
                key={id}
                onClick={() => update("theme", id)}
                className={`relative flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 transition-all ${
                  active
                    ? "border-red-500 bg-red-50"
                    : "border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white"
                }`}>
                {active && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                    <Check size={11} className="text-white" />
                  </div>
                )}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${active ? "bg-red-100" : "bg-gray-200"}`}>
                  <Icon size={22} className={active ? "text-red-700" : "text-gray-500"} />
                </div>
                <div className="text-center">
                  <p
                    className={`text-[13px] font-bold ${active ? "text-red-800" : "text-gray-700"}`}>
                    {label}
                  </p>
                  <p className="text-[11px] text-gray-400">{desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </SettingsCard>

      {/* Accent color - Admin red theme */}
      <SettingsCard
        title="Admin Accent Colour"
        description="Personalise the admin dashboard highlight colour">
        <div className="flex flex-wrap gap-3">
          {ACCENT_COLORS.map(({ id, label, cls, ring }) => {
            const active = local.accentColor === id;
            return (
              <button
                key={id}
                onClick={() => update("accentColor", id as any)}
                title={label}
                className={`flex flex-col items-center gap-2 group`}>
                <div
                  className={`w-10 h-10 rounded-full ${cls} flex items-center justify-center transition-all ${
                    active ? `ring-2 ring-offset-2 ${ring} scale-110 shadow-lg` : "hover:scale-105"
                  }`}>
                  {active && <Check size={16} className="text-white" />}
                </div>
                <span
                  className={`text-[10px] font-semibold ${active ? "text-gray-800" : "text-gray-400"}`}>
                  {label.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </SettingsCard>

      {/* Font size */}
      <SettingsCard title="Font Size" description="Adjust the text size across the admin panel">
        <ChipGroup<FontSize>
          options={["small", "medium", "large"]}
          value={local.fontSize}
          onChange={(v) => update("fontSize", v)}
          renderLabel={(v) => FONT_LABELS[v]}
        />
      </SettingsCard>

      {/* Dashboard layout */}
      <SettingsCard
        title="Admin Layout"
        description="Control the spacing density of the admin dashboard">
        <div className="grid grid-cols-3 gap-3">
          {LAYOUT_OPTIONS.map(({ id, label, desc, preview }) => {
            const active = local.dashboardLayout === id;
            return (
              <button
                key={id}
                onClick={() => update("dashboardLayout", id)}
                className={`relative flex flex-col gap-2.5 p-4 rounded-2xl border-2 text-left transition-all ${
                  active
                    ? "border-red-500 bg-red-50"
                    : "border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white"
                }`}>
                {active && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                    <Check size={9} className="text-white" />
                  </div>
                )}
                <div className="font-mono text-[18px] text-gray-400 tracking-widest">{preview}</div>
                <div>
                  <p
                    className={`text-[13px] font-bold ${active ? "text-red-800" : "text-gray-700"}`}>
                    {label}
                  </p>
                  <p className="text-[11px] text-gray-400 leading-tight">{desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </SettingsCard>

      {/* Display Options */}
      <SettingsCard title="Display Options">
        <ToggleRow
          label="Show Animations"
          description="Enable transitions and micro-animations throughout the admin panel"
          value={local.showAnimations}
          onChange={(v) => update("showAnimations", v)}
        />
        <ToggleRow
          label="Show Avatar in Header"
          description="Display your profile picture in the top navigation bar"
          value={local.showAvatarInHeader}
          onChange={(v) => update("showAvatarInHeader", v)}
        />
        <ToggleRow
          label="Collapse Sidebar by Default"
          description="Start with the admin sidebar minimised"
          value={local.sidebarCollapsed}
          onChange={(v) => update("sidebarCollapsed", v)}
        />
        <SaveBar
          visible={isDirty || saved}
          onSave={handleSave}
          onDiscard={() => setLocal(settings)}
          isSaving={isSaving}
          saved={saved}
        />
      </SettingsCard>
    </div>
  );
}
