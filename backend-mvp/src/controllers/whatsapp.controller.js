const fs = require("fs");
const supabase = require("../config/supabase");
const { consentMessage } = require("../constants/messages");

module.exports = {
  getQr: (req, res, next) => {
    try {
      fs.readFile("storage/qrcodes/last.qr", (err, last_qr) => {
        if (err) {
          console.error(err);
          return res.status(400).json({ err: err });
        }
        return res.status(200).json({ qrcode: last_qr.toString() });
        // fs.readFile("storage/sessions/session.json", (serr, sessiondata) => {
        //   if (err && sessiondata) {
        //     next(new Error({ Authenticated: false }));
        //   } else if (!err && serr) {
        //     res.send({ qrcode: last_qr.toString() });
        //     res.end();
        //   } else {
        //     next(new Error({ Authenticated: false }));
        //   }
        // });
      });
    } catch (err) {
      console.error(err);
      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    }
  },

  installBot: async (req, res) => {
    try {
      const { title, phoneNumber, parentId } = req.body;
      const whatsappId = `${phoneNumber}@c.us`;
      const group = await global.client.createGroup(title, [whatsappId]);
      console.log("Group created successfully:", group);
      // const message = await global.client.sendMessage(
      //   group.gid._serialize,
      //   consentMessage
      // );
      const { error } = await supabase.from("consent-messages").insert({
        group_id: group.gid._serialize,
        title: title,
        phone_number: phoneNumber,
        parent_id: parentId,
      });
      return res.status(200).json({
        status: "success",
        message: "Success to install bot",
      });
    } catch (err) {
      console.error(err);
      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    }
  },
};
