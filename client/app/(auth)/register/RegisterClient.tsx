"use client";

import { useState } from "react";
import LeftPanel from "./LeftPanel";
import StepIndicator from "./StepIndicator";
import Step2Details from "./Step2Details";
import Step3Verify from "./Step3Verify";
import StepSuccess from "./StepSuccess";
import { RoleId } from "@/types/registerType";
import Step1RoleSelect from "./Step1RoleSelect";
import Link from "next/link";
import Image from "next/image";

type Step = 1 | 2 | 3 | "success";

export default function RegisterPage() {
  const [step, setStep] = useState<Step>(1);
  const [selectedRole, setSelectedRole] = useState<RoleId | null>(null);
  const [showRoleError, setShowRoleError] = useState(false);
  const [email, setEmail] = useState("");

  function handleRoleSelect(id: RoleId) {
    setSelectedRole(id);
    setShowRoleError(false);
  }

  function handleContinueStep1() {
    if (!selectedRole) {
      setShowRoleError(true);
      return;
    }
    setStep(2);
    window.scrollTo(0, 0);
  }

  function handleSubmitStep2(submittedEmail: string) {
    setEmail(submittedEmail);
    setStep(3);
    window.scrollTo(0, 0);
  }

  function handleVerified() {
    setStep("success");
    window.scrollTo(0, 0);
  }

  const indicatorStep = step === "success" ? 3 : (step as 1 | 2 | 3);

  return (
    <div className="min-h-screen flex bg-cream">
      {/* ── Left decorative panel ── */}
      <LeftPanel />

      {/* ── Right: form panel ── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-cream">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-5 lg:px-10 border-b border-green-900/[0.08]">
          <Link href="/" className="flex items-center gap-2 lg:hidden no-underline shrink-0">
            <Image src="/logo.svg" alt="Gravitest Logo" width={32} height={32} />
            <span className="font-serif text-lg sm:text-xl text-green-800">Gravitest</span>
          </Link>

          <div className="ml-auto flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-green-700/60 whitespace-nowrap">
            <span className="hidden sm:inline">Already have an account?</span>

            <Link
              href="/login"
              className="font-semibold text-green-800 hover:text-green-600 transition-colors">
              Login <span className="hidden sm:inline">→</span>
            </Link>
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-start justify-center px-6 py-8 lg:px-12 xl:px-16">
          <div className="w-full max-w-[520px]">
            {/* Step indicator — hidden on success */}
            {step !== "success" && <StepIndicator current={indicatorStep} />}

            {/* Step 1 */}
            {step === 1 && (
              <>
                <Step1RoleSelect
                  selected={selectedRole}
                  onSelect={handleRoleSelect}
                  onContinue={handleContinueStep1}
                />
                {showRoleError && (
                  <div className="mt-4 flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4m0 4h.01" strokeLinecap="round" />
                    </svg>
                    Please select an account type to continue.
                  </div>
                )}
              </>
            )}

            {/* Step 2 */}
            {step === 2 && selectedRole && (
              <Step2Details
                role={selectedRole}
                onBack={() => setStep(1)}
                onSubmit={handleSubmitStep2}
              />
            )}

            {/* Step 3 */}
            {step === 3 && <Step3Verify email={email} onVerified={handleVerified} />}

            {/* Success */}
            {step === "success" && <StepSuccess />}
          </div>
        </div>
      </div>
    </div>
  );
}
