"use client";

import { useState } from "react";
import { PlatformSettings } from "../types";
import { SettingsCard, ToggleRow, SettingsSelect, SaveBar } from "./ui";

interface PlatformSectionProps {
  settings: PlatformSettings;
  onChange: (s: PlatformSettings) => void;
}

export default function PlatformSection({ settings, onChange }: PlatformSectionProps) {
  const [local, setLocal] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const isDirty = JSON.stringify(local) !== JSON.stringify(settings);

  const update = <K extends keyof PlatformSettings>(key: K, val: PlatformSettings[K]) => {
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
      <SettingsCard title="General Settings" description="Core platform configuration">
        <SettingsSelect
          label="Platform Mode"
          value={local.maintenanceMode ? "maintenance" : "live"}
          onChange={(v) => update("maintenanceMode", v === "maintenance")}
          options={[
            { id: "live", label: "Live — Full access for all users" },
            { id: "maintenance", label: "Maintenance — Block user access" },
          ]}
        />
        <ToggleRow
          label="Registration Enabled"
          description="Allow new user registrations on the platform"
          value={local.registrationEnabled}
          onChange={(v) => update("registrationEnabled", v)}
        />
        <ToggleRow
          label="Email Verification Required"
          description="Require new users to verify their email address"
          value={local.emailVerificationRequired}
          onChange={(v) => update("emailVerificationRequired", v)}
        />
        <SettingsSelect
          label="Default User Role"
          value={local.defaultUserRole}
          onChange={(v) => update("defaultUserRole", v)}
          options={[
            { id: "student", label: "Student" },
            { id: "tutor", label: "Tutor" },
          ]}
        />
        <SaveBar
          visible={isDirty || saved}
          onSave={handleSave}
          onDiscard={() => setLocal(settings)}
          isSaving={isSaving}
          saved={saved}
        />
      </SettingsCard>

      <SettingsCard title="Pricing & Subscription" description="Configure platform pricing">
        <ToggleRow
          label="Enable Pro Plan"
          description="Allow users to upgrade to Student Pro"
          value={local.proPlanEnabled}
          onChange={(v) => update("proPlanEnabled", v)}
        />
        <ToggleRow
          label="Enable School Plan"
          description="Allow schools to purchase the School plan"
          value={local.schoolPlanEnabled}
          onChange={(v) => update("schoolPlanEnabled", v)}
        />
        <ToggleRow
          label="Enable Annual Discounts"
          description="Offer 33% discount on annual subscriptions"
          value={local.annualDiscountsEnabled}
          onChange={(v) => update("annualDiscountsEnabled", v)}
        />
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <label className="text-[11px] font-bold text-gray-500 uppercase">
              Pro Monthly Price
            </label>
            <div className="text-[18px] font-bold text-gray-900 mt-1">₦2,500</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <label className="text-[11px] font-bold text-gray-500 uppercase">
              School Monthly Price
            </label>
            <div className="text-[18px] font-bold text-gray-900 mt-1">₦15,000</div>
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

      <SettingsCard title="AI Features" description="Configure Sabi-Explain and AI Tutor settings">
        <ToggleRow
          label="Enable AI Sabi-Explain"
          description="Allow AI explanations for wrong answers"
          value={local.aiExplainEnabled}
          onChange={(v) => update("aiExplainEnabled", v)}
        />
        <ToggleRow
          label="Enable AI Tutor Chat"
          description="Allow users to chat with Sabi-Tutor"
          value={local.aiTutorEnabled}
          onChange={(v) => update("aiTutorEnabled", v)}
        />
        <ToggleRow
          label="Enable Voice Input"
          description="Allow voice input for AI features"
          value={local.voiceInputEnabled}
          onChange={(v) => update("voiceInputEnabled", v)}
        />
        <ToggleRow
          label="Enable Pidgin Mode"
          description="Allow explanations in Nigerian Pidgin English"
          value={local.pidginModeEnabled}
          onChange={(v) => update("pidginModeEnabled", v)}
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
