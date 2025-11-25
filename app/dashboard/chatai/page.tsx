import BackButton from "@/components/BackButton";
import ChataiForm from "@/components/chatai/ChataiForm";
import { getChatais } from "@/actions/get/chatai";
import TabLink from "@/components/TabLink";

const ChatAiPage = async () => {
  const data = await getChatais();

  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-1">
          <TabLink url="/dashboard/chatai" title="Chat I.A" />
        </div>

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
