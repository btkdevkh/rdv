import crypto from "crypto";
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

    const formatedPasswords = passwords.map((password) => {
      return {
        ...password,
        password: decrypt(password.password),
      };
    });

    return {
      success: true,
      message: "Mots de passe trouvés",
      passwords: formatedPasswords,
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

const getPasswordById = async (passwordId: string) => {
  try {
    const { user } = await getConnectedUser();

    if (!user) {
      throw new Error("Identification inconnu");
    }

    const password = await prisma.password.findUnique({
      where: {
        id: passwordId,
      },
    });

    const decryptedPassword = decrypt(password?.password as string);

    return {
      success: true,
      message: "Mot de passe trouvé",
      password,
      decryptedPassword,
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

export { getPasswords, getPasswordById };

// Helpers
// Clé maître depuis .env
const MASTER_KEY = crypto
  .createHash("sha256")
  .update(process.env.NEXT_PUBLIC_MASTER_KEY!)
  .digest();

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
