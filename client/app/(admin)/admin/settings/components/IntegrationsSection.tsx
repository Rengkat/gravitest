// app/admin/settings/components/IntegrationsSection.tsx
"use client";

import { useState } from "react";
import { IntegrationSettings } from "../types";
import { SettingsCard, ToggleRow, SaveBar } from "./ui";

interface IntegrationsSectionProps {
  settings: IntegrationSettings;
  onChange: (s: IntegrationSettings) => void;
}

const PAYMENT_GATEWAYS = [
  { id: "paystack", label: "Paystack", key: "paystackSecretKey" },
  { id: "flutterwave", label: "Flutterwave", key: "flutterwaveSecretKey" },
];

export default function IntegrationsSection({ settings, onChange }: IntegrationsSectionProps) {
  const [local, setLocal] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const isDirty = JSON.stringify(local) !== JSON.stringify(settings);

  const update = <K extends keyof IntegrationSettings>(key: K, val: IntegrationSettings[K]) => {
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
      <SettingsCard title="Payment Gateways" description="Configure payment providers">
        <ToggleRow
          label="Enable Paystack"
          description="Accept payments via Paystack"
          value={local.paystackEnabled}
          onChange={(v) => update("paystackEnabled", v)}
        />
        {local.paystackEnabled && (
          <div className="ml-9 pl-4 border-l-2 border-gray-200">
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
              Paystack Secret Key
            </label>
            <input
              type="password"
              value={local.paystackSecretKey}
              onChange={(e) => update("paystackSecretKey", e.target.value)}
              placeholder="sk_live_••••••••"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-[13px]"
            />
          </div>
        )}

        <ToggleRow
          label="Enable Flutterwave"
          description="Accept payments via Flutterwave"
          value={local.flutterwaveEnabled}
          onChange={(v) => update("flutterwaveEnabled", v)}
        />
        {local.flutterwaveEnabled && (
          <div className="ml-9 pl-4 border-l-2 border-gray-200">
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
              Flutterwave Secret Key
            </label>
            <input
              type="password"
              value={local.flutterwaveSecretKey}
              onChange={(e) => update("flutterwaveSecretKey", e.target.value)}
              placeholder="FLWSECK-••••••••"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-[13px]"
            />
          </div>
        )}
        <SaveBar
          visible={isDirty || saved}
          onSave={handleSave}
          onDiscard={() => setLocal(settings)}
          isSaving={isSaving}
          saved={saved}
        />
      </SettingsCard>

      <SettingsCard title="SMS Gateway" description="Configure SMS provider for OTP and alerts">
        <ToggleRow
          label="Enable SMS Notifications"
          description="Send SMS alerts via Termii"
          value={local.termiiEnabled}
          onChange={(v) => update("termiiEnabled", v)}
        />
        {local.termiiEnabled && (
          <>
            <div className="ml-9 pl-4 border-l-2 border-gray-200">
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                Termii API Key
              </label>
              <input
                type="password"
                value={local.termiiApiKey}
                onChange={(e) => update("termiiApiKey", e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-[13px]"
              />
            </div>
            <div className="ml-9 pl-4 border-l-2 border-gray-200 mt-3">
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                Sender ID
              </label>
              <input
                type="text"
                value={local.termiiSenderId}
                onChange={(e) => update("termiiSenderId", e.target.value)}
                placeholder="GRAVITEST"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-[13px]"
              />
            </div>
          </>
        )}
        <SaveBar
          visible={isDirty || saved}
          onSave={handleSave}
          onDiscard={() => setLocal(settings)}
          isSaving={isSaving}
          saved={saved}
        />
      </SettingsCard>

      <SettingsCard title="AI Service" description="Configure AI provider for Sabi-Explain">
        <ToggleRow
          label="Enable AI Features"
          description="Enable all AI-powered features"
          value={local.aiEnabled}
          onChange={(v) => update("aiEnabled", v)}
        />
        {local.aiEnabled && (
          <div className="ml-9 pl-4 border-l-2 border-gray-200">
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
              AI API Key
            </label>
            <input
              type="password"
              value={local.aiApiKey}
              onChange={(e) => update("aiApiKey", e.target.value)}
              placeholder="sk-••••••••"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-[13px]"
            />
            <label className="block text-[11px] font-bold text-gray-500 uppercase mt-3 mb-1">
              Model
            </label>
            <select
              title="ai midel"
              value={local.aiModel}
              onChange={(e) => update("aiModel", e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-[13px]">
              <option value="claude-sonnet-4">Claude Sonnet 4</option>
              <option value="claude-opus-4">Claude Opus 4</option>
              <option value="gpt-4">GPT-4</option>
            </select>
          </div>
        )}
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
