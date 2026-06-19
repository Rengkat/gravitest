"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getMockBooking } from "./constants";
import type { Booking, ActiveTab } from "./types";

export function useBookingDetail() {
  const params = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>("details");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Replace with real API call: fetch(`/api/bookings/${params.id}`)
    const timer = setTimeout(() => {
      setBooking(getMockBooking(params.id) as Booking);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [params.id]);

  const handleCancel = () => {
    setBooking((prev) =>
      prev
        ? { ...prev, status: "cancelled", cancelledAt: new Date().toISOString().split("T")[0] }
        : prev,
    );
    setShowCancelModal(false);
  };

  const handleMarkComplete = () => {
    setBooking((prev) =>
      prev
        ? {
            ...prev,
            status: "completed",
            completedAt: new Date().toISOString().split("T")[0],
            attendanceConfirmed: true,
          }
        : prev,
    );
  };

  const handleMarkNoShow = () => {
    setBooking((prev) => (prev ? { ...prev, status: "no_show" } : prev));
  };

  return {
    booking,
    loading,
    activeTab,
    setActiveTab,
    showCancelModal,
    setShowCancelModal,
    showRescheduleModal,
    setShowRescheduleModal,
    handleCancel,
    handleMarkComplete,
    handleMarkNoShow,
  };
}
