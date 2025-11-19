"use server";

import { prisma } from "@/lib/prisma";
import { IRdv } from "@/types/interfaces/IRdv";
import { revalidatePath } from "next/cache";

export async function updateRdv(
  data: IRdv & { userId: string },
  rdvId: string
) {
  try {
    const rdv = await prisma.rdv.update({
      where: {
        id: rdvId,
      },
      data: {
        title: data.title,
        withWhom: data.withWhom,
        date: data.date,
        address: data.address,
        userId: data.userId,
      },
    });

    revalidatePath("/");
    return { message: "RDV modifié avec success", rdv };
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
