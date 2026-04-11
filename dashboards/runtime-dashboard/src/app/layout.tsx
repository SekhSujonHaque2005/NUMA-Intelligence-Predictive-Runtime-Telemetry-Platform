import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NUMA Intelligence",
  description: "Real-time CPU and Runtime Metrics Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}