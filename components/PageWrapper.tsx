import { ReactNode } from "react";

type PageWrapperProps = {
  children: ReactNode;
};

const PageWrapper = ({ children }: PageWrapperProps) => {
  return <div className="w-full dark:bg-[#D9D9D9]">{children}</div>;
};

export default PageWrapper;
