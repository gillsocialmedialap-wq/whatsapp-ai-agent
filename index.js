const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("WhatsApp AI Agent is LIVE on Render 🚀");
});

app.post("/webhook", (req, res) => {
  const message = req.body.message || "hello";

  console.log("User:", message);

  const reply = "Hi Buzzy AI 🤖 received: " + message;

  res.json({ reply });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
