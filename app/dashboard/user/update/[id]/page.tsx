"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IUser } from "@/types/interfaces/IUser";
import { useSession } from "next-auth/react";
import { getUserById } from "@/actions/get/user";
import { updateUser } from "@/actions/update/user";

export default function UpdateUserPage() {
  const { data: session } = useSession();

  const params = useParams();
  const userId = params.id as string;

  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    getUserById(userId).then((data) => setUser(data.user as IUser));
  }, [userId]);

  async function handleSubmit(formData: FormData) {
    if (!confirm("Souhaitez-vous continuer ?")) return;

    const firstname = formData.get("firstname") as string;
    const lastname = formData.get("lastname") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;
    const role = formData.get("role") as string;

    if (!firstname || !lastname || !email) {
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
      role: role ?? "User",
    };

    const result = await updateUser(data, userId);

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
          Modifier un utilisateur
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
            defaultValue={user?.firstname}
            className="w-full p-3 shadow bg-white rounded outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stormy-teal"
          />
        </div>

        <div>
          <input
            type="text"
            id="lastname"
            name="lastname"
            placeholder="NOM *"
            defaultValue={user?.lastname}
            className="w-full p-3 shadow bg-white rounded outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stormy-teal"
          />
        </div>

        <div>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Email *"
            defaultValue={user?.email}
            className="w-full p-3 shadow bg-white rounded outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stormy-teal"
          />
        </div>

        {user && session?.user.role === "Admin" && (
          <div>
            <select
              id="role"
              name="role"
              defaultValue={user.role}
              className="w-full p-3 shadow bg-white rounded outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stormy-teal"
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        )}

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
