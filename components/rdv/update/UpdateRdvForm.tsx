"use client";

import { useActionState, useEffect } from "react";
import { Rdv } from "@prisma/client";
import { useRouter } from "next/navigation";
import { BeatLoader } from "react-spinners";
import { updateRdv } from "@/actions/update/rdv";

type UpdateRdvFormProps = {
  rdv?: Rdv | null;
};

export default function UpdateRdvForm({ rdv }: UpdateRdvFormProps) {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(updateRdv, {
    id: rdv?.id as string,
    success: false,
    message: "",
  });

  useEffect(() => {
    if (state.success) {
      setTimeout(() => router.push("/dashboard/rdv"), 1000);
    }
  }, [state.success]);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <h2 className="text-xl font-bold mb-3 uppercase">
        Modifier un Rendez-vous
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
          id="title"
          name="title"
          defaultValue={rdv?.title}
          placeholder="Titre de RDV"
          className="w-full p-3 shadow bg-white rounded outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stormy-teal"
        />
      </div>

      <div>
        <input
          type="text"
          id="withWhom"
          name="withWhom"
          defaultValue={rdv?.withWhom}
          placeholder="Avec qui ?"
          className="w-full p-3 shadow bg-white rounded outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stormy-teal"
        />
      </div>

      <div>
        <input
          type="datetime-local"
          id="date"
          name="date"
          lang="fr"
          defaultValue={rdv?.date}
          className="w-full p-3 shadow bg-white rounded outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stormy-teal"
        />
      </div>

      <div>
        <input
          type="text"
          id="address"
          name="address"
          defaultValue={rdv?.address}
          placeholder="Adresse de RDV"
          className="w-full p-3 shadow bg-white rounded outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stormy-teal"
        />
      </div>

      <button
        type="submit"
        className="w-full mt-3 p-3 rounded shadow font-bold cursor-pointer text-white bg-yale-blue hover:bg-stormy-teal focus:ring-2 focus:ring-offset-2 focus:ring-stormy-teal uppercase flex justify-center items-center"
      >
        {isPending ? <BeatLoader color="#45d7b6" size={20} /> : "Valider"}
      </button>
    </form>
  );
}
