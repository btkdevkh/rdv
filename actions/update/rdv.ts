"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getConnectedUser } from "../auth/user";
import { UpdatePrevState } from "@/types/UpdatePrevState";

export async function updateRdv(
  prevState: UpdatePrevState,
  formData: FormData
) {
  try {
    const title = formData.get("title") as string;
    const withWhom = formData.get("withWhom") as string;
    const date = formData.get("date") as string;
    const address = formData.get("address") as string;

    if (!title || !withWhom || !date || !address) {
      throw new Error("Champs obligatoires");
    }

    const { user } = await getConnectedUser();

    if (!user) {
      throw new Error("Identification inconnu");
    }

    await prisma.rdv.update({
      where: {
        id: prevState.id,
      },
      data: {
        title,
        withWhom,
        date,
        address,
        userId: user.id,
      },
    });

    revalidatePath("/");

    return {
      ...prevState,
      success: true,
      message: "RDV modifié",
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
