"use client";

import { useFormStatus } from "react-dom";
import { HashLoader } from "react-spinners";

type SubmitButtonProps = {
  title: string;
};

const SubmitButton = ({ title }: SubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-yale-blue text-white text-sm p-2 rounded-xl font-semibold hover:bg-stormy-teal transition uppercase absolute right-1"
    >
      {pending ? <HashLoader size={20} color="#37d7b7" /> : title}
    </button>
  );
};

export default SubmitButton;
