const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in Netlify
});
const openai = new OpenAIApi(configuration);

exports.handler = async function (event) {
  try {
    const { message } = JSON.parse(event.body); // Parse incoming user message

    if (!message || typeof message !== "string") {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid or empty message" }),
      };
    }

    // Call OpenAI assistant
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: message }], // Interaction
    });

    const reply = response.data.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }), // Send the reply back
    };
  } catch (error) {
    console.error("Error in sendMessage.js:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
