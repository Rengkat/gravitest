import type { Metadata } from "next";

import PricingPageClient from "./PricingClient";

export const metadata: Metadata = {
  title: "Pricing — Affordable JAMB & WAEC, ICAN, Nigeria Nursing Council Exam Prep Plans",

  description:
    "Gravitest pricing starts at ₦0. Free forever plan for 3 subjects, " +
    "Student Pro at ₦2,500/month with unlimited AI explanations and mock " +
    "exams, and School plans from ₦15,000/month for branded portals. " +
    "No hidden fees. Pay with Paystack, USSD, or bank transfer.",

  keywords: [
    "Gravitest pricing",
    "JAMB prep cost Nigeria",
    "cheap exam prep Nigeria",
    "WAEC prep subscription",
    "school CBT portal price",
    "affordable tutor app",
    "exam prep free Nigeria",
    "Gravitest Student Pro",
    "Gravitest school plan",
  ],

  alternates: { canonical: "https://Gravitest.ng/pricing" },

  openGraph: {
    type: "website",
    url: "https://Gravitest.ng/pricing",
    title: "Gravitest Pricing — Plans from ₦0 to ₦2,500/month",
    description:
      "Start free. Upgrade when ready. No hidden fees. " +
      "Student Pro at ₦2,500/month. School plans from ₦15,000/month.",
    images: [{ url: "/og/pricing.png", width: 1200, height: 630, alt: "Gravitest Pricing Plans" }],
  },

  twitter: {
    card: "summary_large_image",
    title: "Gravitest Pricing — From ₦0",
    description: "Start free. Unlimited AI explanations from ₦2,500/month.",
    images: ["/og/pricing.png"],
  },
};

const Pricing = () => {
  return <PricingPageClient />;
};
export default Pricing;
