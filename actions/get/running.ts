"use server";

import { prisma } from "@/lib/prisma";
import { getConnectedUser } from "../auth/user";
import { Running } from "@prisma/client";

const getRunnings = async () => {
  try {
    const { user } = await getConnectedUser();

    if (!user) {
      throw new Error("Identification inconnu");
    }

    const runnings = await prisma.running.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, message: "Runnings trouvés", runnings };
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

const getRunningById = async (runningId: string) => {
  try {
    const { user } = await getConnectedUser();

    if (!user) {
      throw new Error("Identification inconnu");
    }

    const running = await prisma.running.findUnique({
      where: {
        id: runningId,
      },
    });

    const convertedRunning = {
      ...running,
      kilometers: running?.kilometers.toNumber(),
      calories: running?.calories.toNumber(),
    } as Running & { kilometers: number; calories: number };

    return {
      success: true,
      message: "Running trouvé",
      running: convertedRunning,
    };
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

export { getRunnings, getRunningById };
