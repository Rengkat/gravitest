"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Mail } from "lucide-react";

import { type StepNumber } from "./constants";
import type {
  PersonalInfoData,
  AcademicInfoData,
  ExamGoalsData,
  FullRegistration,
} from "./schemas";
import { Step3ExamGoals } from "./components/Step3examgoals";
import { Step2AcademicInfo } from "./components/Step2academicinfo";
import { Step1PersonalInfo } from "./components/Step1personalinfo";
import { SuccessState } from "./components/Successstate";
import { StepProgress } from "./components/Stepprogress";

export default function CompleteRegistrationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [currentStep, setCurrentStep] = useState<StepNumber>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Accumulated form data across steps
  const [formData, setFormData] = useState<Partial<FullRegistration>>({});

  // ─── STEP HANDLERS ──────────────────────────────────────
  const handleStep1 = (data: PersonalInfoData) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStep2 = (data: AcademicInfoData) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStep3 = async (data: ExamGoalsData) => {
    setIsSubmitting(true);
    const payload: FullRegistration = { ...(formData as any), ...data };

    try {
      // ── Real API call would go here ──────────────────────
      // await fetch("/api/auth/complete-registration", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ ...payload, email }),
      // });
      await new Promise((r) => setTimeout(r, 1500)); // mock delay

      setFormData((prev) => ({ ...prev, ...data }));
      setIsDone(true);
    } catch (err) {
      console.error("Registration failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as StepNumber) : prev));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ─── RENDER ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Page header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4 shadow-md">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h1 className="font-serif text-3xl text-green-900 mb-2">Complete Your Profile</h1>
          <p className="text-text-muted">
            Welcome to Gravitas! Let's set up your personalised learning journey.
          </p>
          {email && (
            <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-green-50 text-[13px] text-green-700">
              <Mail size={13} />
              {email}
            </div>
          )}
        </div>

        {/* Step progress — hidden on success */}
        {!isDone && <StepProgress currentStep={currentStep} />}

        {/* Step content */}
        {isDone ? (
          <div
            className="bg-white rounded-2xl border p-8"
            style={{ borderColor: "rgba(30,80,50,0.08)" }}>
            <SuccessState data={formData} />
          </div>
        ) : (
          <>
            {currentStep === 1 && (
              <Step1PersonalInfo
                defaultValues={formData as Partial<PersonalInfoData>}
                onNext={handleStep1}
              />
            )}
            {currentStep === 2 && (
              <Step2AcademicInfo
                defaultValues={formData as Partial<AcademicInfoData>}
                onNext={handleStep2}
                onBack={handleBack}
              />
            )}
            {currentStep === 3 && (
              <Step3ExamGoals
                defaultValues={formData as Partial<ExamGoalsData>}
                onSubmit={handleStep3}
                onBack={handleBack}
                isSubmitting={isSubmitting}
              />
            )}

            {/* Skip */}
            <div className="text-center mt-6">
              <button
                onClick={() => router.push("/dashboard")}
                className="text-[13px] text-text-muted hover:text-gray-600 transition-colors underline underline-offset-2">
                I'll complete this later
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
