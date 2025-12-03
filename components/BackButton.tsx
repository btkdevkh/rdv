"use client";

import { useRouter } from "next/navigation";
import { IoMdArrowRoundBack } from "react-icons/io";

type BackButtonProps = {
  url?: string;
};

const BackButton = ({ url }: BackButtonProps) => {
  const router = useRouter();

  return (
    <button
      className="bg-stormy-teal flex items-center gap-1 py-2 px-4 rounded font-semibold cursor-pointer uppercase"
      onClick={() => router.back()}
    >
      <IoMdArrowRoundBack size={20} />
      <span>Retour</span>
    </button>
  );
};

export default BackButton;
