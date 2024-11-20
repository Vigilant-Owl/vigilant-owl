const express = require("express");
const router = express.Router();

const authRouter = require("./auth.route");
const whatsappRouter = require("./whatsapp.route");
const reportRouter = require("./report.route");
const stripeRouter = require("./stripe.route");

const verifyToken = require("../middlewares/auth.middleware");

router.use("/auth", authRouter);

router.use("/stripe", stripeRouter);

router.use(verifyToken);

router.use("/whatsapp", whatsappRouter);
router.use("/report", reportRouter);

module.exports = router;
