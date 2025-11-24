import BackButton from "@/components/BackButton";
import PageWrapper from "@/components/PageWrapper";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Daily SaaS | Modification mot de passe",
};

// Custom layout
export default async function UpdatePasswordLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <PageWrapper>
      <div className="flex justify-between items-center p-3">
        <span className="text-graphite font-semibold uppercase border-b-2 border-stormy-teal">
          Modifier
        </span>

        {/* Back button */}
        <BackButton />
      </div>

      <div className="w-[500px] mx-auto bg-dust-grey flex items-center p-8">
        {children}
      </div>
    </PageWrapper>
  );
}
