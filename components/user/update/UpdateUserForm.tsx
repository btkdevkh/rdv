"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { updateUser } from "@/actions/update/user";
import { User } from "@prisma/client";
import { BeatLoader } from "react-spinners";

type UpdateUserFormProps = {
  user?: User | null;
};

const UpdateUserForm = ({ user }: UpdateUserFormProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  const [state, formAction, isPending] = useActionState(updateUser, {
    id: user?.id as string,
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
      <h2 className="text-xl font-bold mb-3 uppercase">
        Modifier un utilisateur
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
        className="w-full mt-3 p-3 rounded shadow font-bold cursor-pointer text-white bg-yale-blue hover:bg-stormy-teal focus:ring-2 focus:ring-offset-2 focus:ring-stormy-teal uppercase flex justify-center items-center"
      >
        {isPending ? <BeatLoader color="#45d7b6" size={20} /> : "Valider"}
      </button>
    </form>
  );
};

export default UpdateUserForm;
