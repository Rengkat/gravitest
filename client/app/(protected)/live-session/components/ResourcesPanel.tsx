"use client";

import { useState } from "react";
import {
  FolderOpen, Upload, Download, ExternalLink, X, Plus, Link as LinkIcon, FileText,
} from "lucide-react";
import { Resource } from "@/types/live-session";
import { getResourceIcon } from "@/lib/constants/live-session";

interface ResourcesPanelProps {
  resources: Resource[];
  onAddResource: (r: Omit<Resource, "id" | "uploadedAt">) => void;
  isTutor: boolean;
}

type AddMode = "file" | "link" | null;

export default function ResourcesPanel({ resources, onAddResource, isTutor }: ResourcesPanelProps) {
  const [addMode, setAddMode] = useState<AddMode>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkName, setLinkName] = useState("");
  const [linkDesc, setLinkDesc] = useState("");

  const handleAddLink = () => {
    if (!linkUrl || !linkName) return;
    onAddResource({
      name: linkName,
      type: "link",
      url: linkUrl,
      uploadedBy: "Dr. Adebayo Ola",
      description: linkDesc,
    });
    setLinkUrl("");
    setLinkName("");
    setLinkDesc("");
    setAddMode(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const type = file.type.includes("pdf")
      ? "pdf"
      : file.type.includes("image")
      ? "image"
      : file.type.includes("video")
      ? "video"
      : "doc";
    onAddResource({
      name: file.name,
      type,
      url: URL.createObjectURL(file),
      uploadedBy: "Dr. Adebayo Ola",
      size: `${(file.size / 1024).toFixed(0)} KB`,
    });
    setAddMode(null);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="p-3 border-b border-gray-700 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[13px] font-bold text-white">Session Resources</h3>
          <span className="text-[11px] text-gray-500">{resources.length} files</span>
        </div>

        {isTutor && !addMode && (
          <div className="flex gap-2">
            <button
              onClick={() => setAddMode("file")}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-semibold rounded-xl transition-colors"
            >
              <Upload size={13} /> Upload File
            </button>
            <button
              onClick={() => setAddMode("link")}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-700 hover:bg-gray-600 text-white text-[12px] font-semibold rounded-xl transition-colors"
            >
              <LinkIcon size={13} /> Add Link
            </button>
          </div>
        )}

        {/* File upload */}
        {addMode === "file" && isTutor && (
          <div className="mt-2 p-3 bg-gray-800 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] text-gray-300 font-medium">Upload File</span>
              <button onClick={() => setAddMode(null)} className="text-gray-500 hover:text-white">
                <X size={14} />
              </button>
            </div>
            <label className="flex flex-col items-center gap-2 py-4 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-blue-500 transition-colors">
              <Upload size={20} className="text-gray-400" />
              <span className="text-[12px] text-gray-400">Click to browse files</span>
              <input type="file" className="hidden" onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.png,.jpg,.mp4" />
            </label>
          </div>
        )}

        {/* Link input */}
        {addMode === "link" && isTutor && (
          <div className="mt-2 p-3 bg-gray-800 rounded-xl border border-gray-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-gray-300 font-medium">Add Link</span>
              <button onClick={() => setAddMode(null)} className="text-gray-500 hover:text-white">
                <X size={14} />
              </button>
            </div>
            <input
              value={linkName}
              onChange={(e) => setLinkName(e.target.value)}
              placeholder="Display name *"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
            />
            <input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="URL *"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
            />
            <input
              value={linkDesc}
              onChange={(e) => setLinkDesc(e.target.value)}
              placeholder="Description (optional)"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
            />
            <button
              onClick={handleAddLink}
              disabled={!linkUrl || !linkName}
              className="w-full py-2 bg-blue-600 text-white font-semibold text-[12px] rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors"
            >
              Add Link
            </button>
          </div>
        )}
      </div>

      {/* Resource list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {resources.length === 0 ? (
          <div className="text-center mt-10 text-gray-500">
            <FolderOpen size={28} className="mx-auto mb-2 opacity-40" />
            <p className="text-[13px]">No resources yet</p>
            {isTutor && <p className="text-[11px] mt-1 opacity-60">Upload files or add links above</p>}
          </div>
        ) : (
          resources.map((res) => (
            <div key={res.id} className="flex items-start gap-3 p-3 bg-gray-800 rounded-xl hover:bg-gray-750 transition-colors group">
              <div className="text-xl shrink-0 mt-0.5">{getResourceIcon(res.type)}</div>

              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-white truncate">{res.name}</p>
                {res.description && (
                  <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2">{res.description}</p>
                )}
                <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-500">
                  <span>{res.uploadedBy.split(" ")[0]}</span>
                  {res.size && <><span>·</span><span>{res.size}</span></>}
                  <span>·</span>
                  <span>{new Date(res.uploadedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-1 shrink-0">
                {res.type === "link" ? (
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-900/30 transition-colors"
                    title="Open link"
                  >
                    <ExternalLink size={14} />
                  </a>
                ) : (
                  <a
                    href={res.url}
                    download={res.name}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-green-400 hover:bg-green-900/30 transition-colors"
                    title="Download"
                  >
                    <Download size={14} />
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
