import express from "express";
import { validateMessage } from "../validators/message.validator";
import { MessagesController } from "../controllers/messages.controller";

export function setupMessageRoutes(
  router: express.Router,
  controller: MessagesController
) {
  router.post(
    "/messages",
    validateMessage,
    controller.processMessage.bind(controller)
  );

  return router;
}
