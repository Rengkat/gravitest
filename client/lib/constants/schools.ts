import { Crown, Landmark, Globe, Beaker, Palette, Calculator, Monitor } from "lucide-react";
import type { SchoolType, SchoolStatus, SubscriptionPlan } from "@/types/schoolsTypes";

export const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

export const SCHOOL_TYPES: Record<
  SchoolType,
  { label: string; icon: any; color: string; bg: string }
> = {
  private: { label: "Private", icon: Crown, color: "#7c3aed", bg: "#7c3aed15" },
  public: { label: "Public", icon: Landmark, color: "#2e8b57", bg: "#2e8b5715" },
  international: { label: "International", icon: Globe, color: "#3b82f6", bg: "#3b82f615" },
};

export const STATUS_MAP: Record<SchoolStatus, { label: string; bg: string; text: string }> = {
  active: { label: "Active", bg: "#10b98115", text: "#10b981" },
  inactive: { label: "Inactive", bg: "#6b728015", text: "#6b7280" },
  suspended: { label: "Suspended", bg: "#ef444415", text: "#ef4444" },
  pending: { label: "Pending", bg: "#f59e0b15", text: "#f59e0b" },
};

export const SUBSCRIPTION_PLANS: Record<
  SubscriptionPlan,
  { label: string; color: string; bg: string; price: string }
> = {
  free: { label: "Free", color: "#6b7280", bg: "#6b728015", price: "₦0" },
  basic: { label: "Basic", color: "#3b82f6", bg: "#3b82f615", price: "₦50,000/mo" },
  pro: { label: "Pro", color: "#8b5cf6", bg: "#8b5cf615", price: "₦150,000/mo" },
  enterprise: { label: "Enterprise", color: "#ef4444", bg: "#ef444415", price: "Custom" },
};

export const SUBJECT_CATEGORIES: Record<string, { label: string; icon: any; color: string }> = {
  science: { label: "Science", icon: Beaker, color: "#3b82f6" },
  arts: { label: "Arts", icon: Palette, color: "#8b5cf6" },
  commercial: { label: "Commercial", icon: Calculator, color: "#f59e0b" },
  vocational: { label: "Vocational", icon: Monitor, color: "#14b8a6" },
};

export const CLASS_LEVELS = ["JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"];
export const CLASS_STREAMS = ["Science", "Arts", "Commercial", "Technical"];

export const CORE_SUBJECTS = [
  { name: "Mathematics", code: "MTH", category: "science" as const },
  { name: "English Language", code: "ENG", category: "arts" as const },
  { name: "Physics", code: "PHY", category: "science" as const },
  { name: "Chemistry", code: "CHM", category: "science" as const },
  { name: "Biology", code: "BIO", category: "science" as const },
  { name: "Economics", code: "ECO", category: "commercial" as const },
  { name: "Government", code: "GOV", category: "arts" as const },
  { name: "Literature in English", code: "LIT", category: "arts" as const },
  { name: "Commerce", code: "COM", category: "commercial" as const },
  { name: "Geography", code: "GEO", category: "arts" as const },
  { name: "Agricultural Science", code: "AGR", category: "science" as const },
  { name: "Further Mathematics", code: "FMA", category: "science" as const },
  { name: "Technical Drawing", code: "TDR", category: "vocational" as const },
  { name: "Food & Nutrition", code: "FNT", category: "vocational" as const },
  { name: "Home Economics", code: "HEC", category: "vocational" as const },
  { name: "Computer Studies", code: "CSC", category: "vocational" as const },
  { name: "Christian Religious Studies", code: "CRS", category: "arts" as const },
  { name: "Islamic Religious Studies", code: "IRS", category: "arts" as const },
  { name: "French", code: "FRN", category: "arts" as const },
  { name: "Yoruba", code: "YOR", category: "arts" as const },
  { name: "Physical Education", code: "PHE", category: "vocational" as const },
  { name: "Business Studies", code: "BST", category: "commercial" as const },
  { name: "Civic Education", code: "CVE", category: "arts" as const },
  { name: "Basic Science", code: "BSC", category: "science" as const },
  { name: "Social Studies", code: "SST", category: "arts" as const },
];

export const PLAN_LIMITS: Record<
  string,
  { maxStudents: number; maxClasses: number; features: string[] }
> = {
  enterprise: {
    maxStudents: 5000,
    maxClasses: 100,
    features: [
      "AI Tutoring",
      "Advanced Analytics",
      "Custom Reports",
      "API Access",
      "Priority Support",
    ],
  },
  pro: {
    maxStudents: 2000,
    maxClasses: 50,
    features: ["AI Tutoring", "Advanced Analytics", "Custom Reports"],
  },
  basic: {
    maxStudents: 500,
    maxClasses: 20,
    features: ["Practice Questions", "Basic Analytics"],
  },
  free: {
    maxStudents: 100,
    maxClasses: 5,
    features: ["Practice Questions"],
  },
};
