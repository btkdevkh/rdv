"use server";

import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const loginUser = async (data: { email: string; password: string }) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new Error("Identification inconnu.");
    }

    const matched = await bcrypt.compare(data.password, user.password);

    if (!matched) {
      throw new Error("Identification inconnu.");
    }

    return { message: "Identification réussi", user };
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

const forgetPass = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new Error("Identification inconnu.");
    }

    return { message: "Identification réussi", user };
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

const getConnectedUser = async () => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new Error("Identification inconnu.");
    }

    return { message: "Identification réussi", user: session.user };
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

export { loginUser, forgetPass, getConnectedUser };
