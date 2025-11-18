"use server";

import { prisma } from "@/lib/prisma";
import { IRdv } from "@/types/interfaces/IRdv";
import { revalidatePath } from "next/cache";

export async function createRdv(data: IRdv & { userId: string }) {
  try {
    const rdv = await prisma.rdv.create({
      data: {
        title: data.title,
        withWhom: data.withWhom,
        date: data.date,
        address: data.address,
        userId: data.userId,
      },
    });

    revalidatePath("/");
    return { message: "RDV created successfully", rdv };
  } catch (error) {
    return { error: "Failed to create RDV" };
  }
}
