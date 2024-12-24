exports.handler = async function (event) {
    try {
      const { reply, currentTrust } = JSON.parse(event.body);
  
      if (!reply || typeof reply !== "string") {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "La respuesta es inválida o está vacía" }),
        };
      }
  
      // Lógica simple para evaluar la intención
      let newTrust = currentTrust;
  
      if (reply.toLowerCase().includes("confío") || reply.toLowerCase().includes("convenciste")) {
        newTrust = Math.min(10, currentTrust + 2); // Incrementa la confianza
      } else if (reply.toLowerCase().includes("desconfío") || reply.toLowerCase().includes("no confío")) {
        newTrust = Math.max(0, currentTrust - 2); // Reduce la confianza
      }
  
      return {
        statusCode: 200,
        body: JSON.stringify({ newTrust }),
      };
    } catch (error) {
      console.error("Error en detectIntent.js:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Error interno al procesar la intención" }),
      };
    }
  };
  