const { Client, LocalAuth } = require("whatsapp-web.js");
const fs = require("fs");
const supabase = require("../../config/supabase");
const {
  consentMessage,
  stopMessage,
  activeMessage,
} = require("../../constants/messages");

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
  try {
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

    if (isGroup) {
      const { data, error } = await supabase
        .from("consent-messages")
        .select("*")
        .eq("group_id", sender)
        .single();
      console.log(data);
      if (error) throw error;
      console.log("Consent Message", data);
      if (data && data.is_active) {
        const { error } = await supabase.from("messages").insert({
          content: msg.body,
          sender_number: isGroup ? authorNumber : senderNumber,
          is_group: isGroup,
          chat_id: sender,
        });
        if (error) throw error;
      }
    }

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
  } catch (err) {
    console.error(err);
  }
});

global.client.on("remote_session_saved", () => {
  console.log("Session saved");
  // Do Stuff...
});

global.client.on("group_join", async (notification) => {
  try {
    console.log("Group join notification:", notification);

    // Get the group invite info
    const groupId = notification.chatId;
    const inviter = notification.author;
    const chat = await notification.getChat();
    const groupMemberCounts = chat.participants.length;
    console.log("Group Member Counts", groupMemberCounts);

    // Accept the invite automatically
    console.log(groupId, inviter);
    // const group = await global.client.acceptInvite(groupId);
    // console.log("Successfully joined group:", group);

    // You can send a message to the group after joining
    const message = await global.client.sendMessage(groupId, consentMessage);
    console.log(message);

    const { data, error } = await supabase.from("consent-messages").insert({
      message_id: message.id.id,
      group_id: groupId,
      member_count: groupMemberCounts - 1,
    });
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error accepting group invite:", error);
  }
});

global.client.on("message_reaction", async (reaction) => {
  try {
    console.log("reaction", reaction);
    const msgId = reaction.msgId.id;

    const { data, error } = await supabase
      .from("consent-messages")
      .select("*")
      .eq("message_id", msgId)
      .single();
    console.log(data);
    console.log(data.thumb_ups);
    if (error) {
      throw error;
    }
    if (data) {
      console.log(reaction.reaction, "👍");
      if (reaction.reaction === "👍") {
        const isActive = data.thumb_ups + 1 == data.member_count;
        if (isActive) {
          const message = await global.client.sendMessage(
            data.group_id,
            activeMessage
          );
          console.log("Active Message", message);
        }
        const { error } = await supabase
          .from("consent-messages")
          .update({ thumb_ups: data.thumb_ups + 1, is_active: isActive })
          .eq("message_id", msgId);
      }
      if (reaction.reaction === "👎") {
        const { error } = await supabase
          .from("consent-messages")
          .update({ thumb_downs: data.thumb_downs + 1, is_active: false })
          .eq("message_id", msgId);
        const message = await global.client.sendMessage(
          data.group_id,
          stopMessage
        );
        console.log("Stop Mornitoring", message);
      }
    }
  } catch (error) {
    console.error("Error handling reaction:", error);
  }
});

global.client.initialize();
