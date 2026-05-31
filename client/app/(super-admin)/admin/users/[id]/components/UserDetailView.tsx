"use client";

import { RefreshCw } from "lucide-react";
import { useUserDetail, type DetailTab } from "../useUserDetail";
import { UserDetailHeader } from "./UserDetailHeader";
import { OverviewTab } from "./OverviewTab";
import { ActivityTab, PaymentsTab } from "./TabPanels";
import { AdminActionsPanel } from "./AdminActionsPanel";
import { ActionModal } from "./ActionModal";

const TABS: { id: DetailTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "activity", label: "Activity" },
  { id: "payments", label: "Payments" },
];

export function UserDetailView({ userId }: { userId: string }) {
  const {
    user,
    activityLog,
    payments,
    loading,
    actionLoading,
    activeTab,
    pendingAction,
    confirmInput,
    editForm,
    pendingTier,
    setActiveTab,
    initiateAction,
    cancelAction,
    confirmAction,
    setConfirmInput,
    setEditForm,
    setPendingTier,
  } = useUserDetail(userId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3 text-text-muted text-[14px]">
        <RefreshCw size={20} className="animate-spin text-green-800" />
        Loading user…
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className="flex items-center justify-center h-64 text-text-muted text-[14px]"
        role="alert">
        User not found.
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <UserDetailHeader user={user} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5 items-start">
          {/* Main column */}
          <main>
            {/* Tab bar */}
            <div
              className="flex gap-1 border-b mb-5"
              style={{ borderColor: "rgba(30,80,50,0.1)" }}
              role="tablist"
              aria-label="User detail sections">
              {TABS.map((tab) => (
                <button
                  title="tab"
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

            {/* Tab panels */}
            <div
              id="panel-overview"
              role="tabpanel"
              aria-labelledby="tab-overview"
              hidden={activeTab !== "overview"}>
              <OverviewTab user={user} />
            </div>

            <div
              id="panel-activity"
              role="tabpanel"
              aria-labelledby="tab-activity"
              hidden={activeTab !== "activity"}>
              <ActivityTab entries={activityLog} />
            </div>

            <div
              id="panel-payments"
              role="tabpanel"
              aria-labelledby="tab-payments"
              hidden={activeTab !== "payments"}>
              <PaymentsTab payments={payments} />
            </div>
          </main>

          {/* Admin sidebar */}
          <AdminActionsPanel user={user} onAction={initiateAction} />
        </div>
      </div>

      {/* Action modal */}
      {pendingAction && (
        <ActionModal
          actionType={pendingAction}
          user={user}
          confirmInput={confirmInput}
          editForm={editForm}
          pendingTier={pendingTier}
          loading={actionLoading}
          onConfirmInputChange={setConfirmInput}
          onEditFormChange={setEditForm}
          onTierChange={setPendingTier}
          onConfirm={confirmAction}
          onCancel={cancelAction}
        />
      )}
    </>
  );
}
