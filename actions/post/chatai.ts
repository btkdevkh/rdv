"use server";

import axios from "axios";
import { IChaitaiAsk } from "@/types/interfaces/IChatai";

const API_URL = process.env.NEXT_PUBLIC_CHAT_AI_API_URL!;

const createChatAi = async (prevState: IChaitaiAsk, formData: FormData) => {
  try {
    const question = formData.get("question") as string;

    // User's question
    const userQuestion = { sender: "user", text: question };
    const questions = [...prevState.questions, userQuestion];

    // Data structure matched with API endpoint
    const data = {
      message: question,
      questions: questions,
    };

    const res = await axios.post(API_URL, data);

    if (res.status !== 200) {
      throw new Error("Impossible de communiquer avec le bot d'OpenAI");
    }

    // Bot's response
    const message = {
      sender: "bot",
      text: res.data.answer,
    };
    const messages = [...prevState.messages, message];

    return {
      message: "Le bot a répondu avec success",
      messages,
      questions,
    };
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
