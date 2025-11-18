import { ReactNode } from "react";
import PageWrapper from "@/components/PageWrapper";

// Custom layout
export default async function CreateUserLayout({
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
