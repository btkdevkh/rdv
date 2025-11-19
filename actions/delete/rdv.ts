"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteRdv(rdvId: string) {
  try {
    const rdv = await prisma.rdv.delete({
      where: {
        id: rdvId,
      },
    });

    revalidatePath("/");
    return { message: "RDV deleted successfully", rdv };
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
