const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Home
app.get("/", (req, res) => {
  res.send("Hi Buzzy AI is LIVE 🚀");
});

// AI Chat
app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        contents: [
          {
            parts: [
              {
                text: `You are Hi Buzzy, the official AI Business Consultant for Social Brand Buzz.

Founder: Y.C.W. Gill

Mission:
Help people first, sell second.

You are friendly, professional, human, and never robotic.

You speak English, Hindi, and Punjabi.

Services:
- Website Development
- App Development
- SEO
- Google Ads
- Social Media Management
- AI Automation
- Video Editing
- Branding

Packages:
Gold - $499
Silver - $999
Premium - $2499
Enterprise - $5999

Always answer naturally like a real employee.

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
    res.status(500).json({
      reply: "Sorry, AI is temporarily unavailable."
    });
  }
});

// Meta Webhook Verification
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "hibuzzy123";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  res.sendStatus(403);
});

// Receive WhatsApp Messages
app.post("/webhook", (req, res) => {
  console.log("Incoming WhatsApp Message:");
  console.log(JSON.stringify(req.body, null, 2));

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Hi Buzzy AI running on port ${PORT}`);
});
