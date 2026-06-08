"use client";

import { Trophy, Award, Flame, Shield, Star } from "lucide-react";
import type { StudentWithUser } from "../types";

interface StudentGamificationProps {
  student: StudentWithUser;
}

export function StudentGamification({ student }: StudentGamificationProps) {
  const { studentProfile } = student;

  // Calculate XP progress to next level
  const getXpProgress = () => {
    const brackets = [0, 500, 1500, 3000, 5000, 10000, 20000, 50000];
    const currentLevel = studentProfile.level;
    const currentLevelXp = brackets[currentLevel - 1] || 0;
    const nextLevelXp = brackets[currentLevel] || currentLevelXp + 10000;
    const xpInLevel = studentProfile.totalXp - currentLevelXp;
    const xpNeeded = nextLevelXp - currentLevelXp;
    return (xpInLevel / xpNeeded) * 100;
  };

  return (
    <div className="p-6 rounded-2xl bg-white border" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <h2 className="text-lg font-semibold text-green-900 mb-4">Gamification Stats</h2>

      {/* Level Card */}
      <div className="bg-gradient-to-r from-green-800 to-green-700 rounded-xl p-4 text-white mb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm opacity-90">Current Level</p>
            <p className="text-3xl font-bold">{studentProfile.level}</p>
            <p className="text-sm font-medium">{studentProfile.levelTitle}</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Total XP</p>
            <p className="text-2xl font-bold">{studentProfile.totalXp.toLocaleString()}</p>
          </div>
        </div>
        <div className="mt-3">
          <div className="h-2 bg-green-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 rounded-full"
              style={{ width: `${getXpProgress()}%` }}
            />
          </div>
          <p className="text-xs text-green-100 mt-1">
            {Math.round(getXpProgress())}% to next level
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-lg bg-cream">
          <div className="flex items-center gap-2 mb-1">
            <Trophy size={16} className="text-yellow-600" />
            <span className="text-xs text-text-muted">Leaderboard Rank</span>
          </div>
          <p className="text-xl font-bold text-green-900">
            #{studentProfile.leaderboardRank || "N/A"}
          </p>
          {studentProfile.percentileStanding && (
            <p className="text-xs text-text-muted">
              Top {Math.round(100 - studentProfile.percentileStanding)}%
            </p>
          )}
        </div>

        <div className="p-3 rounded-lg bg-cream">
          <div className="flex items-center gap-2 mb-1">
            <Award size={16} className="text-purple-600" />
            <span className="text-xs text-text-muted">Badges Earned</span>
          </div>
          <p className="text-xl font-bold text-green-900">{studentProfile.totalBadges}</p>
        </div>

        <div className="p-3 rounded-lg bg-cream">
          <div className="flex items-center gap-2 mb-1">
            <Flame size={16} className="text-orange-600" />
            <span className="text-xs text-text-muted">Current Streak</span>
          </div>
          <p className="text-xl font-bold text-green-900">{studentProfile.currentStreak} days</p>
        </div>

        <div className="p-3 rounded-lg bg-cream">
          <div className="flex items-center gap-2 mb-1">
            <Shield size={16} className="text-blue-600" />
            <span className="text-xs text-text-muted">Streak Shields</span>
          </div>
          <p className="text-xl font-bold text-green-900">{studentProfile.streakShields}</p>
        </div>
      </div>

      {/* Best Streak */}
      <div className="pt-3 border-t">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-muted">Longest Streak</span>
          <span className="font-semibold text-green-900">{studentProfile.longestStreak} days</span>
        </div>
        {studentProfile.lastStudyDate && (
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm text-text-muted">Last Study Date</span>
            <span className="text-sm">
              {new Date(studentProfile?.lastStudyDate).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
