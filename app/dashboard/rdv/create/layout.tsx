import PageWrapper from "@/components/PageWrapper";
import { ReactNode } from "react";

// Custom layout
export default async function CreateRdvLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <PageWrapper>
      <div className="w-[500px] mx-auto bg-dust-grey flex items-center p-8">
        {children}
      </div>
    </PageWrapper>
  );
}
