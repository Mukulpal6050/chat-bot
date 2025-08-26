import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

const ChatMessage = ({ role, content }) => {
  // agar code block ho toh
  if (content.includes("```")) {
    const match = content.match(/```(\w+)?\n([\s\S]*?)```/);
    const language = match?.[1] || "javascript";
    const code = match?.[2] || content;

    return (
      <div
        className={`p-3 my-2 max-w-[80%] rounded-xl shadow-md ${
          role === "user"
            ? "bg-blue-600 text-white ml-auto text-right"
            : "bg-gray-800 text-gray-200 mr-auto text-left"
        }`}
      >
        <SyntaxHighlighter
          language={language}
          style={dracula}
          customStyle={{
            borderRadius: "0.75rem",
            padding: "1rem",
            fontSize: "0.9rem",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );
  }

  // normal text
  return (
    <div
      className={`p-3 my-2 max-w-[70%] rounded-xl shadow-md ${
        role === "user"
          ? "bg-blue-600 text-white ml-auto text-right"
          : "bg-gray-800 text-gray-200 mr-auto text-left"
      }`}
    >
      {content}
    </div>
  );
};

export default ChatMessage;
