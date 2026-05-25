"use client";

import { useState } from "react";
import {
  RotateCcw,
  AlertTriangle,
  Loader2,
  X,
  CheckCircle,
  Trash2,
  Database,
  RefreshCw,
  Server,
} from "lucide-react";
import { SettingsCard } from "./ui";

interface AdvancedSectionProps {
  onResetSettings: () => void;
}

export default function AdvancedSection({ onResetSettings }: AdvancedSectionProps) {
  const [showResetModal, setShowResetModal] = useState(false);
  const [showClearCacheModal, setShowClearCacheModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isClearingCache, setIsClearingCache] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    await new Promise((r) => setTimeout(r, 1500));
    onResetSettings();
    setIsResetting(false);
    setResetDone(true);
    setShowResetModal(false);
    setTimeout(() => setResetDone(false), 3000);
  };

  const handleClearCache = async () => {
    setIsClearingCache(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsClearingCache(false);
    setCacheCleared(true);
    setShowClearCacheModal(false);
    setTimeout(() => setCacheCleared(false), 3000);
  };

  return (
    <div className="space-y-5">
      {resetDone && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl">
          <CheckCircle size={18} className="text-green-600 shrink-0" />
          <p className="text-[13px] font-semibold text-green-800">
            All settings have been reset to defaults.
          </p>
        </div>
      )}

      {cacheCleared && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl">
          <CheckCircle size={18} className="text-green-600 shrink-0" />
          <p className="text-[13px] font-semibold text-green-800">Cache cleared successfully!</p>
        </div>
      )}

      {/* System Tools */}
      <SettingsCard title="System Tools" description="Maintenance and system utilities">
        <button
          onClick={() => setShowClearCacheModal(true)}
          className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <RefreshCw size={18} className="text-blue-700" />
            </div>
            <div className="text-left">
              <p className="text-[14px] font-semibold text-gray-800">Clear System Cache</p>
              <p className="text-[12px] text-gray-500">Clear all cached data and temporary files</p>
            </div>
          </div>
          <span className="text-[13px] text-gray-400">Clear →</span>
        </button>

        <button className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Server size={18} className="text-purple-700" />
            </div>
            <div className="text-left">
              <p className="text-[14px] font-semibold text-gray-800">System Health Check</p>
              <p className="text-[12px] text-gray-500">Run diagnostic checks on all services</p>
            </div>
          </div>
          <span className="text-[13px] text-gray-400">Run →</span>
        </button>
      </SettingsCard>

      {/* Reset Settings */}
      <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center">
            <RotateCcw size={18} className="text-amber-700" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-amber-800">Reset All Settings</h3>
            <p className="text-[12px] text-amber-600">
              Restore every setting to its factory default
            </p>
          </div>
        </div>
        <p className="text-[13px] text-amber-700 mb-4 leading-relaxed">
          This will reset appearance, platform, security, notification, and integration settings to
          their defaults. User data and platform content are not affected.
        </p>
        <button
          onClick={() => setShowResetModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 border-2 border-amber-500 text-amber-700 rounded-xl text-[14px] font-bold hover:bg-amber-100 transition-colors">
          <RotateCcw size={15} />
          Reset to Defaults
        </button>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 rounded-2xl border border-red-200 p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center">
            <AlertTriangle size={18} className="text-red-600" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-red-800">Danger Zone</h3>
            <p className="text-[12px] text-red-500">
              Irreversible actions - proceed with extreme caution
            </p>
          </div>
        </div>
        <p className="text-[13px] text-red-600 mb-4 leading-relaxed">
          These actions cannot be undone. Please ensure you have recent backups before proceeding.
        </p>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl text-[14px] font-bold hover:bg-red-700 transition-colors shadow-sm">
          <Trash2 size={15} />
          Emergency System Shutdown
        </button>
      </div>

      {/* Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RotateCcw size={20} className="text-amber-600" />
                <h3 className="text-[17px] font-bold text-gray-900">Reset Settings?</h3>
              </div>
              <button
                onClick={() => setShowResetModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl">
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-[14px] text-gray-700 mb-3">
                The following will be reset to defaults:
              </p>
              <ul className="space-y-1.5 text-[13px] text-gray-600 mb-5">
                {[
                  "Appearance (theme, colours, layout)",
                  "Platform configuration",
                  "Security settings",
                  "Notification preferences",
                  "Integration settings",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-[12px] text-gray-400">
                User data, transactions, and content are not affected.
              </p>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-[14px] font-semibold text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={handleReset}
                disabled={isResetting}
                className="flex-[2] py-2.5 bg-amber-500 text-white rounded-xl text-[14px] font-bold hover:bg-amber-600 disabled:opacity-60 flex items-center justify-center gap-2">
                {isResetting ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <RotateCcw size={15} />
                )}
                {isResetting ? "Resetting…" : "Yes, Reset Everything"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Cache Modal */}
      {showClearCacheModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RefreshCw size={20} className="text-blue-600" />
                <h3 className="text-[17px] font-bold text-gray-900">Clear System Cache?</h3>
              </div>
              <button
                onClick={() => setShowClearCacheModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl">
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-[14px] text-gray-700">This will clear:</p>
              <ul className="space-y-1.5 text-[13px] text-gray-600 my-4">
                <li className="flex items-center gap-2">• API response cache</li>
                <li className="flex items-center gap-2">• Database query cache</li>
                <li className="flex items-center gap-2">
                  • Session store (users will need to re-login)
                </li>
                <li className="flex items-center gap-2">• CDN cache</li>
              </ul>
              <p className="text-[12px] text-amber-600">
                This may temporarily slow down the platform while caches rebuild.
              </p>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => setShowClearCacheModal(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-[14px] font-semibold text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={handleClearCache}
                disabled={isClearingCache}
                className="flex-[2] py-2.5 bg-blue-600 text-white rounded-xl text-[14px] font-bold hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2">
                {isClearingCache ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <RefreshCw size={15} />
                )}
                {isClearingCache ? "Clearing..." : "Clear Cache"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
