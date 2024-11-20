const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth.middleware");

const controller = require("../controllers/stripe.controller");

router.post("/webhook", controller.webhook);
router.use("/", verifyToken);
router.post("/checkout", controller.checkout);
router.post("/session/:sessionId", controller.getSessionDetail);
module.exports = router;
