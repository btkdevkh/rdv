import PageWrapper from "@/components/PageWrapper";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Daily SaaS | Course à pied",
};

// Custom layout
export default async function RunningLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <PageWrapper>{children}</PageWrapper>;
}
