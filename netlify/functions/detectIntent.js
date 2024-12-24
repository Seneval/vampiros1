const { Configuration, OpenAIApi } = require("openai");

// Configuración de OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // La clave API se configura como variable de entorno en Netlify
});
const openai = new OpenAIApi(configuration);

exports.handler = async function (event) {
  try {
    // Parsear el cuerpo de la solicitud
    const { message } = JSON.parse(event.body);

    // Verificar que el mensaje existe
    if (!message || typeof message !== "string") {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "El mensaje es inválido o está vacío" }),
      };
    }

    // Llamada al asistente preconfigurado
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: message }],
      functions: [{ name: "asst_u3dw8HAqJBB4XxaWVu6mqe9G" }], // Identificador del asistente
    });

    // Extraer la respuesta del asistente
    const npcReply = response.data.choices[0].message.content;

    // Respuesta al frontend
    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: npcReply,
      }),
    };
  } catch (error) {
    console.error("Error en detectIntent.js:", error);

    // Respuesta de error al frontend
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno al procesar la solicitud" }),
    };
  }
};
