"use server";

import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getConnectedUser } from "../auth/user";
import { UpdatePrevState } from "@/types/UpdatePrevState";

export async function updatePassword(
  prevState: UpdatePrevState,
  formData: FormData
) {
  try {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const sites = formData.get("sites") as string;
    const note = formData.get("note") as string;

    if (!username || !password || !sites) {
      throw new Error("Champs obligatoires");
    }

    const { user } = await getConnectedUser();

    if (!user) {
      throw new Error("Identification inconnu");
    }

    const encrypted = encrypt(password);

    await prisma.password.update({
      where: {
        id: prevState.id,
      },
      data: {
        username,
        password: encrypted,
        sites: [sites],
        note,
        userId: user.id,
      },
    });

    revalidatePath("/");

    return {
      ...prevState,
      success: true,
      message: "Mot de passe modifié",
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

// Helpers
// Clé maître depuis .env
const MASTER_KEY = crypto
  .createHash("sha256")
  .update(process.env.MASTER_KEY!)
  .digest();

// Fonction de chiffrement AES-GCM
function encrypt(text: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", MASTER_KEY, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return JSON.stringify({
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    data: encrypted.toString("base64"),
  });
}
