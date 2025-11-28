"use client";

import { BeatLoader } from "react-spinners";

type SubmitButtonProps = {
  isPending: boolean;
  title?: string;
};

const SubmitButton = ({ isPending, title = "Valider" }: SubmitButtonProps) => {
  return (
    <button
      type="submit"
      disabled={isPending}
      className="w-full mt-3 p-3 rounded shadow font-bold cursor-pointer text-white bg-stormy-teal focus:ring-2 focus:ring-offset-2 focus:ring-stormy-teal uppercase flex justify-center items-center"
    >
      {isPending ? <BeatLoader color="#45d7b6" size={20} /> : title}
    </button>
  );
};

export default SubmitButton;
