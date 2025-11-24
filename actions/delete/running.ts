"use server";

import { prisma } from "@/lib/prisma";
import { getConnectedUser } from "../auth/user";
import { revalidatePath } from "next/cache";

const deleteRunning = async (runningId: string) => {
  try {
    const { user } = await getConnectedUser();

    if (!user) {
      throw new Error("Identification inconnu");
    }

    await prisma.running.delete({
      where: {
        id: runningId,
      },
    });

    revalidatePath("/");
    return { success: true, message: "Runnings supprimé" };
  } catch (err) {
    if (err instanceof SyntaxError) {
      return { error: err.message as string };
    } else if (typeof err === "object" && err !== null && "message" in err) {
      return { error: err.message as string };
    } else {
      return { error: "Internal server error" as string };
    }
  }
};

export { deleteRunning };
