"use client";

import { GraduationCap, Briefcase, AlertCircle, Target, X, Plus } from "lucide-react";
import type {
  QuestionFormData,
  ExamType,
  QuestionCategory,
  QuestionFormat,
  DifficultyLevel,
} from "@/types/creatQuestions";
import {
  EXAM_CONFIGS,
  YEARS,
  BLOOM_TAXONOMY,
  FORMAT_DETAILS,
  DIFFICULTY_MAP,
} from "@/lib/constants/createQuestion";

interface Props {
  formData: QuestionFormData;
  errors: Record<string, string>;
  updateField: (field: keyof QuestionFormData, value: unknown) => void;
  tagInput: string;
  setTagInput: (v: string) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
}

export function BasicInfoTab({
  formData,
  errors,
  updateField,
  tagInput,
  setTagInput,
  addTag,
  removeTag,
}: Props) {
  const currentExamConfig = formData.examType ? EXAM_CONFIGS[formData.examType] : null;
  const availableFormats =
    currentExamConfig?.formats ?? (["MCQ", "THEORY", "PRACTICAL", "MIXED"] as QuestionFormat[]);
  const availableSubjects = currentExamConfig?.subjects ?? [];

  const inputCls = (field: string) =>
    `w-full px-4 py-3 rounded-xl border text-[14px] focus:outline-none focus:ring-2 transition-all ${
      errors[field]
        ? "border-red-300 focus:ring-red-500/30"
        : "border-gray-200 focus:ring-green-500/30 focus:border-green-400"
    }`;

  return (
    <>
      {/* Exam Details */}
      <Card title="Exam Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <FieldLabel required>Exam Category</FieldLabel>
            <div className="grid grid-cols-2 gap-2">
              {(["secondary", "professional"] as QuestionCategory[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    updateField("examCategory", cat);
                    updateField("examType", "");
                    updateField("subject", "");
                  }}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    formData.examCategory === cat
                      ? "border-green-800 bg-green-50"
                      : "border-gray-200 hover:border-green-800/30"
                  }`}>
                  {cat === "secondary" ? (
                    <GraduationCap size={20} className="mx-auto mb-1 text-green-600" />
                  ) : (
                    <Briefcase size={20} className="mx-auto mb-1 text-purple-600" />
                  )}
                  <span className="text-[12px] font-semibold text-green-900 capitalize">
                    {cat === "secondary" ? "Secondary School" : "Professional"}
                  </span>
                </button>
              ))}
            </div>
            <FieldError msg={errors.examCategory} />
          </div>

          {/* Exam Type */}
          <div>
            <FieldLabel required>Exam Type</FieldLabel>
            <select
              title="exam type"
              value={formData.examType}
              onChange={(e) => {
                updateField("examType", e.target.value as ExamType);
                updateField("subject", "");
              }}
              className={inputCls("examType")}
              disabled={!formData.examCategory}>
              <option value="">Select Exam Type</option>
              {formData.examCategory &&
                Object.entries(EXAM_CONFIGS)
                  .filter(([, cfg]) => cfg.category === formData.examCategory)
                  .map(([key, cfg]) => (
                    <option key={key} value={key}>
                      {cfg.name}
                    </option>
                  ))}
            </select>
            <FieldError msg={errors.examType} />
          </div>

          {/* Year */}
          <div>
            <FieldLabel required>Year</FieldLabel>
            <select
              title="year"
              value={formData.year}
              onChange={(e) => updateField("year", e.target.value)}
              className={inputCls("year")}>
              <option value="">Select Year</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <FieldError msg={errors.year} />
          </div>

          {/* Subject */}
          <div>
            <FieldLabel required>Subject</FieldLabel>
            <select
              title="subject"
              value={formData.subject}
              onChange={(e) => updateField("subject", e.target.value)}
              className={inputCls("subject")}
              disabled={!formData.examType}>
              <option value="">Select Subject</option>
              {availableSubjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <FieldError msg={errors.subject} />
          </div>

          {/* Format */}
          <div>
            <FieldLabel>Question Format</FieldLabel>
            <div className="grid grid-cols-2 gap-2">
              {availableFormats.map((fmt) => {
                const detail = FORMAT_DETAILS[fmt];
                const Icon = detail.icon;
                return (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => updateField("format", fmt)}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      formData.format === fmt
                        ? "border-green-800 bg-green-50"
                        : "border-gray-200 hover:border-green-800/30"
                    }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Icon size={16} style={{ color: detail.color }} />
                      <span className="text-[12px] font-semibold text-green-900">
                        {detail.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-text-muted">{detail.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <FieldLabel>Difficulty Level</FieldLabel>
            <div className="grid grid-cols-3 gap-2">
              {(
                Object.entries(DIFFICULTY_MAP) as [
                  DifficultyLevel,
                  (typeof DIFFICULTY_MAP)[DifficultyLevel],
                ][]
              ).map(([level, cfg]) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => updateField("difficulty", level)}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    formData.difficulty === level
                      ? "border-green-800 bg-green-50"
                      : "border-gray-200 hover:border-green-800/30"
                  }`}
                  style={formData.difficulty === level ? { borderColor: cfg.text } : {}}>
                  <div
                    className="w-8 h-8 rounded-lg mx-auto mb-1 flex items-center justify-center"
                    style={{ background: cfg.bg }}>
                    <Target size={14} style={{ color: cfg.text }} />
                  </div>
                  <span className="text-[11px] font-semibold text-green-900">{cfg.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Marks & Time */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>Marks</FieldLabel>
              <input
                title="mark"
                type="number"
                min="1"
                max="100"
                value={formData.marks}
                onChange={(e) => updateField("marks", parseInt(e.target.value) || 1)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all"
              />
            </div>
            <div>
              <FieldLabel>Time Allocation (seconds)</FieldLabel>
              <input
                title="time"
                type="number"
                min="30"
                max="3600"
                step="30"
                value={formData.timeAllocation}
                onChange={(e) => updateField("timeAllocation", parseInt(e.target.value) || 120)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Topic & Curriculum */}
      <Card title="Topic & Curriculum">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FieldLabel>Topic</FieldLabel>
            <input
              type="text"
              placeholder="e.g., Quadratic Equations"
              value={formData.topic}
              onChange={(e) => updateField("topic", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all"
            />
          </div>
          <div>
            <FieldLabel>Sub-Topic</FieldLabel>
            <input
              type="text"
              placeholder="e.g., Factorization Method"
              value={formData.subTopic}
              onChange={(e) => updateField("subTopic", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all"
            />
          </div>
          <div>
            <FieldLabel>Bloom's Taxonomy Level</FieldLabel>
            <select
              title="taxonomy"
              value={formData.bloomTaxonomy}
              onChange={(e) => updateField("bloomTaxonomy", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all">
              {BLOOM_TAXONOMY.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel>Curriculum Alignment</FieldLabel>
            <input
              type="text"
              placeholder="e.g., WAEC Syllabus Section 3.2"
              value={formData.curriculumAlignment}
              onChange={(e) => updateField("curriculumAlignment", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all"
            />
          </div>
        </div>
      </Card>

      {/* Tags */}
      <Card title="Tags">
        <div className="flex items-center gap-2 mb-3">
          <input
            type="text"
            placeholder="Add tag..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag(tagInput);
                setTagInput("");
              }
            }}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all"
          />
          <button
            type="button"
            onClick={() => {
              addTag(tagInput);
              setTagInput("");
            }}
            className="px-4 py-2.5 rounded-xl bg-green-800 text-white text-[14px] font-medium hover:bg-green-700 transition-all">
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-[12px] font-medium text-green-700">
              {tag}
              <button
                title="tag"
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-red-500 transition-colors">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      </Card>
    </>
  );
}

// ─── SHARED PRIMITIVES ──────────────────────────────────────
export function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-6 rounded-2xl bg-white border" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <h2 className="font-serif text-xl text-green-900 mb-6">{title}</h2>
      {children}
    </div>
  );
}

export function FieldLabel({
  required,
  children,
}: {
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-[13px] font-semibold text-green-900 mb-2">
      {children}
      {required && " *"}
    </label>
  );
}

export function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="text-[12px] text-red-500 mt-1 flex items-center gap-1">
      <AlertCircle size={12} /> {msg}
    </p>
  );
}
