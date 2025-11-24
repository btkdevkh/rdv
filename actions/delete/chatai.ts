"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getConnectedUser } from "../auth/user";

export async function deleteChatais() {
  try {
    const { user } = await getConnectedUser();

    if (!user) {
      throw new Error("Identification inconnu");
    }

    await prisma.chatai.deleteMany();

    revalidatePath("/");
    return { success: true, message: "Chats supprimés" };
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
