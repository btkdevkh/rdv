"use client";

type TabSwitchProps = {
  order: number;
  title: string;
};

const TabSwitch = ({ order, title }: TabSwitchProps) => {
  return (
    <button
      className={`font-semibold uppercase border-b-3 border-white ${
        order ? "bg-graphite" : "bg-[#979696]"
      } text-white shadow  py-1 px-2`}
    >
      {title}
    </button>
  );
};

export default TabSwitch;
