"use client";

import { useState } from "react";
import { CheckCircle, CreditCard, Crown, AlertTriangle, X, Trash2, Loader2 } from "lucide-react";

// ── Social icons ──────────────────────────────────────────────────────────────

function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function FacebookIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function TwitterIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#1DA1F2">
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </svg>
  );
}

// ── Connected Accounts ────────────────────────────────────────────────────────

const SOCIAL_ACCOUNTS = [
  {
    id: "google",
    name: "Google",
    icon: GoogleIcon,
    color: "#4285F4",
    connected: false,
    help: "Sign in faster with Google",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: FacebookIcon,
    color: "#1877F2",
    connected: false,
    help: "Connect your Facebook account",
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    icon: TwitterIcon,
    color: "#1DA1F2",
    connected: false,
    help: "Connect your X account",
  },
];

export function ConnectedAccountsSection() {
  const [accounts, setAccounts] = useState(SOCIAL_ACCOUNTS);

  const toggle = (id: string) => {
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, connected: !a.connected } : a)));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h3 className="text-[16px] font-bold text-gray-900">Connected Accounts</h3>
        <p className="text-[12px] text-gray-500 mt-0.5">
          Link social accounts for faster sign-in and profile data
        </p>
      </div>

      <div className="space-y-3">
        {accounts.map(({ id, name, icon: Icon, color, connected, help }) => (
          <div
            key={id}
            className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
              connected ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-100"
            }`}>
            <div className="flex items-center gap-4">
              {/* Proper logo circle */}
              <div className="w-11 h-11 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm shrink-0">
                <Icon size={22} />
              </div>
              <div>
                <p className="text-[14px] font-bold text-gray-800">{name}</p>
                <p className="text-[12px] text-gray-500">
                  {connected ? `Connected as you@${id}.com` : help}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {connected && (
                <span className="text-[11px] font-bold text-green-700 flex items-center gap-1">
                  <CheckCircle size={11} /> Connected
                </span>
              )}
              <button
                onClick={() => toggle(id)}
                className={`px-4 py-2 rounded-xl text-[13px] font-semibold border transition-all ${
                  connected
                    ? "border-red-200 text-red-600 hover:bg-red-50"
                    : "border-gray-200 text-gray-700 hover:bg-white hover:border-gray-300"
                }`}>
                {connected ? "Disconnect" : "Connect"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-gray-400 mt-4">
        Connecting an account allows you to sign in using that service. We never post on your
        behalf.
      </p>
    </div>
  );
}

// ── Billing ───────────────────────────────────────────────────────────────────

const PLAN_FEATURES = [
  "Unlimited practice sessions",
  "Access to all video lessons",
  "Priority tutor booking",
  "Downloadable study materials",
  "Performance analytics dashboard",
  "Games & achievement system",
];

export function BillingSection() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (deleteConfirm !== "DELETE") return;
    setIsDeleting(true);
    await new Promise((r) => setTimeout(r, 1500));
    // TODO: call delete API
    alert("Account deletion requested. You'll receive a confirmation email.");
    setIsDeleting(false);
    setShowDeleteModal(false);
  };

  return (
    <div className="space-y-5">
      {/* Current plan */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[16px] font-bold text-gray-900">Current Plan</h3>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
            ✓ Active
          </span>
        </div>

        <div className="flex items-start gap-4 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shrink-0">
            <Crown size={22} className="text-white" />
          </div>
          <div>
            <p className="text-[20px] font-black text-gray-900">Pro Plan</p>
            <p className="text-[13px] text-gray-500">₦15,000/month · Renews Jan 15, 2025</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
          {PLAN_FEATURES.map((f) => (
            <div key={f} className="flex items-center gap-2 text-[13px] text-gray-700">
              <CheckCircle size={14} className="text-green-600 shrink-0" />
              {f}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button className="flex-1 py-2.5 border border-gray-200 rounded-xl text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            Manage Subscription
          </button>
          <button className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-[13px] font-bold hover:bg-green-700 shadow-sm transition-colors">
            Upgrade Plan
          </button>
        </div>
      </div>

      {/* Payment method */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-[16px] font-bold text-gray-900 mb-4">Payment Method</h3>

        <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl mb-3">
          <div className="flex items-center gap-3">
            {/* Card brand icon — proper circle */}
            <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center shadow-sm shrink-0">
              <CreditCard size={18} className="text-white" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-gray-800">VISA •••• 4242</p>
              <p className="text-[12px] text-gray-500">Expires 12/2026</p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full border border-green-200">
            Default
          </span>
        </div>

        <button className="w-full py-2.5 border border-dashed border-gray-300 rounded-xl text-[13px] font-semibold text-gray-600 hover:border-green-400 hover:text-green-700 hover:bg-green-50 transition-all">
          + Add Payment Method
        </button>
      </div>

      {/* Billing history */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-[16px] font-bold text-gray-900 mb-4">Billing History</h3>
        <div className="space-y-2">
          {[
            { date: "Jan 15, 2025", amount: "₦15,000", status: "Paid", inv: "INV-2025-001" },
            { date: "Dec 15, 2024", amount: "₦15,000", status: "Paid", inv: "INV-2024-012" },
            { date: "Nov 15, 2024", amount: "₦15,000", status: "Paid", inv: "INV-2024-011" },
          ].map((item) => (
            <div
              key={item.inv}
              className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-[13px] font-semibold text-gray-800">Pro Plan — {item.date}</p>
                <p className="text-[11px] text-gray-500">{item.inv}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[13px] font-bold text-gray-800">{item.amount}</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-red-50 rounded-2xl border border-red-200 p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center">
            <AlertTriangle size={18} className="text-red-600" />
          </div>
          <h3 className="text-[15px] font-bold text-red-800">Danger Zone</h3>
        </div>
        <p className="text-[13px] text-red-600 mb-4">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl text-[13px] font-bold hover:bg-red-700 transition-colors shadow-sm">
          <Trash2 size={14} />
          Delete Account
        </button>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="bg-red-600 px-6 py-5">
              <h3 className="text-[17px] font-black text-white">Delete Your Account</h3>
              <p className="text-red-200 text-[13px] mt-1">This is permanent and irreversible</p>
            </div>
            <div className="p-6">
              <div className="space-y-3 mb-5 text-[13px] text-gray-700">
                <p className="flex items-start gap-2">
                  <X size={14} className="text-red-500 mt-0.5 shrink-0" /> All your bookings and
                  sessions will be cancelled
                </p>
                <p className="flex items-start gap-2">
                  <X size={14} className="text-red-500 mt-0.5 shrink-0" /> Your profile, progress,
                  and XP will be erased
                </p>
                <p className="flex items-start gap-2">
                  <X size={14} className="text-red-500 mt-0.5 shrink-0" /> Your subscription will
                  not be refunded
                </p>
              </div>
              <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Type DELETE to confirm
              </label>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3.5 py-2.5 rounded-xl border border-red-200 text-[14px] focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-500/20 font-mono"
              />
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirm("");
                }}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-[14px] font-semibold text-gray-600 hover:bg-gray-50">
                Keep Account
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteConfirm !== "DELETE" || isDeleting}
                className="flex-[2] py-2.5 bg-red-600 text-white rounded-xl text-[14px] font-bold hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {isDeleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                {isDeleting ? "Deleting…" : "Delete Forever"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
