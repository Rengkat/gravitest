"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { BreadcrumbLevel } from "@/types/adminQuestions";
import { EXAM_META } from "@/lib/mock/questionsMock";

interface BreadcrumbProps {
  crumb: BreadcrumbLevel;
  onNavigate: (crumb: BreadcrumbLevel) => void;
}

export default function Breadcrumb({ crumb, onNavigate }: BreadcrumbProps) {
  const examName =
    crumb.level !== "overview" && "examType" in crumb ? EXAM_META[crumb.examType]?.name : null;

  const items: { label: string; crumb: BreadcrumbLevel }[] = [
    { label: "Question Bank", crumb: { level: "overview" } },
  ];

  if (crumb.level !== "overview" && "examType" in crumb) {
    items.push({
      label: examName ?? crumb.examType,
      crumb: { level: "exam", examType: crumb.examType },
    });
  }
  if (
    (crumb.level === "year" || crumb.level === "subject" || crumb.level === "topic") &&
    "examType" in crumb
  ) {
    if (crumb.level === "year") {
      items.push({ label: crumb.year, crumb });
    }
    if (crumb.level === "subject") {
      items.push({ label: crumb.subject, crumb });
    }
    if (crumb.level === "topic" && "subject" in crumb) {
      items.push({
        label: crumb.subject,
        crumb: { level: "subject", examType: crumb.examType, subject: crumb.subject },
      });
      items.push({ label: crumb.topic, crumb });
    }
  }

  return (
    <nav className="flex items-center gap-1.5 text-[13px] mb-6">
      <Home size={13} className="text-gray-400 shrink-0" />
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <span key={idx} className="flex items-center gap-1.5">
            <ChevronRight size={13} className="text-gray-300 shrink-0" />
            {isLast ? (
              <span className="font-semibold text-green-900">{item.label}</span>
            ) : (
              <button
                onClick={() => onNavigate(item.crumb)}
                className="text-gray-500 hover:text-green-800 transition-colors font-medium">
                {item.label}
              </button>
            )}
          </span>
        );
      })}
    </nav>
  );
}
