export type WhiteboardToolId =
  | "pen"
  | "eraser"
  | "rectangle"
  | "circle"
  | "text"
  | "arrow";

export type SidebarTab = "chat" | "participants" | "resources" | "attendance";

export interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  type: "text" | "file" | "image" | "system";
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
}

export interface Participant {
  id: string;
  name: string;
  role: "tutor" | "student";
  isVideoOn: boolean;
  isAudioOn: boolean;
  isScreenSharing: boolean;
  isHandRaised: boolean;
  joinedAt: Date;
  attendanceStatus: "present" | "late" | "absent";
}

export interface Resource {
  id: string;
  name: string;
  type: "pdf" | "doc" | "image" | "link" | "video";
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
  size?: string;
  description?: string;
}

export interface AttendanceRecord {
  participantId: string;
  name: string;
  role: "tutor" | "student";
  joinedAt: Date | null;
  leftAt: Date | null;
  status: "present" | "late" | "absent";
  duration: number; // minutes present
}
