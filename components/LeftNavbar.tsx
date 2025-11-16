import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { IoCalendarNumberSharp } from "react-icons/io5";
import { MdOutlinePassword } from "react-icons/md";
import { MdMovie } from "react-icons/md";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { AiOutlineMenuFold } from "react-icons/ai";
import { GiMusicalScore } from "react-icons/gi";
import { RiRobot2Fill } from "react-icons/ri";

type LeftNavbarProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const MENU = [
  {
    id: 1,
    title: "Rendez-vous",
    pathname: "/dashboard/rdv",
    show: true,
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
    title: "Glassmusicplayer",
    pathname: "/dashboard/glassmusicplayer",
    show: false,
    icon: <GiMusicalScore size={28} color="#353535" />,
    iconActive: <GiMusicalScore size={28} color="#3C6E71" />,
  },
  {
    id: 4,
    title: "CineSnooZzzz",
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

const LeftNavbar = ({ open, setOpen }: LeftNavbarProps) => {
  const pathname = usePathname();
  console.log(pathname);

  return (
    <div
      className={`bg-white text-black ${
        open ? "w-[250px] fade" : "w-[50px] fade-in"
      } shadow px-2.5 py-2.5`}
    >
      <div className="flex justify-end items-center">
        {open && (
          <span className="mr-auto font-semibold uppercase border-b-2 border-[#D9D9D9]">
            Tableau de bord
          </span>
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
