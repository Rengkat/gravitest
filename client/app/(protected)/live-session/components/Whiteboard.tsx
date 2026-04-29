"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Undo, Redo, Trash2, Download, Plus, Minus } from "lucide-react";
import { COLORS, STROKE_WIDTHS, WHITEBOARD_TOOLS } from "@/lib/constants/live-session";
import { WhiteboardToolId } from "@/types/live-session";

export default function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const snapshotRef = useRef<ImageData | null>(null);

  const [activeTool, setActiveTool] = useState<WhiteboardToolId>("pen");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const canUndo = historyIdx > 0;
  const canRedo = historyIdx < history.length - 1;

  // Init canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const { width, height } = parent.getBoundingClientRect();
      // Preserve drawing
      const saved = contextRef.current?.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      contextRef.current = ctx;
      if (saved) ctx.putImageData(saved, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);
    return () => ro.disconnect();
  }, []);

  // Sync tool/color/width to context
  useEffect(() => {
    const ctx = contextRef.current;
    if (!ctx) return;
    if (activeTool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = strokeWidth * 3;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = strokeColor;
      ctx.fillStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
    }
  }, [activeTool, strokeColor, strokeWidth]);

  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => {
      const next = prev.slice(0, historyIdx + 1);
      next.push(data);
      return next;
    });
    setHistoryIdx((prev) => prev + 1);
  }, [historyIdx]);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const ctx = contextRef.current;
    if (!ctx) return;
    const { x, y } = getPos(e);
    startPosRef.current = { x, y };
    isDrawingRef.current = true;

    if (["rectangle", "circle", "arrow"].includes(activeTool)) {
      snapshotRef.current = ctx.getImageData(
        0,
        0,
        canvasRef.current!.width,
        canvasRef.current!.height,
      );
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const ctx = contextRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    const { x, y } = getPos(e);
    const { x: sx, y: sy } = startPosRef.current;

    if (activeTool === "pen" || activeTool === "eraser") {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (activeTool === "rectangle") {
      if (snapshotRef.current) ctx.putImageData(snapshotRef.current, 0, 0);
      ctx.beginPath();
      ctx.strokeRect(sx, sy, x - sx, y - sy);
    } else if (activeTool === "circle") {
      if (snapshotRef.current) ctx.putImageData(snapshotRef.current, 0, 0);
      const r = Math.sqrt((x - sx) ** 2 + (y - sy) ** 2);
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.stroke();
    } else if (activeTool === "arrow") {
      if (snapshotRef.current) ctx.putImageData(snapshotRef.current, 0, 0);
      const angle = Math.atan2(y - sy, x - sx);
      const len = 12;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(x, y);
      ctx.lineTo(x - len * Math.cos(angle - Math.PI / 6), y - len * Math.sin(angle - Math.PI / 6));
      ctx.moveTo(x, y);
      ctx.lineTo(x - len * Math.cos(angle + Math.PI / 6), y - len * Math.sin(angle + Math.PI / 6));
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    contextRef.current?.closePath();
    saveState();
  };

  const handleTextClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool !== "text") return;
    const { x, y } = getPos(e);
    const text = prompt("Enter text:");
    if (!text || !contextRef.current) return;
    contextRef.current.font = `${strokeWidth * 4}px sans-serif`;
    contextRef.current.fillText(text, x, y);
    saveState();
  };

  const undo = () => {
    if (!canUndo || !contextRef.current || !canvasRef.current) return;
    const idx = historyIdx - 1;
    contextRef.current.putImageData(history[idx], 0, 0);
    setHistoryIdx(idx);
  };

  const redo = () => {
    if (!canRedo || !contextRef.current || !canvasRef.current) return;
    const idx = historyIdx + 1;
    contextRef.current.putImageData(history[idx], 0, 0);
    setHistoryIdx(idx);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveState();
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `whiteboard-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const currentTool = WHITEBOARD_TOOLS.find((t) => t.id === activeTool);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Bottom toolbar */}
      <div className="bg-gray-900 border-t border-gray-700 px-3 py-2 flex items-center justify-between flex-wrap gap-2 shrink-0">
        {/* Tools */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Drawing tools */}
          <div className="flex bg-gray-800 rounded-xl p-1 gap-0.5">
            {WHITEBOARD_TOOLS.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id as WhiteboardToolId)}
                title={tool.name}
                className={`p-2 rounded-lg transition-all ${
                  activeTool === tool.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-400 hover:bg-gray-700 hover:text-white"
                }`}>
                <tool.icon size={17} />
              </button>
            ))}
          </div>

          {/* Color picker */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker((v) => !v)}
              className="flex items-center gap-2 px-2.5 py-2 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors">
              <div
                className="w-5 h-5 rounded-md border-2 border-gray-600 shadow"
                style={{ backgroundColor: strokeColor }}
              />
              <span className="text-[11px] text-gray-400 hidden sm:inline">Color</span>
            </button>

            {showColorPicker && (
              <div className="absolute bottom-full mb-2 left-0 bg-gray-800 border border-gray-700 rounded-2xl p-3 shadow-2xl z-30">
                <div className="grid grid-cols-6 gap-2 mb-3">
                  {COLORS.map((c) => (
                    <button
                      title="color"
                      key={c}
                      onClick={() => {
                        setStrokeColor(c);
                        setShowColorPicker(false);
                      }}
                      className={`w-7 h-7 rounded-lg border-2 transition-all hover:scale-110 ${
                        strokeColor === c
                          ? "border-white scale-110 shadow-lg"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-[11px] text-gray-400">Custom:</label>
                  <input
                    title="stroke color"
                    type="color"
                    value={strokeColor}
                    onChange={(e) => setStrokeColor(e.target.value)}
                    className="w-8 h-7 rounded cursor-pointer bg-transparent border-0"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Stroke width */}
          <div className="flex items-center gap-1.5 bg-gray-800 rounded-xl px-2.5 py-1.5">
            <button
              title="stroke width"
              onClick={() => setStrokeWidth((w) => Math.max(2, w - 2))}
              className="text-gray-400 hover:text-white transition-colors">
              <Minus size={13} />
            </button>
            <span className="text-[12px] text-white font-mono w-8 text-center">
              {strokeWidth}px
            </span>
            <button
              title="stroke width"
              onClick={() => setStrokeWidth((w) => Math.min(20, w + 2))}
              className="text-gray-400 hover:text-white transition-colors">
              <Plus size={13} />
            </button>
          </div>

          {/* Actions */}
          <div className="flex bg-gray-800 rounded-xl p-1 gap-0.5">
            <button
              onClick={undo}
              disabled={!canUndo}
              title="Undo"
              className="p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <Undo size={17} />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              title="Redo"
              className="p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <Redo size={17} />
            </button>
            <button
              onClick={clearCanvas}
              title="Clear board"
              className="p-2 rounded-lg text-gray-400 hover:bg-red-900 hover:text-red-300 transition-all">
              <Trash2 size={17} />
            </button>
            <button
              onClick={downloadCanvas}
              title="Save as PNG"
              className="p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-all">
              <Download size={17} />
            </button>
          </div>
        </div>

        {/* Zoom placeholder — future feature */}
        <div className="text-[11px] text-gray-600 hidden md:block">
          {currentTool?.name} · {strokeWidth}px
        </div>
      </div>

      {/* Canvas area */}
      <div className="flex-1 relative bg-white">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ cursor: currentTool?.cursor ?? "crosshair" }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onClick={handleTextClick}
        />
        {/* Watermark */}
        <div className="absolute bottom-3 right-4 text-[11px] text-gray-200 select-none pointer-events-none font-medium">
          Gravitest Whiteboard
        </div>
      </div>
    </div>
  );
}
