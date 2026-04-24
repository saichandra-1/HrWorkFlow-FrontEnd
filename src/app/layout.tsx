import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "WorkflowHR — HR Workflow Designer",
  description:
    "Visual workflow designer for HR teams. Create, configure, and test internal workflows like onboarding, leave approval, and document verification using a drag-and-drop canvas.",
  keywords: [
    "HR workflow",
    "workflow designer",
    "React Flow",
    "onboarding",
    "leave approval",
    "automation",
  ],
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
