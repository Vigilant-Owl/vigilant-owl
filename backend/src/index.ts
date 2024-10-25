import express from "express";
import { Logger } from "./infrastructure/logger/logger.service";
import { errorHandler } from "./presentation/middlewares/error.middleware";
import router from "./presentation/routes";
// import { WhatsAppClient } from "./infrastructure/whatsapp/client";

async function bootstrap() {
  // Initialize infrastructure
  const logger = new Logger();
  const app = express();

  try {
    // Initialize WhatsApp client
    // const whatsappClient = new WhatsAppClient(messageService);
    // await whatsappClient.initialize();

    // Setup middleware
    app.use(express.json());
    app.use("/api", router);
    // app.use(errorHandler(logger));

    // Start server
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      logger.info(`Server started on port ${port}`);
    });
  } catch (error: any) {
    logger.error(error);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error("Failed to start application:", error);
  process.exit(1);
});
