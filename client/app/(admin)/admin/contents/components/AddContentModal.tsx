"use client";

import { useState } from "react";
import { X, Upload } from "lucide-react";
import type {
  ContentItem,
  ContentType,
  AccessLevel,
  ContentAudience,
  SubjectCategory,
  ExamTarget,
} from "@/types/admin-contents";
import {
  CONTENT_TYPES,
  SUBJECTS,
  SECONDARY_EXAMS,
  PROFESSIONAL_EXAMS,
} from "@/lib/constants/contents";

interface Props {
  onClose: () => void;
  onAdd: (item: ContentItem) => void;
}

type FormData = {
  title: string;
  description: string;
  author: string;
  type: ContentType;
  audience: ContentAudience;
  subject: SubjectCategory;
  examTarget: ExamTarget;
  accessLevel: AccessLevel;
  price: string;
  tags: string;
  file: File | null;
};

const EXAM_LABELS: Record<string, string> = {
  jamb: "JAMB",
  waec: "WAEC",
  neco: "NECO",
  nabteb: "NABTEB",
  bece: "BECE",
  junior_neco: "Jr. NECO",
  ican: "ICAN",
  nmcn: "NMCN",
  cipm: "CIPM",
  nim: "NIM",
  niesv: "NIESV",
  all: "All",
};

export function AddContentModal({ onClose, onAdd }: Props) {
  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    author: "",
    type: "ebook",
    audience: "secondary",
    subject: "mathematics",
    examTarget: "waec",
    accessLevel: "free",
    price: "",
    tags: "",
    file: null,
  });
  const [dragOver, setDragOver] = useState(false);

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const secondarySubjects: [string, { label: string; color: string }][] = Object.entries(
    SUBJECTS,
  ).filter(
    ([k]) => !["accounting", "nursing", "hr_management", "management", "estate", "all"].includes(k),
  ) as [SubjectCategory, { label: string; color: string }][];

  const professionalSubjects: [string, { label: string; color: string }][] = Object.entries(
    SUBJECTS,
  ).filter(([k]) =>
    ["accounting", "nursing", "hr_management", "management", "estate"].includes(k),
  ) as [SubjectCategory, { label: string; color: string }][];

  const currentSubjects = form.audience === "secondary" ? secondarySubjects : professionalSubjects;
  const currentExams =
    form.audience === "secondary"
      ? Object.entries(SECONDARY_EXAMS)
      : Object.entries(PROFESSIONAL_EXAMS);

  const handleSubmit = () => {
    if (!form.title || !form.author) return;
    const price = parseFloat(form.price) || 0;
    const item: ContentItem = {
      id: `cnt_${Date.now()}`,
      type: form.type,
      title: form.title,
      description: form.description,
      subject: form.subject,
      audience: form.audience,
      examTarget: form.examTarget,
      examLabel: EXAM_LABELS[form.examTarget] ?? form.examTarget,
      size: form.file ? `${(form.file.size / 1024 / 1024).toFixed(1)} MB` : "—",
      author: form.author,
      uploaderName: form.author,
      accessLevel: form.accessLevel,
      price,
      isFree: form.accessLevel === "free" || price === 0,
      views: 0,
      likes: 0,
      downloads: 0,
      rating: 0,
      ratingCount: 0,
      completionRate: 0,
      status: "draft",
      quality: "standard",
      isFeatured: false,
      isNew: true,
      isTrending: false,
      isVerified: false,
      isDownloadable: true,
      drmProtected: form.accessLevel !== "free",
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      dateAdded: new Date().toISOString().split("T")[0],
      dateUpdated: new Date().toISOString().split("T")[0],
      revenue: 0,
      conversionRate: 0,
      bounceRate: 0,
    };
    onAdd(item);
    onClose();
  };

  const inputCls =
    "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-xl text-green-900">Add New Content</h3>
          <button
            title="close"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div className="md:col-span-2">
            <Label>Title *</Label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g., Complete WAEC Mathematics Guide 2024"
              className={inputCls}
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <Label>Description</Label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Briefly describe this content…"
              className={`${inputCls} resize-none`}
            />
          </div>

          {/* Content Type */}
          <div>
            <Label>Content Type *</Label>
            <select
              title="content type"
              value={form.type}
              onChange={(e) => set("type", e.target.value as ContentType)}
              className={inputCls}>
              {Object.entries(CONTENT_TYPES).map(([k, c]) => (
                <option key={k} value={k}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Author */}
          <div>
            <Label>Author *</Label>
            <input
              type="text"
              value={form.author}
              onChange={(e) => set("author", e.target.value)}
              placeholder="e.g., Dr. Adebayo Ola"
              className={inputCls}
            />
          </div>

          {/* Audience toggle */}
          <div>
            <Label>Audience *</Label>
            <div className="grid grid-cols-2 gap-2">
              {(["secondary", "professional"] as ContentAudience[]).map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => {
                    set("audience", a);
                    set("subject", a === "secondary" ? "mathematics" : "accounting");
                    set("examTarget", a === "secondary" ? "waec" : "ican");
                  }}
                  className={`py-2.5 rounded-xl border-2 text-[12px] font-semibold transition-all ${form.audience === a ? "border-green-800 bg-green-50 text-green-900" : "border-gray-200 text-text-muted hover:border-green-800/30"}`}>
                  {a === "secondary" ? "Secondary School" : "Professional"}
                </button>
              ))}
            </div>
          </div>

          {/* Exam target — filtered by audience */}
          <div>
            <Label>Exam Target</Label>
            <select
              title="exam type"
              value={form.examTarget}
              onChange={(e) => set("examTarget", e.target.value as ExamTarget)}
              className={inputCls}>
              {currentExams.map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          {/* Subject — filtered by audience */}
          <div>
            <Label>Subject</Label>
            <select
              title="subject"
              value={form.subject}
              onChange={(e) => set("subject", e.target.value as SubjectCategory)}
              className={inputCls}>
              {currentSubjects.map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          {/* Access Level */}
          <div>
            <Label>Access Level *</Label>
            <select
              title="access level"
              value={form.accessLevel}
              onChange={(e) => set("accessLevel", e.target.value as AccessLevel)}
              className={inputCls}>
              <option value="free">Free</option>
              <option value="premium">Premium (Paid)</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>

          {/* Price — only if not free */}
          {form.accessLevel !== "free" && (
            <div>
              <Label>Price (₦)</Label>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="e.g., 5000"
                className={inputCls}
              />
            </div>
          )}

          {/* Tags */}
          <div className="md:col-span-2">
            <Label>Tags (comma-separated)</Label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => set("tags", e.target.value)}
              placeholder="e.g., mathematics, waec, 2024, past questions"
              className={inputCls}
            />
          </div>

          {/* File upload */}
          <div className="md:col-span-2">
            <Label>File Upload</Label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const f = e.dataTransfer.files[0];
                if (f) set("file", f);
              }}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragOver ? "border-green-800 bg-green-50" : "border-gray-300"}`}>
              <Upload size={32} className="mx-auto mb-2 text-gray-300" />
              <p className="text-[13px] text-text-muted mb-1">
                Drop your file here or click to browse
              </p>
              <p className="text-[11px] text-gray-400 mb-3">
                Accepted: {CONTENT_TYPES[form.type].extensions.join(", ")} — Max{" "}
                {CONTENT_TYPES[form.type].maxSize}
              </p>
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-800 text-white text-[12px] font-medium hover:bg-green-700 cursor-pointer transition-all">
                <Upload size={12} /> Browse Files
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) set("file", f);
                  }}
                />
              </label>
              {form.file && (
                <div className="mt-3 p-2 rounded-lg bg-green-50 inline-flex items-center gap-2 text-[12px] text-green-900">
                  ✓ {form.file.name} ({(form.file.size / 1024 / 1024).toFixed(1)} MB)
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-[14px] font-semibold text-text-muted hover:bg-gray-50 transition-all">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!form.title || !form.author}
            className="flex-1 py-3 rounded-xl bg-green-800 text-white font-semibold hover:bg-green-700 transition-all text-[14px] disabled:opacity-50">
            Add Content
          </button>
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[12px] font-semibold text-green-900 mb-1.5">{children}</label>
  );
}
