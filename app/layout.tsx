import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PeakPost — Post at the perfect time. Every time.",
  description:
    "PeakPost analyzes your Instagram audience and auto-publishes your Reels at the exact moment your followers are most active. Built for creators.",
  keywords: ["instagram scheduler", "reels", "peak time", "creator tools", "auto-post"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PeakPost",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "PeakPost — Post at the perfect time",
    description: "AI-powered Instagram scheduling for creators.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#08080d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${dmSans.variable} dark`} suppressHydrationWarning>
      <body className="bg-bg text-text font-sans antialiased min-h-screen" suppressHydrationWarning>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
