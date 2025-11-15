import { prisma } from "@/lib/prisma";
import PageWrapper from "@/components/PageWrapper";
import PageContainer from "@/components/PageContainer";
import { redirect } from "next/navigation";

export default async function Home() {
  redirect("/dashboard");

  return (
    <PageWrapper>
      <PageContainer>
        <></>
      </PageContainer>
    </PageWrapper>
  );
}
