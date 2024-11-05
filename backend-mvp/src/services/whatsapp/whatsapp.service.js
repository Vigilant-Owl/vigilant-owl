const { Client, LocalAuth } = require("whatsapp-web.js");
const fs = require("fs");
const supabase = require("../../config/supabase");
const { consentMessage } = require("../../constants/messages");

const SESSION_FILE_PATH = "storage/sessions/session.json";

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
  authStrategy: new LocalAuth({
    dataPath: SESSION_FILE_PATH,
  }),
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
});

global.client.on("authenticated", (session) => {
  console.log("AUTH!");
});

global.client.on("auth_failure", () => {
  console.log("AUTH Failed !");
  process.exit();
});

global.client.on("ready", () => {
  console.log("Client is ready!");
});

global.client.on("message_create", async (msg) => {
  console.log(msg);
  const sender = msg.from;
  const senderNumber = sender.split("@")[0];
  const isGroup = msg.from.includes("@g.us");

  const authorNumber = msg.author?.split("@")[0];

  console.log({
    sender,
    senderNumber,
    isGroup,
    authorNumber,
    messageContent: msg.body,
  });

  const { error } = await supabase.from("messages").insert({
    content: msg.body,
    sender_number: isGroup ? authorNumber : senderNumber,
    is_group: isGroup,
    chat_id: sender,
  });

  if (error) console.error(error);
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

global.client.on("remote_session_saved", () => {
  console.log("Session saved");
  // Do Stuff...
});

global.client.on("group_join", async (notification) => {
  console.log("Group join notification:", notification);

  // Get the group invite info
  const groupId = notification.chatId;
  const inviter = notification.author;

  // Accept the invite automatically
  console.log(groupId, inviter);
  try {
    // const group = await global.client.acceptInvite(groupId);
    // console.log("Successfully joined group:", group);

    // You can send a message to the group after joining
    await global.client.sendMessage(groupId, consentMessage);
  } catch (error) {
    console.error("Error accepting group invite:", error);
  }
});

global.client.on("message_reaction", async (reaction) => {
  try {
    console.log("reaction", reaction);
    const msgId = reaction.msgId;
    if(reaction.reaction === "👍" && reaction.reaction === "") {
      
    }
  } catch (error) {
    console.error("Error handling reaction:", error);
  }
});

global.client.initialize();
