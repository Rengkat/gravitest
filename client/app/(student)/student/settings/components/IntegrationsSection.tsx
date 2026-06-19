"use client";

import { useState } from "react";
import { CheckCircle, RefreshCw, ExternalLink } from "lucide-react";
import { Integration } from "@/types/settings";
import { INTEGRATIONS } from "@/lib/constants/settings";
import { SettingsCard } from "./ui";

const CATEGORY_LABELS: Record<Integration["category"], string> = {
  calendar: "Calendar",
  communication: "Communication",
  storage: "Cloud Storage",
  learning: "Learning Tools",
};

const ACCENT_MAP: Record<string, { bg: string; border: string; text: string }> = {
  blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
  green: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700" },
  yellow: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },
};

export default function IntegrationsSection() {
  const [integrations, setIntegrations] = useState<Integration[]>(INTEGRATIONS);
  const [syncing, setSyncing] = useState<string | null>(null);

  const toggle = (id: string) => {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, isConnected: !i.isConnected, lastSync: !i.isConnected ? "Just now" : undefined }
          : i,
      ),
    );
  };

  const handleSync = async (id: string) => {
    setSyncing(id);
    await new Promise((r) => setTimeout(r, 1200));
    setIntegrations((prev) => prev.map((i) => (i.id === id ? { ...i, lastSync: "Just now" } : i)));
    setSyncing(null);
  };

  const categories = Array.from(new Set(integrations.map((i) => i.category)));

  return (
    <div className="space-y-5">
      <div className="p-4 bg-green-50 border border-green-200 rounded-2xl">
        <p className="text-[13px] text-green-800">
          <span className="font-bold">Connect your favourite tools</span> to get the most out of
          Gravitest — sync your calendar, launch sessions from Zoom, and save resources to Drive.
        </p>
      </div>

      {categories.map((category) => {
        const items = integrations.filter((i) => i.category === category);
        return (
          <SettingsCard
            key={category}
            title={CATEGORY_LABELS[category]}
            description={`${items.filter((i) => i.isConnected).length} of ${items.length} connected`}>
            <div className="space-y-3">
              {items.map((integration) => {
                const accent = ACCENT_MAP[integration.accentColor] ?? ACCENT_MAP.green;
                const isSync = syncing === integration.id;

                return (
                  <div
                    key={integration.id}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      integration.isConnected
                        ? `${accent.bg} ${accent.border}`
                        : "bg-gray-50 border-gray-100"
                    }`}>
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Icon circle */}
                      <div className="w-11 h-11 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm text-2xl shrink-0">
                        {integration.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-[14px] font-bold text-gray-800">{integration.name}</p>
                          {integration.isConnected && (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${accent.bg} ${accent.text} border ${accent.border} flex items-center gap-1`}>
                              <CheckCircle size={9} /> Connected
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-gray-500 truncate">
                          {integration.description}
                        </p>
                        {integration.isConnected && integration.lastSync && (
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            Last synced: {integration.lastSync}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      {integration.isConnected && (
                        <button
                          onClick={() => handleSync(integration.id)}
                          disabled={!!isSync}
                          title="Sync now"
                          className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-white transition-all disabled:opacity-50">
                          <RefreshCw size={14} className={isSync ? "animate-spin" : ""} />
                        </button>
                      )}
                      <button
                        onClick={() => toggle(integration.id)}
                        className={`px-4 py-2 rounded-xl text-[13px] font-semibold border transition-all ${
                          integration.isConnected
                            ? "border-red-200 text-red-600 bg-white hover:bg-red-50"
                            : "border-gray-200 bg-white text-gray-700 hover:border-green-400 hover:text-green-700"
                        }`}>
                        {integration.isConnected ? "Disconnect" : "Connect"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </SettingsCard>
        );
      })}

      <div className="text-center py-6">
        <p className="text-[13px] text-gray-500">
          Don't see an integration you need?{" "}
          <button className="text-green-600 font-semibold hover:text-green-700 underline underline-offset-2">
            Request an integration →
          </button>
        </p>
      </div>
    </div>
  );
}
