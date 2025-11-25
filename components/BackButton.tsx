"use client";

import { useRouter } from "next/navigation";

type BackButtonProps = {
  url?: string;
};

const BackButton = ({ url }: BackButtonProps) => {
  const router = useRouter();

  return (
    <button
      className="bg-yale-blue py-2 px-4 rounded font-semibold cursor-pointer uppercase"
      onClick={() => router.back()}
    >
      Retour
    </button>
  );
};

export default BackButton;
