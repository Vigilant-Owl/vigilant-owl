const express = require("express");
const router = express.Router();

const authRouter = require("./auth.route");
const messageRouter = require("./message.route");
const whatsappRouter = require("./whatsapp.route");
const reportRouter = require("./report.route");

router.use("/auth", authRouter);

router.use("/message", messageRouter);
router.use("/whatsapp", whatsappRouter);
router.use("/report", reportRouter);

module.exports = router;
