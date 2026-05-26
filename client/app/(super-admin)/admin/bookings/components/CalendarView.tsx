import { BOOKING_STATUS_CONFIG, CALENDAR_DAY_LABELS } from "../constants";
import type { Booking } from "../types";

interface Props {
  bookings: Booking[];
  /** Year and month (0-indexed) to display */
  year?: number;
  month?: number;
}

export function CalendarView({ bookings, year = 2025, month = 2 }: Props) {
  // Figure out where the month starts so we can offset the grid
  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Build 35-cell grid: blank prefix + days + blank suffix
  const cells: Array<number | null> = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length < 35) cells.push(null);

  return (
    <div
      className="bg-white rounded-2xl border p-6"
      style={{ borderColor: "rgba(30,80,50,0.08)" }}>
      <h3 className="font-serif text-lg text-green-900 mb-4">Booking Calendar</h3>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-2 mb-1">
        {CALENDAR_DAY_LABELS.map((day) => (
          <div key={day} className="text-center text-[12px] font-semibold text-text-muted py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-2">
        {cells.map((day, i) => {
          if (!day) {
            return (
              <div key={i} className="min-h-[80px] rounded-lg bg-gray-50/50 border border-transparent" />
            );
          }

          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dayBookings = bookings.filter((b) => b.date === dateStr);

          return (
            <div
              key={i}
              className="min-h-[80px] p-2 rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
              <span className="text-[12px] font-semibold text-green-900">{day}</span>
              {dayBookings.slice(0, 2).map((b) => {
                const cfg = BOOKING_STATUS_CONFIG[b.status];
                return (
                  <div
                    key={b.id}
                    className="mt-1 px-1.5 py-0.5 rounded text-[9px] font-medium truncate"
                    style={{ background: cfg.bg, color: cfg.text }}>
                    {b.time} – {b.studentName.split(" ")[0]}
                  </div>
                );
              })}
              {dayBookings.length > 2 && (
                <div className="text-[9px] text-text-muted mt-1">
                  +{dayBookings.length - 2} more
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
