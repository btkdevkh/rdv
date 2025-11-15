import Image from "next/image";
import Link from "next/link";

type NavbarProps = {};

const Navbar = ({}: NavbarProps) => {
  return (
    <nav className="py-2 px-3 bg-[#fefeff] sticky top-0 shadow">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            width={40}
            height={40}
            alt="logo"
            className="shadow rounded-xl"
          />
        </Link>

        <div>
          <Image src="/profile.png" width={45} height={45} alt="profile" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
