const express = require("express");
const router = express.Router();

const controller = require("../controllers/stripe.controller");

router.post("/checkout", controller.checkout);
router.get("/session/:sessionId", controller.getSessionDetail);
module.exports = router;
