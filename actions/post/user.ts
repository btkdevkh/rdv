"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import { PrevState } from "@/types/PrevState";

export async function createUser(prevState: PrevState, formData: FormData) {
  try {
    const firstname = formData.get("firstname") as string;
    const lastname = formData.get("lastname") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;
    const role = formData.get("role") as string;

    if (!firstname || !lastname || !email || !password || !confirmPassword) {
      throw new Error("Champs obligatoires");
    }

    if (password !== confirmPassword) {
      throw new Error("Le mot de passe sont différents");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        password: hashedPassword,
        role: role ?? "User",
      },
    });

    revalidatePath("/");

    return {
      ...prevState,
      success: true,
      message: "Utilisateur crée avec success",
    };
  } catch (err) {
    if (err instanceof SyntaxError) {
      return { ...prevState, success: false, message: err.message as string };
    } else if (typeof err === "object" && err !== null && "message" in err) {
      return { ...prevState, success: false, message: err.message as string };
    } else {
      return {
        ...prevState,
        success: false,
        message: "Internal server error" as string,
      };
    }
  }
}
