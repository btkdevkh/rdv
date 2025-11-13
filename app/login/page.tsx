"use client";

import { useState } from "react";
import PageWrapper from "@/components/PageWrapper";

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

        <form action={handleSubmit} className="space-y-4 p-6 rounded-md">
          <h2 className="text-2xl font-bold mb-6">S'identifier</h2>

          <div>
            <input
              type="text"
              id="email"
              name="email"
              required
              placeholder="Email"
              className="w-full p-3 rounded shadow bg-white"
            />
          </div>

          <div>
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="Mot de passe"
              className="w-full p-3 rounded shadow bg-white"
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 rounded shadow font-bold uppercase cursor-pointer text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            S'identifier
          </button>
        </form>
      </div>
    </PageWrapper>
  );
}
