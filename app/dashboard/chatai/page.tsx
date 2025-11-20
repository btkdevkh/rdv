"use client";

import { useActionState, useEffect, useRef } from "react";
import BackButton from "@/components/BackButton";
import { createChatAi } from "@/actions/post/chatai";
import { HashLoader } from "react-spinners";

const ChatAiPage = () => {
  const msgContainer = useRef<HTMLDivElement | null>(null);
  const [state, formAction, isPending] = useActionState(createChatAi, {
    message: "",
    messages: [],
    questions: [],
    error: "",
  });

  useEffect(() => {
    if (state.messages.length > 0) {
      msgContainer?.current?.scrollTo({
        top: msgContainer.current?.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [state.messages.length]);

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
          state.messages.length === 0 ? "max-w-[515px]" : ""
        } mx-auto text-graphite`}
      >
        <div className="md:flex md:gap-5 overflow-y-auto">
          {/* Historique des questions */}
          {state.questions.length > 0 && (
            <div className="bg-white rounded p-5 max-h-[87vh] h-full flex-1 mb-5 overflow-y-auto">
              <h2 className="text-2xl mb-5">Historique des questions</h2>
              <div className="flex flex-col gap-2">
                {state.questions
                  .filter((q) => q.sender === "user")
                  .map((q, i) => (
                    <span key={i} className="bg-dust-grey p-2 rounded w-fit">
                      {q.text}
                    </span>
                  ))}
              </div>
            </div>
          )}

          <div
            className="w-full h-[85vh] mx-auto flex flex-col gap-5 flex-3 overflow-y-auto"
            ref={msgContainer}
          >
            {state.messages.length === 0 && (
              <h2 className="text-3xl mb-5">
                Bonjour, comment puis-je vous aider ?
              </h2>
            )}

            <div className="flex flex-col gap-5">
              {state.messages.map((msg, i) => (
                <div
                  key={i}
                  id={msg.text.split(" ").join("-")}
                  className="flex flex-col gap-3"
                >
                  <p className="bg-white p-2 rounded w-fit">
                    {state.questions[i].text}{" "}
                  </p>
                  <p className="wrap-anywhere">{msg.text}</p>
                </div>
              ))}
            </div>

            <form
              action={formAction}
              className="flex justify-center items-center relative"
            >
              <input
                type="text"
                name="question"
                placeholder="Posez une question..."
                className="w-full p-2 border-2 border-yale-blue focus:border-stormy-teal outline-none rounded-2xl"
              />

              <button
                type="submit"
                disabled={isPending}
                className="bg-yale-blue text-white text-sm p-2 rounded-xl font-semibold hover:bg-stormy-teal transition uppercase absolute right-1"
              >
                {isPending ? (
                  <HashLoader size={20} color="#37d7b7" />
                ) : (
                  "Chatter"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAiPage;
