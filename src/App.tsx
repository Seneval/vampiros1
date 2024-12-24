import React, { useState } from "react";

const App: React.FC = () => {
  const [trust, setTrust] = useState(5); // Nivel inicial de confianza
  const [npcReply, setNpcReply] = useState("¿Quién eres? No confío en ti."); // Respuesta inicial del NPC
  const [userMessage, setUserMessage] = useState(""); // Mensaje del usuario
  const [gameOver, setGameOver] = useState(false); // Estado del juego

  // Cambia la imagen según el nivel de confianza
  const getImage = () => {
    if (trust <= 3) return "/images/trust-1-3.png";
    if (trust <= 6) return "/images/trust-5.png";
    if (trust <= 8) return "/images/trust-7-8.png";
    return "/images/trust-9-10.png";
  };

  // Maneja el envío del mensaje
  const handleSendMessage = async () => {
    if (!userMessage.trim() || gameOver) return;

    try {
      // Paso 1: Envía el mensaje al asistente
      const response = await fetch("/.netlify/functions/sendMessage", {
        method: "POST",
        body: JSON.stringify({ message: userMessage }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      setNpcReply(data.reply); // Actualiza la respuesta del NPC

      // Paso 2: Detecta la intención y ajusta la confianza
      const intentResponse = await fetch("/.netlify/functions/detectIntent", {
        method: "POST",
        body: JSON.stringify({ reply: data.reply, currentTrust: trust }),
        headers: { "Content-Type": "application/json" },
      });

      const intentData = await intentResponse.json();
      setTrust(intentData.newTrust); // Actualiza la confianza

      // Verifica si el juego ha terminado
      if (intentData.newTrust >= 10) {
        setGameOver(true);
        setNpcReply("¡Me convenciste! Puedes entrar.");
      } else if (intentData.newTrust <= 0) {
        setGameOver(true);
        setNpcReply("No confío en ti. Nunca entrarás.");
      }
    } catch (error) {
      console.error("Error enviando mensaje:", error);
      setNpcReply("Hubo un problema. Intenta de nuevo.");
    }

    setUserMessage(""); // Limpia el input
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-800 text-white">
      <h1 className="text-4xl font-bold mb-4">Vampyr Game</h1>
      <img src={getImage()} alt="Estado de Confianza" className="w-1/3 mb-4" />
      <p className="text-xl mb-4">Nivel de confianza: {trust}</p>
      <p className="text-lg mb-4">NPC dice: "{npcReply}"</p>

      {!gameOver && (
        <div className="flex flex-col items-center gap-4">
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="p-2 w-2/3 bg-gray-700 border border-gray-600 rounded text-white"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-400"
          >
            Enviar
          </button>
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
