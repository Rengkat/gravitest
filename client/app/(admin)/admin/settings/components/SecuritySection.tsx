// app/admin/settings/components/SecuritySection.tsx
"use client";

import { useState } from "react";
import { SecuritySettings } from "../types";
import { SettingsCard, ToggleRow, SettingsSelect, SaveBar } from "./ui";

interface SecuritySectionProps {
  settings: SecuritySettings;
  onChange: (s: SecuritySettings) => void;
}

export default function SecuritySection({ settings, onChange }: SecuritySectionProps) {
  const [local, setLocal] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const isDirty = JSON.stringify(local) !== JSON.stringify(settings);

  const update = <K extends keyof SecuritySettings>(key: K, val: SecuritySettings[K]) => {
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
      <SettingsCard title="Authentication" description="Login and session security">
        <ToggleRow
          label="Require Strong Password"
          description="Enforce minimum password complexity requirements"
          value={local.requireStrongPassword}
          onChange={(v) => update("requireStrongPassword", v)}
        />
        <ToggleRow
          label="Enable Two-Factor Authentication"
          description="Allow users to enable 2FA on their accounts"
          value={local.twoFactorEnabled}
          onChange={(v) => update("twoFactorEnabled", v)}
        />
        <ToggleRow
          label="Force 2FA for Admins"
          description="Require 2FA for all admin accounts"
          value={local.forceTwoFactorForAdmins}
          onChange={(v) => update("forceTwoFactorForAdmins", v)}
        />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase">
              Session Duration
            </label>
            <select
              title="session timeout"
              value={local.sessionTimeout}
              onChange={(e) => update("sessionTimeout", Number(e.target.value) as any)}
              className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 text-[13px]">
              <option value={3600}>1 hour</option>
              <option value={28800}>8 hours</option>
              <option value={86400}>24 hours</option>
              <option value={604800}>7 days</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase">
              Max Login Attempts
            </label>
            <select
              title="max login attemp"
              value={local.maxLoginAttempts}
              onChange={(e) => update("maxLoginAttempts", Number(e.target.value) as any)}
              className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 text-[13px]">
              <option value={3}>3 attempts</option>
              <option value={5}>5 attempts</option>
              <option value={10}>10 attempts</option>
            </select>
          </div>
        </div>
        <SaveBar
          visible={isDirty || saved}
          onSave={handleSave}
          onDiscard={() => setLocal(settings)}
          isSaving={isSaving}
          saved={saved}
        />
      </SettingsCard>

      <SettingsCard title="Rate Limiting" description="API and request throttling">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase">
              API Requests per Minute
            </label>
            <input
              title="rate limit"
              type="number"
              value={local.apiRateLimit}
              onChange={(e) => update("apiRateLimit", Number(e.target.value))}
              className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 text-[13px]"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase">
              Login Attempts per Hour
            </label>
            <input
              title="login ratelimit"
              type="number"
              value={local.loginRateLimit}
              onChange={(e) => update("loginRateLimit", Number(e.target.value))}
              className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 text-[13px]"
            />
          </div>
        </div>
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
