import Image from "next/image";
import Link from "next/link";

type NavbarProps = {};

const Navbar = ({}: NavbarProps) => {
  return (
    <nav className="p-2 border-b border-[#e94d3e]">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center relative">
          <Image
            src="/logo.png"
            width={40}
            height={40}
            alt="logo"
            className="z-1"
          />
          <h2 className="bg-[#e94d3e] py-0.5 px-2 font-semibold absolute left-8.5 bottom-1">
            monrdv
          </h2>
        </Link>

        <button className="bg-green-700 h-[30px] px-4 rounded mr-0.5 font-semibold">
          rdvs
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
