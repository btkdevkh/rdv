"use server";

import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getConnectedUser } from "../auth/user";
import { PrevState } from "@/types/PrevState";

export async function createPassword(prevState: PrevState, formData: FormData) {
  try {
    const { user } = await getConnectedUser();

    if (!user) {
      throw new Error("Identification inconnu");
    }

    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const sites = formData.get("sites") as string;
    const note = formData.get("note") as string;

    if (!username || !password || !sites) {
      throw new Error("Champs obligatoires");
    }

    if (password.length < 8) {
      throw new Error("Le mot de passe doit avoir 8 caratères minimum");
    }

    const encrypted = encrypt(password);

    await prisma.password.create({
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
      message: "Mot de passe crée avec success",
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
  .update(process.env.NEXT_PUBLIC_MASTER_KEY!)
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

// Fonction de déchiffrement
function decrypt(jsonEncrypted: string) {
  const obj = JSON.parse(jsonEncrypted);
  const iv = Buffer.from(obj.iv, "base64");
  const tag = Buffer.from(obj.tag, "base64");
  const encryptedData = Buffer.from(obj.data, "base64");

  const decipher = crypto.createDecipheriv("aes-256-gcm", MASTER_KEY, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([
    decipher.update(encryptedData),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}
