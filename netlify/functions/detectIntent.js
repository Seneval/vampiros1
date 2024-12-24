const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.handler = async function (event) {
  const { message, trust } = JSON.parse(event.body); // Mensaje del usuario y trust actual

  try {
    // Llama a OpenAI para procesar el mensaje
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Eres un humano que decide si invitar a un vampiro. Aumenta la confianza solo si el mensaje es convincente." },
        { role: "user", content: message },
      ],
    });

    const npcReply = response.data.choices[0].message.content;

    // Ajusta el nivel de confianza basado en palabras clave
    let newTrust = trust;
    if (npcReply.includes("convenciste") || npcReply.includes("confío")) {
      newTrust = Math.min(10, trust + 2); // Aumenta el trust
    } else if (npcReply.includes("no estoy seguro") || npcReply.includes("desconfío")) {
      newTrust = Math.max(0, trust - 2); // Reduce el trust
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: npcReply,
        trust: newTrust,
      }),
    };
  } catch (error) {
    console.error("Error en detectIntent:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error procesando el mensaje" }),
    };
  }
};
