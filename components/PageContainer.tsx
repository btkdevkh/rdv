import { ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
};

const PageContainer = ({ children }: PageContainerProps) => {
  return <div className="container mx-auto">{children}</div>;
};

export default PageContainer;
