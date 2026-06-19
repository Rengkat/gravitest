"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getMockTutor } from "./mockData";
import type { Tutor, ActiveTab } from "./types";

export function useTutorDetail() {
  const params = useParams();
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Tutor | null>(null);
  const [showSuspendModal, setShowSuspendModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    // TODO: replace with real API call: fetch(`/api/tutors/${params.id}`)
    const timer = setTimeout(() => {
      const data = getMockTutor(params.id as string);
      setTutor(data);
      setEditData(data);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [params.id]);

  const handleSave = () => {
    if (!editData) return;
    setTutor(editData);
    setIsEditing(false);
  };

  const handleSuspend = () => {
    setTutor((prev) => prev ? { ...prev, status: "suspended" } : prev);
    setShowSuspendModal(false);
  };

  const handleActivate = () => {
    setTutor((prev) => prev ? { ...prev, status: "active" } : prev);
  };

  const startEditing = () => {
    if (!tutor) return;
    setEditData({ ...tutor });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditData(tutor);
  };

  return {
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
  };
}
