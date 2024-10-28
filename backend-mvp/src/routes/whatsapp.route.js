const express = require("express");
const router = express.Router();

const controller = require("../controllers/whatsapp.controller");

router.get("/getqr", controller.getQr);

module.exports = router;
