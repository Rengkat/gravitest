"use client";

import { useState, useCallback, useEffect } from "react";
import type {
  LibraryContent, AccessCheckResult, LibraryAccessRecord,
  RatingEntry, Bookmark,
} from "./types";
import {
  mockContent, mockAccessCheck, mockAccessRecord, mockRatings, mockRelated,
} from "./mockData";
import type { RelatedContent } from "./types";

export type ContentTab = "about" | "ratings" | "related";

interface UseContentDetailReturn {
  content: LibraryContent | null;
  access: AccessCheckResult | null;
  accessRecord: LibraryAccessRecord | null;
  ratings: RatingEntry[];
  related: RelatedContent[];
  loading: boolean;
  activeTab: ContentTab;
  userRating: number;          // hover/selected star
  hoverRating: number;
  reviewText: string;
  submittingRating: boolean;
  ratingSubmitted: boolean;
  bookmarkNote: string;
  showBookmarkInput: boolean;
  progressPercent: number;

  setActiveTab: (t: ContentTab) => void;
  setUserRating: (n: number) => void;
  setHoverRating: (n: number) => void;
  setReviewText: (s: string) => void;
  submitRating: () => Promise<void>;
  addBookmark: (position: number) => Promise<void>;
  setBookmarkNote: (s: string) => void;
  setShowBookmarkInput: (b: boolean) => void;
  updateProgress: (pct: number) => void;
}

export function useContentDetail(contentId: string): UseContentDetailReturn {
  const [content] = useState<LibraryContent | null>(() => mockContent(contentId));
  const [access, setAccess] = useState<AccessCheckResult | null>(null);
  const [accessRecord, setAccessRecord] = useState<LibraryAccessRecord | null>(null);
  const [ratings, setRatings] = useState<RatingEntry[]>([]);
  const [related] = useState<RelatedContent[]>(() => mockRelated(contentId));
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ContentTab>("about");
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [bookmarkNote, setBookmarkNote] = useState("");
  const [showBookmarkInput, setShowBookmarkInput] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);

  // Simulate initial API calls:
  // GET /library/:id/access   → access check
  // GET /library/:id/my-access → access record + progress
  // GET /library/ratings/:id  → ratings
  useEffect(() => {
    const load = async () => {
      await new Promise((r) => setTimeout(r, 400));
      const accessResult = mockAccessCheck(contentId);
      setAccess(accessResult);
      if (accessResult.hasAccess) {
        const rec = mockAccessRecord();
        setAccessRecord(rec);
        setProgressPercent(rec.progressPercent);
      }
      setRatings(mockRatings());
      setLoading(false);
    };
    load();
  }, [contentId]);

  // POST /library/access/record — update progress
  const updateProgress = useCallback((pct: number) => {
    setProgressPercent(pct);
    setAccessRecord((prev) => prev ? { ...prev, progressPercent: pct } : prev);
  }, []);

  // POST /library/:id/bookmarks
  const addBookmark = useCallback(async (position: number) => {
    await new Promise((r) => setTimeout(r, 300));
    const newBookmark: Bookmark = {
      position, note: bookmarkNote || undefined,
      createdAt: new Date().toISOString(),
    };
    setAccessRecord((prev) => prev
      ? { ...prev, bookmarks: [...(prev.bookmarks ?? []), newBookmark] }
      : prev
    );
    setBookmarkNote("");
    setShowBookmarkInput(false);
  }, [bookmarkNote]);

  // POST /library/:id/ratings (hypothetical endpoint)
  const submitRating = useCallback(async () => {
    if (!userRating) return;
    setSubmittingRating(true);
    await new Promise((r) => setTimeout(r, 700));
    const newRating: RatingEntry = {
      id: `r-new-${Date.now()}`,
      userId: "current-user",
      userName: "You",
      avatarInitials: "YO",
      rating: userRating,
      review: reviewText || undefined,
      createdAt: new Date().toISOString(),
      helpful: 0,
    };
    setRatings((prev) => [newRating, ...prev]);
    setRatingSubmitted(true);
    setSubmittingRating(false);
  }, [userRating, reviewText]);

  return {
    content, access, accessRecord, ratings, related, loading,
    activeTab, userRating, hoverRating, reviewText,
    submittingRating, ratingSubmitted,
    bookmarkNote, showBookmarkInput, progressPercent,
    setActiveTab, setUserRating, setHoverRating, setReviewText,
    submitRating, addBookmark, setBookmarkNote, setShowBookmarkInput,
    updateProgress,
  };
}
