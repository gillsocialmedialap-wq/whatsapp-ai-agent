const express = require("express");
const axios = require("axios");
const path = require("path");
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.send("Hi Buzzy AI is LIVE 🚀");
});

app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        contents: [
          {
            parts: [
              {
                text: `You are Hi Buzzy, AI Business Consultant for Social Brand Buzz.
Founder: Y.C.W. Gill.
Reply professionally, friendly, and in English, Hindi, or Punjabi depending on the user's language.

User: ${message}`
              }
            ]
          }
        ]
      }
    );

    const reply =
      response.data.candidates[0].content.parts[0].text;

    res.json({ reply });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ reply: "Sorry, AI is temporarily unavailable." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Hi Buzzy AI running on port " + PORT);
});
