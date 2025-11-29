"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/actions/auth/user";
import SubmitButton from "../SubmitButton";

type ResetPassFormProps = {
  token?: string | string[] | null;
};

export default function ResetPassForm({ token }: ResetPassFormProps) {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(resetPassword, {
    token: token as string,
    success: false,
    message: "",
  });

  useEffect(() => {
    if (state.success) {
      setTimeout(() => router.push("/login"), 1000);
    }
  }, [state.success]);

  return (
    <form action={formAction} className="flex flex-col gap-3">
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
          type="password"
          id="password"
          name="password"
          placeholder="Nouveau mot de passe *"
          className="w-full p-3 shadow bg-white rounded outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stormy-teal"
        />
      </div>
      <div>
        <input
          type="password"
          id="confirm-password"
          name="confirm-password"
          placeholder="Confirmer le nouveau mot de passe *"
          className="w-full p-3 shadow bg-white rounded outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stormy-teal"
        />
      </div>

      <SubmitButton isPending={isPending} title="Réinitialisation" />

      <div className="flex justify-between items-center">
        <Link
          href="/login"
          className="text-blue-700 underline text-left text-xs"
        >
          Retour
        </Link>
      </div>
    </form>
  );
}
