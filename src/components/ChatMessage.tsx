import React from "react";

interface ChatMessageProps {
  message: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className="p-4 bg-gray-700 text-white rounded-lg shadow-md mb-4">
      <p>{message}</p>
    </div>
  );
};

export default ChatMessage;
