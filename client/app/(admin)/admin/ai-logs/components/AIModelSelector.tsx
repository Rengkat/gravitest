"use client";

import { useState } from "react";
import { Brain, Zap, DollarSign, Activity, RefreshCw, Check, AlertCircle } from "lucide-react";

interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  description: string;
  costInput: number;
  costOutput: number;
  avgLatency: number;
  isActive: boolean;
  isFallback: boolean;
  features: string[];
}

interface Props {
  onUpdate: (config: any) => void;
}

const AVAILABLE_MODELS: ModelConfig[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    description: "Most capable model for complex reasoning and tutoring",
    costInput: 2.5,
    costOutput: 10.0,
    avgLatency: 800,
    isActive: true,
    isFallback: false,
    features: ["reasoning", "math", "code", "multilingual"],
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "OpenAI",
    description: "Fast, cost-effective for simple explanations",
    costInput: 0.15,
    costOutput: 0.6,
    avgLatency: 400,
    isActive: true,
    isFallback: true,
    features: ["fast", "cheap", "general"],
  },
  {
    id: "claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    description: "Excellent for nuanced educational content",
    costInput: 3.0,
    costOutput: 15.0,
    avgLatency: 900,
    isActive: false,
    isFallback: false,
    features: ["nuanced", "safe", "detailed"],
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google",
    description: "Large context window for long conversations",
    costInput: 1.25,
    costOutput: 5.0,
    avgLatency: 700,
    isActive: false,
    isFallback: false,
    features: ["long-context", "multimodal"],
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek V3",
    provider: "DeepSeek",
    description: "Cost-effective with strong reasoning",
    costInput: 0.14,
    costOutput: 0.28,
    avgLatency: 600,
    isActive: false,
    isFallback: false,
    features: ["cheap", "reasoning", "math"],
  },
];

export function AIModelSelector({ onUpdate }: Props) {
  const [models, setModels] = useState(AVAILABLE_MODELS);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleToggleActive = (modelId: string) => {
    setModels((prev) => prev.map((m) => (m.id === modelId ? { ...m, isActive: !m.isActive } : m)));
  };

  const handleSetFallback = (modelId: string) => {
    setModels((prev) => prev.map((m) => ({ ...m, isFallback: m.id === modelId })));
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onUpdate({
      activeModels: models.filter((m) => m.isActive),
      fallbackModel: models.find((m) => m.isFallback),
    });
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Active Model Routing */}
      <div
        className="bg-white rounded-2xl border p-6"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <h3 className="font-serif text-lg text-green-900 mb-4">Model Routing Configuration</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-green-50 border border-green-200">
            <div className="text-[11px] text-green-600 mb-1">Primary Model</div>
            <div className="text-lg font-bold text-green-900">
              {models.find((m) => m.isActive && !m.isFallback)?.name || "GPT-4o"}
            </div>
            <div className="text-[11px] text-green-600">Used for 90% of traffic</div>
          </div>
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
            <div className="text-[11px] text-amber-600 mb-1">Fallback Model</div>
            <div className="text-lg font-bold text-amber-900">
              {models.find((m) => m.isFallback)?.name || "GPT-4o Mini"}
            </div>
            <div className="text-[11px] text-amber-600">Used when primary fails</div>
          </div>
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
            <div className="text-[11px] text-blue-600 mb-1">Cost per 1K tokens</div>
            <div className="text-lg font-bold text-blue-900">$0.15 - $15.00</div>
            <div className="text-[11px] text-blue-600">Depending on model</div>
          </div>
        </div>

        <div className="space-y-3">
          {models.map((model) => (
            <div
              key={model.id}
              className={`p-4 rounded-xl border transition-all ${
                model.isActive ? "border-green-200 bg-cream/20" : "border-gray-200 opacity-70"
              }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain size={16} className="text-green-800" />
                    <span className="font-semibold text-green-900">{model.name}</span>
                    <span className="text-[10px] text-text-muted">{model.provider}</span>
                    {model.isFallback && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[9px] font-semibold">
                        Fallback
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-text-muted mb-3">{model.description}</p>
                  <div className="flex items-center gap-4 text-[11px]">
                    <span className="flex items-center gap-1">
                      <DollarSign size={10} />
                      Input: ${model.costInput}/1K
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign size={10} />
                      Output: ${model.costOutput}/1K
                    </span>
                    <span className="flex items-center gap-1">
                      <Activity size={10} />
                      {model.avgLatency}ms
                    </span>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {model.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-1.5 py-0.5 rounded bg-gray-100 text-[9px] text-text-muted">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(model.id)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
                      model.isActive
                        ? "bg-green-800 text-white"
                        : "bg-gray-100 text-text-muted hover:bg-gray-200"
                    }`}>
                    {model.isActive ? "Active" : "Inactive"}
                  </button>
                  {model.isActive && !model.isFallback && (
                    <button
                      onClick={() => handleSetFallback(model.id)}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-[12px] text-text-muted hover:bg-cream">
                      Set as Fallback
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-6 pt-4 border-t flex justify-end"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-800 text-white font-semibold hover:bg-green-700 transition-all disabled:opacity-50">
            {saving ? <RefreshCw size={16} className="animate-spin" /> : <Check size={16} />}
            {saving ? "Saving..." : "Apply Changes"}
          </button>
        </div>
      </div>

      {/* Feature-Specific Routing */}
      <div
        className="bg-white rounded-2xl border p-6"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <h3 className="font-serif text-lg text-green-900 mb-4">Feature-Specific Model Mapping</h3>
        <p className="text-[12px] text-text-muted mb-4">
          Route specific AI features to different models for cost optimization
        </p>
        <div className="space-y-3">
          {[
            {
              feature: "Sabi Explain",
              current: "GPT-4o",
              recommended: "GPT-4o Mini",
              savings: "85%",
            },
            { feature: "Sabi Solve", current: "GPT-4o", recommended: "GPT-4o", savings: "0%" },
            {
              feature: "Sabi Quiz",
              current: "GPT-4o Mini",
              recommended: "GPT-4o Mini",
              savings: "0%",
            },
            {
              feature: "Sabi Essay",
              current: "GPT-4o",
              recommended: "Claude 3.5 Sonnet",
              savings: "Better Quality",
            },
            {
              feature: "Practice Scoring",
              current: "GPT-4o",
              recommended: "DeepSeek V3",
              savings: "90%",
            },
          ].map((route) => (
            <div
              key={route.feature}
              className="flex items-center justify-between p-3 rounded-xl bg-cream/30">
              <div>
                <div className="text-[13px] font-semibold text-green-900">{route.feature}</div>
                <div className="text-[11px] text-text-muted">Current: {route.current}</div>
              </div>
              <div className="text-right">
                <div className="text-[12px] font-medium text-green-800">
                  Recommended: {route.recommended}
                </div>
                <div className="text-[10px] text-green-600">Potential savings: {route.savings}</div>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-green-800 text-white text-[11px] font-semibold hover:bg-green-700">
                Apply
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
