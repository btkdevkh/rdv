"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createRunning } from "@/actions/post/running";
import SubmitButton from "@/components/SubmitButton";

export default function CreateRunningForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createRunning, {
    success: false,
    message: "",
  });

  useEffect(() => {
    if (state.success) {
      setTimeout(() => router.push("/dashboard/running?order=1"), 1000);
    }
  }, [state.success]);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <h2 className="text-xl font-bold mb-3 uppercase">
        Enregistrer vos course à pied
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
        <select
          id="mode"
          name="mode"
          className="w-full p-3 shadow bg-white rounded outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stormy-teal"
        >
          <option value="treadmill">Tapis de course</option>
          <option value="outside">Dehors</option>
        </select>
      </div>

      <div>
        <input
          type="number"
          id="kilometers"
          name="kilometers"
          placeholder="Kilomètres"
          step="any"
          className="w-full p-3 shadow bg-white rounded outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stormy-teal"
        />
      </div>

      <div>
        <input
          type="text"
          id="durations"
          name="durations"
          placeholder="Temps (00:00:00)"
          className="w-full p-3 shadow bg-white rounded outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stormy-teal"
        />
      </div>

      <div>
        <input
          type="number"
          id="calories"
          name="calories"
          step="any"
          placeholder="Calories"
          className="w-full p-3 shadow bg-white rounded outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stormy-teal"
        />
      </div>

      <div>
        <input
          type="date"
          id="date"
          name="date"
          className="w-full p-3 shadow bg-white rounded outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stormy-teal"
        />
      </div>

      <SubmitButton isPending={isPending} />
    </form>
  );
}
