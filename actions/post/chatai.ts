"use server";

import axios from "axios";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getConnectedUser } from "../auth/user";
import { IChaitaiAsk, IChatai } from "@/types/interfaces/IChatai";
import { getChatais } from "../get/chatai";

const API_URL = process.env.NEXT_PUBLIC_CHAT_AI_API_URL!;

const createChatAi = async (prevState: IChaitaiAsk, formData: FormData) => {
  try {
    const { user } = await getConnectedUser();

    if (!user) {
      throw new Error("Identification inconnu");
    }

    const question = formData.get("question") as string;

    // Get chats of user
    const history = await getChatais();
    const chatsHistory: IChatai[] = [];
    history.chatais?.forEach((chat) => {
      chatsHistory.push({ sender: "user", text: chat.question });
      chatsHistory.push({ sender: "bot", text: chat.answer! });
    });

    // User's question
    // const userQuestion = { sender: "user", text: question };
    const QA = [...prevState.messages, ...chatsHistory];

    // Data structure matched with API endpoint
    const data = {
      message: question,
      questions: QA,
    };

    const res = await axios.post(API_URL, data);

    if (res.status !== 200) {
      throw new Error("Impossible de communiquer avec API d'OpenAI");
    }

    // Bot's response
    const botAnswer = { sender: "bot", text: res.data.answer };
    const messages = [...QA, botAnswer];

    // Save to postgresql
    await prisma.chatai.create({
      data: {
        question: question,
        answer: res.data.answer,
        userId: user.id,
      },
    });

    revalidatePath("/");
    return { success: true, messages };
  } catch (err) {
    if (err instanceof SyntaxError) {
      return { ...prevState, error: err.message as string };
    } else if (typeof err === "object" && err !== null && "message" in err) {
      return { ...prevState, error: err.message as string };
    } else {
      return { ...prevState, error: "Internal server error" as string };
    }
  }
};

export { createChatAi };
