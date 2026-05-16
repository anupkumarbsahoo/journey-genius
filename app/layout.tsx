import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/Providers";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "WanderPilot AI — Smart Travel Planning",
    template: "%s | WanderPilot AI",
  },
  description:
    "AI-powered travel planner with real-time attraction discovery, smart route planning, and personalized itinerary generation.",
  keywords: [
    "travel planner",
    "AI travel",
    "itinerary generator",
    "route planner",
    "attractions",
    "hidden gems",
  ],
  authors: [{ name: "WanderPilot AI" }],
  creator: "WanderPilot AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "WanderPilot AI — Smart Travel Planning",
    description: "AI-powered travel planner with personalized itinerary generation.",
    siteName: "WanderPilot AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "WanderPilot AI",
    description: "AI-powered travel planner",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#060d1a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "rgba(15, 20, 40, 0.95)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(16px)",
                borderRadius: "12px",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
