const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const express = require("express");

const app = express();
app.use(express.json());

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth");

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;

        const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text;

        if (!text) return;

        console.log("User:", text);

        const reply = "Hi Buzzy AI 🤖 I got your message: " + text;

        await sock.sendMessage(msg.key.remoteJid, { text: reply });
    });
}

startBot();

app.get("/", (req, res) => {
    res.send("WhatsApp QR Bot Running 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
