import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// AI function
async function askAI(message) {

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",

    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      model: "llama-3.1-8b-instant",

      messages: [
        {
          role: "system",
          content:
            "You are an IT support assistant. Help users solve technical problems simply and professionally."
        },

        {
          role: "user",
          content: message
        }
      ]
    })
  });

  const data = await response.json();

  return data.choices[0].message.content;
}

// Chat route
app.post("/chat", async (req, res) => {

  const userMessage = req.body.message;

  const aiReply = await askAI(userMessage);

  res.json({
    reply: aiReply
  });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
