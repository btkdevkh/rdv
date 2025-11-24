"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BeatLoader } from "react-spinners";
import { Password } from "@prisma/client";
import { updatePassword } from "@/actions/update/password";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

type UpdatePasswordFormProps = {
  password?: Password | null;
  decryptedPassword?: string;
};

export default function UpdatePasswordForm({
  password,
  decryptedPassword,
}: UpdatePasswordFormProps) {
  const router = useRouter();
  const [seePassword, setSeePassword] = useState(false);

  const [state, formAction, isPending] = useActionState(updatePassword, {
    id: password?.id as string,
    success: false,
    message: "",
  });

  useEffect(() => {
    if (state.success) {
      setTimeout(() => router.push("/dashboard/password"), 1000);
    }
  }, [state.success]);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <h2 className="text-xl font-bold mb-3 uppercase">
        Modifier un mot de passe
      </h2>

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
          id="username"
          name="username"
          placeholder="Username"
          defaultValue={password?.username}
          className="w-full p-3 shadow bg-white rounded outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stormy-teal"
        />
      </div>

      <div className="relative">
        <input
          type={seePassword ? "text" : "password"}
          id="password"
          name="password"
          placeholder="Password"
          defaultValue={decryptedPassword}
          className="w-full p-3 shadow bg-white rounded outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stormy-teal"
        />

        <button
          type="button"
          className="absolute top-3 right-3 cursor-pointer"
          onClick={() => setSeePassword(!seePassword)}
        >
          {seePassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
        </button>
      </div>

      <div>
        <input
          type="text"
          id="sites"
          name="sites"
          placeholder="Sites"
          defaultValue={password?.sites}
          className="w-full p-3 shadow bg-white rounded outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stormy-teal"
        />
      </div>

      <div>
        <textarea
          id="note"
          name="note"
          placeholder="Note"
          defaultValue={password?.note}
          className="w-full p-3 shadow bg-white rounded outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stormy-teal"
        />
      </div>

      <button
        type="submit"
        className="w-full mt-3 p-3 rounded shadow font-bold cursor-pointer text-white bg-yale-blue hover:bg-stormy-teal focus:ring-2 focus:ring-offset-2 focus:ring-stormy-teal uppercase flex justify-center items-center"
      >
        {isPending ? <BeatLoader color="#45d7b6" size={20} /> : "Valider"}
      </button>
    </form>
  );
}
