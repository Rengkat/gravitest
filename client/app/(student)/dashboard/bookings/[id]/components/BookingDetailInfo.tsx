import {
  Calendar, Clock, Video, MapPin, Package, FileText, BookOpen,
} from "lucide-react";
import { Booking } from "@/types/bookings";
import { formatDate, PLATFORM_LABELS } from "@/lib/constants/bookings";

export default function BookingDetailInfo({ booking }: { booking: Booking }) {
  const isPhysical = booking.type === "physical";

  const rows = [
    {
      icon: Calendar,
      label: "Date",
      value: formatDate(booking.date),
    },
    {
      icon: Clock,
      label: "Time & Duration",
      value: `${booking.time} · ${booking.duration} hour${booking.duration !== 1 ? "s" : ""}`,
    },
    ...(isPhysical
      ? [
          {
            icon: MapPin,
            label: "Location",
            value: booking.locationAddress || booking.location || "—",
            extra: booking.studentAddress
              ? `Your address: ${booking.studentAddress}`
              : undefined,
          },
        ]
      : [
          {
            icon: Video,
            label: "Platform",
            value: booking.meetingPlatform ? PLATFORM_LABELS[booking.meetingPlatform] : "Online",
            link: booking.meetingLink,
          },
        ]),
    ...(booking.packageName
      ? [{ icon: Package, label: "Package", value: booking.packageName }]
      : []),
    ...(booking.sessionTopic
      ? [{ icon: BookOpen, label: "Session Topic", value: booking.sessionTopic }]
      : []),
    ...(booking.notes
      ? [{ icon: FileText, label: "Notes", value: booking.notes }]
      : []),
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Session Details</h2>
      <div className="space-y-4">
        {rows.map(({ icon: Icon, label, value, extra, link }: any) => (
          <div key={label} className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0 mt-0.5">
              <Icon size={15} className="text-green-700" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
              {link ? (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] text-blue-600 hover:underline font-medium"
                >
                  {value} ↗
                </a>
              ) : (
                <p className="text-[14px] text-gray-800 font-medium">{value}</p>
              )}
              {extra && <p className="text-[12px] text-gray-500 mt-0.5">{extra}</p>}
            </div>
          </div>
        ))}

        {/* Materials */}
        {booking.materials && booking.materials.length > 0 && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0 mt-0.5">
              <FileText size={15} className="text-green-700" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Materials</p>
              <div className="flex flex-wrap gap-2">
                {booking.materials.map((m, i) => (
                  <span key={i} className="px-2.5 py-1 bg-gray-100 rounded-lg text-[12px] text-gray-700 font-medium">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
