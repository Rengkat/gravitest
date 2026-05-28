// app/(super-admin)/admin/games/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Gamepad2,
  Trophy,
  Puzzle,
  Brain,
  MapPin,
  Calculator,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Settings,
  BarChart3,
  Users,
  Star,
  Clock,
  DollarSign,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Copy,
  Save,
  X,
  Play,
  TrendingUp,
  Calendar,
  Target,
  Award,
  Shield,
  BookOpen,
  Zap,
  Heart,
  Flag,
} from "lucide-react";

// Types
type Game = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  category: "academic" | "puzzle" | "trivia" | "adventure";
  status: "active" | "maintenance" | "beta";
  totalPlays: number;
  avgScore: number;
  avgTime: number;
  questionsCount: number;
  lastUpdated: string;
  settings: GameSettings;
};

type GameSettings = {
  difficultyLevels: string[];
  timeLimit: number;
  lives: number;
  hintsEnabled: boolean;
  scoring: {
    basePoints: number;
    timeBonus: boolean;
    streakBonus: boolean;
    streakMultiplier: number;
  };
  leaderboardEnabled: boolean;
  dailyChallenges: boolean;
  maxQuestions: number;
};

type Question = {
  id: string;
  gameId: string;
  text: string;
  options: string[];
  correctAnswer: number;
  difficulty: "easy" | "medium" | "hard" | "expert";
  explanation?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  stats: {
    timesAnswered: number;
    timesCorrect: number;
    avgTime: number;
  };
};

// Mock game data
const MOCK_GAMES: Game[] = [
  {
    id: "1",
    name: "Who Wants to Be a Scholar?",
    slug: "scholar",
    description: "Answer 15 questions correctly to win the grand prize of ₦1,000,000!",
    icon: "Trophy",
    category: "trivia",
    status: "active",
    totalPlays: 12450,
    avgScore: 285000,
    avgTime: 420,
    questionsCount: 120,
    lastUpdated: "2024-01-15",
    settings: {
      difficultyLevels: ["easy", "medium", "hard"],
      timeLimit: 60,
      lives: 3,
      hintsEnabled: true,
      scoring: {
        basePoints: 500,
        timeBonus: true,
        streakBonus: true,
        streakMultiplier: 1.5,
      },
      leaderboardEnabled: true,
      dailyChallenges: true,
      maxQuestions: 15,
    },
  },
  {
    id: "2",
    name: "Word Connect",
    slug: "word-connect",
    description: "Fill the wooden board by spelling words correctly",
    icon: "Puzzle",
    category: "puzzle",
    status: "active",
    totalPlays: 8750,
    avgScore: 3500,
    avgTime: 180,
    questionsCount: 180,
    lastUpdated: "2024-01-20",
    settings: {
      difficultyLevels: ["easy", "medium", "hard"],
      timeLimit: 30,
      lives: 3,
      hintsEnabled: true,
      scoring: {
        basePoints: 100,
        timeBonus: true,
        streakBonus: true,
        streakMultiplier: 1.2,
      },
      leaderboardEnabled: true,
      dailyChallenges: true,
      maxQuestions: 10,
    },
  },
  {
    id: "3",
    name: "Where in Nigeria is Madam Karmen?",
    slug: "madam-karmen",
    description: "Track Madam Karmen across all 36 states using geography clues",
    icon: "MapPin",
    category: "adventure",
    status: "active",
    totalPlays: 5620,
    avgScore: 12500,
    avgTime: 600,
    questionsCount: 36,
    lastUpdated: "2024-01-18",
    settings: {
      difficultyLevels: ["easy", "medium", "hard"],
      timeLimit: 30,
      lives: 3,
      hintsEnabled: true,
      scoring: {
        basePoints: 100,
        timeBonus: true,
        streakBonus: true,
        streakMultiplier: 1.3,
      },
      leaderboardEnabled: true,
      dailyChallenges: false,
      maxQuestions: 36,
    },
  },
  {
    id: "4",
    name: "Biodun's Algebra Heist",
    slug: "algebra-heist",
    description: "Solve algebra equations to unlock doors and escape the monster",
    icon: "Calculator",
    category: "academic",
    status: "active",
    totalPlays: 4320,
    avgScore: 2850,
    avgTime: 300,
    questionsCount: 30,
    lastUpdated: "2024-01-22",
    settings: {
      difficultyLevels: ["easy", "medium", "hard", "expert"],
      timeLimit: 60,
      lives: 5,
      hintsEnabled: true,
      scoring: {
        basePoints: 200,
        timeBonus: true,
        streakBonus: true,
        streakMultiplier: 1.5,
      },
      leaderboardEnabled: true,
      dailyChallenges: true,
      maxQuestions: 15,
    },
  },
  {
    id: "5",
    name: "The Nigerian Trail",
    slug: "nigerian-trail",
    description: "Navigate 66 years of Nigerian history through critical choices",
    icon: "Flag",
    category: "adventure",
    status: "beta",
    totalPlays: 1890,
    avgScore: 8500,
    avgTime: 1200,
    questionsCount: 20,
    lastUpdated: "2024-01-25",
    settings: {
      difficultyLevels: ["easy", "medium", "hard"],
      timeLimit: 0,
      lives: 1,
      hintsEnabled: false,
      scoring: {
        basePoints: 500,
        timeBonus: false,
        streakBonus: true,
        streakMultiplier: 1.2,
      },
      leaderboardEnabled: true,
      dailyChallenges: false,
      maxQuestions: 20,
    },
  },
];

const GAME_ICONS: Record<string, any> = {
  Trophy: Trophy,
  Puzzle: Puzzle,
  MapPin: MapPin,
  Calculator: Calculator,
  Flag: Flag,
};

const CATEGORY_COLORS = {
  academic: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  puzzle: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  trivia: "bg-gold/10 text-gold border-gold/30",
  adventure: "bg-green-500/10 text-green-400 border-green-500/30",
};

const STATUS_COLORS = {
  active: "bg-green-500/10 text-green-400 border-green-500/30",
  maintenance: "bg-red-500/10 text-red-400 border-red-500/30",
  beta: "bg-orange-500/10 text-orange-400 border-orange-500/30",
};

function GameCard({
  game,
  onEdit,
  onViewQuestions,
  onViewStats,
}: {
  game: Game;
  onEdit: (game: Game) => void;
  onViewQuestions: (game: Game) => void;
  onViewStats: (game: Game) => void;
}) {
  const Icon = GAME_ICONS[game.icon] || Gamepad2;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="bg-white rounded-2xl border overflow-hidden transition-all hover:shadow-lg"
      style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Icon size={22} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-green-900">{game.name}</h3>
              <p className="text-[12px] text-text-muted mt-0.5">{game.description}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span
              className={`px-2 py-1 rounded-full text-[10px] font-semibold border ${CATEGORY_COLORS[game.category]}`}>
              {game.category}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-[10px] font-semibold border ${STATUS_COLORS[game.status]}`}>
              {game.status}
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div
          className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="text-center">
            <div className="text-[18px] font-bold text-green-900">
              {game.totalPlays.toLocaleString()}
            </div>
            <div className="text-[10px] text-text-muted">Total Plays</div>
          </div>
          <div className="text-center">
            <div className="text-[18px] font-bold text-green-900">
              {game.avgScore.toLocaleString()}
            </div>
            <div className="text-[10px] text-text-muted">Avg Score</div>
          </div>
          <div className="text-center">
            <div className="text-[18px] font-bold text-green-900">
              {Math.floor(game.avgTime / 60)}m {game.avgTime % 60}s
            </div>
            <div className="text-[10px] text-text-muted">Avg Time</div>
          </div>
          <div className="text-center">
            <div className="text-[18px] font-bold text-green-900">{game.questionsCount}</div>
            <div className="text-[10px] text-text-muted">Questions</div>
          </div>
        </div>

        {/* Actions */}
        <div
          className="flex gap-2 mt-4 pt-4 border-t"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <button
            onClick={() => onEdit(game)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-[12px] font-semibold text-gray-600 hover:border-green-400 hover:text-green-700 transition">
            <Settings size={14} /> Settings
          </button>
          <button
            onClick={() => onViewQuestions(game)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-[12px] font-semibold text-gray-600 hover:border-green-400 hover:text-green-700 transition">
            <Brain size={14} /> Questions
          </button>
          <button
            onClick={() => onViewStats(game)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-[12px] font-semibold text-gray-600 hover:border-green-400 hover:text-green-700 transition">
            <BarChart3 size={14} /> Stats
          </button>
        </div>
      </div>
    </div>
  );
}

function GameSettingsModal({
  game,
  onClose,
  onSave,
}: {
  game: Game;
  onClose: () => void;
  onSave: (settings: GameSettings) => void;
}) {
  const [settings, setSettings] = useState<GameSettings>(game.settings);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="font-serif text-xl text-green-900">Game Settings - {game.name}</h2>
          <button title="close" onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Difficulty Levels */}
          <div>
            <label className="block text-[12px] font-semibold text-green-900 mb-2">
              Difficulty Levels
            </label>
            <div className="flex flex-wrap gap-2">
              {["easy", "medium", "hard", "expert"].map((level) => (
                <button
                  key={level}
                  onClick={() => {
                    if (settings.difficultyLevels.includes(level)) {
                      setSettings({
                        ...settings,
                        difficultyLevels: settings.difficultyLevels.filter((l) => l !== level),
                      });
                    } else {
                      setSettings({
                        ...settings,
                        difficultyLevels: [...settings.difficultyLevels, level],
                      });
                    }
                  }}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold capitalize transition ${
                    settings.difficultyLevels.includes(level)
                      ? "bg-green-800 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}>
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Basic Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-green-900 mb-1">
                Time Limit (seconds)
              </label>
              <input
                title="time limi"
                type="number"
                value={settings.timeLimit}
                onChange={(e) => setSettings({ ...settings, timeLimit: parseInt(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-[13px]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-green-900 mb-1">Lives</label>
              <input
                title="lives"
                type="number"
                value={settings.lives}
                onChange={(e) => setSettings({ ...settings, lives: parseInt(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-[13px]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-green-900 mb-1">
                Max Questions
              </label>
              <input
                title="max questions"
                type="number"
                value={settings.maxQuestions}
                onChange={(e) =>
                  setSettings({ ...settings, maxQuestions: parseInt(e.target.value) })
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-[13px]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-green-900 mb-1">
                Base Points
              </label>
              <input
                title="base point"
                type="number"
                value={settings.scoring.basePoints}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    scoring: { ...settings.scoring, basePoints: parseInt(e.target.value) },
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-[13px]"
              />
            </div>
          </div>

          {/* Scoring Settings */}
          <div className="space-y-2">
            <label className="block text-[12px] font-semibold text-green-900 mb-2">
              Scoring Options
            </label>
            <div className="flex items-center justify-between py-2">
              <span className="text-[13px] text-gray-600">Time Bonus</span>
              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    scoring: { ...settings.scoring, timeBonus: !settings.scoring.timeBonus },
                  })
                }
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${settings.scoring.timeBonus ? "bg-green-600" : "bg-gray-200"}`}>
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform ${settings.scoring.timeBonus ? "translate-x-4" : "translate-x-1"}`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-[13px] text-gray-600">Streak Bonus</span>
              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    scoring: { ...settings.scoring, streakBonus: !settings.scoring.streakBonus },
                  })
                }
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${settings.scoring.streakBonus ? "bg-green-600" : "bg-gray-200"}`}>
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform ${settings.scoring.streakBonus ? "translate-x-4" : "translate-x-1"}`}
                />
              </button>
            </div>
            {settings.scoring.streakBonus && (
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">Streak Multiplier</label>
                <input
                  title="streak"
                  type="number"
                  step="0.1"
                  value={settings.scoring.streakMultiplier}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      scoring: {
                        ...settings.scoring,
                        streakMultiplier: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-[13px]"
                />
              </div>
            )}
          </div>

          {/* Feature Toggles */}
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2">
              <span className="text-[13px] text-gray-600">Hints Enabled</span>
              <button
                onClick={() => setSettings({ ...settings, hintsEnabled: !settings.hintsEnabled })}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${settings.hintsEnabled ? "bg-green-600" : "bg-gray-200"}`}>
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform ${settings.hintsEnabled ? "translate-x-4" : "translate-x-1"}`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-[13px] text-gray-600">Leaderboard Enabled</span>
              <button
                onClick={() =>
                  setSettings({ ...settings, leaderboardEnabled: !settings.leaderboardEnabled })
                }
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${settings.leaderboardEnabled ? "bg-green-600" : "bg-gray-200"}`}>
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform ${settings.leaderboardEnabled ? "translate-x-4" : "translate-x-1"}`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-[13px] text-gray-600">Daily Challenges</span>
              <button
                onClick={() =>
                  setSettings({ ...settings, dailyChallenges: !settings.dailyChallenges })
                }
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${settings.dailyChallenges ? "bg-green-600" : "bg-gray-200"}`}>
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform ${settings.dailyChallenges ? "translate-x-4" : "translate-x-1"}`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-200 text-[13px] font-semibold hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => onSave(settings)}
            className="px-4 py-2 rounded-xl bg-green-800 text-white text-[13px] font-semibold hover:bg-green-700">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function QuestionsModal({ game, onClose }: { game: Game; onClose: () => void }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock questions data
  useEffect(() => {
    const mockQuestions: Question[] = Array.from({ length: 10 }, (_, i) => ({
      id: `q_${i}`,
      gameId: game.id,
      text: `Sample question ${i + 1} for ${game.name}`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: 0,
      difficulty: ["easy", "medium", "hard", "expert"][Math.floor(Math.random() * 4)] as any,
      explanation: "This is an explanation for the correct answer.",
      tags: ["tag1", "tag2"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: {
        timesAnswered: Math.floor(Math.random() * 1000),
        timesCorrect: Math.floor(Math.random() * 800),
        avgTime: Math.floor(Math.random() * 30) + 10,
      },
    }));
    setQuestions(mockQuestions);
  }, [game]);

  const filteredQuestions = questions.filter((q) =>
    q.text.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="font-serif text-xl text-green-900">Question Bank - {game.name}</h2>
          <button title="close" onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 border-b flex justify-between items-center">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 text-[13px]"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-800 text-white text-[13px] font-semibold">
            <Plus size={14} /> Add Question
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-3">
            {filteredQuestions.map((q) => (
              <div
                key={q.id}
                className="p-4 rounded-xl border hover:shadow-md transition"
                style={{ borderColor: "rgba(30,80,50,0.08)" }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-semibold capitalize ${
                          q.difficulty === "easy"
                            ? "bg-green-100 text-green-700"
                            : q.difficulty === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : q.difficulty === "hard"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-red-100 text-red-700"
                        }`}>
                        {q.difficulty}
                      </span>
                      <span className="text-[10px] text-gray-400">ID: {q.id}</span>
                    </div>
                    <p className="text-[14px] font-medium text-gray-800 mb-2">{q.text}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt, idx) => (
                        <div
                          key={idx}
                          className={`text-[12px] p-2 rounded ${idx === q.correctAnswer ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-600"}`}>
                          {String.fromCharCode(65 + idx)}. {opt}
                          {idx === q.correctAnswer && (
                            <CheckCircle size={12} className="inline ml-1 text-green-600" />
                          )}
                        </div>
                      ))}
                    </div>
                    {q.explanation && (
                      <div className="mt-2 text-[11px] text-gray-500 bg-gray-50 p-2 rounded">
                        <span className="font-semibold">Explanation:</span> {q.explanation}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button title="edit" className="p-1.5 rounded-lg hover:bg-gray-100">
                      <Edit size={14} className="text-gray-500" />
                    </button>
                    <button title="trash" className="p-1.5 rounded-lg hover:bg-red-50">
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>
                </div>

                {/* Stats for this question */}
                <div className="mt-3 pt-3 border-t flex gap-4 text-[10px] text-gray-500">
                  <span>Answered: {q.stats.timesAnswered} times</span>
                  <span>
                    Correct: {((q.stats.timesCorrect / q.stats.timesAnswered) * 100).toFixed(1)}%
                  </span>
                  <span>Avg Time: {q.stats.avgTime}s</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function GameStatsModal({ game, onClose }: { game: Game; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="font-serif text-xl text-green-900">Game Analytics - {game.name}</h2>
          <button title="close" onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-green-50 border border-green-200">
              <div className="text-[11px] text-green-600 mb-1">Total Plays</div>
              <div className="text-[28px] font-bold text-green-900">
                {game.totalPlays.toLocaleString()}
              </div>
              <div className="text-[10px] text-green-600 mt-1">↑ 12% from last month</div>
            </div>
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <div className="text-[11px] text-blue-600 mb-1">Avg Score</div>
              <div className="text-[28px] font-bold text-blue-900">
                {game.avgScore.toLocaleString()}
              </div>
              <div className="text-[10px] text-blue-600 mt-1">↑ 5% from last month</div>
            </div>
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
              <div className="text-[11px] text-purple-600 mb-1">Completion Rate</div>
              <div className="text-[28px] font-bold text-purple-900">68%</div>
              <div className="text-[10px] text-purple-600 mt-1">↑ 3% from last month</div>
            </div>
            <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
              <div className="text-[11px] text-orange-600 mb-1">Avg Session Time</div>
              <div className="text-[28px] font-bold text-orange-900">
                {Math.floor(game.avgTime / 60)}m {game.avgTime % 60}s
              </div>
              <div className="text-[10px] text-orange-600 mt-1">↓ 8s from last month</div>
            </div>
          </div>

          {/* Weekly Performance Chart */}
          <div className="border rounded-xl p-5">
            <h3 className="font-semibold text-green-900 mb-4">Weekly Performance</h3>
            <div className="h-48 flex items-end gap-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
                const height = [65, 72, 70, 78, 85, 92, 88][i];
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-green-100 rounded-t-lg transition-all hover:bg-green-300"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-[10px] text-gray-500">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Difficulty Breakdown */}
          <div className="border rounded-xl p-5">
            <h3 className="font-semibold text-green-900 mb-4">Performance by Difficulty</h3>
            <div className="space-y-3">
              {[
                { level: "Easy", success: 85, color: "#27ae60" },
                { level: "Medium", success: 68, color: "#f39c12" },
                { level: "Hard", success: 45, color: "#e74c3c" },
                { level: "Expert", success: 28, color: "#8e44ad" },
              ].map((diff) => (
                <div key={diff.level}>
                  <div className="flex justify-between text-[12px] mb-1">
                    <span className="font-semibold text-gray-700">{diff.level}</span>
                    <span className="text-gray-500">{diff.success}% correct</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${diff.success}%`, background: diff.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Button */}
          <div className="flex justify-end">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-[13px] font-semibold hover:bg-gray-50">
              <Download size={14} /> Export Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminGamesPage() {
  const [games, setGames] = useState<Game[]>(MOCK_GAMES);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredGames = games.filter((game) => {
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || game.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || game.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleSaveSettings = (newSettings: GameSettings) => {
    if (selectedGame) {
      setGames(
        games.map((g) =>
          g.id === selectedGame.id
            ? { ...g, settings: newSettings, lastUpdated: new Date().toISOString().split("T")[0] }
            : g,
        ),
      );
      setShowSettingsModal(false);
    }
  };

  // Summary Stats
  const totalPlays = games.reduce((sum, g) => sum + g.totalPlays, 0);
  const totalQuestions = games.reduce((sum, g) => sum + g.questionsCount, 0);
  const avgScore = games.reduce((sum, g) => sum + g.avgScore, 0) / games.length;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-serif text-3xl text-green-900 mb-2">Game Management</h1>
            <p className="text-text-muted">
              Manage all educational games, questions, and game settings
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-800 text-white hover:bg-green-700 transition-all">
            <Plus size={18} /> Add New Game
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div
          className="p-4 rounded-2xl bg-white border"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center gap-2 mb-1">
            <Gamepad2 size={16} className="text-green-600" />
            <span className="text-[11px] text-gray-500">Total Games</span>
          </div>
          <div className="text-[24px] font-bold text-green-900">{games.length}</div>
        </div>
        <div
          className="p-4 rounded-2xl bg-white border"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center gap-2 mb-1">
            <Users size={16} className="text-blue-600" />
            <span className="text-[11px] text-gray-500">Total Plays</span>
          </div>
          <div className="text-[24px] font-bold text-blue-900">{totalPlays.toLocaleString()}</div>
        </div>
        <div
          className="p-4 rounded-2xl bg-white border"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center gap-2 mb-1">
            <Brain size={16} className="text-purple-600" />
            <span className="text-[11px] text-gray-500">Total Questions</span>
          </div>
          <div className="text-[24px] font-bold text-purple-900">
            {totalQuestions.toLocaleString()}
          </div>
        </div>
        <div
          className="p-4 rounded-2xl bg-white border"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center gap-2 mb-1">
            <Star size={16} className="text-gold" />
            <span className="text-[11px] text-gray-500">Avg Score</span>
          </div>
          <div className="text-[24px] font-bold text-gold-dark">
            {Math.round(avgScore).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div
        className="bg-white rounded-2xl border p-4 mb-6"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/30"
            />
          </div>
          <select
            title="filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/30">
            <option value="all">All Categories</option>
            <option value="academic">Academic</option>
            <option value="puzzle">Puzzle</option>
            <option value="trivia">Trivia</option>
            <option value="adventure">Adventure</option>
          </select>
          <select
            title="filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/30">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="beta">Beta</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition">
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* Games Grid */}
      <div className="space-y-4">
        {filteredGames.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            onEdit={(g) => {
              setSelectedGame(g);
              setShowSettingsModal(true);
            }}
            onViewQuestions={(g) => {
              setSelectedGame(g);
              setShowQuestionsModal(true);
            }}
            onViewStats={(g) => {
              setSelectedGame(g);
              setShowStatsModal(true);
            }}
          />
        ))}
      </div>

      {/* Modals */}
      {showSettingsModal && selectedGame && (
        <GameSettingsModal
          game={selectedGame}
          onClose={() => setShowSettingsModal(false)}
          onSave={handleSaveSettings}
        />
      )}
      {showQuestionsModal && selectedGame && (
        <QuestionsModal game={selectedGame} onClose={() => setShowQuestionsModal(false)} />
      )}
      {showStatsModal && selectedGame && (
        <GameStatsModal game={selectedGame} onClose={() => setShowStatsModal(false)} />
      )}
    </div>
  );
}
