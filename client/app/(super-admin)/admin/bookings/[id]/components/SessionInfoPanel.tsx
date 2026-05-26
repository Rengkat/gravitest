import {
  BookOpen, Target, Calendar, Clock, Video, FileText, ExternalLink,
} from "lucide-react";
import { InfoBlock, PackageIcon, SectionCard } from "./Primitives";
import type { Booking } from "../types";

interface Props {
  booking: Booking;
}

export function SessionInfoPanel({ booking }: Props) {
  return (
    <SectionCard title="Session Information">
      <div className="grid grid-cols-2 gap-4">
        <InfoBlock icon={BookOpen}     label="Subject"      value={booking.subject} />
        <InfoBlock icon={Target}       label="Topic"        value={booking.topic} />
        <InfoBlock icon={Calendar}     label="Date"         value={booking.date} />
        <InfoBlock
          icon={Clock}
          label="Time"
          value={`${booking.time} – ${booking.endTime} (${booking.duration}h)`}
        />
        <InfoBlock
          icon={Video}
          label="Session Mode"
          value={booking.type === "online" ? "Online" : "Physical"}
        />
        {booking.meetingPlatform && (
          <InfoBlock
            icon={Video}
            label="Platform"
            value={booking.meetingPlatform.replace("-", " ")}
          />
        )}
        <InfoBlock icon={PackageIcon}  label="Session Type" value={booking.sessionType} />
        <InfoBlock
          icon={Target}
          label="Attendance"
          value={booking.attendanceConfirmed ? "Confirmed" : "Pending"}
        />
      </div>

      {/* Meeting link */}
      {booking.meetingLink && (
        <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[12px] font-semibold text-blue-700 mb-1">Meeting Link</div>
              <div className="text-[13px] text-blue-900 font-mono break-all">
                {booking.meetingLink}
              </div>
            </div>
            <a
              href={booking.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-[13px] font-medium hover:bg-blue-700 transition-all shrink-0">
              <ExternalLink size={14} /> Join
            </a>
          </div>
        </div>
      )}

      {/* Notes */}
      {booking.notes && (
        <div className="mt-4 p-4 rounded-xl bg-cream/50">
          <div className="text-[12px] font-semibold text-green-900 mb-1">Notes</div>
          <p className="text-[13px] text-text-muted">{booking.notes}</p>
        </div>
      )}

      {/* Materials */}
      {booking.materials.length > 0 && (
        <div className="mt-4">
          <div className="text-[12px] font-semibold text-green-900 mb-2">Session Materials</div>
          <div className="flex flex-wrap gap-2">
            {booking.materials.map((mat, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 text-[12px] text-green-700">
                <FileText size={12} /> {mat}
              </span>
            ))}
          </div>
        </div>
      )}
    </SectionCard>
  );
}
