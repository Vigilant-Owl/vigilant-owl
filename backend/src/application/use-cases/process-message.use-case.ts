import { Message, MessageRepository } from "@/domain/entities/message.entity";
import { QueueService } from "@/infrastructure/queue/queue.service";

export class ProcessMessageUseCase {
  constructor(
    private messageRepository: MessageRepository,
    private queueService: QueueService
  ) {}

  async execute(messageData: {
    groupId: string;
    content: string;
    sender: string;
  }): Promise<Message> {
    // Create message record
    const message = await this.messageRepository.create({
      ...messageData,
      createdAt: new Date(),
    });

    // Send to analysis queue
    await this.queueService.sendToQueue("message_analysis", {
      messageId: message.id,
      content: message.content,
    });

    return message;
  }
}
