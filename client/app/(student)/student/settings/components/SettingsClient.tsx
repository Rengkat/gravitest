"use client";

import { useState, useCallback } from "react";
import { SettingsSection, AllSettings } from "@/types/settings";
import { DEFAULT_SETTINGS } from "@/lib/constants/settings";

import SettingsSidebar from "./SettingsSidebar";
import AppearanceSection from "./AppearanceSection";
import StudySection from "./StudySection";
import { AccessibilitySection, LanguageSection, PrivacySection } from "./OtherSections";
import DataSection from "./DataSection";
import IntegrationsSection from "./IntegrationsSection";
import AdvancedSection from "./AdvancedSection";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("appearance");
  const [settings, setSettings] = useState<AllSettings>(DEFAULT_SETTINGS);

  // Dirty tracking — any section that has a pending save bar will mark this
  // We track globally here for the sidebar badge
  const [dirtySection, setDirtySection] = useState<SettingsSection | null>(null);

  const updateSection = useCallback(<K extends keyof AllSettings>(key: K, val: AllSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
    setDirtySection(null);
  }, []);

  const handleResetAll = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    setDirtySection(null);
  }, []);

  return (
    /* Lives inside the dashboard layout — no outer shell needed */
    <div className="max-w-6xl mx-auto">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-[24px] font-black text-gray-900">Settings</h1>
        <p className="text-[13px] text-gray-500 mt-1">
          Customise your Gravitest experience — appearance, study preferences, privacy, and more
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* ── Sidebar ── */}
        <SettingsSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          hasUnsavedChanges={dirtySection !== null}
        />

        {/* ── Content ── */}
        <div className="lg:col-span-3">
          {activeSection === "appearance" && (
            <AppearanceSection
              settings={settings.appearance}
              onChange={(v) => updateSection("appearance", v)}
            />
          )}

          {activeSection === "study" && (
            <StudySection settings={settings.study} onChange={(v) => updateSection("study", v)} />
          )}

          {activeSection === "accessibility" && (
            <AccessibilitySection
              settings={settings.accessibility}
              onChange={(v) => updateSection("accessibility", v)}
            />
          )}

          {activeSection === "language" && (
            <LanguageSection
              settings={settings.language}
              onChange={(v) => updateSection("language", v)}
            />
          )}

          {activeSection === "privacy" && (
            <PrivacySection
              settings={settings.privacy}
              onChange={(v) => updateSection("privacy", v)}
            />
          )}

          {activeSection === "data" && <DataSection />}

          {activeSection === "integrations" && <IntegrationsSection />}

          {activeSection === "danger" && <AdvancedSection onResetSettings={handleResetAll} />}
        </div>
      </div>
    </div>
  );
}
