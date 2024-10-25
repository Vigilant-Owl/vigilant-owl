const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client({
  puppeteer: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

client.once("ready", () => {
  console.log("Client is ready!");
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("message_create", (message) => {
  if (message.body === "!ping") {
    client.sendMessage(message.from, "pong");
  }
});

client.initialize();
