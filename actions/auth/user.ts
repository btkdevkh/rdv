"use server";

import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

const loginUser = async (data: { email: string; password: string }) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new Error("L'utilisateur n'existe pas");
    }

    const matched = await bcrypt.compare(data.password, user.password);

    if (!matched) {
      throw new Error("Le mot de passe incorrect");
    }

    return { message: "Utilisateur trouvé avec success", user };
  } catch (error) {
    return { error: "Une erreur s'est produit." };
  }
};

const forgetPass = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new Error("L'utilisateur n'existe pas");
    }

    return { message: "Utilisateur trouvé avec success", user };
  } catch (error) {
    return { error: "Une erreur s'est produit." };
  }
};

export { loginUser, forgetPass };
