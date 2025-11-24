import BackButton from "@/components/BackButton";
import ChataiForm from "@/components/chatai/ChataiForm";
import { getChatais } from "@/actions/get/chatai";

const ChatAiPage = async () => {
  const data = await getChatais();

  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-3">
        <span className="text-graphite font-semibold uppercase border-b-2 border-stormy-teal">
          Chat I.A
        </span>
        <BackButton />
      </div>

      <div
        className={`${
          data.chatais && data.chatais.length === 0 ? "max-w-[600px]" : ""
        } mx-auto text-graphite`}
      >
        <ChataiForm messages={data?.chatais ?? []} />
      </div>
    </div>
  );
};

export default ChatAiPage;
