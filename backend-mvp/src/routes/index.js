const express = require("express");
const router = express.Router();

const messageRouter = require("./message.route");
const whatsappRouter = require("./whatsapp.route");

router.use("/message", messageRouter);
router.use("/whatsapp", whatsappRouter);

module.exports = router;
