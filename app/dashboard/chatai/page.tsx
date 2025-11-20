"use client";

import { useState } from "react";
import BackButton from "@/components/BackButton";
import { createChatAi } from "@/actions/post/chatai";
import { IChatai } from "@/types/interfaces/IChatai";
import SubmitButton from "@/components/SubmitButton";

const ChatAiPage = () => {
  const [messages, setMessages] = useState<IChatai[]>([]);

  const handleSubmit = async (formData: FormData) => {
    const question = formData.get("question") as string;

    if (!question) {
      return alert("Veuillez entrer un message.");
    }

    const userMessage = { sender: "user", text: question };
    setMessages([...messages, userMessage]);

    const result = await createChatAi({
      message: question,
      replyHistory: messages,
    });

    if (result.error) {
      console.log(result.error);
      window.alert(result.error);
    } else {
      if (result.botMessage) {
        setMessages((prev) => [...prev, result.botMessage]);
      }
    }
  };

  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-3">
        <span className="text-graphite font-semibold uppercase border-b-2 border-stormy-teal">
          Chat AI
        </span>

        <BackButton />
      </div>

      <div
        className={`${
          messages.length === 0 ? "max-w-[515px]" : ""
        } mx-auto text-graphite`}
      >
        <div className="md:flex md:gap-5">
          {/* Historique des questions */}
          {messages.length > 0 && (
            <div className="bg-white rounded px-4 py-5 max-h-[87vh] h-full flex-1 mb-5 overflow-y-auto">
              <h2 className="text-2xl mb-5">Historique des questions</h2>
              <div className="flex flex-col gap-2">
                {messages
                  .filter((msg) => msg.sender === "user")
                  .map((msg, i) => (
                    <span key={i} className="bg-dust-grey p-2 rounded w-fit">
                      {msg.text}
                    </span>
                  ))}
              </div>
            </div>
          )}

          <div className="w-full mx-auto flex flex-col gap-3 flex-3">
            {messages.length === 0 && (
              <h2 className="text-3xl mb-5">
                Bonjour, comment puis-je vous aider ?
              </h2>
            )}

            <div className="flex flex-col gap-3">
              {messages.map((msg, i) => (
                <div key={i} id={msg.text.split(" ").join("-")}>
                  <p
                    className={`wrap-anywhere ${
                      msg.sender === "user"
                        ? "bg-white p-2 rounded w-fit"
                        : "p-1"
                    }`}
                  >
                    {msg.text}
                  </p>
                </div>
              ))}
            </div>

            <form
              action={handleSubmit}
              className="flex justify-center items-center relative"
            >
              <input
                type="text"
                name="question"
                placeholder="Posez une question..."
                className="w-full p-2 border-2 border-yale-blue focus:border-stormy-teal outline-none rounded-2xl"
              />

              <SubmitButton title="Chatter" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAiPage;
