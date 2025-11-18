"use server";

import { prisma } from "@/lib/prisma";

const getUsers = async () => {
  try {
    const users = await prisma.user.findMany();

    return { message: "Utilisateurs trouvés avec success", users };
  } catch (error) {
    return { error: "Une erreur s'est produit." };
  }
};

const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    return { message: "Utilisateur trouvé avec success", user };
  } catch (error) {
    return { error: "Une erreur s'est produit." };
  }
};

export { getUsers, getUserById };
