"use client";

import { useState } from "react";
import {
  Mail,
  Bell,
  Smartphone,
  Star,
  Calendar,
  TrendingUp,
  Megaphone,
  BookOpen,
  Save,
} from "lucide-react";
import { NotificationSettings } from "@/types/profile";
import { DEFAULT_NOTIFICATION_SETTINGS } from "@/lib/constants/profile";

const NOTIFICATION_ITEMS: {
  id: keyof NotificationSettings;
  label: string;
  description: string;
  icon: any;
  iconColor: string;
  iconBg: string;
}[] = [
  {
    id: "emailNotifications",
    label: "Email Notifications",
    description: "Receive important updates via email",
    icon: Mail,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50 border-blue-100",
  },
  {
    id: "pushNotifications",
    label: "Push Notifications",
    description: "Browser and app push alerts",
    icon: Bell,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50 border-purple-100",
  },
  {
    id: "smsNotifications",
    label: "SMS Notifications",
    description: "Text message alerts to your phone",
    icon: Smartphone,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50 border-emerald-100",
  },
  {
    id: "sessionReminders",
    label: "Session Reminders",
    description: "Reminders 30 min before tutoring sessions",
    icon: Calendar,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50 border-amber-100",
  },
  {
    id: "achievementAlerts",
    label: "Achievement Alerts",
    description: "Get notified when you earn badges or XP",
    icon: Star,
    iconColor: "text-yellow-600",
    iconBg: "bg-yellow-50 border-yellow-100",
  },
  {
    id: "weeklyReport",
    label: "Weekly Progress Report",
    description: "A summary of your learning each week",
    icon: TrendingUp,
    iconColor: "text-green-600",
    iconBg: "bg-green-50 border-green-100",
  },
  {
    id: "newResourceAlerts",
    label: "New Resource Alerts",
    description: "When new study materials are added",
    icon: BookOpen,
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-50 border-indigo-100",
  },
  {
    id: "marketingEmails",
    label: "Marketing & Offers",
    description: "News about features, discounts, and events",
    icon: Megaphone,
    iconColor: "text-rose-600",
    iconBg: "bg-rose-50 border-rose-100",
  },
];

export default function NotificationsSection() {
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);
  const [saved, setSaved] = useState(false);

  const toggle = (id: keyof NotificationSettings) => {
    setSettings((prev) => ({ ...prev, [id]: !prev[id] }));
    setSaved(false);
  };

  const handleSave = async () => {
    // TODO: call API
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-[16px] font-bold text-gray-900">Notification Preferences</h3>
          <p className="text-[12px] text-gray-500 mt-0.5">Choose how and when you receive alerts</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all ${
            saved
              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
              : "bg-green-600 text-white hover:bg-green-700 shadow-sm"
          }`}>
          <Save size={14} />
          {saved ? "Saved!" : "Save"}
        </button>
      </div>

      <div className="space-y-1">
        {NOTIFICATION_ITEMS.map(({ id, label, description, icon: Icon, iconColor, iconBg }) => (
          <div
            key={id}
            className="flex items-center justify-between py-3.5 px-1 border-b border-gray-50 last:border-0 group">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${iconBg}`}>
                <Icon size={16} className={iconColor} />
              </div>
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-gray-800">{label}</p>
                <p className="text-[12px] text-gray-500 truncate">{description}</p>
              </div>
            </div>

            {/* Toggle */}
            <button
              onClick={() => toggle(id)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ml-4 ${
                settings[id] ? "bg-green-600" : "bg-gray-200"
              }`}
              aria-label={label}>
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                  settings[id] ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
