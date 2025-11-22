"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "../../actions/auth/user";
import { signIn } from "next-auth/react";
import { BeatLoader } from "react-spinners";

export default function LoginForm() {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(loginUser, {
    success: false,
    message: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (state.success) {
      // Signin NextAuth
      signIn("credentials", {
        email: state.email,
        password: state.password,
        redirect: false,
      });

      setTimeout(() => router.push("/"), 1000);
    }
  }, [state.success]);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <h2 className="text-xl font-bold uppercase text-center mb-3">
        S'identifier
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
          id="email"
          name="email"
          placeholder="Email *"
          className="w-full p-3 shadow bg-white rounded outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stormy-teal"
        />
      </div>

      <div>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Mot de passe *"
          className="w-full p-3 shadow bg-white rounded outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stormy-teal"
        />
      </div>

      <button
        type="submit"
        className="w-full mt-3 p-3 rounded shadow font-bold cursor-pointer text-white bg-yale-blue hover:bg-stormy-teal focus:ring-2 focus:ring-offset-2 focus:ring-stormy-teal uppercase flex justify-center items-center"
      >
        {isPending ? <BeatLoader color="#45d7b6" size={20} /> : "S'identifier"}
      </button>

      <div className="flex justify-between items-center">
        <Link
          href="/signup"
          className="text-blue-700 underline text-left text-xs"
        >
          S'inscrire ?
        </Link>

        <Link href="/forgetpass" className="text-blue-700 underline text-xs">
          Mot de passe oublié ?
        </Link>
      </div>
    </form>
  );
}
