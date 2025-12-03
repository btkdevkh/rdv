"use client";

import { useRouter } from "next/navigation";
import { IoMdAdd } from "react-icons/io";

type CreateButtonProps = {
  page: string;
};

const CreateButton = ({ page }: CreateButtonProps) => {
  const router = useRouter();

  return (
    <button
      className="bg-stormy-teal flex items-center gap-1 py-2 px-4 rounded font-semibold cursor-pointer uppercase"
      onClick={() => router.push(`/dashboard/${page}/create`)}
    >
      <IoMdAdd size={20} />
      <span>Créer</span>
    </button>
  );
};

export default CreateButton;
