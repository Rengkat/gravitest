"use client";

import { RefreshCw } from "lucide-react";
import { useSchoolDetail, type DetailTab } from "../useSchoolDetail";
import { SchoolDetailHeader } from "./SchoolDetailHeader";
import { OverviewTab } from "./OverviewTab";
import { ClassesTab } from "./ClassesTab";
import { AdminsTab } from "./AdminsTab";
import { ActivityTab } from "./ActivityTab";
import { BillingTab } from "./BillingTab";
import { AdminActionsPanel } from "./AdminActionsPanel";
import { ActionModal } from "./ActionModal";

const TABS: { id: DetailTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "classes", label: "Classes" },
  { id: "admins", label: "Admins" },
  { id: "activity", label: "Activity" },
  { id: "billing", label: "Billing" },
];

export function SchoolDetailView({ schoolId }: { schoolId: string }) {
  const {
    school,
    loading,
    actionLoading,
    activeTab,
    expandedClass,
    pendingAction,
    confirmInput,
    reasonInput,
    editForm,
    addClassForm,
    addAdminForm,
    pendingPlan,
    setActiveTab,
    toggleClass,
    initiateAction,
    cancelAction,
    confirmAction,
    setConfirmInput,
    setReasonInput,
    setEditForm,
    setAddClassForm,
    setAddAdminForm,
    setPendingPlan,
  } = useSchoolDetail(schoolId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3 text-text-muted text-[14px]">
        <RefreshCw size={20} className="animate-spin text-green-800" />
        Loading school…
      </div>
    );
  }

  if (!school) {
    return (
      <div
        className="flex items-center justify-center h-64 text-text-muted text-[14px]"
        role="alert">
        School not found.
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <SchoolDetailHeader school={school} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5 items-start">
          <main>
            {/* Tab bar */}
            <div
              className="flex gap-1 border-b mb-5"
              style={{ borderColor: "rgba(30,80,50,0.1)" }}
              role="tablist"
              aria-label="School detail sections">
              {TABS.map((tab) => (
                <button
                  title={tab.label}
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
                </button>
              ))}
            </div>

            <div
              id="panel-overview"
              role="tabpanel"
              aria-labelledby="tab-overview"
              hidden={activeTab !== "overview"}>
              <OverviewTab school={school} />
            </div>
            <div
              id="panel-classes"
              role="tabpanel"
              aria-labelledby="tab-classes"
              hidden={activeTab !== "classes"}>
              <ClassesTab
                school={school}
                expandedClass={expandedClass}
                onToggleClass={toggleClass}
                onAction={initiateAction}
              />
            </div>
            <div
              id="panel-admins"
              role="tabpanel"
              aria-labelledby="tab-admins"
              hidden={activeTab !== "admins"}>
              <AdminsTab school={school} onAction={initiateAction} />
            </div>
            <div
              id="panel-activity"
              role="tabpanel"
              aria-labelledby="tab-activity"
              hidden={activeTab !== "activity"}>
              <ActivityTab schoolId={schoolId} />
            </div>
            <div
              id="panel-billing"
              role="tabpanel"
              aria-labelledby="tab-billing"
              hidden={activeTab !== "billing"}>
              <BillingTab school={school} />
            </div>
          </main>

          <AdminActionsPanel school={school} onAction={initiateAction} />
        </div>
      </div>

      {pendingAction && (
        <ActionModal
          actionType={pendingAction}
          school={school}
          confirmInput={confirmInput}
          reasonInput={reasonInput}
          editForm={editForm}
          addClassForm={addClassForm}
          addAdminForm={addAdminForm}
          pendingPlan={pendingPlan}
          loading={actionLoading}
          onConfirmInputChange={setConfirmInput}
          onReasonInputChange={setReasonInput}
          onEditFormChange={setEditForm}
          onAddClassFormChange={setAddClassForm}
          onAddAdminFormChange={setAddAdminForm}
          onPlanChange={setPendingPlan}
          onConfirm={confirmAction}
          onCancel={cancelAction}
        />
      )}
    </>
  );
}
