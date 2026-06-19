// app/admin/settings/page.tsx
"use client";

import { useState, useCallback } from "react";
import { SettingsSection, AllSettings } from "./types";
import { DEFAULT_SETTINGS } from "./types";

import AdminSettingsSidebar from "./components/AdminSettingsSidebar";
import AdminAppearanceSection from "./components/AdminAppearanceSection";
import PlatformSection from "./components/PlatformSection";
import AdvancedSection from "./components/AdvancedSection";
import BackupSection from "./components/BackupSection";
import IntegrationsSection from "./components/IntegrationsSection";
import NotificationsSection from "./components/NotificationsSection";
import SecuritySection from "./components/SecuritySection";

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("appearance");
  const [settings, setSettings] = useState<AllSettings>(DEFAULT_SETTINGS);
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
    <div className="max-w-7xl mx-auto">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-[24px] font-black text-gray-900">Platform Settings</h1>
        <p className="text-[13px] text-gray-500 mt-1">
          Configure system-wide settings, manage security, and control platform behavior
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <AdminSettingsSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          hasUnsavedChanges={dirtySection !== null}
        />

        <div className="lg:col-span-3">
          {activeSection === "appearance" && (
            <AdminAppearanceSection
              settings={settings.appearance}
              onChange={(v) => updateSection("appearance", v)}
            />
          )}
          {activeSection === "platform" && (
            <PlatformSection
              settings={settings.platform}
              onChange={(v) => updateSection("platform", v)}
            />
          )}
          {activeSection === "security" && (
            <SecuritySection
              settings={settings.security}
              onChange={(v) => updateSection("security", v)}
            />
          )}
          {activeSection === "notifications" && (
            <NotificationsSection
              settings={settings.notifications}
              onChange={(v) => updateSection("notifications", v)}
            />
          )}
          {activeSection === "integrations" && (
            <IntegrationsSection
              settings={settings.integrations}
              onChange={(v) => updateSection("integrations", v)}
            />
          )}
          {activeSection === "backup" && <BackupSection />}
          {activeSection === "danger" && <AdvancedSection onResetSettings={handleResetAll} />}
        </div>
      </div>
    </div>
  );
}
