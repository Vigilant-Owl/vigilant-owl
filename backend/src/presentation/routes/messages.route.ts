import express from "express";
import { validateMessage } from "../validators/message.validator";
import messageController from "../controllers/messages.controller";

const messageRouter = express.Router();

messageRouter.post(
  "/",
  validateMessage,
  messageController.processMessage
);

export default messageRouter;
