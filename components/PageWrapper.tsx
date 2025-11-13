import { ReactNode } from "react";

type PageWrapperProps = {
  children: ReactNode;
};

const PageWrapper = ({ children }: PageWrapperProps) => {
  return <div className="flex min-h-screen dark:bg-[#fef2f6]">{children}</div>;
};

export default PageWrapper;
