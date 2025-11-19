"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteUser(userId: string) {
  try {
    const user = await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    revalidatePath("/");
    return { message: "User deleted successfully", user };
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
