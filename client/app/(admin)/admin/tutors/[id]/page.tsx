"use client";

import { useTutorDetail }      from "./useTutorDetail";
import { TutorPageHeader }     from "./components/TutorPageHeader";
import { TabBar }              from "./components/TabBar";
import { OverviewTab }         from "./components/OverviewTab";
import { SessionsTab }         from "./components/SessionsTab";
import { ReviewsTab }          from "./components/ReviewsTab";
import { EarningsTab }         from "./components/EarningsTab";
import { DocumentsTab }        from "./components/DocumentsTab";
import { SuspendModal }        from "./components/SuspendModal";

export default function AdminTutorDetailPage() {
  const {
    tutor,
    loading,
    activeTab, setActiveTab,
    isEditing,
    editData, setEditData,
    showSuspendModal, setShowSuspendModal,
    handleSave,
    handleSuspend,
    handleActivate,
    startEditing,
    cancelEditing,
  } = useTutorDetail();

  // ─── LOADING SKELETON ──────────────────────────────────────
  if (loading || !tutor || !editData) {
    return (
      <div className="max-w-7xl mx-auto animate-pulse space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded" />
        <div className="h-48 bg-gray-200 rounded-2xl" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* ─── HEADER ─── */}
      <TutorPageHeader
        tutor={tutor}
        isEditing={isEditing}
        onEdit={startEditing}
        onSave={handleSave}
        onCancelEdit={cancelEditing}
        onSuspendClick={() => setShowSuspendModal(true)}
        onActivate={handleActivate}
      />

      {/* ─── TABS ─── */}
      <TabBar activeTab={activeTab} onChange={setActiveTab} />

      {/* ─── TAB PANELS ─── */}
      {activeTab === "overview" && (
        <OverviewTab
          tutor={tutor}
          isEditing={isEditing}
          editData={editData}
          setEditData={setEditData}
        />
      )}

      {activeTab === "sessions" && (
        <SessionsTab sessions={tutor.recentSessions} />
      )}

      {activeTab === "reviews" && (
        <ReviewsTab reviews={tutor.recentReviews} tutorName={tutor.name} />
      )}

      {activeTab === "earnings" && (
        <EarningsTab earnings={tutor.earnings} />
      )}

      {activeTab === "documents" && (
        <DocumentsTab
          cvUrl={tutor.cvUrl}
          idCardUrl={tutor.idCardUrl}
          certificateUrls={tutor.certificateUrls}
        />
      )}

      {/* ─── SUSPEND MODAL ─── */}
      {showSuspendModal && (
        <SuspendModal
          tutorName={tutor.name}
          onConfirm={handleSuspend}
          onClose={() => setShowSuspendModal(false)}
        />
      )}
    </div>
  );
}
