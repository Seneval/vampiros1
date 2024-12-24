const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.handler = async function (event) {
  try {
    const { message } = JSON.parse(event.body);

    if (!message || typeof message !== "string") {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "El mensaje es inválido o está vacío" }),
      };
    }

    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: message }],
      functions: [{ name: "asst_u3dw8HAqJBB4XxaWVu6mqe9G" }],
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
