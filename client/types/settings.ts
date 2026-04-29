// ── Section navigation ─────────────────────────────────────────────────────

export type SettingsSection =
  | "appearance"
  | "study"
  | "accessibility"
  | "language"
  | "privacy"
  | "data"
  | "integrations"
  | "danger";

// ── Appearance ─────────────────────────────────────────────────────────────

export type ThemeMode = "light" | "dark" | "system";
export type AccentColor = "green" | "blue" | "purple" | "orange" | "red";
export type FontSize = "small" | "medium" | "large";
export type DashboardLayout = "compact" | "comfortable" | "spacious";

export interface AppearanceSettings {
  theme: ThemeMode;
  accentColor: AccentColor;
  fontSize: FontSize;
  dashboardLayout: DashboardLayout;
  showAnimations: boolean;
  sidebarCollapsed: boolean;
  showAvatarInHeader: boolean;
}

// ── Study preferences ──────────────────────────────────────────────────────

export type StudyGoal = "jamb" | "waec" | "neco" | "university" | "general";
export type DailyGoalMinutes = 15 | 30 | 45 | 60 | 90 | 120;
export type QuizDifficulty = "adaptive" | "easy" | "medium" | "hard";

export interface StudySettings {
  dailyGoalMinutes: DailyGoalMinutes;
  preferredStudyTime: "morning" | "afternoon" | "evening" | "night";
  primaryGoal: StudyGoal;
  autoPlayVideos: boolean;
  showExplanationsAfterAnswer: boolean;
  soundEffects: boolean;
  streakReminders: boolean;
  defaultQuizDifficulty: QuizDifficulty;
  subjectsOfFocus: string[];
  weeklyTargetSessions: number;
}

// ── Accessibility ──────────────────────────────────────────────────────────

export interface AccessibilitySettings {
  reduceMotion: boolean;
  highContrast: boolean;
  largerClickTargets: boolean;
  screenReaderOptimized: boolean;
  keyboardShortcutsEnabled: boolean;
  focusIndicatorEnhanced: boolean;
  colorBlindMode: "none" | "protanopia" | "deuteranopia" | "tritanopia";
}

// ── Language & Region ──────────────────────────────────────────────────────

export interface LanguageSettings {
  appLanguage: string;
  contentLanguage: string;
  dateFormat: "dd/mm/yyyy" | "mm/dd/yyyy" | "yyyy-mm-dd";
  timeFormat: "12h" | "24h";
  currency: "NGN" | "USD" | "GBP";
  timezone: string;
}

// ── Privacy ────────────────────────────────────────────────────────────────

export interface PrivacySettings {
  profileVisibility: "public" | "friends" | "private";
  showInLeaderboard: boolean;
  shareProgressWithTutors: boolean;
  allowTutorRequests: boolean;
  showOnlineStatus: boolean;
  activityTracking: boolean;
  personalizedAds: boolean;
  dataSharedWithPartners: boolean;
}

// ── Integrations ───────────────────────────────────────────────────────────

export interface Integration {
  id: string;
  name: string;
  description: string;
  category: "calendar" | "communication" | "storage" | "learning";
  isConnected: boolean;
  lastSync?: string;
  icon: string; // emoji
  accentColor: string;
}

// ── All settings bundle ────────────────────────────────────────────────────

export interface AllSettings {
  appearance: AppearanceSettings;
  study: StudySettings;
  accessibility: AccessibilitySettings;
  language: LanguageSettings;
  privacy: PrivacySettings;
}
