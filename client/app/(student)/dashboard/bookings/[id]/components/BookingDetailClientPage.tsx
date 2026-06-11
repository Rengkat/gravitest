"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { BOOKINGS } from "@/lib/mock/bookings";
import BookingDetailHeader from "./BookingDetailHeader";
import BookingDetailInfo from "./BookingDetailInfo";
import LocationMap from "./LocationMap";
import BookingDetailActions from "./BookingDetailActions";
import BookingFeedbackPanel from "./BookingFeedbackPanel";
import FeedbackModal from "../../components/FeedbackModal";
import RescheduleModal from "../../components/RescheduleModal";

export default function BookingDetailPage() {
  const params = useParams();
  const booking = BOOKINGS.find((b) => b.id === params.id);

  const [showFeedback, setShowFeedback] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);

  const handleJoin = useCallback(() => {
    if (!booking) return;
    if (booking.type === "online" && booking.meetingLink) {
      window.open(booking.meetingLink, "_blank");
    } else if (booking.type === "physical" && booking.locationAddress) {
      window.open(
        `https://maps.google.com/?q=${encodeURIComponent(booking.locationAddress)}`,
        "_blank",
      );
    }
  }, [booking]);

  const handleDownload = useCallback(() => {
    if (!booking) return;
    // TODO: generate PDF invoice
    alert(`Downloading invoice ${booking.invoiceId}`);
  }, [booking]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({ title: `Booking with ${booking?.tutorName}`, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  }, [booking]);

  const handleMessage = useCallback(() => {
    // TODO: navigate to messages pre-filled with this tutor
    console.log("Open messages with tutor:", booking?.tutorId);
    alert("Opening messages… (integrate chat here)");
  }, [booking]);

  const handleCancel = useCallback(() => {
    if (!booking) return;
    if (confirm(`Cancel your session with ${booking.tutorName}?`)) {
      // TODO: call cancel API
      alert("Session cancelled. Refund will be processed within 3–5 business days.");
    }
  }, [booking]);

  const handleSubmitFeedback = useCallback(
    (rating: number, comment: string) => {
      // TODO: call feedback API
      console.log("Feedback:", { bookingId: booking?.id, rating, comment });
      alert(`Thank you! Your ${rating}-star review has been submitted.`);
      setShowFeedback(false);
    },
    [booking],
  );

  const handleConfirmReschedule = useCallback(
    (newDate: string, newTime: string) => {
      // TODO: call reschedule API
      console.log("Reschedule:", { bookingId: booking?.id, newDate, newTime });
      alert(`Session rescheduled to ${newDate} at ${newTime}`);
      setShowReschedule(false);
    },
    [booking],
  );

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-700 mb-2">Booking not found</h2>
          <a href="/bookings" className="text-green-600 hover:underline text-[14px]">
            ← Back to Bookings
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/30 to-teal-50/20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left column ── */}
          <div className="lg:col-span-2 space-y-6">
            <BookingDetailHeader
              booking={booking}
              onDownload={handleDownload}
              onShare={handleShare}
            />
            <BookingDetailInfo booking={booking} />
            {/* Map only for physical / hire bookings */}
            {booking.type === "physical" && <LocationMap booking={booking} />}
            <BookingFeedbackPanel booking={booking} onLeaveFeedback={() => setShowFeedback(true)} />
          </div>

          {/* ── Right column ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BookingDetailActions
                booking={booking}
                onJoin={handleJoin}
                onReschedule={() => setShowReschedule(true)}
                onCancel={handleCancel}
                onFeedback={() => setShowFeedback(true)}
                onDownload={handleDownload}
                onMessage={handleMessage}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showFeedback && (
        <FeedbackModal
          booking={booking}
          onClose={() => setShowFeedback(false)}
          onSubmit={handleSubmitFeedback}
        />
      )}
      {showReschedule && (
        <RescheduleModal
          booking={booking}
          onClose={() => setShowReschedule(false)}
          onConfirm={handleConfirmReschedule}
        />
      )}
    </div>
  );
}
