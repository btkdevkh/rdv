import LeftNavbar from "@/components/LeftNavbar";
import Navbar from "@/components/Navbar";
import { ReactNode } from "react";

// Custom layout
export default async function CreateRdvLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="bg-[#D9D9D9] min-h-screen flex justify-between">
        {/* Left Navbar */}
        <LeftNavbar />

        {/* Children */}
        <div className="w-[calc(100%-300px)]">{children}</div>
      </main>
    </>
  );
}
