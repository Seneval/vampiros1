import React, { useState } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim() === "") return; // Validación para evitar mensajes vacíos
    onSendMessage(inputValue); // Envía el mensaje al padre (App)
    setInputValue(""); // Limpia el campo de texto
  };

  return (
    <div className="flex items-center gap-4">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Escribe tu mensaje..."
        className="p-2 w-full bg-gray-700 border border-gray-600 rounded text-white"
      />
      <button
        onClick={handleSend}
        className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-400"
      >
        Enviar
      </button>
    </div>
  );
};

export default ChatInput;
