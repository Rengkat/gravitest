"use client";

import { RefreshCw } from "lucide-react";
import { useContentDetail, type ContentTab } from "../useContentDetail";
import { ContentHeader } from "./ContentHeader";
import { ContentPlayer } from "./ContentPlayer";
import { AccessSidebar } from "./AccessSidebar";
import { AboutTab, RatingsTab, RelatedTab } from "./TabPanels";

const TABS: { id: ContentTab; label: string }[] = [
  { id: "about", label: "About" },
  { id: "ratings", label: "Ratings" },
  { id: "related", label: "Related" },
];

export function ContentDetailView({ contentId }: { contentId: string }) {
  const {
    content,
    access,
    accessRecord,
    ratings,
    related,
    loading,
    activeTab,
    userRating,
    hoverRating,
    reviewText,
    submittingRating,
    ratingSubmitted,
    bookmarkNote,
    showBookmarkInput,
    progressPercent,
    setActiveTab,
    setUserRating,
    setHoverRating,
    setReviewText,
    submitRating,
    addBookmark,
    setBookmarkNote,
    setShowBookmarkInput,
    updateProgress,
  } = useContentDetail(contentId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3 text-text-muted text-[14px]">
        <RefreshCw size={20} className="animate-spin text-green-800" />
        Loading content…
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center h-64 text-text-muted" role="alert">
        Content not found.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header: breadcrumb, thumbnail, title, badges */}
      <ContentHeader content={content} access={access} progressPercent={progressPercent} />

      {/* Main two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
        {/* Left: player + tabs */}
        <div className="space-y-5">
          {/* Player */}
          <ContentPlayer
            content={content}
            access={access ?? { hasAccess: false, reason: "no_access" }}
            accessRecord={accessRecord}
            onProgress={updateProgress}
            onAddBookmark={addBookmark}
          />

          {/* Tab bar */}
          <div
            className="flex gap-1 border-b"
            style={{ borderColor: "rgba(30,80,50,0.1)" }}
            role="tablist"
            aria-label="Content sections">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-[13px] font-medium border-b-2 -mb-px transition-all ${
                  activeTab === tab.id
                    ? "border-green-800 text-green-900 font-semibold"
                    : "border-transparent text-text-muted hover:text-green-900"
                }`}>
                {tab.label}
                {tab.id === "ratings" && (
                  <span className="ml-1.5 text-[10px] text-text-muted">({ratings.length})</span>
                )}
              </button>
            ))}
          </div>

          {/* Panels */}
          <div
            id="panel-about"
            role="tabpanel"
            aria-labelledby="tab-about"
            hidden={activeTab !== "about"}>
            <AboutTab content={content} />
          </div>
          <div
            id="panel-ratings"
            role="tabpanel"
            aria-labelledby="tab-ratings"
            hidden={activeTab !== "ratings"}>
            <RatingsTab
              content={content}
              ratings={ratings}
              userRating={userRating}
              hoverRating={hoverRating}
              reviewText={reviewText}
              submitting={submittingRating}
              submitted={ratingSubmitted}
              onSetUserRating={setUserRating}
              onSetHoverRating={setHoverRating}
              onSetReviewText={setReviewText}
              onSubmit={submitRating}
              hasAccess={access?.hasAccess ?? false}
            />
          </div>
          <div
            id="panel-related"
            role="tabpanel"
            aria-labelledby="tab-related"
            hidden={activeTab !== "related"}>
            <RelatedTab items={related} />
          </div>
        </div>

        {/* Right: access sidebar */}
        <AccessSidebar
          content={content}
          access={access}
          accessRecord={accessRecord}
          progressPercent={progressPercent}
          showBookmarkInput={showBookmarkInput}
          bookmarkNote={bookmarkNote}
          onSetShowBookmarkInput={setShowBookmarkInput}
          onSetBookmarkNote={setBookmarkNote}
        />
      </div>
    </div>
  );
}
