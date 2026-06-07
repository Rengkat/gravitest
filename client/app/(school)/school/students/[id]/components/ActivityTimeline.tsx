"use client";

import { Activity, Calendar, Award, TrendingUp, User, Settings, LogIn, Edit } from "lucide-react";
import type { ActivityLog } from "../../types";

interface ActivityTimelineProps {
  activities: ActivityLog[];
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const getActivityIcon = (action: string) => {
    switch (action) {
      case "login":
        return <LogIn size={16} className="text-blue-600" />;
      case "exam_completed":
        return <TrendingUp size={16} className="text-green-600" />;
      case "profile_update":
        return <User size={16} className="text-purple-600" />;
      case "badge_earned":
        return <Award size={16} className="text-yellow-600" />;
      case "streak_milestone":
        return <Flame size={16} className="text-orange-600" />;
      case "settings_change":
        return <Settings size={16} className="text-gray-600" />;
      case "edit":
        return <Edit size={16} className="text-indigo-600" />;
      default:
        return <Activity size={16} className="text-text-muted" />;
    }
  };

  const getActivityColor = (action: string) => {
    switch (action) {
      case "login":
        return "bg-blue-50";
      case "exam_completed":
        return "bg-green-50";
      case "profile_update":
        return "bg-purple-50";
      case "badge_earned":
        return "bg-yellow-50";
      case "streak_milestone":
        return "bg-orange-50";
      default:
        return "bg-gray-50";
    }
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return new Date(date).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (activities.length === 0) {
    return (
      <div
        className="p-6 rounded-2xl bg-white border text-center"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <Activity size={48} className="mx-auto text-text-muted mb-3" />
        <p className="text-text-muted">No activity records found</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-white border" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <h2 className="text-lg font-semibold text-green-900 mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-3">
            <div
              className={`w-8 h-8 rounded-full ${getActivityColor(activity.action)} flex items-center justify-center flex-shrink-0`}>
              {getActivityIcon(activity.action)}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                  <p className="text-xs text-text-muted mt-1">
                    By: {activity.performedBy === "system" ? "System" : activity.performedBy}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <Calendar size={12} />
                  <span title={new Date(activity.performedAt).toLocaleString()}>
                    {formatRelativeTime(activity.performedAt)}
                  </span>
                </div>
              </div>
              {activity.metadata && (
                <div className="mt-2 text-xs text-text-muted bg-cream p-2 rounded-lg">
                  {Object.entries(activity.metadata).map(([key, value]) => (
                    <span key={key} className="mr-3">
                      <strong>{key}:</strong> {String(value)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
