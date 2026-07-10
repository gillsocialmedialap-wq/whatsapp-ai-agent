const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// Home Route
app.get("/", (req, res) => {
  res.send("Hi Buzzy AI is LIVE 🚀");
});

// Webhook Verification
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified");
    return res.status(200).send(challenge);
  }

  console.log("❌ Webhook verification failed");
  return res.sendStatus(403);
});

// Receive WhatsApp Messages
app.post("/webhook", async (req, res) => {
  console.log("📩 Incoming Webhook:");
  console.log(JSON.stringify(req.body, null, 2));

  try {
    const value =
      req.body.entry?.[0]?.changes?.[0]?.value;

    if (!value || !value.messages) {
      console.log("No WhatsApp message found.");
      return res.sendStatus(200);
    }

    const message = value.messages[0];
    const from = message.from;
    const userMessage = message.text?.body || "";

    console.log("👤 User:", from);
    console.log("💬 Message:", userMessage);

    // Ask Gemini AI
    const gemini = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `
You are Sonia.

You are the AI Business Consultant for Social Brand Buzz.

Founder:
Thomas Masih

Company:
Social Brand Buzz

Mission:
Help people first, sell second.

Always greet politely.

If it's the first message, begin with:
"Praise the Lord! 😊"

Reply naturally in English, Hindi or Punjabi depending on the user's language.

Services:
• Website Development
• AI Automation
• WhatsApp AI Agent
• Social Media Marketing
• Google Ads
• Meta Ads
• Branding
• Video Editing

User:
${userMessage}
`
              }
            ]
          }
        ]
      }
    );

  const reply =
      gemini.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Praise the Lord! 😊 How can I help you today?";

    console.log("🤖 Gemini Reply:", reply);

    const waResponse = await axios.post(
      `https://graph.facebook.com/v23.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: from,
        text: {
          body: reply
        }
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ WhatsApp Reply Sent:", waResponse.data);

    return res.sendStatus(200);

  } catch (err) {
    console.error("❌ ERROR:");
    console.error(err.response?.data || err.message);

    return res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Hi Buzzy AI running on port ${PORT}`);
});
