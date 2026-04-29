import { PenTool, Eraser, Square, Circle, Type, ArrowRight } from "lucide-react";
import { Participant, Resource, AttendanceRecord } from "@/types/live-session";

export const COLORS = [
  "#000000",
  "#FFFFFF",
  "#EF4444",
  "#F97316",
  "#EAB308",
  "#22C55E",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
  "#A52A2A",
];

export const STROKE_WIDTHS = [2, 4, 6, 8, 12, 16, 20];

export const WHITEBOARD_TOOLS = [
  { id: "pen", name: "Pen", icon: PenTool, cursor: "crosshair" },
  { id: "eraser", name: "Eraser", icon: Eraser, cursor: "cell" },
  { id: "rectangle", name: "Rectangle", icon: Square, cursor: "crosshair" },
  { id: "circle", name: "Circle", icon: Circle, cursor: "crosshair" },
  { id: "text", name: "Text", icon: Type, cursor: "text" },
  { id: "arrow", name: "Arrow", icon: ArrowRight, cursor: "crosshair" },
] as const;

// ── Mock session data ─────────────────────────────────────────────────────────

export const SESSION_INFO = {
  subject: "Mathematics",
  topic: "Calculus: Differentiation",
  tutorId: "1",
  currentUserId: "2", // the logged-in student
  currentUserName: "Adaeze Okonkwo",
  currentUserRole: "student" as const,
};

export const INITIAL_PARTICIPANTS: Participant[] = [
  {
    id: "1",
    name: "Dr. Adebayo Ola",
    role: "tutor",
    isVideoOn: true,
    isAudioOn: true,
    isScreenSharing: false,
    isHandRaised: false,
    joinedAt: new Date(),
    attendanceStatus: "present",
  },
  {
    id: "2",
    name: "Adaeze Okonkwo",
    role: "student",
    isVideoOn: true,
    isAudioOn: true,
    isScreenSharing: false,
    isHandRaised: false,
    joinedAt: new Date(),
    attendanceStatus: "present",
  },
  {
    id: "3",
    name: "Emmanuel Okafor",
    role: "student",
    isVideoOn: false,
    isAudioOn: true,
    isScreenSharing: false,
    isHandRaised: true,
    joinedAt: new Date(Date.now() - 3 * 60000),
    attendanceStatus: "late",
  },
  {
    id: "4",
    name: "Precious Adebayo",
    role: "student",
    isVideoOn: true,
    isAudioOn: false,
    isScreenSharing: false,
    isHandRaised: false,
    joinedAt: new Date(),
    attendanceStatus: "present",
  },
  {
    id: "5",
    name: "Chioma Nwosu",
    role: "student",
    isVideoOn: false,
    isAudioOn: false,
    isScreenSharing: false,
    isHandRaised: false,
    joinedAt: new Date(),
    attendanceStatus: "absent",
  },
];

export const INITIAL_RESOURCES: Resource[] = [
  {
    id: "r1",
    name: "Calculus Differentiation Rules.pdf",
    type: "pdf",
    url: "#",
    uploadedBy: "Dr. Adebayo Ola",
    uploadedAt: new Date(Date.now() - 10 * 60000),
    size: "1.2 MB",
    description: "Complete guide to differentiation rules and chain rule",
  },
  {
    id: "r2",
    name: "Practice Problems - Week 3.pdf",
    type: "pdf",
    url: "#",
    uploadedBy: "Dr. Adebayo Ola",
    uploadedAt: new Date(Date.now() - 5 * 60000),
    size: "845 KB",
    description: "30 practice problems on derivatives",
  },
  {
    id: "r3",
    name: "Khan Academy - Derivatives",
    type: "link",
    url: "https://khanacademy.org",
    uploadedBy: "Dr. Adebayo Ola",
    uploadedAt: new Date(Date.now() - 2 * 60000),
    description: "Supplementary video lessons on derivatives",
  },
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = INITIAL_PARTICIPANTS.map((p) => ({
  participantId: p.id,
  name: p.name,
  role: p.role,
  joinedAt: p.attendanceStatus !== "absent" ? p.joinedAt : null,
  leftAt: null,
  status: p.attendanceStatus,
  duration: p.attendanceStatus !== "absent" ? Math.floor(Math.random() * 30) + 5 : 0,
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function getResourceIcon(type: Resource["type"]): string {
  const icons: Record<Resource["type"], string> = {
    pdf: "📄",
    doc: "📝",
    image: "🖼️",
    link: "🔗",
    video: "🎬",
  };
  return icons[type];
}

export function downloadAttendanceCSV(
  records: AttendanceRecord[],
  sessionInfo: typeof SESSION_INFO,
): void {
  const lines = [
    `Session Attendance Report`,
    `Subject: ${sessionInfo.subject} — ${sessionInfo.topic}`,
    `Date: ${new Date().toLocaleDateString()}`,
    `Time: ${new Date().toLocaleTimeString()}`,
    ``,
    `Name,Role,Status,Join Time,Duration (min)`,
    ...records.map(
      (r) =>
        `"${r.name}",${r.role},${r.status},${r.joinedAt ? new Date(r.joinedAt).toLocaleTimeString() : "—"},${r.duration}`,
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `attendance-${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
