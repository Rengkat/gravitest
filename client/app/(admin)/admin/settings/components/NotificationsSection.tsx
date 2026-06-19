"use client";

import { useState } from "react";
import { NotificationSettings } from "../types";
import { SettingsCard, ToggleRow, SaveBar } from "./ui";

interface NotificationsSectionProps {
  settings: NotificationSettings;
  onChange: (s: NotificationSettings) => void;
}

export default function NotificationsSection({ settings, onChange }: NotificationsSectionProps) {
  const [local, setLocal] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const isDirty = JSON.stringify(local) !== JSON.stringify(settings);

  const update = <K extends keyof NotificationSettings>(key: K, val: NotificationSettings[K]) => {
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
      <SettingsCard title="Email Notifications" description="System-wide email alerts">
        <ToggleRow
          label="New User Registration Email"
          description="Send email when a new user registers"
          value={local.newUserEmail}
          onChange={(v) => update("newUserEmail", v)}
        />
        <ToggleRow
          label="Payment Received Email"
          description="Send email when a payment is processed"
          value={local.paymentEmail}
          onChange={(v) => update("paymentEmail", v)}
        />
        <ToggleRow
          label="Refund Processed Email"
          description="Send email when a refund is issued"
          value={local.refundEmail}
          onChange={(v) => update("refundEmail", v)}
        />
        <ToggleRow
          label="Support Request Email"
          description="Send email when a support ticket is created"
          value={local.supportEmail}
          onChange={(v) => update("supportEmail", v)}
        />
        <ToggleRow
          label="System Alert Email"
          description="Send email for system errors and alerts"
          value={local.systemAlertEmail}
          onChange={(v) => update("systemAlertEmail", v)}
        />
        <SaveBar
          visible={isDirty || saved}
          onSave={handleSave}
          onDiscard={() => setLocal(settings)}
          isSaving={isSaving}
          saved={saved}
        />
      </SettingsCard>

      <SettingsCard title="SMS Notifications" description="SMS alerts for critical events">
        <ToggleRow
          label="OTP SMS for Login"
          description="Send SMS OTP for two-factor authentication"
          value={local.otpSms}
          onChange={(v) => update("otpSms", v)}
        />
        <ToggleRow
          label="Payment Confirmation SMS"
          description="Send SMS when payment is confirmed"
          value={local.paymentSms}
          onChange={(v) => update("paymentSms", v)}
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
