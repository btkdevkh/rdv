import { Chatai } from "@prisma/client";
import ActionButton from "../ActionButton";
import { RiDeleteBin6Line } from "react-icons/ri";
import { deleteChatais } from "@/actions/delete/chatai";

type ChataiQuestionHistoryProps = {
  messages: Chatai[];
};

const ChataiQuestionHistory = ({ messages }: ChataiQuestionHistoryProps) => {
  return (
    <>
      {messages.length > 0 && (
        <div className="bg-white p-5 max-h-[87vh] h-full flex-1 mb-5 overflow-y-auto rounded shadow relative">
          <h2 className="text-2xl mb-5">Historique des questions</h2>
          <div className="flex flex-col gap-2">
            {messages.map((msg, i) => (
              <span key={i} className="bg-dust-grey p-2 rounded text-sm w-fit">
                {msg.question}
              </span>
            ))}
          </div>

          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <ActionButton handler={deleteChatais}>
              <div className="bg-[rgb(0,0,0,0.1)] hover:bg-[rgb(0,0,0,0.3)] rounded-full p-2 transition">
                <RiDeleteBin6Line size={15} color="crimson" />
              </div>
            </ActionButton>
          </div>
        </div>
      )}
    </>
  );
};

export default ChataiQuestionHistory;
