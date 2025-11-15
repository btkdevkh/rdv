import { ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
};

const PageContainer = ({ children }: PageContainerProps) => {
  return <main className="w-full p-3">{children}</main>;
};

export default PageContainer;
