"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type TabLinkProps = {
  url: string;
  title: string;
};

const TabLink = ({ url, title }: TabLinkProps) => {
  const pathname = usePathname();

  console.log(pathname);

  return (
    <Link
      href={url}
      className={`font-semibold uppercase border-b-3 border-white ${
        pathname === url ? "bg-graphite" : "bg-[#979696]"
      } text-white shadow  py-1 px-2`}
    >
      {title}
    </Link>
  );
};

export default TabLink;
