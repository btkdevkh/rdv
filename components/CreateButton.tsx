"use client";

import { useRouter } from "next/navigation";

type CreateButtonProps = {
  page: string;
};

const CreateButton = ({ page }: CreateButtonProps) => {
  const router = useRouter();

  return (
    <button
      className="bg-yale-blue py-2 px-4 rounded cursor-pointer"
      onClick={() => router.push(`/dashboard/${page}/create`)}
    >
      Create
    </button>
  );
};

export default CreateButton;
