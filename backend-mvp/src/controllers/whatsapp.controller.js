const fs = require("fs");

module.exports = {
  getQr: (req, res, next) => {
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
  },
};
