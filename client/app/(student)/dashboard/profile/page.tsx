"use client";

import { useState, useCallback } from "react";
import { MOCK_USER } from "@/lib/constants/profile";
import { ProfileSection, ProfileFormData, AcademicFormData } from "@/types/profile";

import ProfileSidebar from "./components/ProfileSidebar";
import ProfileHeader from "./components/ProfileHeader";
import ProfileInfoSection from "./components/ProfileInfoSection";
import AcademicSection from "./components/AcademicSection";
import SecuritySection from "./components/SecuritySection";
import NotificationsSection from "./components/NotificationsSection";
import { ConnectedAccountsSection, BillingSection } from "./components/ConnectedAndBilling";

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState<ProfileSection>("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: MOCK_USER.firstName,
    lastName: MOCK_USER.lastName,
    middleName: MOCK_USER.middleName ?? "",
    phoneNumber: MOCK_USER.phoneNumber ?? "",
    dateOfBirth: MOCK_USER.dateOfBirth ?? "",
    gender: MOCK_USER.gender ?? "",
    stateOfResidence: MOCK_USER.stateOfResidence ?? "",
    lga: MOCK_USER.lga ?? "",
    bio: MOCK_USER.bio ?? "",
  });

  const [academicData, setAcademicData] = useState<AcademicFormData>({
    currentClass: MOCK_USER.currentClass ?? "",
    targetExams: MOCK_USER.targetExams ?? [],
    school: MOCK_USER.school ?? "",
    aspirations: MOCK_USER.aspirations ?? "",
  });

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    [],
  );

  const handleSaveProfile = async () => {
    setIsSaving(true);
    // TODO: call API with formData
    await new Promise((r) => setTimeout(r, 1200));
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleSaveAcademic = async (data: AcademicFormData) => {
    // TODO: call API
    await new Promise((r) => setTimeout(r, 800));
    setAcademicData(data);
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      // reset on cancel
      setFormData({
        firstName: MOCK_USER.firstName,
        lastName: MOCK_USER.lastName,
        middleName: MOCK_USER.middleName ?? "",
        phoneNumber: MOCK_USER.phoneNumber ?? "",
        dateOfBirth: MOCK_USER.dateOfBirth ?? "",
        gender: MOCK_USER.gender ?? "",
        stateOfResidence: MOCK_USER.stateOfResidence ?? "",
        lga: MOCK_USER.lga ?? "",
        bio: MOCK_USER.bio ?? "",
      });
    }
    setIsEditing((v) => !v);
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to sign out?")) {
      // TODO: clear session and redirect
      window.location.href = "/";
    }
  };

  return (
    /* This page lives inside the dashboard layout — no outer wrapper needed */
    <div className="max-w-6xl mx-auto">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-[24px] font-black text-gray-900">My Profile</h1>
        <p className="text-[13px] text-gray-500 mt-1">
          Manage your personal information, security, and account preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* ── Sidebar ── */}
        <ProfileSidebar
          user={MOCK_USER}
          activeSection={activeSection}
          onSectionChange={(s) => {
            setActiveSection(s);
            setIsEditing(false);
          }}
          onLogout={handleLogout}
        />

        {/* ── Main content ── */}
        <div className="lg:col-span-3 space-y-0">
          {/* Profile section always shows the header */}
          {activeSection === "profile" && (
            <>
              <ProfileHeader
                user={MOCK_USER}
                isEditing={isEditing}
                onToggleEdit={handleToggleEdit}
              />
              <ProfileInfoSection
                formData={formData}
                isEditing={isEditing}
                isSaving={isSaving}
                onChange={handleInputChange}
                onSave={handleSaveProfile}
                onCancel={handleToggleEdit}
              />
            </>
          )}

          {activeSection === "academic" && (
            <>
              <ProfileHeader user={MOCK_USER} isEditing={false} onToggleEdit={() => {}} />
              <AcademicSection data={academicData} onSave={handleSaveAcademic} />
            </>
          )}

          {activeSection === "security" && <SecuritySection />}

          {activeSection === "notifications" && <NotificationsSection />}

          {activeSection === "connected" && <ConnectedAccountsSection />}

          {activeSection === "billing" && <BillingSection />}
        </div>
      </div>
    </div>
  );
}
