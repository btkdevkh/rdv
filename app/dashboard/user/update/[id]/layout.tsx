import { ReactNode } from "react";
import PageWrapper from "@/components/PageWrapper";
import { Metadata } from "next";
import BackButton from "@/components/BackButton";
import TabLink from "@/components/TabLink";

export const metadata: Metadata = {
  title: "Daily SaaS | Modification Utilisateur",
};

// Custom layout
export default async function UpdateUserLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PageWrapper>
      <div className="flex justify-between items-center p-3">
        <div className="flex items-center gap-1">
          <TabLink url={`/dashboard/user/update/${id}`} title="Modifier" />
        </div>

        <BackButton />
      </div>

      <div className="w-[500px] mx-auto bg-dust-grey flex items-center p-8">
        {children}
      </div>
    </PageWrapper>
  );
}
