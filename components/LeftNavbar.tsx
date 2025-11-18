import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { IoCalendarNumberSharp } from "react-icons/io5";
import { MdOutlinePassword } from "react-icons/md";
import { MdMovie } from "react-icons/md";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { AiOutlineMenuFold } from "react-icons/ai";
import { RiRobot2Fill } from "react-icons/ri";
import { FaUsers } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";
import { signOut } from "next-auth/react";
import { FaGuitar } from "react-icons/fa";

type LeftNavbarProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const LeftNavbar = ({ open, setOpen }: LeftNavbarProps) => {
  const pathname = usePathname();

  return (
    <div
      className={`bg-white text-black flex flex-col ${
        open ? "w-[300px] fade-out" : "w-[50px] fade-in"
      } shadow px-2.5 ${!open ? "py-2.5" : "py-1.5"}`}
    >
      <div>
        <div className="flex justify-end items-center">
          {open && (
            <Link href="/dashboard" className="mr-auto">
              <Image
                src="/logo.png"
                width={35}
                height={35}
                alt="logo"
                className="shadow rounded-xl"
              />
            </Link>
          )}

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className={`cursor-pointer ${open ? "" : ""}`}
          >
            {open ? (
              <AiOutlineMenuFold size={28} />
            ) : (
              <AiOutlineMenuUnfold size={28} />
            )}
          </button>
        </div>

        <br />

        <nav className="flex flex-col gap-5">
          {MENU.map((menu) => (
            <Link
              key={menu.id}
              href={menu.pathname}
              className={`flex items-center gap-5 ${open ? "shadow p-1" : ""}`}
            >
              {pathname.includes(menu.pathname) ? menu.iconActive : menu.icon}

              {open && (
                <span
                  className={`${
                    pathname === menu.pathname
                      ? "text-stormy-teal"
                      : "text-black"
                  }`}
                >
                  {menu.title}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {open ? (
        <button
          type="button"
          className="w-fit flex items-center gap-3 py-2 px-3 rounded bg-dust-grey text-graphite uppercase font-bold mt-auto mb-12 self-center cursor-pointer hover:bg-yale-blue hover:text-white transition"
          onClick={() => signOut()}
        >
          <AiOutlineLogout size={28} /> <span>Déconnexion</span>
        </button>
      ) : (
        <button
          type="button"
          className="w-fit py-1.5 px-1.5 rounded-full text-graphite uppercase font-bold mt-auto mb-11 self-center cursor-pointer hover:bg-yale-blue  hover:text-white transition"
          onClick={() => signOut()}
        >
          <AiOutlineLogout size={28} />
        </button>
      )}
    </div>
  );
};

export default LeftNavbar;

const MENU = [
  {
    id: 6,
    title: "Utilisateurs",
    pathname: "/dashboard/user",
    show: true,
    icon: <FaUsers size={28} color="#353535" />,
    iconActive: <FaUsers size={28} color="#3C6E71" />,
  },
  {
    id: 1,
    title: "Rendez-vous",
    pathname: "/dashboard/rdv",
    show: false,
    icon: <IoCalendarNumberSharp size={28} color="#353535" />,
    iconActive: <IoCalendarNumberSharp size={28} color="#3C6E71" />,
  },
  {
    id: 2,
    title: "iPass",
    pathname: "/dashboard/ipass",
    show: false,
    icon: <MdOutlinePassword size={28} color="#353535" />,
    iconActive: <MdOutlinePassword size={28} color="#3C6E71" />,
  },
  {
    id: 3,
    title: "Glass Music Player",
    pathname: "/dashboard/glassmusicplayer",
    show: false,
    icon: <FaGuitar size={28} color="#353535" />,
    iconActive: <FaGuitar size={28} color="#3C6E71" />,
  },
  {
    id: 4,
    title: "Ciné SnooZzzz",
    pathname: "/dashboard/cinesnoozzz",
    show: false,
    icon: <MdMovie size={28} color="#353535" />,
    iconActive: <MdMovie size={28} color="#3C6E71" />,
  },
  {
    id: 5,
    title: "Chat AI",
    pathname: "/dashboard/chatai",
    show: false,
    icon: <RiRobot2Fill size={28} color="#353535" />,
    iconActive: <RiRobot2Fill size={28} color="#3C6E71" />,
  },
];
