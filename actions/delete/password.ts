"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getConnectedUser } from "../auth/user";

export async function deletePassword(passwordId: string) {
  try {
    const { user } = await getConnectedUser();

    if (!user) {
      throw new Error("Identification inconnu");
    }

    await prisma.password.delete({
      where: {
        id: passwordId,
      },
    });

    revalidatePath("/");
    return { success: true, message: "Mot de passe supprimé" };
  } catch (err) {
    if (err instanceof SyntaxError) {
      return { error: err.message as string };
    } else if (typeof err === "object" && err !== null && "message" in err) {
      return { error: err.message as string };
    } else {
      return { error: "Internal server error" as string };
    }
  }
}
