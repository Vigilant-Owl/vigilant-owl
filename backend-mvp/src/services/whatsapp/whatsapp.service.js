const { Client } = require("whatsapp-web");
const fs = require("fs");

const SESSION_FILE_PATH = "storage/sessions/session.json";

let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionCfg = require(SESSION_FILE_PATH);
}

global.client = new Client({
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--unhandled-rejections=strict",
      "--disable-extensions",
    ],
  },
  session: sessionCfg,
});

global.client.on("qr", (qr) => {
  fs.writeFileSync("storage/qrcodes/last.qr", qr);
});

global.client.on("authenticated", (session) => {
  console.log("AUTH!");
  sessionCfg = session;

  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
    if (err) {
      console.error(err);
    }
    authed = true;
  });

  try {
    fs.unlinkSync("storage/qrcodes/last.qr");
  } catch (err) {}
});

global.client.on("auth_failure", () => {
  console.log("AUTH Failed !");
  sessionCfg = "";
  process.exit();
});

global.client.on("ready", () => {
  console.log("Client is ready!");
});

global.client.on("message", (msg) => {
  if (config.webhook.enabled) {
    axios.post(config.webhook.path, { msg });
  }
});

global.client.initialize();
