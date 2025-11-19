"use server";

import { prisma } from "@/lib/prisma";
import { getConnectedUser } from "../auth/user";

const getRdvs = async () => {
  try {
    const { user } = await getConnectedUser();

    if (!user) {
      throw new Error("Identification inconnu");
    }

    const rdvs = await prisma.rdv.findMany({
      where: {
        userId: user.id,
      },
    });

    return { message: "Rdvs trouvés avec success", rdvs };
  } catch (err) {
    if (err instanceof SyntaxError) {
      return { error: err.message as string };
    } else if (typeof err === "object" && err !== null && "message" in err) {
      return { error: err.message as string };
    } else {
      return { error: "Internal server error" as string };
    }
  }
};

const getRdvById = async (rdvId: string) => {
  try {
    const { user } = await getConnectedUser();

    if (!user) {
      throw new Error("Identification inconnu");
    }

    const rdv = await prisma.rdv.findUnique({
      where: {
        id: rdvId,
      },
    });

    return { message: "Rdv modifié avec success", rdv };
  } catch (err) {
    if (err instanceof SyntaxError) {
      return { error: err.message as string };
    } else if (typeof err === "object" && err !== null && "message" in err) {
      return { error: err.message as string };
    } else {
      return { error: "Internal server error" as string };
    }
  }
};

export { getRdvs, getRdvById };
