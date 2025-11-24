"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getConnectedUser } from "../auth/user";
import { PrevState } from "@/types/PrevState";

export async function createRunning(prevState: PrevState, formData: FormData) {
  try {
    const { user } = await getConnectedUser();

    if (!user) {
      throw new Error("Identification inconnu");
    }

    const mode = formData.get("mode") as string;
    const kilometers = formData.get("kilometers") as string;
    const durations = formData.get("durations") as string;
    const calories = formData.get("calories") as string;
    const date = formData.get("date") as string;

    if (!mode || !kilometers || !durations || !calories || !date) {
      throw new Error("Champs obligatoires");
    }

    await prisma.running.create({
      data: {
        mode,
        kilometers: new Prisma.Decimal(Number(kilometers)),
        durations: durations,
        calories: new Prisma.Decimal(Number(calories)),
        date,
        userId: user.id,
      },
    });

    revalidatePath("/");

    return {
      ...prevState,
      success: true,
      message: "Running crée",
    };
  } catch (err) {
    if (err instanceof SyntaxError) {
      return { ...prevState, success: false, message: err.message as string };
    } else if (typeof err === "object" && err !== null && "message" in err) {
      return { ...prevState, success: false, message: err.message as string };
    } else {
      return {
        ...prevState,
        success: false,
        message: "Internal server error" as string,
      };
    }
  }
}
