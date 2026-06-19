"use client";

import {
  Lock,
  Smartphone,
  Monitor,
  Laptop,
  X,
  Eye,
  EyeOff,
  CheckCircle,
  Shield,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { PasswordFormData, ActiveSession } from "@/types/profile";
import { ACTIVE_SESSIONS, getPasswordStrength } from "@/lib/constants/profile";
import { useState } from "react";

export default function SecuritySection() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [sessions, setSessions] = useState<ActiveSession[]>(ACTIVE_SESSIONS);

  const strength = getPasswordStrength(passwordData.newPassword);
  const match =
    passwordData.newPassword &&
    passwordData.confirmPassword &&
    passwordData.newPassword === passwordData.confirmPassword;

  const handleChangePassword = async () => {
    if (!match) {
      alert("Passwords don't match");
      return;
    }
    // TODO: call API
    alert("Password updated successfully!");
    setShowPasswordModal(false);
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const revokeSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id === "s1" || s.id !== id));
  };

  const DeviceIcon = ({ device }: { device: string }) => {
    if (device === "Mobile") return <Smartphone size={16} className="text-gray-500" />;
    if (device === "Laptop") return <Laptop size={16} className="text-gray-500" />;
    return <Monitor size={16} className="text-gray-500" />;
  };

  return (
    <div className="space-y-5">
      {/* Password card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center">
            <Lock size={18} className="text-green-700" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-gray-900">Password</h3>
            <p className="text-[12px] text-gray-500">Last changed — never</p>
          </div>
        </div>
        <p className="text-[13px] text-gray-500 mb-4">
          Use a strong password with at least 8 characters, numbers, and symbols.
        </p>
        <button
          onClick={() => setShowPasswordModal(true)}
          className="px-4 py-2.5 bg-green-600 text-white rounded-xl text-[13px] font-semibold hover:bg-green-700 transition-colors shadow-sm">
          Change Password
        </button>
      </div>

      {/* 2FA card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
              <Smartphone size={18} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-gray-900">Two-Factor Authentication</h3>
              <p className="text-[12px] text-gray-500 mt-0.5">
                Add an extra layer of security using your phone
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {twoFAEnabled ? (
              <span className="text-[11px] font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                <CheckCircle size={11} /> Enabled
              </span>
            ) : (
              <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                Disabled
              </span>
            )}
            <button
              title="2fa"
              onClick={() => setTwoFAEnabled((v) => !v)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                twoFAEnabled ? "bg-green-600" : "bg-gray-300"
              }`}>
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  twoFAEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
        {!twoFAEnabled && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
            <AlertTriangle size={14} className="text-amber-600 mt-0.5 shrink-0" />
            <p className="text-[12px] text-amber-700">
              Your account is not fully protected. Enable 2FA to secure it.
            </p>
          </div>
        )}
      </div>

      {/* Sessions card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
              <Shield size={18} className="text-purple-600" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-gray-900">Active Sessions</h3>
              <p className="text-[12px] text-gray-500">{sessions.length} devices logged in</p>
            </div>
          </div>
          <button
            onClick={() => setSessions(sessions.filter((s) => s.isCurrent))}
            className="text-[12px] text-red-500 hover:text-red-600 font-semibold flex items-center gap-1.5 transition-colors">
            <RefreshCw size={12} /> Revoke all others
          </button>
        </div>

        <div className="space-y-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                session.isCurrent ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-100"
              }`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                  <DeviceIcon device={session.device} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-gray-800">
                    {session.browser} on {session.device}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {session.location} · {session.lastActive}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {session.isCurrent ? (
                  <span className="text-[11px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                    This device
                  </span>
                ) : (
                  <button
                    onClick={() => revokeSession(session.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="Revoke session">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h3 className="text-[17px] font-bold text-gray-900">Change Password</h3>
              <button
                title="password"
                onClick={() => setShowPasswordModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Current password */}
              <div>
                <label className="block text-[12px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                    placeholder="Enter current password"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* New password */}
              <div>
                <label className="block text-[12px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    placeholder="At least 8 characters"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {/* Strength bar */}
                {passwordData.newPassword && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`flex-1 h-1.5 rounded-full transition-all ${
                            i <= strength.score ? strength.color : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Strength: <span className="font-semibold">{strength.label}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm */}
              <div>
                <label className="block text-[12px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  placeholder="Repeat new password"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-[14px] focus:outline-none focus:ring-2 ${
                    passwordData.confirmPassword
                      ? match
                        ? "border-green-400 focus:ring-green-500/20"
                        : "border-red-300 focus:ring-red-500/20"
                      : "border-gray-200 focus:border-green-400 focus:ring-green-500/20"
                  }`}
                />
                {passwordData.confirmPassword && !match && (
                  <p className="text-[11px] text-red-500 mt-1">Passwords don't match</p>
                )}
                {match && (
                  <p className="text-[11px] text-green-600 mt-1 flex items-center gap-1">
                    <CheckCircle size={11} /> Passwords match
                  </p>
                )}
              </div>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-[14px] text-gray-600 font-semibold hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                disabled={!match || !passwordData.currentPassword}
                className="flex-[2] py-2.5 bg-green-600 text-white rounded-xl text-[14px] font-bold hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
