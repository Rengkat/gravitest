"use client";

import { useState } from "react";
import { Bot, Save, Bell, Shield, Database, AlertTriangle, RefreshCw } from "lucide-react";
import { useAIData } from "../useAIData";
import { AIConfigPanel } from "../components/AIConfigPanel";

interface AISettings {
  defaultModel: string;
  fallbackModel: string;
  maxTokensPerResponse: number;
  defaultTemperature: number;
  autoFlagThreshold: number;
  notifyOnFlagged: boolean;
  notifyOnBudgetAlert: boolean;
  notifyEmail: string;
  retentionDays: number;
  enableAutoGrading: boolean;
  requireTeacherReviewBelow: number;
}

const DEFAULT_SETTINGS: AISettings = {
  defaultModel: "gpt-4o",
  fallbackModel: "gpt-4o-mini",
  maxTokensPerResponse: 1024,
  defaultTemperature: 0.7,
  autoFlagThreshold: 0.75,
  notifyOnFlagged: true,
  notifyOnBudgetAlert: true,
  notifyEmail: "admin@gravitas.ng",
  retentionDays: 90,
  enableAutoGrading: true,
  requireTeacherReviewBelow: 60,
};

const inputCls =
  "w-full px-3 py-2 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-500/30 text-green-900";

function SectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
          <Icon size={15} className="text-green-700" />
        </div>
        <h3 className="font-serif text-base text-green-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <div
      className="flex items-center justify-between py-2.5 border-b last:border-0"
      style={{ borderColor: "rgba(30,80,50,0.06)" }}>
      <div>
        <div className="text-[13px] font-medium text-green-900">{label}</div>
        {hint && <div className="text-[11px] text-text-muted mt-0.5">{hint}</div>}
      </div>
      <button
        title="check"
        onClick={() => onChange(!checked)}
        className={`relative rounded-full transition-colors shrink-0 ${checked ? "bg-green-700" : "bg-gray-200"}`}
        style={{ width: 40, height: 22 }}
        aria-pressed={checked}
        aria-label={label}>
        <span
          className="absolute top-0.5 left-0.5 rounded-full bg-white shadow transition-transform"
          style={{
            width: 18,
            height: 18,
            transform: checked ? "translateX(18px)" : "translateX(0)",
          }}
        />
      </button>
    </div>
  );
}

export default function AISettingsPage() {
  const [settings, setSettings] = useState<AISettings>(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { stats, toggleFeature } = useAIData();

  const update = <K extends keyof AISettings>(key: K, value: AISettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    // TODO: PATCH /admin/ai/settings
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    setSaved(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-800 to-green-600 flex items-center justify-center shadow-sm">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-serif text-2xl text-green-900">AI Settings</h1>
            <p className="text-text-muted text-[13px] -mt-0.5">
              Defaults, notifications, and data retention
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-cream transition-all text-[13px] text-text-muted">
            <RefreshCw size={14} /> Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-800 text-white text-[13px] font-semibold hover:bg-green-700 transition-all disabled:opacity-60">
            <Save size={14} /> {saving ? "Saving…" : saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      <SectionCard icon={Bot} title="Model Defaults">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-1">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-text-muted mb-1">
              Default Model
            </label>
            <select
              title="Default model"
              className={inputCls}
              value={settings.defaultModel}
              onChange={(e) => update("defaultModel", e.target.value)}>
              <option value="gpt-4o">GPT-4o</option>
              <option value="gpt-4o-mini">GPT-4o Mini</option>
              <option value="claude-3.5-sonnet">Claude 3.5 Sonnet</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-text-muted mb-1">
              Fallback Model
            </label>
            <select
              title="Fallback model"
              className={inputCls}
              value={settings.fallbackModel}
              onChange={(e) => update("fallbackModel", e.target.value)}>
              <option value="gpt-4o-mini">GPT-4o Mini</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-text-muted mb-1">
              Max Tokens / Response
            </label>
            <input
              title="max token"
              type="number"
              className={inputCls}
              value={settings.maxTokensPerResponse}
              onChange={(e) => update("maxTokensPerResponse", parseInt(e.target.value) || 0)}
              min={128}
              max={8192}
              step={128}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-text-muted mb-1">
              Temperature ({settings.defaultTemperature.toFixed(1)})
            </label>
            <input
              title="temperature"
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={settings.defaultTemperature}
              onChange={(e) => update("defaultTemperature", parseFloat(e.target.value))}
              className="w-full accent-green-700 mt-2.5"
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard icon={Shield} title="Moderation & Flagging">
        <div className="mb-4">
          <label className="block text-[11px] font-semibold uppercase tracking-wide text-text-muted mb-1">
            Auto-Flag Confidence Threshold ({(settings.autoFlagThreshold * 100).toFixed(0)}%)
          </label>
          <input
            title="threshhold"
            type="range"
            min={0.5}
            max={1}
            step={0.05}
            value={settings.autoFlagThreshold}
            onChange={(e) => update("autoFlagThreshold", parseFloat(e.target.value))}
            className="w-full accent-amber-600"
          />
          <p className="text-[11px] text-text-muted mt-1">
            Sessions matching policy violation patterns above this confidence are auto-flagged for
            review.
          </p>
        </div>
        <Toggle
          checked={settings.notifyOnFlagged}
          onChange={(v) => update("notifyOnFlagged", v)}
          label="Notify on flagged sessions"
          hint="Send an email when a new session is flagged"
        />
      </SectionCard>

      <SectionCard icon={Database} title="Auto-Grading">
        <Toggle
          checked={settings.enableAutoGrading}
          onChange={(v) => update("enableAutoGrading", v)}
          label="Enable AI auto-grading"
          hint="Automatically score practice questions and exam submissions"
        />
        <div className="mt-4">
          <label className="block text-[11px] font-semibold uppercase tracking-wide text-text-muted mb-1">
            Require Teacher Review Below ({settings.requireTeacherReviewBelow}%)
          </label>
          <input
            title="teacher review"
            type="range"
            min={0}
            max={100}
            step={5}
            value={settings.requireTeacherReviewBelow}
            onChange={(e) => update("requireTeacherReviewBelow", parseInt(e.target.value))}
            className="w-full accent-green-700"
          />
          <p className="text-[11px] text-text-muted mt-1">
            Submissions scoring below this threshold are routed to a teacher for review.
          </p>
        </div>
      </SectionCard>

      <SectionCard icon={Bell} title="Notifications">
        <Toggle
          checked={settings.notifyOnBudgetAlert}
          onChange={(v) => update("notifyOnBudgetAlert", v)}
          label="Budget alerts"
          hint="Notify when monthly AI cost exceeds 80% of budget"
        />
        <div className="mt-4">
          <label className="block text-[11px] font-semibold uppercase tracking-wide text-text-muted mb-1">
            Notification Email
          </label>
          <input
            type="email"
            className={inputCls}
            value={settings.notifyEmail}
            onChange={(e) => update("notifyEmail", e.target.value)}
            placeholder="admin@gravitas.ng"
          />
        </div>
      </SectionCard>

      <SectionCard icon={Database} title="Data Retention">
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wide text-text-muted mb-1">
            Conversation Retention (days)
          </label>
          <input
            title="retaintion days"
            type="number"
            className={inputCls}
            value={settings.retentionDays}
            onChange={(e) => update("retentionDays", parseInt(e.target.value) || 0)}
            min={7}
            max={365}
          />
          <p className="text-[11px] text-text-muted mt-1">
            Conversations and messages older than this are automatically purged. Flagged sessions
            are kept indefinitely.
          </p>
        </div>
      </SectionCard>

      {/* Feature Flags */}
      {stats?.features && (
        <div>
          <h2 className="font-serif text-lg text-green-900 mb-3">Feature Flags</h2>
          <AIConfigPanel features={stats.features} onToggle={toggleFeature} />
        </div>
      )}

      <div className="bg-white rounded-2xl border border-red-200 p-6">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
            <AlertTriangle size={15} className="text-red-600" />
          </div>
          <h3 className="font-serif text-base text-red-700">Danger Zone</h3>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-red-50">
          <div>
            <div className="text-[13px] font-medium text-red-800">Clear all conversation logs</div>
            <div className="text-[11px] text-red-600">
              Permanently delete all stored conversations. This cannot be undone.
            </div>
          </div>
          <button className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-[12px] font-semibold hover:bg-red-700 transition-all whitespace-nowrap">
            Clear Logs
          </button>
        </div>
      </div>
    </div>
  );
}
