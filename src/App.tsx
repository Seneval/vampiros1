import React, { useState } from "react";
import ChatInput from "./components/ChatInput";
import ChatMessage from "./components/ChatMessage";

const App: React.FC = () => {
  const [trust, setTrust] = useState(5); // Nivel inicial de confianza
  const [npcReply, setNpcReply] = useState("¿Quién eres? No confío en ti."); // Respuesta inicial del NPC
  const [gameOver, setGameOver] = useState(false); // Indica si el juego terminó

  // Cambia la imagen según el nivel de confianza
  const getImage = () => {
    if (trust <= 3) return "/images/trust-1-3.png";
    if (trust <= 6) return "/images/trust-5.png";
    if (trust <= 8) return "/images/trust-7-8.png";
    return "/images/trust-9-10.png";
  };

  // Maneja el envío del mensaje al backend
  const handleSendMessage = async (message: string) => {
    if (gameOver) return;

    try {
      const response = await fetch("/.netlify/functions/detectIntent", {
        method: "POST",
        body: JSON.stringify({ message, trust }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      setNpcReply(data.reply);
      setTrust(data.trust);

      // Verifica si el juego terminó
      if (data.trust >= 10) {
        setNpcReply("¡Me convenciste! Puedes entrar.");
        setGameOver(true);
      } else if (data.trust <= 0) {
        setNpcReply("No confío en ti. Nunca entrarás.");
        setGameOver(true);
      }
    } catch (error) {
      console.error("Error enviando mensaje:", error);
      setNpcReply("Hubo un problema. Intenta de nuevo.");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-800 text-white">
      <h1 className="text-4xl font-bold mb-4">Vampyr Game</h1>
      <img src={getImage()} alt="Estado de Confianza" className="w-1/3 mb-4" />
      <p className="text-xl mb-4">Nivel de confianza: {trust}</p>
      <ChatMessage message={npcReply} />
      {!gameOver && (
        <div className="mt-4 w-2/3">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      )}
      {gameOver && (
        <p className="text-lg mt-4">
          El juego ha terminado. Recarga la página para intentarlo de nuevo.
        </p>
      )}
    </div>
  );
};

export default App;
