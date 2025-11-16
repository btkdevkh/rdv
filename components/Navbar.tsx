import Image from "next/image";
import Link from "next/link";

type NavbarProps = {};

const Navbar = ({}: NavbarProps) => {
  return (
    <nav className="py-1.5 px-3 bg-white">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            width={35}
            height={35}
            alt="logo"
            className="shadow rounded-xl"
          />

          <span className="text-black font-semibold uppercase border-b-2 border-[#D9D9D9]">
            Daily SaaS
          </span>
        </Link>

        <div className="flex items-center gap-3 text-black">
          <div>
            <span className="font-semibold">Bienvenue </span>
            <span className="border-b-2 border-[#D9D9D9]">BK</span>
            <span className="font-semibold"> !</span>
          </div>
          <Image src="/profile.png" width={35} height={35} alt="profile" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
