import type { Metadata } from "next";
import HelpCenterClient from "./help-center-client";

export const metadata: Metadata = {
  title: "Help Centre — Gravitest Support & Documentation",

  description:
    "Find answers to your questions about Gravitest. Browse guides on JAMB & WAEC " +
    "CBT practice, Sabi-Explain AI, offline mode, school portal setup, billing, " +
    "account security, and more. Live chat available Monday–Friday 8am–8pm WAT.",

  keywords: [
    "Gravitest help",
    "Gravitest support",
    "JAMB CBT help",
    "Gravitest documentation",
    "Sabi-Explain FAQ",
    "offline mode Gravitest",
    "school portal setup",
    "Gravitest reset password",
    "Gravitest billing",
    "Gravitest contact",
  ],

  alternates: { canonical: "https://Gravitest.ng/help" },

  openGraph: {
    type: "website",
    url: "https://Gravitest.ng/help",
    title: "Help Centre — Gravitest Support & Documentation",
    description:
      "Guides, FAQs, and live support for JAMB, WAEC & Post-UTME exam prep on Gravitest.",
    images: [
      {
        url: "/og/help.png",
        width: 1200,
        height: 630,
        alt: "Gravitest Help Centre",
      },
    ],
  },

  twitter: {
    card: "summary",
    title: "Gravitest Help Centre",
    description: "Guides, FAQs, and live support for Nigerian exam prep.",
  },
};

export default function HelpPage() {
  return <HelpCenterClient />;
}
