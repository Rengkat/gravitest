"use client";

import { Plus, Upload, Image, X, Link as LinkIcon } from "lucide-react";
import type { QuestionFormData, QuestionDiagram } from "@/types/creatQuestions";
import { Card, FieldLabel } from "./BasicInfoTab";

interface Props {
  formData: QuestionFormData;
  updateField: (field: keyof QuestionFormData, value: unknown) => void;
  addDiagram: () => void;
  removeDiagram: (id: string) => void;
  handleDiagramUpload: (id: string, file: File) => void;
  updateDiagramCaption: (id: string, caption: string) => void;
  addLink: () => void;
  updateLink: (index: number, value: string) => void;
  removeLink: (index: number) => void;
}

export function MediaTab({
  formData,
  updateField,
  addDiagram,
  removeDiagram,
  handleDiagramUpload,
  updateDiagramCaption,
  addLink,
  updateLink,
  removeLink,
}: Props) {
  return (
    <>
      {/* Diagrams */}
      <div
        className="p-6 rounded-2xl bg-white border"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-xl text-green-900">Diagrams & Images</h2>
            <p className="text-[13px] text-text-muted mt-1">
              Add diagrams, graphs, or images to support the question
            </p>
          </div>
          <button
            type="button"
            onClick={addDiagram}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-800 text-white text-[13px] font-medium hover:bg-green-700 transition-all">
            <Plus size={14} />
            Add Diagram
          </button>
        </div>

        {formData.diagrams.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
            <Image size={48} className="mx-auto mb-3 text-gray-300" />
            <p className="text-[14px] text-text-muted mb-2">No diagrams added yet</p>
            <p className="text-[12px] text-gray-400 mb-4">
              Add diagrams to make your question clearer
            </p>
            <button
              type="button"
              onClick={addDiagram}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-800 text-white text-[13px] font-medium hover:bg-green-700 transition-all">
              <Upload size={14} />
              Upload First Diagram
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {formData.diagrams.map((diagram, index) => (
              <DiagramCard
                key={diagram.id}
                diagram={diagram}
                index={index}
                onRemove={() => removeDiagram(diagram.id)}
                onUpload={(file) => handleDiagramUpload(diagram.id, file)}
                onCaptionChange={(caption) => updateDiagramCaption(diagram.id, caption)}
              />
            ))}
          </div>
        )}
      </div>

      {/* References & Resources */}
      <div
        className="p-6 rounded-2xl bg-white border space-y-6"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <h2 className="font-serif text-xl text-green-900">References & Resources</h2>

        <div>
          <FieldLabel>Reference Text / Passage</FieldLabel>
          <textarea
            rows={4}
            placeholder="Add any reading passage or reference text that accompanies this question…"
            value={formData.referenceText}
            onChange={(e) => updateField("referenceText", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all resize-none"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <FieldLabel>External Links</FieldLabel>
            <button
              type="button"
              onClick={addLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-green-700 hover:bg-green-50 transition-colors">
              <Plus size={12} />
              Add Link
            </button>
          </div>
          <div className="space-y-2">
            {formData.externalLinks.map((link, i) => (
              <div key={i} className="flex items-center gap-2">
                <LinkIcon size={14} className="text-text-muted" />
                <input
                  type="url"
                  placeholder="https://…"
                  value={link}
                  onChange={(e) => updateLink(i, e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all"
                />
                <button
                  title="remive link"
                  type="button"
                  onClick={() => removeLink(i)}
                  className="p-1.5 rounded hover:bg-red-50 transition-colors">
                  <X size={14} className="text-red-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── DIAGRAM CARD ────────────────────────────────────────────
function DiagramCard({
  diagram,
  index,
  onRemove,
  onUpload,
  onCaptionChange,
}: {
  diagram: QuestionDiagram;
  index: number;
  onRemove: () => void;
  onUpload: (file: File) => void;
  onCaptionChange: (caption: string) => void;
}) {
  return (
    <div className="p-4 rounded-xl border border-gray-200">
      {diagram.preview ? (
        <div className="relative mb-3">
          <img
            src={diagram.preview}
            alt={`Diagram ${index + 1}`}
            className="w-full h-64 object-contain rounded-lg bg-gray-50"
          />
          <button
            title="remove"
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors">
            <X size={14} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center h-40 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-green-800/30 transition-colors mb-3">
          <Upload size={24} className="text-gray-400 mb-2" />
          <span className="text-[13px] text-text-muted">Click to upload diagram</span>
          <span className="text-[11px] text-gray-400">PNG, JPG, GIF up to 10 MB</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file);
            }}
          />
        </label>
      )}

      <input
        type="text"
        placeholder="Diagram caption (e.g., Figure 1: Circuit Diagram)"
        value={diagram.caption}
        onChange={(e) => onCaptionChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all"
      />
    </div>
  );
}
