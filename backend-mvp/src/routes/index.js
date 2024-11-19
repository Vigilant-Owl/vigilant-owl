const express = require("express");
const router = express.Router();

const authRouter = require("./auth.route");
const whatsappRouter = require("./whatsapp.route");
const reportRouter = require("./report.route");
const stripeRouter = require("./stripe.route");

router.use("/auth", authRouter);

router.use("/stripe", stripeRouter);
router.use("/whatsapp", whatsappRouter);
router.use("/report", reportRouter);

module.exports = router;
