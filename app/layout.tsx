import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { IoMdAdd } from "react-icons/io";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "rdv",
  description: "Une application web pour la gestion de rendez-vous.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className="flex justify-between">
          <div className="hidden md:flex md:min-w-[300px] bg-[#fefeff] text-black relative">
            {/* Custom Navbar here */}

            <nav className="flex flex-col gap-4 py-3 px-4 fixed w-full">
              <Link
                href="/rdv/create"
                className="bg-[#ed3067] w-[265px] h-[30px] px-2 rounded mr-0.5 font-semibold flex items-center gap-1 text-white hover:bg-[#d42a5b] transition-colors"
              >
                <IoMdAdd /> Créer un RDV
              </Link>
            </nav>
          </div>

          <div className="w-full">
            <Navbar />
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
