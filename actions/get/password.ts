import { prisma } from "@/lib/prisma";
import { getConnectedUser } from "../auth/user";

const getPasswords = async () => {
  try {
    const { user } = await getConnectedUser();

    if (!user) {
      throw new Error("Identification inconnu");
    }

    const passwords = await prisma.password.findMany({
      where: {
        userId: user.id,
      },
    });

    return { message: "Mots de passe trouvés avec success", passwords };
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

export { getPasswords };
