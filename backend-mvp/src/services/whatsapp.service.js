const { Client, LocalAuth } = require("whatsapp-web.js");
const fs = require("fs");
const supabase = require("../config/supabase");
const {
  consentMessage,
  stopMessage,
  activeMessage,
  waitingMessage,
  unrecognizedResponseMessage,
} = require("../constants/messages");

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
    const isGroup = sender.includes("@g.us");
    const chat = await msg.getChat();
    const groupMemberCounts = chat.participants.length;

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
        .from("consent_messages")
        .select("*")
        .eq("group_id", sender);
      console.log(data);
      console.log("Consent Message", data);
      if (
        data &&
        data.length &&
        data[0].message_id &&
        data[0].member_count >= groupMemberCounts - 1
      ) {
        if (data[0].is_active) {
          const { error } = await supabase.from("messages").insert({
            content: msg.body,
            sender_number: isGroup ? authorNumber : senderNumber,
            is_group: isGroup,
            chat_id: sender,
            message_id: message.id.id,
          });
          if (error) throw error;
          const analysis = await global.ai.analyzeTone(msg.body);
          const { error: insertError } = await supabase
            .from("analysis_messages")
            .insert({
              data: JSON.stringify(analysis),
              chat_id: sender,
              sender_number: isGroup ? authorNumber : senderNumber,
              message_id: message.id.id,
            });
          if (insertError) throw insertError;
        } else if (data[0].is_active === null) {
          global.client.sendMessage(sender, waitingMessage);
        }
      } else {
        const message = await global.client.sendMessage(sender, consentMessage);
        const { error } = await supabase
          .from("consent_messages")
          .update({
            message_id: message.id.id,
            member_count: groupMemberCounts - 1,
            is_active: null,
          })
          .eq("group_id", groupId);
        if (data[0].message_id) {
          await supabase
            .from("reactions")
            .delete()
            .eq("message_id", data[0].message_id);
        }
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

// global.client.on("group_join", async (notification) => {
//   try {
//     console.log("Group join notification:", notification);

//     // Get the group invite info
//     const groupId = notification.chatId;
//     const inviter = notification.author;
//     const chat = await notification.getChat();
//     const groupMemberCounts = chat.participants.length;
//     console.log("Group Member Counts", groupMemberCounts);

//     // Accept the invite automatically
//     console.log(groupId, inviter);
//     // const group = await global.client.acceptInvite(groupId);
//     // console.log("Successfully joined group:", group);

//     // You can send a message to the group after joining

//     const { data } = await supabase
//       .from("consent_messages")
//       .select("*")
//       .eq("group_id", groupId);
//     if (data && data.length) {
//       const message = await global.client.sendMessage(groupId, consentMessage);
//       const { error } = await supabase
//         .from("consent_messages")
//         .update({
//           message_id: message.id.id,
//           member_count: groupMemberCounts - 1,
//           is_active: null,
//         })
//         .eq("group_id", groupId);
//       console.log(error);
//       if (data[0].message_id) {
//         await supabase
//           .from("reactions")
//           .delete()
//           .eq("message_id", data[0].message_id);
//       }
//     } else {
//       const { error } = await supabase.from("consent_messages").insert({
//         message_id: message.id.id,
//         group_id: groupId,
//         member_count: groupMemberCounts - 1,
//       });
//       if (error) {
//         throw error;
//       }
//     }
//   } catch (error) {
//     console.error("Error accepting group invite:", error);
//   }
// });

global.client.on("group_leave", async (notification) => {
  console.log(notification);
  try {
    const groupId = notification.chatId;
    const sender = notification.author;
    const chat = await notification.getChat();
    const groupMemberCounts = chat.participants.length;

    let updatedData = {
      member_count: groupMemberCounts - 1,
    };
    if (groupMemberCounts - 1 === 0) {
      updatedData = { ...updatedData, is_active: false };
    }
    await supabase
      .from("consent_messages")
      .update(updatedData)
      .eq("group_id", groupId);

    const { data } = await supabase
      .from("consent_messages")
      .select("*")
      .eq("group_id", groupId)
      .single();

    await supabase.from("reactions").delete().eq("sender", sender);
    if (data.is_active === false) {
      const { data: reactions, count } = await supabase
        .from("reactions")
        .select("*", { count: "exact" })
        .eq("message_id", msgId)
        .eq("reaction", "👍");
      if (count === data.member_count && data.member_count !== 0) {
        await global.client.sendMessage(data.group_id, activeMessage);
        await supabase
          .from("consent_messages")
          .update({
            is_active: true,
          })
          .eq("message_id", msgId);
      }
    }
  } catch (error) {
    console.log(error);
  }
});

global.client.on("message_reaction", async (reaction) => {
  try {
    console.log("reaction", reaction);
    const msgId = reaction.msgId.id;

    const { data, error } = await supabase
      .from("consent_messages")
      .select("*")
      .eq("message_id", msgId)
      .single();
    if (error) {
      throw error;
    }
    if (data) {
      const newReaction = {
        message_id: msgId,
        reaction: reaction.reaction,
        sender: reaction.senderId,
      };
      const { data: reactionData } = await supabase
        .from("reactions")
        .select("*")
        .eq("message_id", msgId)
        .eq("sender", reaction.senderId);

      let previousReact = "";
      if (reactionData && reactionData.length) {
        previousReact = reactionData[0].reaction;
        console.log(previousReact);
        const { error } = await supabase
          .from("reactions")
          .update({
            reaction: reaction.reaction,
          })
          .eq("message_id", msgId)
          .eq("sender", reaction.senderId);
        if (error) {
          throw error;
        }
      } else {
        const { error } = await supabase.from("reactions").insert(newReaction);
        if (error) {
          throw error;
        }
      }

      if (reaction.reaction === "👍") {
        const { data: reactions, count } = await supabase
          .from("reactions")
          .select("*", { count: "exact" })
          .eq("message_id", msgId)
          .eq("reaction", "👍");
        console.log(data, count);
        if (count === data.member_count) {
          await global.client.sendMessage(data.group_id, activeMessage);
          await supabase
            .from("consent_messages")
            .update({
              is_active: true,
            })
            .eq("message_id", msgId);
        }
      } else if (reaction.reaction === "👎") {
        await global.client.sendMessage(data.group_id, stopMessage);
        await supabase
          .from("consent_messages")
          .update({
            is_active: false,
          })
          .eq("message_id", msgId);
      } else if (reaction.reaction !== "") {
        global.client.sendMessage(data.group_id, unrecognizedResponseMessage);
      }
    }
  } catch (error) {
    console.error(error);
    // console.error("Error handling reaction:", error);
  }
});

global.client.initialize();
