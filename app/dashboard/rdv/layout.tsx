import PageWrapper from "@/components/PageWrapper";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Daily SaaS | RDV",
};

// Custom layout
export default async function RdvLayout({ children }: { children: ReactNode }) {
  return <PageWrapper>{children}</PageWrapper>;
}
