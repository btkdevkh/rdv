import Image from "next/image";
import Link from "next/link";

type NavbarProps = {};

const Navbar = ({}: NavbarProps) => {
  return (
    <nav className="p-2 bg-[#fefeff] sticky top-0">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            width={40}
            height={40}
            alt="logo"
            className="z-1"
          />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
