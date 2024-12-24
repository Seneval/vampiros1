import React, { useState } from "react";

const App: React.FC = () => {
  const [trust, setTrust] = useState(5); // Initial trust level
  const [npcReply, setNpcReply] = useState("Who are you? I don't trust you."); // NPC's response
  const [userMessage, setUserMessage] = useState(""); // User's input
  const [gameOver, setGameOver] = useState(false); // Game state

  const handleSendMessage = async () => {
    if (!userMessage.trim() || gameOver) return;

    try {
      // Step 1: Send the user's message to the assistant
      const response = await fetch("/.netlify/functions/sendMessage", {
        method: "POST",
        body: JSON.stringify({ message: userMessage }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      setNpcReply(data.reply); // Update the NPC's reply

      // Step 2: Check trust level adjustment
      const trustResponse = await fetch("/.netlify/functions/detectIntent", {
        method: "POST",
        body: JSON.stringify({ reply: data.reply, currentTrust: trust }),
        headers: { "Content-Type": "application/json" },
      });

      const trustData = await trustResponse.json();
      setTrust(trustData.newTrust); // Update trust

      // End game conditions
      if (trustData.newTrust >= 10) {
        setGameOver(true);
        setNpcReply("You convinced me! You may enter.");
      } else if (trustData.newTrust <= 0) {
        setGameOver(true);
        setNpcReply("I don't trust you. You will never enter.");
      }
    } catch (error) {
      console.error("Error handling message:", error);
      setNpcReply("There was a problem. Please try again.");
    }

    setUserMessage(""); // Clear input
  };

  const getImage = () => {
    if (trust <= 3) return "/images/trust-1-3.png";
    if (trust <= 6) return "/images/trust-5.png";
    if (trust <= 8) return "/images/trust-7-8.png";
    return "/images/trust-9-10.png";
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-800 text-white">
      <h1 className="text-4xl font-bold mb-4">Vampyr Game</h1>
      <img src={getImage()} alt="Trust Level" className="w-1/3 mb-4" />
      <p className="text-xl mb-4">Trust Level: {trust}</p>
      <p className="text-lg mb-4">NPC says: "{npcReply}"</p>

      {!gameOver && (
        <div className="flex flex-col items-center gap-4">
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Type your message..."
            className="p-2 w-2/3 bg-gray-700 border border-gray-600 rounded text-white"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-400"
          >
            Send
          </button>
        </div>
      )}

      {gameOver && (
        <p className="text-lg mt-4">
          Game over. Reload the page to play again.
        </p>
      )}
    </div>
  );
};

export default App;
