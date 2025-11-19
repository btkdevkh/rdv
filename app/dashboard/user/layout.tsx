import PageWrapper from "@/components/PageWrapper";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Daily SaaS | Utilisateurs",
};

// Custom layout
export default async function UserLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <PageWrapper>{children}</PageWrapper>;
}
