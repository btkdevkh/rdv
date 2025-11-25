import BackButton from "@/components/BackButton";
import PageWrapper from "@/components/PageWrapper";
import TabLink from "@/components/TabLink";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Daily SaaS | Création Running",
};

// Custom layout
export default async function CreateRunningLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <PageWrapper>
      <div className="flex justify-between items-center p-3">
        <div className="flex items-center gap-1">
          <TabLink url="/dashboard/running/create" title="Créer" />
        </div>

        <BackButton />
      </div>

      <div className="w-[500px] mx-auto bg-dust-grey flex items-center p-8">
        {children}
      </div>
    </PageWrapper>
  );
}
