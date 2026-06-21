"use client";

import { useState } from "react";
import {
  Settings,
  Power,
  Shield,
  Eye,
  EyeOff,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Zap,
  FileText,
  MessageSquare,
  Brain,
  Target,
  GraduationCap,
  BookOpen,
} from "lucide-react";

interface Feature {
  id: string;
  name: string;
  description: string;
  icon: any;
  enabled: boolean;
  category: "core" | "premium" | "experimental";
  impact: "low" | "medium" | "high";
}

interface Props {
  features: Record<string, boolean>;
  onToggle: (feature: string, enabled: boolean) => void;
}

const FEATURES: Feature[] = [
  {
    id: "sabi_tutor",
    name: "Sabi Tutor",
    description: "Interactive AI tutoring sessions",
    icon: MessageSquare,
    enabled: true,
    category: "core",
    impact: "high",
  },
  {
    id: "sabi_explain",
    name: "Sabi Explain",
    description: "Concept explanations in Pidgin",
    icon: Brain,
    enabled: true,
    category: "core",
    impact: "high",
  },
  {
    id: "sabi_solve",
    name: "Sabi Solve",
    description: "Step-by-step problem solving",
    icon: Target,
    enabled: true,
    category: "core",
    impact: "medium",
  },
  {
    id: "sabi_quiz",
    name: "Sabi Quiz",
    description: "AI-generated practice questions",
    icon: BookOpen,
    enabled: true,
    category: "core",
    impact: "medium",
  },
  {
    id: "sabi_essay",
    name: "Sabi Essay",
    description: "Essay writing assistance & grading",
    icon: FileText,
    enabled: false,
    category: "premium",
    impact: "high",
  },
  {
    id: "practice_scoring",
    name: "Practice Scoring",
    description: "Auto-grading of practice questions",
    icon: Target,
    enabled: true,
    category: "core",
    impact: "medium",
  },
  {
    id: "exam_grading",
    name: "Exam Grading",
    description: "Automated exam marking",
    icon: GraduationCap,
    enabled: true,
    category: "premium",
    impact: "high",
  },
  {
    id: "voice_ai",
    name: "Sabi Voice",
    description: "Voice-based AI interactions",
    icon: Zap,
    enabled: false,
    category: "experimental",
    impact: "low",
  },
];

export function AIConfigPanel({ features, onToggle }: Props) {
  const [saving, setSaving] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleToggle = (featureId: string, currentEnabled: boolean) => {
    onToggle(featureId, !currentEnabled);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
  };

  const coreFeatures = FEATURES.filter((f) => f.category === "core");
  const premiumFeatures = FEATURES.filter((f) => f.category === "premium");
  const experimentalFeatures = FEATURES.filter((f) => f.category === "experimental");

  return (
    <div className="space-y-6">
      {/* Global Settings */}
      <div
        className="bg-white rounded-2xl border p-6"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
            <Settings size={20} className="text-green-800" />
          </div>
          <div>
            <h3 className="font-serif text-lg text-green-900">Global AI Settings</h3>
            <p className="text-[12px] text-text-muted">
              Configure global behavior and safety settings
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Safety Level */}
          <div className="p-4 rounded-xl border" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Shield size={16} className="text-green-800" />
              <span className="text-[13px] font-semibold text-green-900">Content Safety Level</span>
            </div>
            <div className="flex gap-2">
              {["Strict", "Moderate", "Lenient"].map((level) => (
                <button
                  key={level}
                  className={`flex-1 px-3 py-2 rounded-lg text-[12px] font-medium transition-all ${
                    level === "Moderate"
                      ? "bg-green-800 text-white"
                      : "bg-gray-100 text-text-muted hover:bg-gray-200"
                  }`}>
                  {level}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-text-muted mt-2">
              Blocks inappropriate content and exam cheating attempts
            </p>
          </div>

          {/* Response Length */}
          <div className="p-4 rounded-xl border" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <div className="flex items-center gap-2 mb-3">
              <FileText size={16} className="text-green-800" />
              <span className="text-[13px] font-semibold text-green-900">Max Response Length</span>
            </div>
            <div className="flex gap-2">
              {["Short (250)", "Medium (500)", "Long (1000)"].map((len) => (
                <button
                  key={len}
                  className={`flex-1 px-3 py-2 rounded-lg text-[12px] font-medium transition-all ${
                    len === "Medium (500)"
                      ? "bg-green-800 text-white"
                      : "bg-gray-100 text-text-muted hover:bg-gray-200"
                  }`}>
                  {len}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-text-muted mt-2">
              Controls token usage and response detail level
            </p>
          </div>

          {/* Temperature */}
          <div className="p-4 rounded-xl border" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Zap size={16} className="text-green-800" />
              <span className="text-[13px] font-semibold text-green-900">
                Creativity (Temperature)
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                defaultValue="0.3"
                className="flex-1"
              />
              <span className="text-[13px] font-bold text-green-900 w-12">0.3</span>
            </div>
            <div className="flex justify-between text-[10px] text-text-muted mt-1">
              <span>Consistent</span>
              <span>Balanced</span>
              <span>Creative</span>
            </div>
          </div>

          {/* Top P */}
          <div className="p-4 rounded-xl border" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Target size={16} className="text-green-800" />
              <span className="text-[13px] font-semibold text-green-900">
                Top P (Nucleus Sampling)
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                defaultValue="0.9"
                className="flex-1"
              />
              <span className="text-[13px] font-bold text-green-900 w-12">0.9</span>
            </div>
            <p className="text-[11px] text-text-muted mt-1">Controls response diversity</p>
          </div>
        </div>
      </div>

      {/* Feature Toggles - Core */}
      <div
        className="bg-white rounded-2xl border p-6"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
            <Power size={20} className="text-green-800" />
          </div>
          <div>
            <h3 className="font-serif text-lg text-green-900">Feature Flags</h3>
            <p className="text-[12px] text-text-muted">Enable or disable AI features globally</p>
          </div>
        </div>

        {/* Core Features */}
        <div className="mb-6">
          <h4 className="text-[13px] font-semibold text-green-900 mb-3">Core Features</h4>
          <div className="space-y-3">
            {coreFeatures.map((feature) => (
              <FeatureToggle
                key={feature.id}
                feature={feature}
                enabled={features[feature.id] ?? feature.enabled}
                onToggle={() => handleToggle(feature.id, features[feature.id] ?? feature.enabled)}
              />
            ))}
          </div>
        </div>

        {/* Premium Features */}
        <div className="mb-6">
          <h4 className="text-[13px] font-semibold text-green-900 mb-3">Premium Features</h4>
          <div className="space-y-3">
            {premiumFeatures.map((feature) => (
              <FeatureToggle
                key={feature.id}
                feature={feature}
                enabled={features[feature.id] ?? feature.enabled}
                onToggle={() => handleToggle(feature.id, features[feature.id] ?? feature.enabled)}
              />
            ))}
          </div>
        </div>

        {/* Experimental Features */}
        <div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-[12px] text-text-muted hover:text-green-800 mb-3">
            {showAdvanced ? <EyeOff size={14} /> : <Eye size={14} />}
            {showAdvanced ? "Hide" : "Show"} Experimental Features
          </button>
          {showAdvanced && (
            <div className="space-y-3">
              {experimentalFeatures.map((feature) => (
                <FeatureToggle
                  key={feature.id}
                  feature={feature}
                  enabled={features[feature.id] ?? feature.enabled}
                  onToggle={() => handleToggle(feature.id, features[feature.id] ?? feature.enabled)}
                />
              ))}
            </div>
          )}
        </div>

        <div
          className="mt-6 pt-4 border-t flex justify-end"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-800 text-white font-semibold hover:bg-green-700 transition-all disabled:opacity-50">
            {saving ? <RefreshCw size={16} className="animate-spin" /> : <CheckCircle size={16} />}
            {saving ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </div>

      {/* Impact Warning */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
        <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <div className="text-[12px] font-semibold text-amber-800">
            Changes take effect immediately
          </div>
          <div className="text-[11px] text-amber-700">
            Disabling features will affect all users currently using those features. Consider
            announcing changes before disabling popular features.
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureToggle({
  feature,
  enabled,
  onToggle,
}: {
  feature: Feature;
  enabled: boolean;
  onToggle: () => void;
}) {
  const Icon = feature.icon;

  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-cream/20 transition-colors">
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${feature.impact === "high" ? "#ef444415" : "#3b82f615"}` }}>
          <Icon size={14} style={{ color: feature.impact === "high" ? "#ef4444" : "#3b82f6" }} />
        </div>
        <div>
          <div className="text-[13px] font-semibold text-green-900">{feature.name}</div>
          <div className="text-[11px] text-text-muted">{feature.description}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={`text-[10px] font-semibold ${
            feature.impact === "high"
              ? "text-red-600"
              : feature.impact === "medium"
                ? "text-amber-600"
                : "text-green-600"
          }`}>
          {feature.impact.toUpperCase()} IMPACT
        </span>
        <button
          onClick={onToggle}
          className={`relative w-10 h-5 rounded-full transition-all ${
            enabled ? "bg-green-800" : "bg-gray-300"
          }`}>
          <div
            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
              enabled ? "right-0.5" : "left-0.5"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
