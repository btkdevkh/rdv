"use client";

import { useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import Image from "next/image";
import Link from "next/link";

export default function CreateRdvPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    const userId = parseInt(formData.get("userId") as string);
    if (!userId) {
      setError("Please select a user");
      setMessage("");
      return;
    }

    const data = {
      title: formData.get("email") as string,
      withWhom: formData.get("password") as string,
    };
  }

  return (
    <PageWrapper>
      <div className="md:w-lg mx-auto w-full p-4 text-black">
        <br />
        <br />
        <br />

        <div className="flex justify-center">
          <Image
            src="/logo.png"
            width={200}
            height={200}
            alt="logo"
            loading="eager"
          />
        </div>

        <br />

        <h2 className="text-2xl font-bold mb-6 uppercase text-center">
          S'identifier
        </h2>

        <form
          action={handleSubmit}
          className="space-y-4 p-6 bg-white rounded-2xl"
        >
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
              required
              placeholder="Email"
              className="w-full p-3 shadow bg-[#D9D9D9] rounded-xl outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3C6E71]"
            />
          </div>

          <div>
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="Mot de passe"
              className="w-full p-3 shadow bg-[#D9D9D9] rounded-xl outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3C6E71]"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-3 p-3.5 rounded-xl shadow font-bold uppercase cursor-pointer text-white bg-[#284B63] hover:bg-[#3C6E71] focus:ring-2 focus:ring-offset-2 focus:ring-[#3C6E71]"
          >
            S'identifier
          </button>
        </form>

        <br />

        <Link href="#" className="block text-center">
          Mot de passe oublié ?
        </Link>
      </div>
    </PageWrapper>
  );
}
