"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BeatLoader } from "react-spinners";

export default function ForgetPassForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    () => {
      return {
        success: true,
        message: "@todo",
      };
    },
    {
      success: false,
      message: "@todo",
    }
  );

  return (
    <form action={formAction} className="flex flex-col gap-3">
      {state.success && state.message && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {state.message}
        </div>
      )}

      {!state.success && state.message && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {state.message}
        </div>
      )}

      <div>
        <input
          type="text"
          id="email"
          name="email"
          placeholder="Email *"
          className="w-full p-3 shadow bg-white rounded outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stormy-teal"
        />
      </div>

      <button
        type="submit"
        className="w-full mt-3 p-3 rounded shadow font-bold cursor-pointer text-white bg-yale-blue hover:bg-stormy-teal focus:ring-2 focus:ring-offset-2 focus:ring-stormy-teal uppercase flex justify-center items-center"
      >
        {isPending ? (
          <BeatLoader color="#45d7b6" size={20} />
        ) : (
          "Réinitialisation"
        )}
      </button>

      <div className="flex justify-between items-center">
        <Link
          href="/login"
          className="text-blue-700 underline text-left text-xs"
        >
          Retour
        </Link>
      </div>
    </form>
  );
}
