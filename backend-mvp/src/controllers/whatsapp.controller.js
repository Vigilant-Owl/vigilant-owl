const fs = require("fs");

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
      const { title, phoneNumber } = req.body;
      console.log("PhoneNumber", phoneNumber, title);
      const whatsappId = `${phoneNumber}@c.us`;
      const group = await global.client.createGroup(title, [whatsappId]);
      console.log("Group created successfully:", group);
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
