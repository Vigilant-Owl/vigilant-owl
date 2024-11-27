const express = require("express");
const router = express.Router();

const controller = require("../controllers/auth.controller");

const verifyToken = require("../middlewares/auth.middleware");

router.post("/login", controller.login);
router.post("/register", controller.register);

router.use(verifyToken);

router.post("/reset-password", controller.resetPassword);

module.exports = router;
