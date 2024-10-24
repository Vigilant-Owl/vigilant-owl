import express from "express";
import { Logger } from "./infrastructure/logger/logger.service";
import { errorHandler } from "./presentation/middlewares/error.middleware";
import { setupMessageRoutes } from "./presentation/routes/messages.routes";
import { SupabaseMessageRepository } from "./infrastructure/supabase/repositories/message.repository";
import { MessageService } from "./application/services/message.service";
import { MessagesController } from "./presentation/controllers/messages.controller";
import { WhatsAppClient } from "./infrastructure/whatsapp/client";

async function bootstrap() {
  // Initialize infrastructure
  const logger = new Logger();
  const app = express();

  try {
    // Initialize repositories
    const messageRepository = new SupabaseMessageRepository();

    // Initialize services
    const messageService = new MessageService(messageRepository);

    // Initialize controllers
    const messagesController = new MessagesController(messageService);

    // Initialize WhatsApp client
    const whatsappClient = new WhatsAppClient(messageService);
    await whatsappClient.initialize();

    // Setup routes
    const router = express.Router();
    setupMessageRoutes(router, messagesController);

    // Setup middleware
    app.use(express.json());
    app.use("/api", router);
    app.use(errorHandler(logger));

    // Start server
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      logger.info(`Server started on port ${port}`);
    });
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error("Failed to start application:", error);
  process.exit(1);
});
