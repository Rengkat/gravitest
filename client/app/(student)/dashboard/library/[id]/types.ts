export type ContentType =
  | "video"
  | "audio"
  | "ebook"
  | "document"
  | "past_question"
  | "lesson_note"
  | "infographic";

export type Subject =
  | "mathematics"
  | "english"
  | "physics"
  | "chemistry"
  | "biology"
  | "economics"
  | "government"
  | "literature"
  | "geography"
  | "history"
  | "commerce"
  | "accounting"
  | "further_mathematics"
  | "agricultural_science"
  | "civic_education";

export type ExamType = "waec" | "neco" | "jamb" | "nabteb" | "common_entrance";
export type ClassLevel = "jss1" | "jss2" | "jss3" | "ss1" | "ss2" | "ss3";
export type SubscriptionTier = "free" | "basic" | "standard" | "premium" | "enterprise";

// ─── Main content type — mirrors LibraryContent entity ───────────────────────

export interface LibraryContent {
  id: string;
  title: string;
  description: string | null;
  contentType: ContentType;
  subject: Subject | null;
  topic: string | null;
  fileUrl: string;
  thumbnailUrl: string | null;
  durationSeconds: number | null; // video / audio
  totalPages: number | null; // ebook / document
  fileSizeBytes: number | null;
  examTypes: ExamType[];
  classLevels: ClassLevel[];
  isFree: boolean;
  requiredTier: SubscriptionTier | null;
  priceKobo: number | null;
  totalViews: number;
  totalDownloads: number;
  averageRating: number;
  ratingCount: number;
  isActive: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  // Enriched fields from API
  author?: string;
  previewUrl?: string; // partial file URL for locked preview
  previewPages?: number; // how many pages are free to preview
  previewSeconds?: number; // how many seconds of video/audio are free
  tags?: string[];
}

// ─── Access record — mirrors LibraryAccess entity ────────────────────────────

export interface LibraryAccessRecord {
  id: string;
  userId: string;
  contentId: string;
  contentType: ContentType;
  expiresAt: string | null;
  viewCount: number;
  downloadCount: number;
  progressPercent: number;
  lastAccessedAt: string | null;
  bookmarks: Bookmark[] | null;
  highlights: Highlight[] | null;
  paymentId: string | null;
  createdAt: string;
}

export interface Bookmark {
  position: number; // page or seconds
  note?: string;
  createdAt: string;
}

export interface Highlight {
  startOffset: number;
  endOffset: number;
  text: string;
  color: string;
  note?: string;
}

// ─── Access check result ──────────────────────────────────────────────────────

export type AccessReason = "free" | "owned" | "subscription" | "no_access" | "expired";

export interface AccessCheckResult {
  hasAccess: boolean;
  reason: AccessReason;
  accessRecord?: LibraryAccessRecord;
}

// ─── Rating ───────────────────────────────────────────────────────────────────

export interface RatingEntry {
  id: string;
  userId: string;
  userName: string;
  avatarInitials: string;
  rating: number; // 1-5
  review?: string;
  createdAt: string;
  helpful: number;
}

// ─── Related content ─────────────────────────────────────────────────────────

export type RelatedContent = Pick<
  LibraryContent,
  | "id"
  | "title"
  | "contentType"
  | "thumbnailUrl"
  | "averageRating"
  | "isFree"
  | "requiredTier"
  | "priceKobo"
  | "subject"
  | "durationSeconds"
  | "totalPages"
>;
