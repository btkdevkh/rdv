import { ReactNode } from "react";
import PageWrapper from "@/components/PageWrapper";
import { Metadata } from "next";
import BackButton from "@/components/BackButton";

export const metadata: Metadata = {
  title: "Daily SaaS | Création Utilisateur",
};

// Custom layout
export default async function CreateUserLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <PageWrapper>
      <div className="flex justify-between items-center p-3">
        <span className="text-graphite font-semibold uppercase border-b-2 border-stormy-teal">
          Créer
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
