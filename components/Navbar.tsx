import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

type NavbarProps = {
  open: boolean;
};

const Navbar = ({ open }: NavbarProps) => {
  const { data: session } = useSession();

  return (
    <nav className="py-1.5 px-3 bg-white">
      <div className="flex items-center justify-between">
        {!open ? (
          <Link href="/dashboard" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              width={35}
              height={35}
              alt="logo"
              className="shadow rounded-xl"
            />
            <span className="text-graphite font-semibold uppercase">
              Daily SaaS
            </span>
          </Link>
        ) : (
          <span className="text-graphite font-semibold uppercase">
            Daily SaaS
          </span>
        )}

        <div className="text-white font-semibold bg-stormy-teal w-[35px] h-[35px] rounded-full flex items-center justify-center shadow">
          <span>
            {session?.user.name?.split(" ")[0][0]}
            {session?.user.name?.split(" ")[1][0]}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
