"use client";

import { useState } from "react";
import { Save, Copy, RefreshCw, History, AlertCircle, FileText, XCircle } from "lucide-react";

interface PromptVersion {
  id: string;
  version: string;
  prompt: string;
  createdAt: string;
  createdBy: string;
  isActive: boolean;
}

interface Props {
  onSave: (prompt: string, name: string) => void;
}

const DEFAULT_PROMPT = `You are Sabi, an expert AI tutor helping Nigerian students prepare for JAMB, WAEC, NECO, and other exams.

Your personality:
- Friendly, patient, and encouraging
- Use simple English with occasional Pidgin for clarity
- Never give direct answers immediately - guide students step-by-step
- Celebrate when students get answers right

Teaching approach:
1. First, understand what the student is struggling with
2. Break down complex concepts into smaller parts
3. Use real-world examples relevant to Nigerian context
4. Ask guiding questions rather than providing answers
5. Verify understanding before moving on

Content guidelines:
- Focus on the Nigerian curriculum (JAMB/WAEC syllabi)
- Provide accurate, up-to-date information
- Flag any questions outside your knowledge base
- Never assist with exam cheating or malpractice

Response format:
- Keep responses concise (under 500 tokens when possible)
- Use bullet points for lists
- Include practice questions at appropriate times
- Provide positive reinforcement

For math problems:
- Show work step-by-step
- Explain each step in simple terms
- Verify calculations

For essay questions:
- Help structure arguments
- Provide feedback on writing style
- Suggest improvements without rewriting entirely`;

export function SystemPromptEditor({ onSave }: Props) {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [name, setName] = useState("Default Tutor Prompt");
  const [saving, setSaving] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const versions: PromptVersion[] = [
    {
      id: "1",
      version: "v2.0",
      prompt: DEFAULT_PROMPT,
      createdAt: "2025-01-15",
      createdBy: "Admin",
      isActive: true,
    },
    {
      id: "2",
      version: "v1.5",
      prompt: "Previous version with less detailed explanations...",
      createdAt: "2024-12-10",
      createdBy: "Admin",
      isActive: false,
    },
  ];

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onSave(prompt, name);
    setSaving(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
  };

  const handleRevert = (version: PromptVersion) => {
    setPrompt(version.prompt);
    setShowHistory(false);
  };

  return (
    <div className="space-y-6">
      <div
        className="bg-white rounded-2xl border p-6"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-serif text-lg text-green-900">System Prompt Editor</h3>
            <p className="text-[12px] text-text-muted mt-1">
              Define the AI tutor's personality, behavior, and content guidelines
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-[13px] text-text-muted hover:bg-cream">
              <History size={14} />
              Version History
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-[13px] text-text-muted hover:bg-cream">
              <Copy size={14} />
              Copy
            </button>
          </div>
        </div>

        {/* Prompt Name */}
        <div className="mb-4">
          <label className="block text-[12px] font-semibold text-green-900 mb-2">Prompt Name</label>
          <input
            title="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/30"
          />
        </div>

        {/* Prompt Editor */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[12px] font-semibold text-green-900">Prompt Content</label>
            <span className="text-[10px] text-text-muted">{prompt.split(" ").length} words</span>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={20}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 font-mono text-[13px] focus:outline-none focus:ring-2 focus:ring-green-500/30 resize-y"
            placeholder="Enter system prompt..."
          />
        </div>

        {/* Variables Help */}
        <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-200">
          <div className="flex items-start gap-2">
            <AlertCircle size={14} className="text-blue-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-[12px] font-semibold text-blue-800">Available Variables</div>
              <div className="text-[11px] text-blue-700 mt-1">
                Use <code className="bg-blue-100 px-1 rounded">{`{{student_name}}`}</code> for
                student's name, <code className="bg-blue-100 px-1 rounded">{`{{subject}}`}</code>{" "}
                for current subject,{" "}
                <code className="bg-blue-100 px-1 rounded">{`{{exam_type}}`}</code> for exam type,
                and <code className="bg-blue-100 px-1 rounded">{`{{difficulty}}`}</code> for
                question difficulty.
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div
          className="mt-6 pt-4 border-t flex justify-end"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-800 text-white font-semibold hover:bg-green-700 transition-all disabled:opacity-50">
            {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Saving..." : "Save & Apply"}
          </button>
        </div>
      </div>

      {/* Version History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="font-serif text-lg text-green-900">Version History</h3>
              <button
                title="Close"
                onClick={() => setShowHistory(false)}
                className="p-2 rounded-lg hover:bg-gray-100">
                <XCircle size={20} />
              </button>
            </div>
            <div className="p-6 space-y-3">
              {versions.map((version) => (
                <div
                  key={version.id}
                  className={`p-4 rounded-xl border ${
                    version.isActive ? "border-green-200 bg-green-50" : "border-gray-200"
                  }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-green-800" />
                      <span className="font-semibold text-green-900">{version.version}</span>
                      {version.isActive && (
                        <span className="px-2 py-0.5 rounded-full bg-green-200 text-green-700 text-[9px] font-semibold">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-text-muted">
                      {version.createdAt} by {version.createdBy}
                    </div>
                  </div>
                  <p className="text-[12px] text-text-muted line-clamp-2 mb-3">
                    {version.prompt.substring(0, 200)}...
                  </p>
                  {!version.isActive && (
                    <button
                      onClick={() => handleRevert(version)}
                      className="text-[12px] text-green-700 hover:underline">
                      Revert to this version
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
