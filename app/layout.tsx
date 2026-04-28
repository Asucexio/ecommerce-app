import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "NovaCart | Modern Ecommerce",
  description: "Production-ready Next.js ecommerce starter powered by Supabase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-slate-50 font-sans text-slate-900">{children}</body>
    </html>
  );
}