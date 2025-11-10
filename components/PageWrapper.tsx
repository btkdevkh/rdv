import { ReactNode } from "react";

type PageWrapperProps = {
  children: ReactNode;
};

const PageWrapper = ({ children }: PageWrapperProps) => {
  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black">{children}</div>
  );
};

export default PageWrapper;
