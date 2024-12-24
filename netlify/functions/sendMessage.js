const { OpenAIApi, Configuration } = require("openai");

// Configuración de OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Asegúrate de que esta clave esté configurada en Netlify
});
const openai = new OpenAIApi(configuration);

exports.handler = async function (event) {
  try {
    const { message } = JSON.parse(event.body); // Asegúrate de que el cuerpo incluye un mensaje

    if (!message || typeof message !== "string") {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "El mensaje es inválido o está vacío" }),
      };
    }

    // Realiza la llamada al asistente
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: message }],
    });

    const assistantReply = response.data.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: assistantReply }),
    };
  } catch (error) {
    console.error("Error en sendMessage.js:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno al procesar el mensaje" }),
    };
  }
};
