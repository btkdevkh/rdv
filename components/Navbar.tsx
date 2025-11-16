import Image from "next/image";
import Link from "next/link";

type NavbarProps = {};

const Navbar = ({}: NavbarProps) => {
  return (
    <nav className="py-2 px-3 bg-white">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            width={40}
            height={40}
            alt="logo"
            className="shadow rounded-xl"
          />

          <span className="text-black font-semibold uppercase border-b-2 border-[#D9D9D9]">
            Daily SaaS
          </span>
        </Link>

        <div>
          <Image src="/profile.png" width={45} height={45} alt="profile" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
