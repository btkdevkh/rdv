"use server";

import { prisma } from "@/lib/prisma";
import { IUser } from "@/types/interfaces/IUser";
import { UpdatePrevState } from "@/types/UpdatePrevState";
import { revalidatePath } from "next/cache";

export async function updateUser(
  prevState: UpdatePrevState,
  formData: FormData
) {
  try {
    const firstname = formData.get("firstname") as string;
    const lastname = formData.get("lastname") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;
    const role = formData.get("role") as string;

    if (!firstname || !lastname || !email) {
      throw new Error("Champs obligatoires");
    }

    if (password !== confirmPassword) {
      throw new Error("Le mot de passe sont différents");
    }

    const data: IUser = {
      id: prevState.id,
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password,
      role: role ?? "User",
    };

    await prisma.user.update({
      where: {
        id: data.id,
      },
      data: {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        role: data.role,
      },
    });

    revalidatePath("/");

    return {
      ...prevState,
      success: true,
      message: "Utilisateur modifié avec success",
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
