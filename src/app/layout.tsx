import type { Metadata } from "next";
import "./globals.css";
import { profile } from "@/content/profile";

// No next/font import: the type stack is system fonts, so there is no webfont
// to fetch and nothing blocking first paint.

export const metadata: Metadata = {
  metadataBase: new URL("https://cibisiddarth.com"),
  title: `${profile.name} — ${profile.role}`,
  description:
    "Applied AI engineer in Jacksonville, FL. Builds LLM systems that reason over messy clinical text and report their own uncertainty. M.S. Computer Science, AWS Certified ML Engineer.",
  authors: [{ name: profile.name, url: profile.github }],
  keywords: [
    "AI engineer",
    "Applied AI",
    "machine learning engineer",
    "LLM agents",
    "RAG",
    "clinical NLP",
    "Jacksonville",
  ],
  openGraph: {
    type: "profile",
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
    siteName: profile.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
