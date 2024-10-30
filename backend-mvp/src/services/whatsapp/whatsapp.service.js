const { Client } = require("whatsapp-web.js");
const fs = require("fs");
const supabase = require("../../config/supabase");

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

global.client.on("qr", async (qr) => {
  console.log(qr);
  const { error } = await supabase
    .from("qrcodes")
    .update({ qrcode: qr })
    .eq("id", 1);
  if (error) {
    console.error(error);
  }
  // fs.writeFileSync("storage/qrcodes/last.qr", qr);
  // let sendData = {
  //   type: "qrcode",
  //   qrCode: qr,
  // };
  // console.log(sendData);
  // global.wsServer.clients.forEach((client) => {
  //   if (client.readyState === WebSocket.OPEN) {
  //     client.send(JSON.stringify(sendData));
  //   }
  // });
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

global.client.on("message", async (msg) => {
  console.log(msg);
  const { error } = await supabase
    .from("messages")
    .insert({ content: msg.body });
  console.error(error);
  // console.log(msg);
  // const sendData = {
  //   type: "message",
  //   msg,
  // };
  // global.wsServer.clients.forEach((client) => {
  //   if (client.readyState === WebSocket.OPEN) {
  //     client.send(JSON.stringify(sendData));
  //   }
  // });
});

global.client.initialize();
