"use client";

import { useState, useCallback, useEffect } from "react";
import type {
  LibraryContent,
  AccessCheckResult,
  LibraryAccess,
  RatingEntry,
  RelatedItem,
} from "./types";
import {
  getMockContent,
  getMockAccess,
  getMockAccessRecord,
  getMockRatings,
  getMockRelated,
} from "./mockData";

export type ContentTab = "about" | "ratings" | "related";

interface State {
  content: LibraryContent | null;
  access: AccessCheckResult | null;
  record: LibraryAccess | null;
  ratings: RatingEntry[];
  related: RelatedItem[];
  loading: boolean;
  // tabs
  activeTab: ContentTab;
  // rating form
  userRating: number;
  hoverRating: number;
  reviewText: string;
  submittingRating: boolean;
  ratingDone: boolean;
  // progress
  progressPct: number;
}

interface Actions {
  setTab: (t: ContentTab) => void;
  setUserRating: (n: number) => void;
  setHoverRating: (n: number) => void;
  setReviewText: (s: string) => void;
  submitRating: () => Promise<void>;
  updateProgress: (pct: number) => void;
  addBookmark: (position: number, note?: string) => Promise<void>;
}

export function useContentDetail(id: string): State & Actions {
  const [content] = useState<LibraryContent | null>(() => getMockContent(id));
  const [access, setAccess] = useState<AccessCheckResult | null>(null);
  const [record, setRecord] = useState<LibraryAccess | null>(null);
  const [ratings, setRatings] = useState<RatingEntry[]>([]);
  const [related] = useState<RelatedItem[]>(() => getMockRelated());
  const [loading, setLoading] = useState(true);
  const [activeTab, setTab] = useState<ContentTab>("about");
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingDone, setRatingDone] = useState(false);
  const [progressPct, setProgressPct] = useState(0);

  useEffect(() => {
    const load = async () => {
      // Replace with:
      // GET /library/:id/access-check
      // GET /library/access/my-record/:id
      // GET /library/:id/ratings
      await new Promise((r) => setTimeout(r, 350));
      const a = getMockAccess(id);
      setAccess(a);
      if (a.hasAccess) {
        const rec = getMockAccessRecord();
        setRecord(rec);
        setProgressPct(rec.progressPercent);
      }
      setRatings(getMockRatings());
      setLoading(false);
    };
    load();
  }, [id]);

  const updateProgress = useCallback((pct: number) => {
    setProgressPct(pct);
    // PATCH /library/access/progress  { contentId, progressPercent: pct }
  }, []);

  const addBookmark = useCallback(async (position: number, note?: string) => {
    // POST /library/:id/bookmarks  { position, note }
    await new Promise((r) => setTimeout(r, 200));
    setRecord((prev) =>
      prev
        ? {
            ...prev,
            bookmarks: [
              ...(prev.bookmarks ?? []),
              { position, note, createdAt: new Date().toISOString() },
            ],
          }
        : prev,
    );
  }, []);

  const submitRating = useCallback(async () => {
    if (!userRating) return;
    setSubmittingRating(true);
    // POST /library/:id/ratings  { rating: userRating, review: reviewText }
    await new Promise((r) => setTimeout(r, 600));
    setRatings((prev) => [
      {
        id: `r-new`,
        userId: "me",
        userName: "You",
        initials: "ME",
        rating: userRating,
        review: reviewText || undefined,
        createdAt: new Date().toISOString(),
        helpful: 0,
      },
      ...prev,
    ]);
    setSubmittingRating(false);
    setRatingDone(true);
  }, [userRating, reviewText]);

  return {
    content,
    access,
    record,
    ratings,
    related,
    loading,
    activeTab,
    userRating,
    hoverRating,
    reviewText,
    submittingRating,
    ratingDone,
    progressPct,
    setTab,
    setUserRating,
    setHoverRating,
    setReviewText,
    submitRating,
    updateProgress,
    addBookmark,
  };
}
