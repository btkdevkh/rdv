import { ReactNode } from "react";
import PageWrapper from "@/components/PageWrapper";
import { Metadata } from "next";
import BackButton from "@/components/BackButton";
import TabLink from "@/components/TabLink";

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
        <div className="flex items-center gap-1">
          <TabLink url="/dashboard/user/create" title="Créer" />
        </div>

        <BackButton />
      </div>

      <div className="w-[500px] mx-auto bg-dust-grey flex items-center p-8">
        {children}
      </div>
    </PageWrapper>
  );
}
