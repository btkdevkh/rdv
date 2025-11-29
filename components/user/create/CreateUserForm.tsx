"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { createUser } from "@/actions/post/user";
import SubmitButton from "@/components/SubmitButton";

const CreateUserForm = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [state, formAction, isPending] = useActionState(createUser, {
    success: false,
    message: "",
  });

  useEffect(() => {
    if (state.success) {
      setTimeout(() => router.push("/dashboard/user"), 1000);
    }
  }, [state.success]);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <h2 className="text-xl font-bold mb-3 uppercase">Créer un utilisateur</h2>

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

      {session?.user.role === "Admin" && (
        <div>
          <select
            id="role"
            name="role"
            className="w-full p-3 shadow bg-white rounded outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stormy-teal"
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      )}

      <SubmitButton isPending={isPending} />
    </form>
  );
};

export default CreateUserForm;
