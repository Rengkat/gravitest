"use client";

import { useState } from "react";
import { X, Key, Copy, Check } from "lucide-react";
import type { SchoolClass } from "../types";

interface RotatePinModalProps {
  isOpen: boolean;
  onClose: () => void;
  classItem: SchoolClass;
  onSuccess: (updatedClass: SchoolClass) => void;
}

export function RotatePinModal({ isOpen, onClose, classItem, onSuccess }: RotatePinModalProps) {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [generatedPin, setGeneratedPin] = useState("");
  const [step, setStep] = useState<"set" | "generated">("set");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateRandomPin = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const handleGeneratePin = () => {
    const newPin = generateRandomPin();
    setGeneratedPin(newPin);
    setStep("generated");
  };

  const handleCopyPin = () => {
    navigator.clipboard.writeText(generatedPin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === "set") {
      if (pin !== confirmPin) {
        alert("PINs do not match");
        return;
      }
      if (pin.length < 4 || pin.length > 6) {
        alert("PIN must be 4-6 digits");
        return;
      }
      setGeneratedPin(pin);
      setStep("generated");
      return;
    }

    // Submit the new PIN
    setLoading(true);

    try {
      // Replace with actual API call
      // const response = await fetch(`/api/schools/classes/${classItem.id}/rotate-pin`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ newPin: generatedPin }),
      // });
      // const updatedClass = await response.json();

      // Mock update
      const updatedClass = {
        ...classItem,
        pinLastChangedAt: new Date(),
        classCode: classItem.classCode, // Keep same class code, just rotate PIN
      };
      await new Promise((resolve) => setTimeout(resolve, 500));

      onSuccess(updatedClass);
      onClose();
      setStep("set");
      setPin("");
      setConfirmPin("");
      setGeneratedPin("");
    } catch (error) {
      console.error("Error rotating PIN:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />

        <div className="relative bg-white rounded-2xl w-full max-w-md">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Key size={20} className="text-yellow-600" />
              </div>
              <h2 className="text-xl font-semibold text-green-900">Rotate Access PIN</h2>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-cream transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {step === "set" ? (
              <>
                <div className="mb-4 p-3 rounded-lg bg-blue-50 text-sm text-blue-800">
                  <p>
                    The class access PIN is used by teachers to access this class. Rotating the PIN
                    will invalidate the old PIN immediately.
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New PIN (4-6 digits)
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    pattern="[0-9]*"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ""))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500 text-center text-2xl tracking-widest"
                    placeholder="****"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New PIN
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    pattern="[0-9]*"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/[^0-9]/g, ""))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500 text-center text-2xl tracking-widest"
                    placeholder="****"
                    required
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleGeneratePin}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 hover:bg-cream transition-colors text-sm">
                    Generate Random PIN
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 rounded-lg bg-green-800 text-white hover:bg-green-700 transition-colors text-sm">
                    Continue
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-4 p-3 rounded-lg bg-green-50 text-sm text-green-800">
                  <p>
                    Your new PIN has been generated. Please save it securely and share it with the
                    teacher.
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Access PIN
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 px-4 py-3 rounded-lg bg-gray-100 text-center text-3xl font-mono tracking-widest">
                      {generatedPin}
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyPin}
                      className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-cream transition-colors">
                      {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
                    </button>
                  </div>
                </div>

                <div className="mb-4 p-3 rounded-lg bg-yellow-50 text-sm text-yellow-800">
                  <p className="font-medium mb-1">Important:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Share this PIN with the teacher</li>
                    <li>Old PIN will no longer work</li>
                    <li>
                      Class code remains the same:{" "}
                      <code className="bg-yellow-100 px-1 rounded">{classItem.classCode}</code>
                    </li>
                    <li>Teacher will need the new PIN to access the class</li>
                  </ul>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("set");
                      setPin("");
                      setConfirmPin("");
                    }}
                    className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-cream transition-colors">
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 rounded-lg bg-green-800 text-white hover:bg-green-700 disabled:opacity-50 transition-colors">
                    {loading ? "Rotating..." : "Confirm & Rotate PIN"}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
