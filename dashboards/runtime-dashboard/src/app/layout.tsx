import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "NUMA Intelligence | Predictive Runtime Telemetry Platform",
  description: "Enterprise-grade real-time observability and predictive analytics for C++, Rust, and NUMA-aware systems.",
  keywords: ["NUMA", "Telemetry", "Observability", "Performance", "Predictive AI", "C++", "Rust", "HPC"],
  authors: [{ name: "Sujon Haque", url: "https://github.com/Sekhsujonhaque2005" }],
  openGraph: {
    title: "NUMA Intelligence",
    description: "Next-generation predictive telemetry for extreme-performance systems.",
    url: "https://numa-intelligence-predictive-runtim.vercel.app/",
    siteName: "NUMA Intelligence",
    images: [
      {
        url: "/icon.png",
        width: 800,
        height: 800,
        alt: "NUMA Intelligence Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NUMA Intelligence",
    description: "Predictive Telemetry for High-Performance Computing.",
    images: ["/icon.png"],
    creator: "@SujonHaque",
  },
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}