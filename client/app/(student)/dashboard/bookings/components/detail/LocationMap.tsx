"use client";

import { MapPin, Navigation, ExternalLink } from "lucide-react";
import { Booking } from "@/types/bookings";

export default function LocationMap({ booking }: { booking: Booking }) {
  if (booking.type !== "physical") return null;

  const mapsUrl = booking.locationAddress
    ? `https://maps.google.com/?q=${encodeURIComponent(booking.locationAddress)}`
    : null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">Session Location</h2>
        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[13px] text-green-700 font-semibold hover:text-green-800 transition-colors"
          >
            <ExternalLink size={14} />
            Open in Maps
          </a>
        )}
      </div>

      {/* Map placeholder — replace with real map component (e.g. react-leaflet) */}
      <div className="w-full h-48 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl flex items-center justify-center mb-4 border border-green-100 relative overflow-hidden">
        {/* Grid overlay for map feel */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(#10B981 1px, transparent 1px), linear-gradient(90deg, #10B981 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
            <MapPin size={24} className="text-white" />
          </div>
          <div className="bg-white rounded-lg px-3 py-1.5 shadow text-[13px] font-semibold text-gray-800">
            {booking.location}
          </div>
          <p className="text-[11px] text-gray-500 bg-white/80 rounded-lg px-2 py-1">
            {/* TODO: Replace with react-leaflet or Google Maps embed */}
            Map preview — integrate map SDK here
          </p>
        </div>
      </div>

      {/* Address details */}
      <div className="space-y-3">
        <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
          <MapPin size={16} className="text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider mb-0.5">Tutor's Location</p>
            <p className="text-[14px] font-semibold text-gray-800">
              {booking.locationAddress || booking.location}
            </p>
          </div>
        </div>

        {booking.studentAddress && (
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
            <Navigation size={16} className="text-blue-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-0.5">Your Location</p>
              <p className="text-[14px] font-semibold text-gray-800">{booking.studentAddress}</p>
            </div>
          </div>
        )}

        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-green-600 text-white rounded-xl font-semibold text-[14px] hover:bg-green-700 transition-colors"
          >
            <Navigation size={16} />
            Get Directions
          </a>
        )}
      </div>
    </div>
  );
}
