"use client";

import { Plus, MoveUp, MoveDown, Trash2, Image, AlertCircle, X } from "lucide-react";
import type { QuestionOption } from "@/types/creatQuestions";
import { Card } from "./BasicInfoTab";

interface Props {
  options: QuestionOption[];
  errors: Record<string, string>;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<QuestionOption>) => void;
  onMove: (id: string, dir: "up" | "down") => void;
  onSetCorrect: (id: string) => void;
}

export function MCQOptions({
  options,
  errors,
  onAdd,
  onRemove,
  onUpdate,
  onMove,
  onSetCorrect,
}: Props) {
  return (
    <Card title="Answer Options">
      <div className="flex items-center justify-between mb-6 -mt-2">
        <span className="text-[13px] text-text-muted">
          Click a letter button to mark correct answer
        </span>
        <button
          type="button"
          onClick={onAdd}
          disabled={options.length >= 8}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-800 text-white text-[13px] font-medium hover:bg-green-700 transition-all disabled:opacity-50">
          <Plus size={14} />
          Add Option
        </button>
      </div>

      {errors.options && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-[13px] text-red-600 flex items-center gap-2">
          <AlertCircle size={14} />
          {errors.options}
        </div>
      )}

      <div className="space-y-3">
        {options.map((option, index) => (
          <div
            key={option.id}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
              option.isCorrect
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:border-gray-300"
            }`}>
            {/* Correct-answer toggle */}
            <button
              type="button"
              onClick={() => onSetCorrect(option.id)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-[14px] font-bold transition-all ${
                option.isCorrect
                  ? "bg-green-800 text-white shadow-md"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
              title="Mark as correct answer">
              {String.fromCharCode(65 + index)}
            </button>

            {/* Text + optional image */}
            <div className="flex-1 space-y-2">
              <input
                type="text"
                placeholder={`Option ${String.fromCharCode(65 + index)}`}
                value={option.text}
                onChange={(e) => onUpdate(option.id, { text: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all"
              />

              {option.image && (
                <div className="relative inline-block">
                  <img src={option.image} alt="" className="h-20 rounded-lg" />
                  <button
                    title="image"
                    type="button"
                    onClick={() => onUpdate(option.id, { image: undefined })}
                    className="absolute -top-1 -right-1 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors">
                    <X size={10} />
                  </button>
                </div>
              )}

              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors text-[11px] text-text-muted">
                <Image size={12} />
                Add Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onloadend = () =>
                      onUpdate(option.id, { image: reader.result as string });
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
            </div>

            {/* Move buttons */}
            <div className="flex flex-col gap-1">
              {index > 0 && (
                <button
                  title="up"
                  type="button"
                  onClick={() => onMove(option.id, "up")}
                  className="p-1 rounded hover:bg-gray-100 transition-colors">
                  <MoveUp size={14} className="text-text-muted" />
                </button>
              )}
              {index < options.length - 1 && (
                <button
                  title="option"
                  type="button"
                  onClick={() => onMove(option.id, "down")}
                  className="p-1 rounded hover:bg-gray-100 transition-colors">
                  <MoveDown size={14} className="text-text-muted" />
                </button>
              )}
            </div>

            {/* Remove */}
            <button
              title="option"
              type="button"
              onClick={() => onRemove(option.id)}
              disabled={options.length <= 2}
              className="p-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-30">
              <Trash2 size={16} className="text-red-400 hover:text-red-600" />
            </button>
          </div>
        ))}
      </div>

      {options.length < 8 && (
        <button
          type="button"
          onClick={onAdd}
          className="w-full mt-3 py-3 rounded-xl border-2 border-dashed border-gray-300 text-[13px] text-text-muted hover:border-green-800/30 hover:text-green-800 transition-all flex items-center justify-center gap-2">
          <Plus size={16} />
          Add Another Option
        </button>
      )}
    </Card>
  );
}
