"use client";

import { useState, useMemo, useCallback } from "react";
import { BOOKINGS } from "@/lib/mock/bookings";
import { Booking, BookingFilters } from "@/types/bookings";
import { applyBookingFilters } from "@/lib/constants/bookings";

import BookingsHero from "./BookingsHero";
import AnalyticsDashboard from "./AnalyticsDashboard";
import BookingsSearchBar from "./BookingsSearchBar";
import BookingsTabs from "./BookingsTabs";
import BookingCard from "./BookingCard";
import BookingsEmptyState from "./BookingsEmptyState";
import FeedbackModal from "./FeedbackModal";
import RescheduleModal from "./RescheduleModal";

const DEFAULT_FILTERS: BookingFilters = {
  searchQuery: "",
  status: "all",
  type: "all",
  tab: "upcoming",
};

export default function BookingsPage() {
  const [filters, setFilters] = useState<BookingFilters>(DEFAULT_FILTERS);
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [feedbackBooking, setFeedbackBooking] = useState<Booking | null>(null);
  const [rescheduleBooking, setRescheduleBooking] = useState<Booking | null>(null);

  const updateFilter = <K extends keyof BookingFilters>(key: K, val: BookingFilters[K]) =>
    setFilters((prev) => ({ ...prev, [key]: val }));

  const filteredBookings = useMemo(() => applyBookingFilters(BOOKINGS, filters), [filters]);

  const handleJoin = useCallback((b: Booking) => {
    if (b.type === "online" && b.meetingLink) {
      window.open(b.meetingLink, "_blank");
    } else if (b.type === "physical" && b.locationAddress) {
      // TODO: open maps with location
      window.open(`https://maps.google.com/?q=${encodeURIComponent(b.locationAddress)}`, "_blank");
    }
  }, []);

  const handleReschedule = useCallback((b: Booking) => {
    setRescheduleBooking(b);
  }, []);

  const handleCancel = useCallback((b: Booking) => {
    if (confirm(`Cancel your session with ${b.tutorName}?`)) {
      // TODO: call cancellation API
      alert("Session cancelled. Refund will be processed within 3-5 business days.");
    }
  }, []);

  const handleFeedback = useCallback((b: Booking) => {
    setFeedbackBooking(b);
  }, []);

  const handleDownloadInvoice = useCallback((b: Booking) => {
    // TODO: generate PDF invoice
    alert(`Downloading invoice ${b.invoiceId} for session with ${b.tutorName}`);
  }, []);

  const handleSubmitFeedback = useCallback(
    (rating: number, comment: string) => {
      // TODO: call feedback API
      console.log("Feedback submitted:", { bookingId: feedbackBooking?.id, rating, comment });
      alert(`Thank you! Your ${rating}-star review has been submitted.`);
      setFeedbackBooking(null);
    },
    [feedbackBooking],
  );

  const handleConfirmReschedule = useCallback(
    (newDate: string, newTime: string) => {
      // TODO: call reschedule API
      console.log("Reschedule:", { bookingId: rescheduleBooking?.id, newDate, newTime });
      alert(`Session rescheduled to ${newDate} at ${newTime}`);
      setRescheduleBooking(null);
    },
    [rescheduleBooking],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/30 to-teal-50/20">
      <BookingsHero
        showAnalytics={showAnalytics}
        onToggleAnalytics={() => setShowAnalytics((v) => !v)}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {showAnalytics && <AnalyticsDashboard />}

        <BookingsSearchBar
          filters={filters}
          onSearchChange={(q) => updateFilter("searchQuery", q)}
          onStatusChange={(s) => updateFilter("status", s)}
          onTypeChange={(t) => updateFilter("type", t)}
        />

        <BookingsTabs
          activeTab={filters.tab}
          bookings={BOOKINGS}
          onChange={(tab) => updateFilter("tab", tab)}
        />

        {/* Results */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <BookingsEmptyState />
          ) : (
            filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onJoin={handleJoin}
                onReschedule={handleReschedule}
                onCancel={handleCancel}
                onFeedback={handleFeedback}
                onDownloadInvoice={handleDownloadInvoice}
              />
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      {feedbackBooking && (
        <FeedbackModal
          booking={feedbackBooking}
          onClose={() => setFeedbackBooking(null)}
          onSubmit={handleSubmitFeedback}
        />
      )}
      {rescheduleBooking && (
        <RescheduleModal
          booking={rescheduleBooking}
          onClose={() => setRescheduleBooking(null)}
          onConfirm={handleConfirmReschedule}
        />
      )}
    </div>
  );
}
