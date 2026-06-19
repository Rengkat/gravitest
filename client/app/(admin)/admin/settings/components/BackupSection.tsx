"use client";

import { useState } from "react";
import { Download, RefreshCw, Database, Clock, CheckCircle } from "lucide-react";
import { SettingsCard } from "./ui";

export default function BackupSection() {
  const [backingUp, setBackingUp] = useState(false);
  const [backupComplete, setBackupComplete] = useState(false);
  const [lastBackup, setLastBackup] = useState("2024-01-15 02:30 AM");

  const handleManualBackup = async () => {
    setBackingUp(true);
    await new Promise((r) => setTimeout(r, 2000));
    setBackingUp(false);
    setBackupComplete(true);
    setLastBackup(new Date().toLocaleString());
    setTimeout(() => setBackupComplete(false), 3000);
  };

  return (
    <div className="space-y-5">
      {backupComplete && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl">
          <CheckCircle size={18} className="text-green-600 shrink-0" />
          <p className="text-[13px] font-semibold text-green-800">Backup completed successfully!</p>
        </div>
      )}

      <SettingsCard
        title="Database Backup"
        description="Manual and scheduled backups of platform data">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Clock size={18} className="text-blue-700" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-gray-800">Last Backup</p>
              <p className="text-[12px] text-gray-500">{lastBackup}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-semibold">
              <Database size={10} /> Database
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={handleManualBackup}
            disabled={backingUp}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl text-[13px] font-semibold hover:bg-red-700 transition-all disabled:opacity-50">
            {backingUp ? <RefreshCw size={14} className="animate-spin" /> : <Database size={14} />}
            {backingUp ? "Backing up..." : "Manual Backup"}
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl text-[13px] font-semibold text-gray-700 hover:border-red-400 hover:text-red-700 transition-all">
            <Download size={14} /> Download Backup
          </button>
        </div>

        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
          <p className="text-[11px] text-amber-700">
            Automatic backups run daily at 2 AM. Backups are retained for 30 days.
          </p>
        </div>
      </SettingsCard>

      <SettingsCard title="Export Data" description="Export platform data for analysis">
        <div className="space-y-2">
          <button className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all">
            <div className="flex items-center gap-3">
              <Download size={14} className="text-gray-500" />
              <span className="text-[13px] font-semibold text-gray-700">Export All Users</span>
            </div>
            <span className="text-[11px] text-gray-400">CSV</span>
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all">
            <div className="flex items-center gap-3">
              <Download size={14} className="text-gray-500" />
              <span className="text-[13px] font-semibold text-gray-700">
                Export Transaction Logs
              </span>
            </div>
            <span className="text-[11px] text-gray-400">CSV</span>
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all">
            <div className="flex items-center gap-3">
              <Download size={14} className="text-gray-500" />
              <span className="text-[13px] font-semibold text-gray-700">
                Export Performance Analytics
              </span>
            </div>
            <span className="text-[11px] text-gray-400">Excel</span>
          </button>
        </div>
      </SettingsCard>
    </div>
  );
}
