"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "@/actions/create/user";
import { IUser } from "@/types/interfaces/IUser";

export default function CreateUserPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    const firstname = formData.get("firstname") as string;
    const lastname = formData.get("lastname") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    if (!firstname || !lastname || !email || !password || !confirmPassword) {
      setError("Champs obligatoires");
      setMessage("");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les deux mots de passe ne sont pas les mêmes");
      setMessage("");
      return;
    }

    const data: IUser = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password,
      role: "User",
    };

    const result = await createUser(data);

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

      router.push("/dashboard/user");
    }
  }

  return (
    <div className="w-full text-graphite">
      <form action={handleSubmit} className="flex flex-col gap-3">
        <h2 className="text-xl font-bold mb-3 uppercase">
          Créer un utilisateur
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
            id="firstname"
            name="firstname"
            placeholder="Prénom *"
            className="w-full p-3 shadow bg-white rounded outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stormy-teal"
          />
        </div>

        <div>
          <input
            type="text"
            id="lastname"
            name="lastname"
            placeholder="NOM *"
            className="w-full p-3 shadow bg-white rounded outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stormy-teal"
          />
        </div>

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

        <div>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            placeholder="Confirmer le mot de passe *"
            className="w-full p-3 shadow bg-white rounded outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stormy-teal"
          />
        </div>

        <button
          type="submit"
          className="w-full mt-3 p-3 rounded shadow font-bold cursor-pointer text-white bg-yale-blue hover:bg-stormy-teal focus:ring-2 focus:ring-offset-2 focus:ring-stormy-teal uppercase"
        >
          Valider
        </button>
      </form>
    </div>
  );
}
