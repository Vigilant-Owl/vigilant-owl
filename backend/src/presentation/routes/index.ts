import express from "express";
import messageRouter from "./messages.route";
import authRouter from "./auth.route";
const router = express.Router();

router.use("/auth", authRouter);
router.use("/message", messageRouter);

export default router;
