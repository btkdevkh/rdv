import PageWrapper from "@/components/PageWrapper";
import { Metadata } from "next";
import Image from "next/image";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Daily SaaS | Identification",
};

// Custom layout
export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <PageWrapper>
      <div className="flex items-center">
        <div className="h-screen w-[500px] mx-auto bg-dust-grey flex items-center p-8">
          {children}
        </div>
        <div className="hidden md:flex justify-center items-center h-screen md:w-[calc(100%-300px)] bg-stormy-teal ">
          <Image
            src="/background.svg"
            width={1000}
            height={1000}
            alt="saas background"
          />
        </div>
      </div>
    </PageWrapper>
  );
}
