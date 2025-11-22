"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteChatais() {
  try {
    const chatais = await prisma.chatai.deleteMany();

    revalidatePath("/");
    return { message: "Chatais deleted successfully", chatais };
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
