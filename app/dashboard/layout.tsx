"use client";

import LeftNavbar from "@/components/LeftNavbar";
import Navbar from "@/components/Navbar";
import { ReactNode, useState } from "react";

// Custom layout
export default function CreateRdvLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <main className="bg-[#D9D9D9] min-h-screen flex justify-between">
        {/* Left Navbar */}
        <LeftNavbar open={open} setOpen={setOpen} />

        {/* Children */}
        <div className={`${open ? "w-[calc(100%-250px)]" : "w-[calc(100%)]"}`}>
          <Navbar />
          {children}
        </div>
      </main>
    </>
  );
}
