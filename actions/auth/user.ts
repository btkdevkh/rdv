"use server";

import bcrypt from "bcrypt";
import { randomBytes, createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LoginPrevState } from "@/types/LoginPrevState";
import { getUserByEmail, getUserById } from "../get/user";
import { PrevState } from "@/types/PrevState";
import nodemailer from "nodemailer";
import { addHours } from "date-fns";

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
      throw new Error("Identification inconnu");
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      throw new Error("Identification inconnu");
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
      throw new Error("Identification inconnu");
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

// FORGET PASSWORD
const forgetPassword = async (prevState: PrevState, formData: FormData) => {
  try {
    const email = formData.get("email") as string;

    if (!email) {
      throw new Error("Champs obligatoires");
    }

    const { user } = await getUserByEmail(email);

    if (!user) {
      throw new Error("Identification inconnu");
    }

    // Generate token
    const token = randomBytes(32).toString("hex");
    const hashedToken = createHash("sha256").update(token).digest("hex");
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/resetpass?token=${token}`;

    // Save in DB
    await prisma.passwordResetToken.create({
      data: {
        token: hashedToken,
        expiresAt: addHours(new Date(), 1),
        used: false,
        userId: user.id,
      },
    });

    // Création du transport SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.NEXT_PUBLIC_SMTP_HOST,
      port: Number(process.env.NEXT_PUBLIC_SMTP_PORT),
      secure: false, // use TLS (STARTTLS) on port 587
      auth: {
        user: process.env.NEXT_PUBLIC_SMTP_USER,
        pass: process.env.NEXT_PUBLIC_SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Support" <${process.env.NEXT_PUBLIC_SMTP_USER}>`,
      to: email,
      subject: "Réinitialisation de votre mot de passe",
      html: `
        <p>Pour réinitialiser votre mot de passe, cliquez ici :</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Ce lien expire dans 1 heure.</p>
      `,
    });

    return {
      ...prevState,
      success: true,
      message:
        "Un lien de réinitialisation de mot de passe a été envoyé dans votre boîte e-mail.",
    };
  } catch (err) {
    if (err instanceof SyntaxError) {
      return { ...prevState, message: err.message as string };
    } else if (typeof err === "object" && err !== null && "message" in err) {
      return { ...prevState, message: err.message as string };
    } else {
      return { ...prevState, message: "Internal server error" as string };
    }
  }
};

// RESET PASSWORD
const resetPassword = async (
  prevState: PrevState & { token: string },
  formData: FormData
) => {
  try {
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    if (!password || !confirmPassword) {
      throw new Error("Champs obligatoires");
    }

    if (password.length < 8) {
      throw new Error("Le mot de passe doit avoir 8 caratères minimum");
    }

    if (password !== confirmPassword) {
      throw new Error("Les mots de pas ne sont pas identiques");
    }

    // Rehash token to compare
    const hashedTokenToCompare = createHash("sha256")
      .update(prevState.token)
      .digest("hex");

    const tokenRecord = await prisma.passwordResetToken.findFirst({
      where: {
        token: hashedTokenToCompare,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!tokenRecord) {
      throw new Error("Token invalide ou expiré");
    }

    // Update PasswordResetToken table
    await prisma.passwordResetToken.update({
      where: { id: tokenRecord.id },
      data: { used: true },
    });

    // Update User table
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: tokenRecord.userId },
      data: { password: hashedPassword },
    });

    const { user } = await getUserById(tokenRecord.userId);

    if (!user) {
      throw new Error("Identification inconnu");
    }

    // Création du transport SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.NEXT_PUBLIC_SMTP_HOST,
      port: Number(process.env.NEXT_PUBLIC_SMTP_PORT),
      secure: false, // use TLS (STARTTLS) on port 587
      auth: {
        user: process.env.NEXT_PUBLIC_SMTP_USER,
        pass: process.env.NEXT_PUBLIC_SMTP_PASS,
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/login`;

    await transporter.sendMail({
      from: `"Support" <${process.env.NEXT_PUBLIC_SMTP_USER}>`,
      to: user.email,
      subject: "Réinitialisation de votre mot de passe",
      html: `
        <p>Votre nouveau mot de passe a bien été réinitialisé.</p>
        <p>Pour s'identifier, cliquez ici :</p>
        <a href="${resetUrl}">${resetUrl}</a>
      `,
    });

    return {
      ...prevState,
      success: true,
      message: "Un lien de confirmation a été envoyé dans votre boîte e-mail.",
    };
  } catch (err) {
    if (err instanceof SyntaxError) {
      return { ...prevState, message: err.message as string };
    } else if (typeof err === "object" && err !== null && "message" in err) {
      return { ...prevState, message: err.message as string };
    } else {
      return { ...prevState, message: "Internal server error" as string };
    }
  }
};

export { loginUser, getConnectedUser, forgetPassword, resetPassword };
