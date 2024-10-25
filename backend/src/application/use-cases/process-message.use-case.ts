import { Message } from "@/domain/entities/message.entity";
// import { QueueService } from "@/infrastructure/queue/queue.service";
import { IMessageRepository } from "../interfaces/repositories/message-repository.interface";
import messageRepository from "@/infrastructure/supabase/repositories/message.repository";

export class ProcessMessageUseCase {
  constructor(
    private messageRepository: IMessageRepository // private queueService: QueueService
  ) {}

  async execute(messageData: {
    id: string;
    groupId: string;
    content: string;
    sender: string;
  }): Promise<Message> {
    // Create message record
    const message = await this.messageRepository.create({
      ...messageData,
    });

    // Send to analysis queue
    // await this.queueService.sendToQueue("message_analysis", {
    //   messageId: message.id,
    //   content: message.content,
    // });

    return message;
  }
}

const processMessageUseCase = new ProcessMessageUseCase(messageRepository);
export default processMessageUseCase;
