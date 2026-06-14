import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  title: "LUMIÈRE | Premium Skincare & Mindful Luxury Beauty",
  description: "Formulated to preserve your skin's natural protective moisture barrier with active amino acids and bio-silk proteins. Pure, mindful luxury beauty.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-bg-cream text-text-dark font-sans flex flex-col antialiased">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
