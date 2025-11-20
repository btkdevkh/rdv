"use server";

import axios from "axios";
import { IChaitaiAsk } from "@/types/interfaces/IChatai";

const API_URL = process.env.NEXT_PUBLIC_CHAT_AI_API_URL!;

const createChatAi = async (data: IChaitaiAsk) => {
  try {
    const res = await axios.post(API_URL, data);

    if (res.status !== 200) {
      throw new Error("Impossible de communiquer avec le bot d'OpenAI");
    }

    const botMessage = { sender: "bot", text: res.data.answer };
    return { message: "Le bot a répondu avec success", botMessage };
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

export { createChatAi };
