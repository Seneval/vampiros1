import React, { useState } from 'react';

const App: React.FC = () => {
  const [trust, setTrust] = useState(5); // Nivel inicial de confianza
  const [npcReply, setNpcReply] = useState("¿Quién eres? No confío en ti."); // Respuesta del NPC
  const [userMessage, setUserMessage] = useState(""); // Mensaje del usuario

  // Cambia la imagen según el nivel de confianza
  const getImage = () => {
    if (trust <= 3) return '/images/trust-1-3.png';
    if (trust <= 6) return '/images/trust-5.png';
    if (trust <= 8) return '/images/trust-7-8.png';
    return '/images/trust-9-10.png';
  };

  // Simula el envío del mensaje al NPC y la actualización del trust
  const handleSendMessage = () => {
    if (!userMessage) return;

    // Lógica simple para cambiar el trust según el mensaje
    let newTrust = trust;
    if (userMessage.toLowerCase().includes("por favor")) {
      newTrust = Math.min(10, trust + 2); // Aumenta el trust
      setNpcReply("Bueno, eso suena convincente.");
    } else if (userMessage.toLowerCase().includes("invítame")) {
      newTrust = Math.min(10, trust + 1); // Aumenta ligeramente el trust
      setNpcReply("Hmm, tal vez pueda confiar en ti.");
    } else {
      newTrust = Math.max(0, trust - 1); // Reduce el trust
      setNpcReply("No estoy seguro de confiar en ti...");
    }

    setTrust(newTrust);
    setUserMessage(""); // Limpia el input
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-800 text-white">
      <h1 className="text-4xl font-bold mb-4">Vampyr Game</h1>
      <img src={getImage()} alt="Trust Level" className="w-1/3 mb-4" />
      <p className="text-xl mb-4">Nivel de confianza: {trust}</p>
      <p className="text-lg mb-4">NPC dice: "{npcReply}"</p>

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
    </div>
  );
};

export default App;
