import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { toString } from "hast-util-to-string";
import { Chatai } from "@prisma/client";
import { MdOutlineContentCopy } from "react-icons/md";
import "highlight.js/styles/atom-one-dark.css";

type ChataiResponseHistoryProps = {
  messages: Chatai[];
};

const ChataiResponseHistory = ({ messages }: ChataiResponseHistoryProps) => {
  return (
    <>
      {messages.map((msg, i) => (
        <div key={i} className="flex flex-col gap-3">
          <p className="bg-white py-2 px-4 w-fit rounded shadow">
            {msg.question}
          </p>

          <ReactMarkdown
            rehypePlugins={[rehypeHighlight]}
            components={{
              code({ node, className, children, ...props }) {
                if (!node) return;
                const codeText = toString(node);

                return (
                  <code
                    className={`${className} rounded my-1 relative`}
                    {...props}
                  >
                    {node.children.some((c) => c.type !== "text") &&
                      node.tagName === "code" && (
                        <button
                          title="copier"
                          className="text-white absolute top-2 right-2 rounded cursor-pointer hover:text-dust-grey"
                          onClick={() => {
                            window.navigator.clipboard.writeText(codeText);
                          }}
                        >
                          <MdOutlineContentCopy />
                        </button>
                      )}

                    {children}
                  </code>
                );
              },
            }}
          >
            {msg.answer}
          </ReactMarkdown>
        </div>
      ))}
    </>
  );
};

export default ChataiResponseHistory;
