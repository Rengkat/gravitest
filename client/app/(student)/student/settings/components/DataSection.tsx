"use client";

import { useState } from "react";
import {
  Download,
  FileText,
  FileJson,
  Calendar,
  BarChart3,
  AlertTriangle,
  Trash2,
  Loader2,
  Clock,
  CheckCircle,
  X,
} from "lucide-react";
import { exportSettingsJSON, exportUserDataCSV, DEFAULT_SETTINGS } from "@/lib/constants/settings";
import { SettingsCard } from "./ui";

export default function DataSection() {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDownload = async (id: string, fn: () => void) => {
    setDownloading(id);
    await new Promise((r) => setTimeout(r, 800));
    fn();
    setDownloading(null);
  };

  const DATA_EXPORTS = [
    {
      id: "profile-csv",
      icon: FileText,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-700",
      title: "Profile & Academic Data (CSV)",
      description: "Your personal info, academic details, and account stats",
      action: () => exportUserDataCSV(),
    },
    {
      id: "settings-json",
      icon: FileJson,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-700",
      title: "App Settings (JSON)",
      description: "All your saved preferences and configuration",
      action: () => exportSettingsJSON(DEFAULT_SETTINGS),
    },
    {
      id: "sessions-csv",
      icon: Calendar,
      iconBg: "bg-green-100",
      iconColor: "text-green-700",
      title: "Session History (CSV)",
      description: "Complete history of all tutoring sessions and bookings",
      action: () => alert("TODO: export session history CSV"),
    },
    {
      id: "progress-csv",
      icon: BarChart3,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-700",
      title: "Performance Report (CSV)",
      description: "Scores, streaks, XP, and subject performance over time",
      action: () => alert("TODO: export performance CSV"),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Export */}
      <SettingsCard
        title="Download Your Data"
        description="Export a copy of your  data at any time">
        <div className="space-y-3">
          {DATA_EXPORTS.map(({ id, icon: Icon, iconBg, iconColor, title, description, action }) => (
            <div
              key={id}
              className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl hover:bg-white hover:border-gray-200 transition-all">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center border border-gray-100 shrink-0`}>
                  <Icon size={18} className={iconColor} />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-gray-800">{title}</p>
                  <p className="text-[12px] text-gray-500">{description}</p>
                </div>
              </div>
              <button
                onClick={() => handleDownload(id, action)}
                disabled={downloading === id}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 text-[13px] font-semibold hover:border-green-400 hover:text-green-700 hover:bg-green-50 transition-all disabled:opacity-60 shrink-0 ml-4">
                {downloading === id ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Download size={14} />
                )}
                {downloading === id ? "Preparing…" : "Download"}
              </button>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-gray-400 mt-4 flex items-center gap-1.5">
          <Clock size={11} />
          Data exports are available immediately. Large exports (sessions history) may take up to a
          minute.
        </p>
      </SettingsCard>

      {/* Data request */}
      <SettingsCard
        title="Full Data Request"
        description="Request a complete archive of all your data under NDPR rights">
        <p className="text-[13px] text-gray-600 mb-4 leading-relaxed">
          Under Nigeria's Data Protection Regulation (NDPR), you have the right to request a
          complete copy of all personal data we hold about you. We'll prepare your full archive
          within 72 hours and send it to your verified email.
        </p>
        <button className="flex items-center gap-2 px-5 py-2.5 border-2 border-green-600 text-green-700 rounded-xl text-[14px] font-bold hover:bg-green-50 transition-colors">
          <FileText size={16} />
          Request Full Data Archive
        </button>
      </SettingsCard>

      {/* Danger zone */}
      <div className="bg-red-50 rounded-2xl border border-red-200 p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center">
            <AlertTriangle size={18} className="text-red-600" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-red-800">Delete All My Data</h3>
            <p className="text-[12px] text-red-500">
              Permanently remove everything — cannot be undone
            </p>
          </div>
        </div>
        <p className="text-[13px] text-red-600 mb-4 leading-relaxed">
          This will permanently delete your account, all session history, progress data, messages,
          and any uploaded files. Your subscription will not be refunded.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl text-[14px] font-bold hover:bg-red-700 transition-colors shadow-sm">
          <Trash2 size={15} />
          Request Account Deletion
        </button>
      </div>

      {/* Deletion modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="bg-red-600 px-6 py-5 flex items-center justify-between">
              <div>
                <h3 className="text-[17px] font-black text-white">Delete All Data</h3>
                <p className="text-red-200 text-[12px] mt-0.5">
                  This action is permanent and irreversible
                </p>
              </div>
              <button
                title="show model"
                onClick={() => setShowDeleteModal(false)}
                className="p-1.5 hover:bg-red-700 rounded-xl transition-colors">
                <X size={18} className="text-white" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              {[
                "All your sessions and bookings will be cancelled",
                "Your profile, XP, achievements and streaks will be erased",
                "All uploaded files and resources will be deleted",
                "This cannot be undone and your subscription will not be refunded",
              ].map((line) => (
                <p key={line} className="flex items-start gap-2 text-[13px] text-gray-700">
                  <X size={13} className="text-red-500 mt-0.5 shrink-0" />
                  {line}
                </p>
              ))}
              <div className="pt-2">
                <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Type DELETE to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  placeholder="DELETE"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-red-200 font-mono text-[14px] focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                />
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirm("");
                }}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-[14px] font-semibold text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (deleteConfirm !== "DELETE") return;
                  setIsDeleting(true);
                  await new Promise((r) => setTimeout(r, 1500));
                  setIsDeleting(false);
                  alert("Deletion request submitted. You will receive a confirmation email.");
                  setShowDeleteModal(false);
                }}
                disabled={deleteConfirm !== "DELETE" || isDeleting}
                className="flex-[2] py-2.5 bg-red-600 text-white rounded-xl text-[14px] font-bold hover:bg-red-700 disabled:opacity-40 flex items-center justify-center gap-2">
                {isDeleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                {isDeleting ? "Deleting…" : "Delete Everything"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
