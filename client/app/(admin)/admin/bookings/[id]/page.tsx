"use client";

import { useBookingDetail }     from "./useBookingDetail";
import { BookingPageHeader }    from "./components/BookingPageHeader";
import { TabBar }               from "./components/TabBar";
import { SessionInfoPanel }     from "./components/SessionInfoPanel";
import { LocationPanel }        from "./components/LocationPanel";
import { ParticipantCards }     from "./components/ParticipantCards";
import { FeedbackCard }         from "./components/FeedbackCard";
import { FinancialTab }         from "./components/FinancialTab";
import { ActivityTab }          from "./components/ActivityTab";
import { CancelModal }          from "./components/CancelModal";
import { StudentCard, TutorCard } from "./components/ParticipantCards";

export default function AdminBookingDetailPage() {
  const {
    booking,
    loading,
    activeTab,
    setActiveTab,
    showCancelModal,
    setShowCancelModal,
    setShowRescheduleModal,
    handleCancel,
    handleMarkComplete,
    handleMarkNoShow,
  } = useBookingDetail();

  // ─── LOADING SKELETON ──────────────────────────────────────
  if (loading || !booking) {
    return (
      <div className="max-w-5xl mx-auto animate-pulse space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded" />
        <div className="h-48 bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* ─── HEADER ─── */}
      <BookingPageHeader
        booking={booking}
        onReschedule={() => setShowRescheduleModal(true)}
        onCancelClick={() => setShowCancelModal(true)}
        onMarkComplete={handleMarkComplete}
        onMarkNoShow={handleMarkNoShow}
      />

      {/* ─── TABS ─── */}
      <TabBar activeTab={activeTab} onChange={setActiveTab} />

      {/* ─── SESSION DETAILS ─── */}
      {activeTab === "details" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            <SessionInfoPanel booking={booking} />
            <LocationPanel booking={booking} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <StudentCard
              studentId={booking.studentId}
              studentName={booking.studentName}
              studentEmail={booking.studentEmail}
              studentPhone={booking.studentPhone}
              studentAvatar={booking.studentAvatar}
              studentLevel={booking.studentLevel}
            />
            <TutorCard
              tutorId={booking.tutorId}
              tutorName={booking.tutorName}
              tutorEmail={booking.tutorEmail}
              tutorPhone={booking.tutorPhone}
              tutorAvatar={booking.tutorAvatar}
              tutorRating={booking.tutorRating}
              tutorSpecialization={booking.tutorSpecialization}
            />
            {booking.feedback && <FeedbackCard feedback={booking.feedback} />}
          </div>
        </div>
      )}

      {/* ─── FINANCIAL ─── */}
      {activeTab === "financial" && <FinancialTab booking={booking} />}

      {/* ─── ACTIVITY LOG ─── */}
      {activeTab === "activity" && <ActivityTab log={booking.activityLog} />}

      {/* ─── CANCEL MODAL ─── */}
      {showCancelModal && (
        <CancelModal
          onConfirm={handleCancel}
          onClose={() => setShowCancelModal(false)}
        />
      )}
    </div>
  );
}
