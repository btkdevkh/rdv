"use server";

import { prisma } from "@/lib/prisma";
import { IUser } from "@/types/interfaces/IUser";
import { revalidatePath } from "next/cache";

export async function updateUser(data: IUser, userId: string) {
  try {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        role: data.role,
      },
    });

    revalidatePath("/");
    return { message: "Utilisateur modifié avec success", user };
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
