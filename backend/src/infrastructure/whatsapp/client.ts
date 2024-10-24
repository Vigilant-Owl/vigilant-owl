import { Client } from "whatsapp-web.js";
import { ProcessMessageUseCase } from "@/application/use-cases/process-message.use-case";

export class WhatsAppClient {
  private client: Client;

  constructor(private processMessageUseCase: ProcessMessageUseCase) {
    this.client = new Client();
    this.initialize();
  }

  private initialize() {
    this.client.on("message", async (msg) => {
      try {
        await this.processMessageUseCase.execute({
          groupId: msg.chat.id,
          content: msg.body,
          sender: msg.from,
        });
      } catch (error) {
        console.error("Failed to process WhatsApp message:", error);
      }
    });

    this.client.initialize();
  }
}
