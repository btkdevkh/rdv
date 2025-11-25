import BackButton from "@/components/BackButton";
import PageWrapper from "@/components/PageWrapper";
import TabLink from "@/components/TabLink";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Daily SaaS | Modification Running",
};

// Custom layout
export default async function UpdateRunningLayout({
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
          <TabLink url={`/dashboard/running/update/${id}`} title="Modifier" />
        </div>

        <BackButton />
      </div>

      <div className="w-[500px] mx-auto bg-dust-grey flex items-center p-8">
        {children}
      </div>
    </PageWrapper>
  );
}
