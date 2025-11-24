"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getConnectedUser } from "../auth/user";

export async function deleteRdv(rdvId: string) {
  try {
    const { user } = await getConnectedUser();

    if (!user) {
      throw new Error("Identification inconnu");
    }

    await prisma.rdv.delete({
      where: {
        id: rdvId,
      },
    });

    revalidatePath("/");
    return { success: true, message: "RDV supprimé" };
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
