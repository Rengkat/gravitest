"use client";

import { useState } from "react";
import { X, MapPin, Search, Navigation, CheckCircle } from "lucide-react";
import { NIGERIAN_STATES, LAGOS_AREAS } from "@/lib/constants/bookings";

interface HireLocationModalProps {
  onClose: () => void;
  onConfirm: (location: {
    address: string;
    city: string;
    state: string;
    fullAddress: string;
  }) => void;
}

export default function HireLocationModal({ onClose, onConfirm }: HireLocationModalProps) {
  const [step, setStep] = useState<"input" | "confirm">("input");
  const [state, setState] = useState("Lagos");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [locating, setLocating] = useState(false);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        setUseCurrentLocation(true);
        setCity("Detected");
        setAddress(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        // TODO: reverse geocode with Google Maps API
      },
      () => {
        setLocating(false);
        alert("Unable to detect location. Please enter manually.");
      },
    );
  };

  const fullAddress = `${address}, ${city}, ${state}`;
  const isValid = state && city && address;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Find Tutors Near You</h3>
            <p className="text-[13px] text-gray-500">
              Enter your location to find available in-person tutors nearby
            </p>
          </div>
          <button
            title="on close"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        {step === "input" && (
          <div className="p-6 space-y-4">
            {/* Use current location */}
            <button
              onClick={handleUseCurrentLocation}
              disabled={locating}
              className="w-full flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-xl hover:bg-green-100 transition-colors text-left">
              <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center shrink-0">
                <Navigation size={18} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-green-800 text-[14px]">
                  {locating ? "Detecting location..." : "Use My Current Location"}
                </p>
                <p className="text-[12px] text-green-600">Automatically detect your location</p>
              </div>
              {useCurrentLocation && <CheckCircle size={18} className="text-green-600 ml-auto" />}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 border-t border-gray-200" />
              <span className="text-[12px] text-gray-400 font-medium">or enter manually</span>
              <div className="flex-1 border-t border-gray-200" />
            </div>

            {/* State */}
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-1.5">State *</label>
              <select
                title="city"
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  setCity("");
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-[14px]">
                {NIGERIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* City / Area */}
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-1.5">
                City / Area *
              </label>
              {state === "Lagos" ? (
                <select
                  title="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-[14px]">
                  <option value="">Select area</option>
                  {LAGOS_AREAS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter your city or area"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-[14px]"
                />
              )}
            </div>

            {/* Street address */}
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-1.5">
                Street Address *
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 12 Allen Avenue"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-[14px]"
              />
            </div>

            <p className="text-[11px] text-gray-400">
              ℹ️ Your address is used to match you with tutors in your area. It is never shared
              publicly.
            </p>

            <button
              onClick={() => isValid && setStep("confirm")}
              disabled={!isValid}
              className={`w-full py-3 rounded-xl font-bold text-[14px] transition-all ${
                isValid
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}>
              Find Tutors Near Me
            </button>
          </div>
        )}

        {step === "confirm" && (
          <div className="p-6 space-y-4">
            {/* Location preview */}
            <div className="w-full h-36 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl flex items-center justify-center border border-green-100 relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(#10B981 1px, transparent 1px), linear-gradient(90deg, #10B981 1px, transparent 1px)",
                  backgroundSize: "30px 30px",
                }}
              />
              <div className="relative flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
                  <MapPin size={20} className="text-white" />
                </div>
                <span className="bg-white rounded-lg px-3 py-1 text-[13px] font-semibold text-gray-800 shadow">
                  {city}, {state}
                </span>
              </div>
            </div>

            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
              <p className="text-[12px] font-bold text-green-700 uppercase tracking-wider mb-1">
                Your Location
              </p>
              <p className="text-[14px] font-semibold text-gray-800">{fullAddress}</p>
            </div>

            <p className="text-[13px] text-gray-600">
              We'll show you verified tutors available within your area. Travel fees may apply
              depending on the tutor's distance.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("input")}
                className="flex-1 py-2.5 border-2 border-gray-200 rounded-xl text-[14px] text-gray-600 font-semibold hover:bg-gray-50">
                Edit Location
              </button>
              <button
                onClick={() => onConfirm({ address, city, state, fullAddress })}
                className="flex-[2] py-2.5 bg-green-600 text-white rounded-xl font-bold text-[14px] hover:bg-green-700">
                Search Nearby Tutors
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
