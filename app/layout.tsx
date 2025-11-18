import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SessionProviderClient from "@/components/SessionProviderClient";
import "./globals.css";
import PageWrapper from "@/components/PageWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daily SaaS",
  description: "Gestionnaire des divers utilités",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-y-hidden min-w-[320px]`}
      >
        <SessionProviderClient>
          <PageWrapper>{children}</PageWrapper>
        </SessionProviderClient>
      </body>
    </html>
  );
}
