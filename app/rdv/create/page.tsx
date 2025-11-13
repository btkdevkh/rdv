"use client";

import { useState } from "react";
import { createRdv } from "@/app/actions/rdv";
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
      title: formData.get("title") as string,
      withWhom: formData.get("withWhom") as string,
      date: formData.get("date") as string,
      address: formData.get("address") as string,
      userId,
    };

    const result = await createRdv(data);

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
    }
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
          <h2 className="text-2xl font-bold mb-6">Créer un RDV</h2>

          <div>
            <input
              type="text"
              id="title"
              name="title"
              required
              placeholder="Chez"
              className="w-full p-3 rounded shadow bg-white"
            />
          </div>

          <div>
            <input
              type="text"
              id="withWhom"
              name="withWhom"
              required
              placeholder="Avec"
              className="w-full p-3 rounded shadow bg-white"
            />
          </div>

          <div>
            <input
              type="datetime-local"
              id="date"
              name="date"
              required
              className="w-full p-3 rounded shadow bg-white"
            />
          </div>

          <div>
            <input
              type="text"
              id="address"
              name="address"
              required
              placeholder="Adresse"
              className="w-full p-3 rounded shadow bg-white"
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 rounded shadow font-bold uppercase cursor-pointer text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Créer
          </button>
        </form>
      </div>
    </PageWrapper>
  );
}
