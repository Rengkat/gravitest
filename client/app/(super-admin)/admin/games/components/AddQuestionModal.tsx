"use client";

import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import type {
  Game,
  ScholarQuestion,
  AlgebraQuestion,
  KarmenLocation,
  TrailEvent,
  WordConnectPuzzle,
  ZombieLogicPuzzle,
  Difficulty,
} from "../types";
import { GAME_CONFIGS, SCHOLAR_SUBJECTS, ALGEBRA_CLASSES, NIGERIAN_ZONES } from "../constants";
import { Label, DifficultyChip, inputCls } from "./Primitives";

type AnyQ =
  | ScholarQuestion
  | AlgebraQuestion
  | KarmenLocation
  | TrailEvent
  | WordConnectPuzzle
  | ZombieLogicPuzzle;

interface Props {
  game: Game;
  onClose: () => void;
  onAdd: (q: AnyQ) => void;
}

export function AddQuestionModal({ game, onClose, onAdd }: Props) {
  const cfg = GAME_CONFIGS[game.slug];

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        <div
          className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div>
            <h2 className="font-serif text-lg text-green-900">
              Add {cfg.questionLabel.slice(0, -1)}
            </h2>
            <p className="text-[12px] text-text-muted">{game.name}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100" title="Close">
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {game.slug === "scholar" && <ScholarForm game={game} onAdd={onAdd} onClose={onClose} />}
          {game.slug === "algebra-heist" && (
            <AlgebraForm game={game} onAdd={onAdd} onClose={onClose} />
          )}
          {game.slug === "madam-karmen" && (
            <KarmenForm game={game} onAdd={onAdd} onClose={onClose} />
          )}
          {game.slug === "nigerian-trail" && (
            <TrailEventForm game={game} onAdd={onAdd} onClose={onClose} />
          )}
          {game.slug === "word-connect" && (
            <WordConnectForm game={game} onAdd={onAdd} onClose={onClose} />
          )}
          {game.slug === "zombie-logic" && (
            <ZombieForm game={game} onAdd={onAdd} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SHARED FOOTER ────────────────────────────────────────────
function FormFooter({
  onClose,
  onSubmit,
  disabled,
}: {
  onClose: () => void;
  onSubmit: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex gap-3 pt-6 border-t mt-6" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <button
        onClick={onClose}
        className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-[13px] font-semibold text-text-muted hover:bg-gray-50 transition-all">
        Cancel
      </button>
      <button
        onClick={onSubmit}
        disabled={disabled}
        className="flex-1 py-2.5 rounded-xl bg-green-800 text-white text-[13px] font-semibold hover:bg-green-700 transition-all disabled:opacity-50">
        Add to Bank
      </button>
    </div>
  );
}

// ─── DIFFICULTY ROW ───────────────────────────────────────────
function DiffRow({
  value,
  onChange,
  levels,
}: {
  value: Difficulty;
  onChange: (d: Difficulty) => void;
  levels: Difficulty[];
}) {
  return (
    <div>
      <Label>Difficulty</Label>
      <div className="flex gap-2 flex-wrap">
        {levels.map((d) => (
          <DifficultyChip key={d} level={d} selected={value === d} onClick={() => onChange(d)} />
        ))}
      </div>
    </div>
  );
}

// ─── 1. SCHOLAR FORM ─────────────────────────────────────────
function ScholarForm({
  game,
  onAdd,
  onClose,
}: {
  game: Game;
  onAdd: (q: AnyQ) => void;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const [opts, setOpts] = useState(["", "", "", ""]);
  const [correct, setCorrect] = useState<0 | 1 | 2 | 3>(0);
  const [subject, setSubject] = useState<(typeof SCHOLAR_SUBJECTS)[number]>("Mathematics");
  const [diff, setDiff] = useState<Difficulty>("medium");
  const [expl, setExpl] = useState("");
  const [examRef, setExamRef] = useState("");

  const submit = () => {
    if (!q.trim() || opts.some((o) => !o.trim())) return;
    onAdd({
      id: "",
      subject,
      q,
      o: opts as [string, string, string, string],
      a: correct,
      difficulty: diff,
      explanation: expl,
      examRef,
    } as ScholarQuestion);
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Subject *</Label>
          <select
            title="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value as any)}
            className={inputCls}>
            {SCHOLAR_SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Exam Reference</Label>
          <input
            type="text"
            value={examRef}
            onChange={(e) => setExamRef(e.target.value)}
            placeholder="e.g. WAEC 2022"
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <Label>Question Text *</Label>
        <textarea
          rows={3}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Enter the question…"
          className={`${inputCls} resize-none`}
        />
      </div>

      <div>
        <Label>Answer Options * (click the letter to mark correct)</Label>
        <div className="space-y-2">
          {opts.map((opt, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 p-2.5 rounded-xl border-2 transition-all ${correct === i ? "border-green-500 bg-green-50/50" : "border-gray-200"}`}>
              <button
                type="button"
                onClick={() => setCorrect(i as 0 | 1 | 2 | 3)}
                className={`w-8 h-8 rounded-lg font-bold text-[13px] shrink-0 transition-all ${correct === i ? "bg-green-800 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                {String.fromCharCode(65 + i)}
              </button>
              <input
                type="text"
                value={opt}
                onChange={(e) => {
                  const n = [...opts];
                  n[i] = e.target.value;
                  setOpts(n);
                }}
                placeholder={`Option ${String.fromCharCode(65 + i)}`}
                className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-500/20"
              />
            </div>
          ))}
        </div>
        <p className="text-[11px] text-text-muted mt-1">
          Click the letter button to mark the correct answer
        </p>
      </div>

      <div>
        <Label>Explanation (optional)</Label>
        <textarea
          rows={2}
          value={expl}
          onChange={(e) => setExpl(e.target.value)}
          placeholder="Why is this the correct answer?"
          className={`${inputCls} resize-none`}
        />
      </div>

      <DiffRow value={diff} onChange={setDiff} levels={game.settings.difficultyLevels} />
      <FormFooter
        onClose={onClose}
        onSubmit={submit}
        disabled={!q.trim() || opts.some((o) => !o.trim())}
      />
    </div>
  );
}

// ─── 2. ALGEBRA FORM ─────────────────────────────────────────
function AlgebraForm({
  game,
  onAdd,
  onClose,
}: {
  game: Game;
  onAdd: (q: AnyQ) => void;
  onClose: () => void;
}) {
  const [classLevel, setClassLevel] = useState<(typeof ALGEBRA_CLASSES)[number]>("JSS1");
  const [roomLevel, setRoomLevel] = useState<1 | 2>(1);
  const [equation, setEquation] = useState("");
  const [steps, setSteps] = useState(["", ""]);
  const [distractors, setDistractors] = useState(["", ""]);
  const [diff, setDiff] = useState<Difficulty>("easy");

  const submit = () => {
    if (!equation.trim()) return;
    onAdd({
      id: "",
      classLevel,
      roomLevel,
      e: equation,
      c: steps.filter(Boolean),
      d: distractors.filter(Boolean),
      difficulty: diff,
    } as AlgebraQuestion);
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Class Level *</Label>
          <select
            title="Class Level"
            value={classLevel}
            onChange={(e) => setClassLevel(e.target.value as any)}
            className={inputCls}>
            {ALGEBRA_CLASSES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Room (Difficulty Tier)</Label>
          <select
            title="Room Level"
            value={roomLevel}
            onChange={(e) => setRoomLevel(parseInt(e.target.value) as 1 | 2)}
            className={inputCls}>
            <option value={1}>Room 1 (Standard)</option>
            <option value={2}>Room 2 (Advanced)</option>
          </select>
        </div>
      </div>

      <div>
        <Label>Equation *</Label>
        <input
          type="text"
          value={equation}
          onChange={(e) => setEquation(e.target.value)}
          placeholder="e.g. 3x + 5 = 20"
          className={`${inputCls} font-mono text-[15px]`}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Correct Solution Steps</Label>
          <button
            type="button"
            onClick={() => setSteps([...steps, ""])}
            className="text-[11px] text-green-700 font-semibold hover:text-green-800">
            + Add Step
          </button>
        </div>
        <div className="space-y-2">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-2">
              <span className="w-6 h-8 flex items-center justify-center text-[11px] font-bold text-green-700 shrink-0">
                {i + 1}.
              </span>
              <input
                type="text"
                value={step}
                onChange={(e) => {
                  const n = [...steps];
                  n[i] = e.target.value;
                  setSteps(n);
                }}
                placeholder={`Step ${i + 1}: e.g. 3x = 15`}
                className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-500/20 font-mono"
              />
              {steps.length > 1 && (
                <button
                  title="filter"
                  type="button"
                  onClick={() => setSteps(steps.filter((_, j) => j !== i))}
                  className="p-1.5 rounded-lg hover:bg-red-50">
                  <Trash2 size={13} className="text-red-400" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Distractor Steps (wrong options)</Label>
          <button
            type="button"
            onClick={() => setDistractors([...distractors, ""])}
            className="text-[11px] text-green-700 font-semibold hover:text-green-800">
            + Add
          </button>
        </div>
        <div className="space-y-2">
          {distractors.map((d, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={d}
                onChange={(e) => {
                  const n = [...distractors];
                  n[i] = e.target.value;
                  setDistractors(n);
                }}
                placeholder="e.g. x = 6 (wrong step)"
                className="flex-1 px-3 py-1.5 rounded-lg border border-red-100 bg-red-50/30 text-[13px] focus:outline-none font-mono"
              />
              <button
                title="delete"
                type="button"
                onClick={() => setDistractors(distractors.filter((_, j) => j !== i))}
                className="p-1.5 rounded-lg hover:bg-red-50">
                <Trash2 size={13} className="text-red-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <DiffRow value={diff} onChange={setDiff} levels={game.settings.difficultyLevels} />
      <FormFooter onClose={onClose} onSubmit={submit} disabled={!equation.trim()} />
    </div>
  );
}

// ─── 3. MADAM KARMEN FORM ────────────────────────────────────
function KarmenForm({
  game,
  onAdd,
  onClose,
}: {
  game: Game;
  onAdd: (q: AnyQ) => void;
  onClose: () => void;
}) {
  const [f, setF] = useState({
    name: "",
    capital: "",
    zone: "sw" as (typeof NIGERIAN_ZONES)[number],
    slogan: "",
    minerals: "",
    notable: "",
    clueCulture: "",
    clueFood: "",
    clueNature: "",
    clueLandmark: "",
    artifact: "Mask",
  });
  const [diff, setDiff] = useState<Difficulty>("medium");
  const upd = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));

  const submit = () => {
    if (!f.name.trim()) return;
    onAdd({ id: "", ...f, difficulty: diff } as KarmenLocation);
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>State Name *</Label>
          <input
            value={f.name}
            onChange={(e) => upd("name", e.target.value)}
            placeholder="e.g. Lagos"
            className={inputCls}
          />
        </div>
        <div>
          <Label>Capital City *</Label>
          <input
            value={f.capital}
            onChange={(e) => upd("capital", e.target.value)}
            placeholder="e.g. Ikeja"
            className={inputCls}
          />
        </div>
        <div>
          <Label>Geopolitical Zone *</Label>
          <select
            title="Geopolitical Zone"
            value={f.zone}
            onChange={(e) => upd("zone", e.target.value)}
            className={inputCls}>
            {NIGERIAN_ZONES.map((z) => (
              <option key={z} value={z}>
                {z.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>State Slogan</Label>
          <input
            value={f.slogan}
            onChange={(e) => upd("slogan", e.target.value)}
            placeholder="e.g. Centre of Excellence"
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <Label>Minerals / Natural Resources</Label>
        <input
          value={f.minerals}
          onChange={(e) => upd("minerals", e.target.value)}
          placeholder="e.g. Bitumen, Clay, Silica Sand"
          className={inputCls}
        />
      </div>
      <div>
        <Label>Notable Facts</Label>
        <textarea
          rows={2}
          value={f.notable}
          onChange={(e) => upd("notable", e.target.value)}
          placeholder="What makes this state notable?"
          className={`${inputCls} resize-none`}
        />
      </div>

      <div className="border-t pt-4" style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <p className="text-[12px] font-bold text-green-900 mb-3 uppercase tracking-wide">
          Clues (shown to player)
        </p>
        <div className="space-y-3">
          {[
            {
              key: "clueCulture" as const,
              label: "Culture Clue",
              placeholder: "Describe the culture without naming the state…",
            },
            {
              key: "clueFood" as const,
              label: "Food Clue",
              placeholder: "Describe a famous local dish or food tradition…",
            },
            {
              key: "clueNature" as const,
              label: "Nature Clue",
              placeholder: "Describe the geography, climate or wildlife…",
            },
            {
              key: "clueLandmark" as const,
              label: "Landmark Clue",
              placeholder: "Describe a famous landmark or monument…",
            },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <Label>{label}</Label>
              <textarea
                rows={2}
                value={f[key]}
                onChange={(e) => upd(key, e.target.value)}
                placeholder={placeholder}
                className={`${inputCls} resize-none`}
              />
            </div>
          ))}
        </div>
      </div>

      <DiffRow value={diff} onChange={setDiff} levels={game.settings.difficultyLevels} />
      <FormFooter onClose={onClose} onSubmit={submit} disabled={!f.name.trim()} />
    </div>
  );
}

// ─── 4. NIGERIAN TRAIL FORM ──────────────────────────────────
function TrailEventForm({
  game,
  onAdd,
  onClose,
}: {
  game: Game;
  onAdd: (q: AnyQ) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState(1960);
  const [month, setMonth] = useState(1);
  const [category, setCategory] = useState("Political Milestone");
  const [severity, setSeverity] = useState<"positive" | "negative" | "neutral">("neutral");
  const [text, setText] = useState("");
  const [choices, setChoices] = useState([
    { text: "", outcome: "", score: 100 },
    { text: "", outcome: "", score: -50 },
  ]);
  const [diff, setDiff] = useState<Difficulty>("medium");

  const CATEGORIES = [
    "Political Milestone",
    "Economic Event",
    "Military",
    "Social",
    "Cultural",
    "Natural Disaster",
    "International Relations",
  ];

  const submit = () => {
    if (!title.trim() || !text.trim()) return;
    onAdd({
      id: "",
      year,
      month,
      title,
      category,
      severity,
      zone: "nc",
      text,
      choices: choices.filter((c) => c.text.trim()),
      difficulty: diff,
    } as TrailEvent);
    onClose();
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Event Title *</Label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Nigeria Achieves Independence"
          className={inputCls}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Year *</Label>
          <input
            title="Event Year"
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            min={1960}
            max={2026}
            className={inputCls}
          />
        </div>
        <div>
          <Label>Month</Label>
          <select
            title="Event Month"
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            className={inputCls}>
            {[
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ].map((m, i) => (
              <option key={m} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Severity</Label>
          <select
            title="Event Severity"
            value={severity}
            onChange={(e) => setSeverity(e.target.value as any)}
            className={inputCls}>
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>
      </div>

      <div>
        <Label>Category</Label>
        <select
          title="Event Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputCls}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label>Event Narrative *</Label>
        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe the historical event in detail. Set the scene, give context, and explain the significance…"
          className={`${inputCls} resize-none`}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Player Choices</Label>
          <button
            type="button"
            onClick={() => setChoices([...choices, { text: "", outcome: "", score: 0 }])}
            className="text-[11px] text-green-700 font-semibold">
            + Add Choice
          </button>
        </div>
        <div className="space-y-3">
          {choices.map((c, i) => (
            <div key={i} className="p-3 rounded-xl bg-gray-50/80 border border-gray-100 space-y-2">
              <div className="flex gap-2 items-center">
                <span className="text-[11px] font-bold text-green-700 shrink-0">
                  Choice {i + 1}
                </span>
                <input
                  type="number"
                  value={c.score}
                  onChange={(e) => {
                    const n = [...choices];
                    n[i].score = parseInt(e.target.value);
                    setChoices(n);
                  }}
                  className="w-20 px-2 py-1.5 rounded-lg border border-gray-200 text-[12px] text-center focus:outline-none"
                  placeholder="Points"
                />
                {choices.length > 1 && (
                  <button
                    title="Remove Choice"
                    type="button"
                    onClick={() => setChoices(choices.filter((_, j) => j !== i))}
                    className="ml-auto p-1 rounded hover:bg-red-50">
                    <Trash2 size={12} className="text-red-400" />
                  </button>
                )}
              </div>
              <input
                value={c.text}
                onChange={(e) => {
                  const n = [...choices];
                  n[i].text = e.target.value;
                  setChoices(n);
                }}
                placeholder="Choice text shown to player"
                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-500/20"
              />
              <input
                value={c.outcome}
                onChange={(e) => {
                  const n = [...choices];
                  n[i].outcome = e.target.value;
                  setChoices(n);
                }}
                placeholder="Outcome narrative after player chooses this"
                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-[12px] focus:outline-none focus:ring-2 focus:ring-green-500/20 text-gray-600"
              />
            </div>
          ))}
        </div>
      </div>

      <DiffRow value={diff} onChange={setDiff} levels={game.settings.difficultyLevels} />
      <FormFooter onClose={onClose} onSubmit={submit} disabled={!title.trim() || !text.trim()} />
    </div>
  );
}

// ─── 5. WORD CONNECT FORM ─────────────────────────────────────
function WordConnectForm({
  game,
  onAdd,
  onClose,
}: {
  game: Game;
  onAdd: (q: AnyQ) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("math");
  const [diff, setDiff] = useState<Difficulty>("medium");
  const [words, setWords] = useState([{ w: "", clue: "", dir: "h" as "h" | "v", r: 0, c: 0 }]);

  const submit = () => {
    if (!name.trim() || words.every((w) => !w.w.trim())) return;
    onAdd({
      id: "",
      subject,
      name,
      words: words.filter((w) => w.w.trim()),
      difficulty: diff,
      gridSize: 15,
    } as WordConnectPuzzle);
    onClose();
  };

  const SUBJECTS = {
    math: "Mathematics",
    science: "Science",
    english: "English",
    history: "History",
    geo: "Geography",
    tech: "Technology",
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Puzzle Name *</Label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Algebra Terms"
            className={inputCls}
          />
        </div>
        <div>
          <Label>Subject</Label>
          <select
            title="Event Category"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={inputCls}>
            {Object.entries(SUBJECTS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Words in Puzzle</Label>
          <button
            type="button"
            onClick={() => setWords([...words, { w: "", clue: "", dir: "h", r: 0, c: 0 }])}
            className="text-[11px] text-green-700 font-semibold">
            + Add Word
          </button>
        </div>
        <div className="space-y-3">
          {words.map((w, i) => (
            <div key={i} className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
              <div className="flex gap-2">
                <input
                  value={w.w}
                  onChange={(e) => {
                    const n = [...words];
                    n[i].w = e.target.value.toUpperCase();
                    setWords(n);
                  }}
                  placeholder="WORD"
                  className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-[14px] font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-green-500/20"
                />
                <select
                  title="h"
                  value={w.dir}
                  onChange={(e) => {
                    const n = [...words];
                    n[i].dir = e.target.value as "h" | "v";
                    setWords(n);
                  }}
                  className="px-2 py-1.5 rounded-lg border border-gray-200 text-[12px] focus:outline-none">
                  <option value="h">→ Horizontal</option>
                  <option value="v">↓ Vertical</option>
                </select>
                {words.length > 1 && (
                  <button
                    title="Remove Word"
                    type="button"
                    onClick={() => setWords(words.filter((_, j) => j !== i))}
                    className="p-1.5 rounded-lg hover:bg-red-50">
                    <Trash2 size={13} className="text-red-400" />
                  </button>
                )}
              </div>
              <input
                value={w.clue}
                onChange={(e) => {
                  const n = [...words];
                  n[i].clue = e.target.value;
                  setWords(n);
                }}
                placeholder="Clue / definition for this word"
                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-500/20"
              />
            </div>
          ))}
        </div>
      </div>

      <DiffRow value={diff} onChange={setDiff} levels={game.settings.difficultyLevels} />
      <FormFooter onClose={onClose} onSubmit={submit} disabled={!name.trim()} />
    </div>
  );
}

// ─── 6. ZOMBIE LOGIC FORM ────────────────────────────────────
function ZombieForm({
  game,
  onAdd,
  onClose,
}: {
  game: Game;
  onAdd: (q: AnyQ) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [level, setLevel] = useState(1);
  const [traitCount, setTraitCount] = useState(3);
  const [clues, setClues] = useState(["", ""]);
  const [diff, setDiff] = useState<Difficulty>("medium");

  const submit = () => {
    if (!name.trim() || clues.every((c) => !c.trim())) return;
    onAdd({
      id: "",
      name,
      level,
      traitCount,
      clues: clues.filter(Boolean),
      solution: {},
      difficulty: diff,
    } as ZombieLogicPuzzle);
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Puzzle Name *</Label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. The Masquerade Ball"
            className={inputCls}
          />
        </div>
        <div>
          <Label>Level Number</Label>
          <input
            title="level"
            type="number"
            value={level}
            onChange={(e) => setLevel(parseInt(e.target.value) || 1)}
            min={1}
            className={inputCls}
          />
        </div>
        <div>
          <Label>Number of Zombie Traits</Label>
          <select
            title="traiite"
            value={traitCount}
            onChange={(e) => setTraitCount(parseInt(e.target.value))}
            className={inputCls}>
            {[2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n} traits
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Logic Clues (constraints)</Label>
          <button
            type="button"
            onClick={() => setClues([...clues, ""])}
            className="text-[11px] text-green-700 font-semibold">
            + Add Clue
          </button>
        </div>
        <p className="text-[11px] text-text-muted mb-3">
          Each clue is a logical constraint the player uses to deduce zombie traits. E.g. "The
          zombie with the red mask does not have fire powers."
        </p>
        <div className="space-y-2">
          {clues.map((c, i) => (
            <div key={i} className="flex gap-2">
              <span className="w-6 h-8 flex items-center justify-center text-[11px] font-bold text-red-500 shrink-0">
                {i + 1}.
              </span>
              <input
                value={c}
                onChange={(e) => {
                  const n = [...clues];
                  n[i] = e.target.value;
                  setClues(n);
                }}
                placeholder={`Constraint ${i + 1}…`}
                className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-500/20"
              />
              {clues.length > 2 && (
                <button
                  title="Remove Clue"
                  type="button"
                  onClick={() => setClues(clues.filter((_, j) => j !== i))}
                  className="p-1.5 rounded-lg hover:bg-red-50">
                  <Trash2 size={13} className="text-red-400" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <DiffRow value={diff} onChange={setDiff} levels={game.settings.difficultyLevels} />
      <FormFooter onClose={onClose} onSubmit={submit} disabled={!name.trim()} />
    </div>
  );
}
