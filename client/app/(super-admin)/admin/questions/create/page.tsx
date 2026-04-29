"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Upload, Eye, FileText, Info } from "lucide-react";

import { useQuestionForm } from "../../../../hooks/useQuestionForm";
import { BasicInfoTab } from "../components/BasicInfoTab";
import { ContentTab } from "../components/ContentTab";
import { MediaTab } from "../components/MediaTab";
import { AdvancedTab } from "../components/AdvancedTab";
import { QuestionSidebar } from "../components/QuestionSidebar";
import { PreviewModal } from "../components/PreviewModal";

type Tab = "basic" | "content" | "media" | "advanced";

const TAB_LABELS: Record<Tab, string> = {
  basic: "1. Basic Information",
  content: "2. Question Content",
  media: "3. Media & Resources",
  advanced: "4. Advanced Settings",
};

export default function CreateQuestionPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("basic");
  const [showPreview, setShowPreview] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const form = useQuestionForm();

  // ─── SUBMIT ─────────────────────────────────────────────
  const handlePublish = () => {
    if (form.validateForm()) {
      form.updateField("status", "active");
      // TODO: call API
      router.push("/admin/questions");
    }
  };

  const handleDraft = () => {
    form.updateField("status", "draft");
    // TODO: call API
    router.push("/admin/questions");
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* ─── PAGE HEADER ─── */}
      <div className="mb-8">
        <Link
          href="/admin/questions"
          className="inline-flex items-center gap-2 text-[14px] text-text-muted hover:text-green-800 mb-4 transition-colors">
          <ArrowLeft size={16} />
          Back to Question Bank
        </Link>

        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-serif text-3xl text-green-900 mb-2">Create New Question</h1>
            <p className="text-text-muted">
              Add a new question to the question bank with full details and resources.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 cursor-pointer hover:bg-cream transition-all">
              <Upload size={16} className="text-text-muted" />
              <span className="text-[14px] font-medium text-text-muted">Bulk Import</span>
              <input
                type="file"
                accept=".csv,.json,.xlsx"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) setBulkMode(true);
                }}
              />
            </label>

            <button
              onClick={() => setShowPreview((v) => !v)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-cream transition-all text-[14px] font-medium text-text-muted">
              <Eye size={16} />
              Preview
            </button>

            <button
              onClick={handleDraft}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200 hover:bg-gray-50 transition-all text-[14px] font-semibold text-text-muted">
              Save as Draft
            </button>

            <button
              onClick={handlePublish}
              className="flex items-center gap-2 px-5 py-3 bg-green-800 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-xl font-semibold text-sm">
              <Save size={16} />
              Publish Question
            </button>
          </div>
        </div>
      </div>

      {/* ─── BULK IMPORT ─── */}
      {bulkMode && (
        <div
          className="mb-6 p-6 rounded-2xl bg-white border"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-green-900">Bulk Import Questions</h2>
            <button
              onClick={() => setBulkMode(false)}
              className="text-[13px] text-red-500 hover:text-red-600 font-medium">
              Cancel Bulk Import
            </button>
          </div>
          <textarea
            rows={10}
            placeholder="Paste your questions here in the supported format…"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all resize-none font-mono"
          />
          <div className="mt-3 flex items-start gap-2 text-[12px] text-text-muted">
            <Info size={14} className="shrink-0 mt-0.5" />
            <span>
              Supported format: JSON array of questions or CSV with columns: examType, subject,
              year, questionText, format, difficulty, options
            </span>
          </div>
        </div>
      )}

      {/* ─── TAB NAV ─── */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {(Object.keys(TAB_LABELS) as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-xl text-[14px] font-semibold transition-all whitespace-nowrap ${
              activeTab === tab
                ? "bg-green-800 text-white shadow-lg"
                : "bg-white border border-gray-200 text-text-muted hover:bg-cream"
            }`}>
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      {/* ─── MAIN CONTENT + SIDEBAR ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tab content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === "basic" && (
            <BasicInfoTab
              formData={form.formData}
              errors={form.errors}
              updateField={form.updateField}
              tagInput={tagInput}
              setTagInput={setTagInput}
              addTag={form.addTag}
              removeTag={form.removeTag}
            />
          )}

          {activeTab === "content" && (
            <ContentTab
              formData={form.formData}
              errors={form.errors}
              updateField={form.updateField}
              updateOption={form.updateOption}
              addOption={form.addOption}
              removeOption={form.removeOption}
              moveOption={form.moveOption}
              setCorrectAnswer={form.setCorrectAnswer}
              addKeyPoint={form.addKeyPoint}
              updateKeyPoint={form.updateKeyPoint}
              removeKeyPoint={form.removeKeyPoint}
              addTheoryQuestion={form.addTheoryQuestion}
              removeTheoryQuestion={form.removeTheoryQuestion}
              addPart={form.addPart}
              removePart={form.removePart}
              updatePart={form.updatePart}
              addSubPart={form.addSubPart}
              removeSubPart={form.removeSubPart}
              updateSubPart={form.updateSubPart}
              addHint={form.addHint}
              updateHint={form.updateHint}
              removeHint={form.removeHint}
            />
          )}

          {activeTab === "media" && (
            <MediaTab
              formData={form.formData}
              updateField={form.updateField}
              addDiagram={form.addDiagram}
              removeDiagram={form.removeDiagram}
              handleDiagramUpload={form.handleDiagramUpload}
              updateDiagramCaption={form.updateDiagramCaption}
              addLink={form.addLink}
              updateLink={form.updateLink}
              removeLink={form.removeLink}
            />
          )}

          {activeTab === "advanced" && (
            <AdvancedTab
              formData={form.formData}
              updateField={form.updateField}
              addSubQuestion={form.addSubQuestion}
              updateSubQuestion={form.updateSubQuestion}
              removeSubQuestion={form.removeSubQuestion}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <QuestionSidebar
            formData={form.formData}
            onPublish={handlePublish}
            onDraft={handleDraft}
            onPreview={() => setShowPreview((v) => !v)}
          />
        </div>
      </div>

      {/* ─── PREVIEW MODAL ─── */}
      {showPreview && (
        <PreviewModal formData={form.formData} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
}
