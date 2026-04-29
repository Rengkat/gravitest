"use client";

import { useState } from "react";
import type {
  QuestionFormData,
  QuestionOption,
  QuestionDiagram,
  SubQuestion,
  TheoryQuestion,
  QuestionPart,
  SubPart,
  ExamType,
  QuestionFormat,
  DifficultyLevel,
  QuestionCategory,
} from "@/types/creatQuestions";
import { PART_LETTERS, ROMAN_NUMERALS } from "@/lib/constants/createQuestion";

export const generateId = () => Math.random().toString(36).substr(2, 9);

const DEFAULT_OPTIONS: QuestionOption[] = Array.from({ length: 4 }, () => ({
  id: generateId(),
  text: "",
  isCorrect: false,
}));

const DEFAULT_THEORY_QUESTION = (): TheoryQuestion => ({
  id: generateId(),
  number: 1,
  parts: [
    {
      id: generateId(),
      label: "a",
      text: "",
      marks: 0,
      answer: "",
      subParts: [],
    },
  ],
});

const INITIAL_FORM: QuestionFormData = {
  examCategory: "",
  examType: "",
  year: "",
  subject: "",
  topic: "",
  subTopic: "",

  format: "MCQ",
  difficulty: "medium",
  questionText: "",
  marks: 1,
  timeAllocation: 120,

  options: DEFAULT_OPTIONS,

  theoryQuestions: [DEFAULT_THEORY_QUESTION()],
  wordLimit: 500,
  markingScheme: "",
  sampleAnswer: "",
  keyPoints: [""],

  requiredMaterials: "",
  procedure: "",
  observations: "",

  diagrams: [],
  referenceText: "",
  externalLinks: [""],

  status: "active",
  tags: [],
  explanation: "",
  hints: [""],
  difficultyRationale: "",

  subQuestions: [],
  feedbackRules: [],
  adaptiveDifficulty: false,
  bloomTaxonomy: "Apply",
  curriculumAlignment: "",
};

export function useQuestionForm() {
  const [formData, setFormData] = useState<QuestionFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ─── GENERIC UPDATER ────────────────────────────────────
  const updateField = (field: keyof QuestionFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // ─── MCQ OPTIONS ────────────────────────────────────────
  const updateOption = (id: string, updates: Partial<QuestionOption>) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((o) => (o.id === id ? { ...o, ...updates } : o)),
    }));
  };

  const addOption = () => {
    setFormData((prev) => {
      if (prev.options.length >= 8) return prev;
      return {
        ...prev,
        options: [...prev.options, { id: generateId(), text: "", isCorrect: false }],
      };
    });
  };

  const removeOption = (id: string) => {
    setFormData((prev) => {
      if (prev.options.length <= 2) return prev;
      return { ...prev, options: prev.options.filter((o) => o.id !== id) };
    });
  };

  const moveOption = (id: string, direction: "up" | "down") => {
    setFormData((prev) => {
      const idx = prev.options.findIndex((o) => o.id === id);
      if (idx === -1) return prev;
      const next = [...prev.options];
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= next.length) return prev;
      [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
      return { ...prev, options: next };
    });
  };

  const setCorrectAnswer = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((o) => ({ ...o, isCorrect: o.id === id })),
    }));
  };

  // ─── DIAGRAMS ────────────────────────────────────────────
  const addDiagram = () => {
    setFormData((prev) => ({
      ...prev,
      diagrams: [...prev.diagrams, { id: generateId(), file: null, preview: "", caption: "" }],
    }));
  };

  const removeDiagram = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      diagrams: prev.diagrams.filter((d) => d.id !== id),
    }));
  };

  const handleDiagramUpload = (id: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        diagrams: prev.diagrams.map((d) =>
          d.id === id ? { ...d, file, preview: reader.result as string } : d,
        ),
      }));
    };
    reader.readAsDataURL(file);
  };

  const updateDiagramCaption = (id: string, caption: string) => {
    setFormData((prev) => ({
      ...prev,
      diagrams: prev.diagrams.map((d) => (d.id === id ? { ...d, caption } : d)),
    }));
  };

  // ─── KEY POINTS ──────────────────────────────────────────
  const addKeyPoint = () => updateField("keyPoints", [...formData.keyPoints, ""]);

  const updateKeyPoint = (index: number, value: string) => {
    const next = [...formData.keyPoints];
    next[index] = value;
    updateField("keyPoints", next);
  };

  const removeKeyPoint = (index: number) => {
    if (formData.keyPoints.length <= 1) return;
    updateField(
      "keyPoints",
      formData.keyPoints.filter((_, i) => i !== index),
    );
  };

  // ─── THEORY QUESTIONS (structured numbering) ─────────────
  const addTheoryQuestion = () => {
    const next = DEFAULT_THEORY_QUESTION();
    next.number = formData.theoryQuestions.length + 1;
    setFormData((prev) => ({
      ...prev,
      theoryQuestions: [...prev.theoryQuestions, next],
    }));
  };

  const removeTheoryQuestion = (id: string) => {
    setFormData((prev) => {
      const filtered = prev.theoryQuestions.filter((q) => q.id !== id);
      // renumber
      return {
        ...prev,
        theoryQuestions: filtered.map((q, i) => ({ ...q, number: i + 1 })),
      };
    });
  };

  const addPart = (questionId: string) => {
    setFormData((prev) => ({
      ...prev,
      theoryQuestions: prev.theoryQuestions.map((q) => {
        if (q.id !== questionId) return q;
        const label = PART_LETTERS[q.parts.length] ?? String.fromCharCode(97 + q.parts.length);
        return {
          ...q,
          parts: [
            ...q.parts,
            { id: generateId(), label, text: "", marks: 0, answer: "", subParts: [] },
          ],
        };
      }),
    }));
  };

  const removePart = (questionId: string, partId: string) => {
    setFormData((prev) => ({
      ...prev,
      theoryQuestions: prev.theoryQuestions.map((q) => {
        if (q.id !== questionId) return q;
        const filtered = q.parts.filter((p) => p.id !== partId);
        return {
          ...q,
          parts: filtered.map((p, i) => ({
            ...p,
            label: PART_LETTERS[i] ?? String.fromCharCode(97 + i),
          })),
        };
      }),
    }));
  };

  const updatePart = (questionId: string, partId: string, updates: Partial<QuestionPart>) => {
    setFormData((prev) => ({
      ...prev,
      theoryQuestions: prev.theoryQuestions.map((q) =>
        q.id !== questionId
          ? q
          : {
              ...q,
              parts: q.parts.map((p) => (p.id === partId ? { ...p, ...updates } : p)),
            },
      ),
    }));
  };

  const addSubPart = (questionId: string, partId: string) => {
    setFormData((prev) => ({
      ...prev,
      theoryQuestions: prev.theoryQuestions.map((q) => {
        if (q.id !== questionId) return q;
        return {
          ...q,
          parts: q.parts.map((p) => {
            if (p.id !== partId) return p;
            const label = ROMAN_NUMERALS[p.subParts.length] ?? `${p.subParts.length + 1}`;
            return {
              ...p,
              subParts: [
                ...p.subParts,
                { id: generateId(), label, text: "", marks: 0, answer: "" },
              ],
            };
          }),
        };
      }),
    }));
  };

  const removeSubPart = (questionId: string, partId: string, subPartId: string) => {
    setFormData((prev) => ({
      ...prev,
      theoryQuestions: prev.theoryQuestions.map((q) => {
        if (q.id !== questionId) return q;
        return {
          ...q,
          parts: q.parts.map((p) => {
            if (p.id !== partId) return p;
            const filtered = p.subParts.filter((sp) => sp.id !== subPartId);
            return {
              ...p,
              subParts: filtered.map((sp, i) => ({
                ...sp,
                label: ROMAN_NUMERALS[i] ?? `${i + 1}`,
              })),
            };
          }),
        };
      }),
    }));
  };

  const updateSubPart = (
    questionId: string,
    partId: string,
    subPartId: string,
    updates: Partial<SubPart>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      theoryQuestions: prev.theoryQuestions.map((q) =>
        q.id !== questionId
          ? q
          : {
              ...q,
              parts: q.parts.map((p) =>
                p.id !== partId
                  ? p
                  : {
                      ...p,
                      subParts: p.subParts.map((sp) =>
                        sp.id !== subPartId ? sp : { ...sp, ...updates },
                      ),
                    },
              ),
            },
      ),
    }));
  };

  // ─── LEGACY SUB-QUESTIONS (MIXED) ───────────────────────
  const addSubQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      subQuestions: [
        ...prev.subQuestions,
        {
          id: generateId(),
          number: `${prev.subQuestions.length + 1}`,
          text: "",
          marks: 0,
        },
      ],
    }));
  };

  const updateSubQuestion = (id: string, updates: Partial<SubQuestion>) => {
    setFormData((prev) => ({
      ...prev,
      subQuestions: prev.subQuestions.map((sq) => (sq.id === id ? { ...sq, ...updates } : sq)),
    }));
  };

  const removeSubQuestion = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      subQuestions: prev.subQuestions.filter((sq) => sq.id !== id),
    }));
  };

  // ─── TAGS ────────────────────────────────────────────────
  const addTag = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      updateField("tags", [...formData.tags, tag.trim()]);
    }
  };

  const removeTag = (tag: string) => {
    updateField(
      "tags",
      formData.tags.filter((t) => t !== tag),
    );
  };

  // ─── HINTS ───────────────────────────────────────────────
  const addHint = () => updateField("hints", [...formData.hints, ""]);

  const updateHint = (index: number, value: string) => {
    const next = [...formData.hints];
    next[index] = value;
    updateField("hints", next);
  };

  const removeHint = (index: number) => {
    updateField(
      "hints",
      formData.hints.filter((_, i) => i !== index),
    );
  };

  // ─── EXTERNAL LINKS ──────────────────────────────────────
  const addLink = () => updateField("externalLinks", [...formData.externalLinks, ""]);

  const updateLink = (index: number, value: string) => {
    const next = [...formData.externalLinks];
    next[index] = value;
    updateField("externalLinks", next);
  };

  const removeLink = (index: number) => {
    updateField(
      "externalLinks",
      formData.externalLinks.filter((_, i) => i !== index),
    );
  };

  // ─── VALIDATION ──────────────────────────────────────────
  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.examCategory) errs.examCategory = "Exam category is required";
    if (!formData.examType) errs.examType = "Exam type is required";
    if (!formData.year) errs.year = "Year is required";
    if (!formData.subject) errs.subject = "Subject is required";
    if (!formData.questionText.trim()) errs.questionText = "Question text is required";

    if (formData.format === "MCQ") {
      if (!formData.options.some((o) => o.isCorrect))
        errs.options = "At least one correct answer must be selected";
      if (formData.options.some((o) => !o.text.trim())) errs.options = "All options must have text";
      if (formData.options.length < 2) errs.options = "At least 2 options are required";
    }

    if (formData.format === "THEORY" && !formData.markingScheme.trim()) {
      errs.markingScheme = "Marking scheme is required for theory questions";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  return {
    formData,
    errors,
    updateField,
    // MCQ
    updateOption,
    addOption,
    removeOption,
    moveOption,
    setCorrectAnswer,
    // Diagrams
    addDiagram,
    removeDiagram,
    handleDiagramUpload,
    updateDiagramCaption,
    // Key points
    addKeyPoint,
    updateKeyPoint,
    removeKeyPoint,
    // Theory structured
    addTheoryQuestion,
    removeTheoryQuestion,
    addPart,
    removePart,
    updatePart,
    addSubPart,
    removeSubPart,
    updateSubPart,
    // Sub-questions
    addSubQuestion,
    updateSubQuestion,
    removeSubQuestion,
    // Tags / hints / links
    addTag,
    removeTag,
    addHint,
    updateHint,
    removeHint,
    addLink,
    updateLink,
    removeLink,
    // Validation
    validateForm,
  };
}
