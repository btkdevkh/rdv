"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { forgetPass } from "@/actions/auth/user";

export default function ForgetPassPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    const email = formData.get("email") as string;

    if (!email) {
      setError("Champs obligatoires");
      setMessage("");
      return;
    }

    const result = await forgetPass(email);

    if (result.error) {
      setError(result.error);
      setMessage("");
    } else {
      if (result.message) {
        setMessage(result.message);
        setError("");
      }
      // Reset form
      const form = document.querySelector("form") as HTMLFormElement;
      form.reset();

      // router.push("/dashboard/resetpass");
    }
  }

  return (
    <div className="w-full text-graphite">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col items-center justify-center gap-5">
          <Image
            src="/logo.png"
            width={200}
            height={200}
            alt="logo"
            loading="eager"
          />

          <h2 className="text-4xl font-bold uppercase text-center">
            Daily SaaS
          </h2>

          <p>
            Mot de passe oublié ? Pas d'inquiétude, nous allons le retrouver !
          </p>
        </div>

        <form action={handleSubmit} className="flex flex-col gap-3">
          {message && (
            <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
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
            className="w-full mt-3 p-3 rounded shadow font-bold uppercase cursor-pointer text-white bg-yale-blue hover:bg-stormy-teal focus:ring-2 focus:ring-offset-2 focus:ring-stormy-teal"
          >
            Réinitialisation
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
      </div>
    </div>
  );
}
