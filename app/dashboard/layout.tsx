"use client";

import LeftNavbar from "@/components/LeftNavbar";
import Navbar from "@/components/Navbar";
import PageWrapper from "@/components/PageWrapper";
import { ReactNode, Suspense, useState } from "react";

// Custom layout
export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true);

  return (
    <Suspense>
      <PageWrapper>
        <title>Daily SaaS | Tableau de bord</title>
        <div className="bg-dust-grey flex justify-between">
          {/* Left Navbar */}
          <LeftNavbar open={open} setOpen={setOpen} />

          {/* Children */}
          <div
            className={`${
              open ? "w-[calc(100%-300px)]" : "w-[calc(100%)] fade-in"
            }`}
          >
            <Navbar open={open} />
            {children}
          </div>
        </div>
      </PageWrapper>
    </Suspense>
  );
}
