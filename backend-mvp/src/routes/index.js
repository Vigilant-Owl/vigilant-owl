const messageRouter = require("./message.route");
const express = require("express");

const router = express.Router();
router.use("/message", messageRouter);

module.exports = router;
