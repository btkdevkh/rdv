"use server";

import { prisma } from "@/lib/prisma";
import { IUser } from "@/types/interfaces/IUser";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";

export async function createUser(data: IUser) {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: hashedPassword,
        role: data.role,
      },
    });

    revalidatePath("/");
    return { message: "Utilisateur créé avec success", user };
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
