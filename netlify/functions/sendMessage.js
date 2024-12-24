

const { Configuration, OpenAIApi } = require("openai");

// Configuración de OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // La clave se configura en Netlify
});
const openai = new OpenAIApi(configuration);

exports.handler = async function (event) {
  const { message } = JSON.parse(event.body); // Recibe el mensaje del usuario

  try {
    // Llama a OpenAI para obtener la respuesta del NPC
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Eres un NPC en un juego donde decides si confiar en un vampiro." },
        { role: "user", content: message },
      ],
    });

    // Devuelve la respuesta generada
    return {
      statusCode: 200,
      body: JSON.stringify({ reply: response.data.choices[0].message.content }),
    };
  } catch (error) {
    console.error("Error en sendMessage.js:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error al interactuar con OpenAI" }),
    };
  }
};
