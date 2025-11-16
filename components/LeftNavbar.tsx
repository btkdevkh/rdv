import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { IoCalendarNumberSharp } from "react-icons/io5";
import { MdOutlinePassword } from "react-icons/md";
import { MdMovie } from "react-icons/md";

type LeftNavbarProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const MENU = [
  {
    id: 1,
    title: "Rdv",
    pathname: "/dashboard/rdv",
    show: true,
    icon: <IoCalendarNumberSharp size={33} color="#353535" />,
    iconActive: <IoCalendarNumberSharp size={33} color="#3C6E71" />,
  },
  {
    id: 2,
    title: "IPass",
    pathname: "/dashboard/ipass",
    show: false,
    icon: <MdOutlinePassword size={33} color="#353535" />,
    iconActive: <MdOutlinePassword size={33} color="#3C6E71" />,
  },
  {
    id: 3,
    title: "CineSnooZzzz",
    pathname: "/dashboard/cinesnoozzz",
    show: false,
    icon: <MdMovie size={33} color="#353535" />,
    iconActive: <MdMovie size={33} color="#3C6E71" />,
  },
];

const LeftNavbar = ({ open, setOpen }: LeftNavbarProps) => {
  const pathname = usePathname();
  console.log(pathname);

  return (
    <div
      className={`bg-white text-black ${
        open ? "w-[300px]" : "w-[62px]"
      } shadow p-3.5`}
    >
      <div className="w-[50px]">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="cursor-pointer shadow"
        >
          {open ? (
            <Image src="/close.png" width={35} height={35} alt="logo" />
          ) : (
            <Image src="/menu_burger.png" width={35} height={35} alt="logo" />
          )}
        </button>
      </div>

      <br />

      <nav className="flex flex-col gap-5">
        {MENU.map((menu) => (
          <Link
            key={menu.id}
            href={menu.pathname}
            className="flex items-center gap-5 shadow p-1"
          >
            {pathname === menu.pathname ? menu.iconActive : menu.icon}

            {open && (
              <span
                className={`${
                  pathname === menu.pathname
                    ? "text-[#3C6E71]"
                    : "text-[#353535]"
                }`}
              >
                {menu.title}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default LeftNavbar;
