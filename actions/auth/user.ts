"use server";

import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LoginPrevState } from "@/types/LoginPrevState";

const loginUser = async (prevState: LoginPrevState, formData: FormData) => {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      throw new Error("Champs obligatoires");
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Identification inconnu.");
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      throw new Error("Identification inconnu.");
    }

    return {
      ...prevState,
      success: true,
      message: "Identification réussi",
      email,
      password,
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

export { loginUser, getConnectedUser };
