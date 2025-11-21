"use client";

import { useState } from "react";
import { createRdv } from "@/actions/post/rdv";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CreateRdvPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    const data = {
      title: formData.get("title") as string,
      withWhom: formData.get("withWhom") as string,
      date: formData.get("date") as string,
      address: formData.get("address") as string,
      userId: session?.user.id as string,
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

      router.push("/dashboard/rdv");
    }
  }

  return (
    <div className="w-full text-graphite">
      <form action={handleSubmit} className="flex flex-col gap-3">
        <h2 className="text-xl font-bold mb-3 uppercase">
          Créer un Rendez-vous
        </h2>

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
            id="title"
            name="title"
            required
            placeholder="Titre de RDV"
            className="w-full p-3 shadow bg-white rounded outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stormy-teal"
          />
        </div>

        <div>
          <input
            type="text"
            id="withWhom"
            name="withWhom"
            required
            placeholder="Avec qui ?"
            className="w-full p-3 shadow bg-white rounded outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stormy-teal"
          />
        </div>

        <div>
          <input
            type="datetime-local"
            id="date"
            name="date"
            required
            className="w-full p-3 shadow bg-white rounded outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stormy-teal"
          />
        </div>

        <div>
          <input
            type="text"
            id="address"
            name="address"
            required
            placeholder="Adresse de RDV"
            className="w-full p-3 shadow bg-white rounded outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stormy-teal"
          />
        </div>

        <button
          type="submit"
          className="w-full p-3 rounded shadow font-bold uppercase cursor-pointer text-white bg-yale-blue hover:bg-stormy-teal focus:ring-2 focus:ring-offset-2 focus:ring-stormy-teal"
        >
          Valider
        </button>
      </form>
    </div>
  );
}
